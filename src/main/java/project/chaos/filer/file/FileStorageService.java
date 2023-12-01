package project.chaos.filer.file;

import org.springframework.beans.factory.annotation.Value;
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

        Path destinationFile = Paths.get(storagePath)
                .resolve(folderName)
                .resolve(Paths.get(file.getOriginalFilename()))
                .normalize()
                .toAbsolutePath();

        try (InputStream inputStream = file.getInputStream()) {
            Files.createDirectories(destinationFile.getParent());
            Files.copy(inputStream, destinationFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
