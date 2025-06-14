package com.idetityVerification.controller;

import com.idetityVerification.dto.FaceComparisonResult;
import com.idetityVerification.service.FaceComparisonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/face-compare")
public class FaceCompareController {

    private final FaceComparisonService comparisonService;
    private final double defaultThreshold;

    public FaceCompareController(
            FaceComparisonService comparisonService,
            @Value("${face.compare.threshold:50.0}") double defaultThreshold
    ) {
        this.comparisonService = comparisonService;
        this.defaultThreshold = defaultThreshold;
    }

    /**
     * Compare two face photos for a user. Optional `threshold` query param to adjust sensitivity.
     * Higher threshold = more lenient matching.
     */
    @GetMapping("/{userId}")
    public FaceComparisonResult compare(
            @PathVariable String userId,
            @RequestParam(defaultValue = "100") double threshold
    ) {
        return comparisonService.compare(userId, threshold);
    }
}
