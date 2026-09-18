package com.booking.service;

import com.booking.dto.ResourceRequest;
import com.booking.dto.ResourceResponse;
import com.booking.entity.Resource;
import com.booking.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    // ADMIN: Create resource
    public ResourceResponse createResource(ResourceRequest request) {

        Resource resource = new Resource();

        resource.setName(request.getName());
        resource.setDescription(request.getDescription());
        resource.setType(request.getType());
        resource.setAvailable(request.getAvailable());
        resource.setPrice(request.getPrice());

        Resource savedResource = resourceRepository.save(resource);

        return ResourceResponse.fromEntity(savedResource);
    }

    // ADMIN + USER: Get all resources
    public List<ResourceResponse> getAllResources() {

        return resourceRepository.findAll()
                .stream()
                .map(ResourceResponse::fromEntity)
                .toList();
    }

    // ADMIN + USER: Get resource by ID
    public ResourceResponse getResourceById(Long id) {

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Resource not found with id: " + id));

        return ResourceResponse.fromEntity(resource);
    }

    // ADMIN: Update resource
    public ResourceResponse updateResource(
            Long id,
            ResourceRequest request) {

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Resource not found with id: " + id));

        resource.setName(request.getName());
        resource.setDescription(request.getDescription());
        resource.setType(request.getType());
        resource.setAvailable(request.getAvailable());
        resource.setPrice(request.getPrice());

        Resource updatedResource = resourceRepository.save(resource);

        return ResourceResponse.fromEntity(updatedResource);
    }

    // ADMIN: Delete resource
    public void deleteResource(Long id) {

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Resource not found with id: " + id));

        resourceRepository.delete(resource);
    }
}