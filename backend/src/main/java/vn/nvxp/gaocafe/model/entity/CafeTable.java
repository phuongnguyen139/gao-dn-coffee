package vn.nvxp.gaocafe.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import vn.nvxp.gaocafe.model.enums.CafeTableStatus;

@Data
@Entity
@Table(name = "cafe_tables")
public class CafeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "table_name", nullable = false, unique = true)
    private String tableName;

    @Enumerated(EnumType.STRING)
    @Column(name = "table_status", nullable = false)
    private CafeTableStatus tableStatus;
}
