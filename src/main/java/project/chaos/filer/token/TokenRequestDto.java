package project.chaos.filer.token;

import lombok.Getter;
import lombok.Setter;

import java.util.Collection;

@Getter
@Setter
public class TokenRequestDto {

    private Collection<Integer> fileItemIds;
}
