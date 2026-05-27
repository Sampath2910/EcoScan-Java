package com.ecoscan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResult {
    private String label;
    private double confidence;
    private boolean isRecyclable;
    private List<String> suggestions;
    private String error;

    public PredictionResult(String label, double confidence, boolean isRecyclable) {
        this.label = label;
        this.confidence = confidence;
        this.isRecyclable = isRecyclable;
    }
}
