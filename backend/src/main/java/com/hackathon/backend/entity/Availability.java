package com.hackathon.backend.entity;

public enum Availability {
    WEEKEND("weekend"),
    WORKING("working"),
    FLEXIBLE("flexible");

    private final String value;

    Availability(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}
