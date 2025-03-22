package project.chaos.filer.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    @Value("${files.storage.path}")
    private String storagePath;

    public void saveFile(MultipartFile file, String folderName) {
        Path destinationFile = getFilePath(file.getOriginalFilename(), folderName);

        try (InputStream inputStream = file.getInputStream()) {
            Files.createDirectories(destinationFile.getParent());
            Files.copy(inputStream, destinationFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Resource loadFile(String fileName, String folderName) {
        Path filePath = getFilePath(fileName, folderName);
        Resource resource = new PathResource(filePath);

        if (resource.exists()) {
            return resource;
        } else {
            throw new RuntimeException("File not found");
        }
    }

    private Path getFilePath(String fileName, String folderName) {
        return Paths.get(storagePath)
                .resolve(folderName)
                .resolve(Paths.get(fileName))
                .normalize()
                .toAbsolutePath();
    }
}
