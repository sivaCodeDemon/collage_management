package com.college.cms.common.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " not found with id: " + id);
    }
    public static String formatMessage(String resource, String field, Object value) {
        return resource + " not found with " + field + ": " + value;
    }
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(resource + " not found with " + field + ": " + value);
    }
}
