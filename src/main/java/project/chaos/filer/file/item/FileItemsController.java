package project.chaos.filer.file.item;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/files/items")
@RequiredArgsConstructor
public class FileItemsController {

    private final FileItemsService fileItemsService;

    @GetMapping
    public Collection<FileItemDto> getItems(@RequestParam(required = false) Integer rootId) {
        return fileItemsService.getItems(rootId);
    }
}
