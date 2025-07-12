package com.hackathon.backend.dto;

import org.springframework.data.domain.Page;
import java.util.List;

public class ProfileSearchResponse {
    private List<UserProfileDTO> profiles;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int size;
    private boolean hasNext;
    private boolean hasPrevious;

    // Constructor from Page
    public ProfileSearchResponse(Page<UserProfileDTO> page) {
        this.profiles = page.getContent();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.currentPage = page.getNumber();
        this.size = page.getSize();
        this.hasNext = page.hasNext();
        this.hasPrevious = page.hasPrevious();
    }

    // Getters and Setters
    public List<UserProfileDTO> getProfiles() { return profiles; }
    public void setProfiles(List<UserProfileDTO> profiles) { this.profiles = profiles; }

    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public int getCurrentPage() { return currentPage; }
    public void setCurrentPage(int currentPage) { this.currentPage = currentPage; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public boolean isHasNext() { return hasNext; }
    public void setHasNext(boolean hasNext) { this.hasNext = hasNext; }

    public boolean isHasPrevious() { return hasPrevious; }
    public void setHasPrevious(boolean hasPrevious) { this.hasPrevious = hasPrevious; }
}
