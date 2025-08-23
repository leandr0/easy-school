package br.com.easyschool.service.gateways.security;


import br.com.easyschool.domain.entities.security.User;
import br.com.easyschool.domain.repositories.security.RolePathRepository;
import br.com.easyschool.domain.repositories.security.RoleRepository;
import br.com.easyschool.domain.repositories.security.UserRepository;
import br.com.easyschool.domain.repositories.security.UserRolesRepository;
import br.com.easyschool.service.requests.security.LoginRequest;
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
    public ResponseEntity<User> login(@RequestBody LoginRequest request){

        try{

            User user = userRepository.findByUsername(request.getUsername());

            if(user == null)
                ResponseEntity.notFound().build();

            if(!passwordService.matches(request.getPassword(),user.getPasswordHash()))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            return ResponseEntity.ok(user);

        }catch (Throwable t){
            log.error(t.getMessage());
            return  ResponseEntity.internalServerError().build();
        }
    }


}
