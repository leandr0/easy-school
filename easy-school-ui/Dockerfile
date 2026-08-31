# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# If you use Yarn, uncomment the next line
# COPY yarn.lock ./

# Install dependencies
RUN npm install --legacy-peer-deps
# For Yarn, use:
# RUN yarn install

# Bundle app source inside Docker image
COPY . .

# Build your Next.js application
RUN npm run build
# For Yarn, use:
# RUN yarn build

# Your app binds to port 3000, expose this port
EXPOSE 3000

# Define the command to run the app (using npm or yarn)
CMD ["npm", "start"]
# For Yarn, use:
# CMD ["yarn", "start"]
