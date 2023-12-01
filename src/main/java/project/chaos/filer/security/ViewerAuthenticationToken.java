package project.chaos.filer.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;


public class ViewerAuthenticationToken extends AbstractAuthenticationToken {

    private final Collection<Integer> fileIds;

    public ViewerAuthenticationToken(Collection<Integer> fileIds) {
        super(List.of(new SimpleGrantedAuthority("ROLE_VIEWER")));
        super.setAuthenticated(true);
        this.fileIds = fileIds;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return "";
    }

    public Collection<Integer> getFileIds() {
        return fileIds;
    }
}
