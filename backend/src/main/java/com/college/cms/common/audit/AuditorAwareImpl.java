package com.college.cms.common.audit;

import com.college.cms.security.UserPrincipal;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorAwareImpl")
public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
            authentication.getPrincipal().equals("anonymousUser")) {
            return Optional.of("SYSTEM");
        }
        if (authentication.getPrincipal() instanceof UserPrincipal principal) {
            return Optional.of(principal.getEmail());
        }
        return Optional.of(authentication.getName());
    }
}
