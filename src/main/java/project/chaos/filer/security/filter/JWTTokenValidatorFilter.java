package project.chaos.filer.security.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import project.chaos.filer.security.SecurityConstants;
import project.chaos.filer.security.ViewerAuthenticationToken;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;

public class JWTTokenValidatorFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getServletPath().startsWith("/h2-console") || request.getServletPath().equals("/user") || request.getServletPath().equals("/user/registration");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String jwt = request.getHeader(SecurityConstants.JWT_HEADER);
        if (null != jwt) {
            try {
                Claims claims = getClaims(jwt);
                String role = (String) claims.get("role");
                Authentication auth;

                if(role.equals("ROLE_USER")) {
                    String email = String.valueOf(claims.get("email"));
                    auth = new UsernamePasswordAuthenticationToken(email, null,
                            AuthorityUtils.commaSeparatedStringToAuthorityList(role));
                } else if(role.equals("ROLE_VIEWER")) {
                    auth = new ViewerAuthenticationToken((ArrayList<Integer>) claims.get("fileIds"));
                } else {
                    throw new BadCredentialsException("Invalid Token received!");
                }

                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                throw new BadCredentialsException("Invalid Token received!");
            }
        }
        filterChain.doFilter(request, response);
    }

    private Claims getClaims(String jwt) {
        SecretKey key = Keys.hmacShaKeyFor(
                SecurityConstants.JWT_KEY.getBytes(StandardCharsets.UTF_8));

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }
}
