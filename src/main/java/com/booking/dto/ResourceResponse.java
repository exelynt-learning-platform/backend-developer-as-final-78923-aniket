package com.booking.dto;

import com.booking.entity.Resource;

import java.math.BigDecimal;

public class ResourceResponse {

    private Long id;
    private String name;
    private String description;
    private String type;
    private Boolean available;
    private BigDecimal price;

    public ResourceResponse() {
    }

    public ResourceResponse(Long id, String name, String description,
                            String type, Boolean available, BigDecimal price) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.available = available;
        this.price = price;
    }

    public static ResourceResponse fromEntity(Resource resource) {
        return new ResourceResponse(
                resource.getId(),
                resource.getName(),
                resource.getDescription(),
                resource.getType(),
                resource.getAvailable(),
                resource.getPrice()
        );
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getType() {
        return type;
    }

    public Boolean getAvailable() {
        return available;
    }

    public BigDecimal getPrice() {
        return price;
    }
}