package com.hackathon.backend.entity;

public enum Role {
    USER("User"),
    ADMIN("Administrator"),
    MODERATOR("Moderator");

    private final String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
