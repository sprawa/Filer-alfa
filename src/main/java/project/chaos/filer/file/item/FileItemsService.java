package project.chaos.filer.file.item;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import project.chaos.filer.security.ViewerAuthenticationToken;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileItemsService {

    private final FileItemsRepository fileItemsRepository;

    public Collection<FileItemDto> getItems(Integer rootId) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof UsernamePasswordAuthenticationToken) {
            return getFileItemDtos(fileItemsRepository.findByOwnerAndRootId(auth.getName(), rootId));
        } else if (auth instanceof ViewerAuthenticationToken viewer) {
            return getFileItemDtos(fileItemsRepository.findByIdInAndFolderIsFalse(viewer.getFileIds()));
        } else {
            throw new IllegalStateException();
        }
    }

    private List<FileItemDto> getFileItemDtos(Collection<FileItem> fileItems) {
        return fileItems.stream()
                .map(item -> FileItemDto.builder()
                        .id(item.getId())
                        .fileName(item.getFileName())
                        .folder(item.isFolder())
                        .build())
                .toList();
    }
}
