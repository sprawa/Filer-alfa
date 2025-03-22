package project.chaos.filer.file;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import project.chaos.filer.file.item.FileItem;
import project.chaos.filer.file.item.FileItemsRepository;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileStorageService fileStorageService;
    private final FileItemsRepository fileItemRepository;

    @Transactional
    public void upload(MultipartFile file, Integer rootId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        var item = FileItem.builder()
                .owner(email)
                .fileName(file.getOriginalFilename())
                .rootId(rootId)
                .folder(false)
                .build();

        fileItemRepository.save(item);
        fileStorageService.saveFile(file, email);
    }

    public Resource download(Integer id) {
        var fileItem = fileItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!fileItem.getOwner().equals(email)) {
            throw new RuntimeException("Access denied");
        }

        return fileStorageService.loadFile(fileItem.getFileName(), email);
    }
}
