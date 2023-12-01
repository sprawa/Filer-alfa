package project.chaos.filer.file.item;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileItemDto {

    private Integer id;
    private String fileName;
    boolean folder;
}
