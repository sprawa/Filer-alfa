package project.chaos.filer.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
class UsersController {

    private final UserService userService;

    @PostMapping("/registration")
    @ResponseStatus(HttpStatus.CREATED)
    void registration( @RequestBody UserDto user) {
        userService.createUser(user);
    }

    @GetMapping
    UserDto getUser(Authentication auth) {
        return UserDto.builder()
                .email(auth.getName())
                .role(auth.getAuthorities().stream().findFirst().map(GrantedAuthority::getAuthority).orElse(null))
                .build();
    }
}
