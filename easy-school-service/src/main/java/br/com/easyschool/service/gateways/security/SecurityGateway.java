package br.com.easyschool.service.gateways.security;


import br.com.easyschool.domain.entities.security.User;
import br.com.easyschool.domain.repositories.security.RolePathRepository;
import br.com.easyschool.domain.repositories.security.RoleRepository;
import br.com.easyschool.domain.repositories.security.UserRepository;
import br.com.easyschool.domain.repositories.security.UserRolesRepository;
import br.com.easyschool.service.requests.security.LoginRequest;
import br.com.easyschool.service.response.security.UserResponse;
import br.com.easyschool.service.security.PasswordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/security")
@Slf4j
@RequiredArgsConstructor
public class SecurityGateway {


    private final PasswordService passwordService;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final UserRolesRepository userRolesRepository;

    private final RolePathRepository rolePathRepository;


    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request){

        try{

            User user = userRepository.findByUsername(request.getUsername());

            if(user == null)
               return ResponseEntity.notFound().build();

            if(isLocked(user)) {
                return ResponseEntity.status(HttpStatus.LOCKED).build();
            }

            if(!passwordService.matches(request.getPassword(),user.getPasswordHash())) {
                user = updateWrongAttempt(user);

                if(isLocked(user)){
                    return ResponseEntity.status(HttpStatus.LOCKED).build();
                }

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            lastLogin(user);

            return ResponseEntity.ok(new UserResponse(user));

        }catch (Throwable t){
            log.error(t.getMessage());
            return  ResponseEntity.internalServerError().build();
        }
    }


    private boolean isLocked(User user){

        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");
        OffsetDateTime now = ZonedDateTime.now(saoPaulo).toOffsetDateTime();

        if(user.getLockedUntil() == null){
            return false;
        }

        boolean isLocked = now.isBefore(user.getLockedUntil());

        if(!isLocked){
            user.setLockedUntil(null);
            userRepository.save(user);
        }

        return isLocked;
    }

    private void lastLogin(User user){
        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");
        OffsetDateTime lastLogin = ZonedDateTime.now(saoPaulo).toOffsetDateTime();
        user.setLastLoginAt(lastLogin);
        userRepository.save(user);
    }

    private User updateWrongAttempt(User user){
        user.setFailedAttempts(user.getFailedAttempts() +1);
        lockUser(user);
        return userRepository.save(user);
    }

    private void lockUser(User user){

        if(user.getFailedAttempts() > 3 ) {
            ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");
            OffsetDateTime lockedDate = ZonedDateTime.now(saoPaulo).plusMinutes(5).toOffsetDateTime();
            user.setLockedUntil(lockedDate);
            user.setFailedAttempts(0);
        }
    }
}
