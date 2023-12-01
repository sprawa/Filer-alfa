package project.chaos.filer.token;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import project.chaos.filer.file.item.FileItem;
import project.chaos.filer.file.item.FileItemsRepository;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final FileItemsRepository fileItemsRepository;
    private final TokenRepository tokenRepository;

    public String createToken(TokenRequestDto dto) {

        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var permittedIds = fileItemsRepository.findByOwnerAndIdIn(email, dto.getFileItemIds())
                .stream()
                .map(FileItem::getId)
                .map(Object::toString)
                .collect(Collectors.toList());

        if(permittedIds.isEmpty()) throw new IllegalArgumentException();

        String token = TokenGenerator.generate();
        tokenRepository.save(Token.builder()
                        .tokenValue(token)
                        .fileIds(String.join(",", permittedIds))
                .build());
        return token;
    }
}
