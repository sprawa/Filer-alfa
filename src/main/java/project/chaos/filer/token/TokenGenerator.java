package project.chaos.filer.token;

import java.util.Base64;
import java.util.UUID;

public class TokenGenerator {

    public static String generate() {
        return Base64.getEncoder().encodeToString(UUID.randomUUID().toString().getBytes());
    }

    private TokenGenerator() {
        throw new IllegalStateException("Utility class");
    }
}
