package project.chaos.filer.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import project.chaos.filer.security.ViewerAuthenticationToken;
import project.chaos.filer.token.Token;
import project.chaos.filer.token.TokenRepository;

import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class CustomTokenValidatorFilter extends OncePerRequestFilter {

    private final TokenRepository tokenRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("VIEWER_TOKEN");
        if(header != null) {
            Token token = tokenRepository.findByTokenValue(header).orElseThrow(() -> new BadCredentialsException("Wrong token"));
            ViewerAuthenticationToken auth = new ViewerAuthenticationToken(
                    Arrays.stream(token.getFileIds().split(","))
                            .map(Integer::valueOf)
                            .collect(Collectors.toList())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getServletPath().equals("/user");
    }
}
