package project.chaos.filer.file.item;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileItemsService {

    private final FileItemsRepository fileItemsRepository;

    public Collection<FileItemDto> getItems(Integer rootId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return fileItemsRepository.findByOwnerAndRootId(email, rootId).stream()
                .map(item -> FileItemDto.builder()
                        .id(item.getId())
                        .fileName(item.getFileName())
                        .folder(item.isFolder())
                        .build()).collect(Collectors.toList());
    }
}
