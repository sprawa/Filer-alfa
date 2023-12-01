package project.chaos.filer.file.item;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "FILE_ITEMS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class FileItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String owner;
    private String fileName;
    private Integer rootId;
    boolean folder;
}
