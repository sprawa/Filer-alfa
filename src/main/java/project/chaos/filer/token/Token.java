package project.chaos.filer.token;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TOKENS")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Token {
    @Id
    String tokenValue;
    String fileIds;
}
