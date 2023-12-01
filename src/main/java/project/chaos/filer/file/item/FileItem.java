package project.chaos.filer.file.item;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
