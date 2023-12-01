package project.chaos.filer.security.filter;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import project.chaos.filer.security.SecurityConstants;
import project.chaos.filer.security.ViewerAuthenticationToken;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class JWTTokenGeneratorFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        SecretKey key = Keys.hmacShaKeyFor(SecurityConstants.JWT_KEY.getBytes(StandardCharsets.UTF_8));

        var jwt =  Jwts.builder().setIssuer("Project Chaos").setSubject("JWT Token")
                .claim("role", auth.getAuthorities().stream().findFirst().map(GrantedAuthority::getAuthority).orElse(null))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 30000000));


        if (auth instanceof UsernamePasswordAuthenticationToken) {
            jwt = jwt.claim("email", auth.getName());
        } else if(auth instanceof ViewerAuthenticationToken viewer) {
            jwt = jwt.claim("fileIds", viewer.getFileIds());
        }

        response.setHeader(SecurityConstants.JWT_HEADER, jwt.signWith(key).compact());
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getServletPath().equals("/user");
    }
}
