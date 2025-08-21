# ========= Backend build (Maven) =========
FROM maven:3.9-eclipse-temurin-20 AS backend-build
WORKDIR /workspace

# Copy only the Maven poms first (for better layer caching)
COPY pom.xml ./pom.xml
COPY easy-school-domain/pom.xml easy-school-domain/pom.xml
COPY easy-school-service/pom.xml easy-school-service/pom.xml

# Download deps for all modules
RUN mvn -q -B -DskipTests dependency:go-offline

# Now copy sources and build
COPY easy-school-domain easy-school-domain
COPY easy-school-service easy-school-service
RUN mvn -q -B -DskipTests -pl easy-school-service -am package
# JAR at /workspace/easy-school-service/target/*.jar


# ========= Frontend build (Node / Next.js) =========
FROM node:20-bullseye AS ui-build
WORKDIR /ui

# Use npm only (simple path)
COPY easy-school-ui/package.json easy-school-ui/package-lock.json ./
RUN npm ci

# Accept conflicting peers to unblock CI
RUN npm ci --legacy-peer-deps

COPY easy-school-ui/. .
# next.config.js must have: output: 'standalone'
RUN npm run build


# ========= Runtime (Java + Node) =========
FROM eclipse-temurin:20-jre-jammy AS runtime
WORKDIR /app

# Install Node to run the Next server
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | \
      gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# ... previous runtime steps ...
RUN useradd -ms /bin/bash appuser

# Copy artifacts (as root)
COPY --from=backend-build /workspace/easy-school-service/target/*.jar /app/service.jar
COPY --from=ui-build /ui/.next/standalone /app/ui
COPY --from=ui-build /ui/.next/static /app/ui/.next/static
COPY --from=ui-build /ui/public /app/ui/public

# Create start.sh as root, then chown everything and switch user
RUN printf '%s\n' \
'#!/usr/bin/env bash' \
'set -euo pipefail' \
'echo "[start.sh] Launching API and UI..."' \
'JAVA_OPTS=${JAVA_OPTS:-"-XX:+UseContainerSupport -XX:MaxRAMPercentage=75"}' \
'(' \
'  echo "[API] starting on :8080";' \
'  exec java $JAVA_OPTS -jar /app/service.jar' \
') & API_PID=$!' \
'(' \
'  echo "[UI] starting on :3000";' \
'  cd /app/ui;' \
'  exec node server.js' \
') & UI_PID=$!' \
'trap "echo Stopping...; kill $API_PID $UI_PID 2>/dev/null || true; wait" SIGINT SIGTERM' \
'wait $API_PID $UI_PID' \
> /app/start.sh \
&& chmod +x /app/start.sh \
&& chown -R appuser:appuser /app
USER appuser

EXPOSE 8080 3000
ENV PORT=3000
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
ENTRYPOINT ["/app/start.sh"]
