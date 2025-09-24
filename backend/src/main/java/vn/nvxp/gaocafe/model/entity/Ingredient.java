package vn.nvxp.gaocafe.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "ingredients")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "ingredient_name", nullable = false, unique = true)
    private String ingredientName;

    @Column(name = "unit", nullable = false)
    private String unit; // "kg", "gram", "ml", "cai"

    @Column(name = "quantity_in_stock", nullable = false)
    private double quantityInStock;

    @OneToMany(mappedBy = "ingredient", cascade = CascadeType.ALL)
    private Set<ProductIngredient> productIngredients;
}
