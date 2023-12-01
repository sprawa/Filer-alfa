package project.chaos.filer.file.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface FileItemsRepository extends JpaRepository<FileItem, Integer> {

    Collection<FileItem> findByOwnerAndRootId(String owner, Integer rootId);
    Collection<FileItem> findByOwnerAndIdIn(String owner, Collection<Integer> ids);
    Collection<FileItem> findByIdInAndFolderIsFalse(Collection<Integer> ids);

}
