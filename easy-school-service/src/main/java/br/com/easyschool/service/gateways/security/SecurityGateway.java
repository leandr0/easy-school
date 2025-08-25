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

            //TODO: Check is user is blocked

            if(!passwordService.matches(request.getPassword(),user.getPasswordHash())) {
                //TODO: In case of not math password increase failed_attempts until 3 after block user
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            //TODO: check locked_until parameter
            //TODO: updated last_login_at value

            return ResponseEntity.ok(new UserResponse(user));

        }catch (Throwable t){
            log.error(t.getMessage());
            return  ResponseEntity.internalServerError().build();
        }
    }


}
