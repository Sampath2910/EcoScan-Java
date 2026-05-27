package com.ecoscan.service;

import ai.djl.Device;
import ai.djl.MalformedModelException;
import ai.djl.inference.Predictor;
import ai.djl.modality.cv.Image;
import ai.djl.modality.cv.ImageFactory;
import ai.djl.modality.cv.transform.CenterCrop;
import ai.djl.modality.cv.transform.Normalize;
import ai.djl.modality.cv.transform.Resize;
import ai.djl.modality.cv.transform.ToTensor;
import ai.djl.ndarray.NDArray;
import ai.djl.ndarray.NDList;
import ai.djl.repository.zoo.Criteria;
import ai.djl.repository.zoo.ZooModel;
import ai.djl.training.util.ProgressBar;
import ai.djl.translate.Batchifier;
import ai.djl.translate.Pipeline;
import ai.djl.translate.TranslateException;
import ai.djl.translate.Translator;
import ai.djl.translate.TranslatorContext;
import com.ecoscan.dto.PredictionResult;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ClassificationService {

    private static final Logger log = LoggerFactory.getLogger(ClassificationService.class);

    private static final List<String> CLASS_NAMES =
            Arrays.asList("cardboard", "glass", "metal", "paper", "plastic", "trash");

    private static final List<String> RECYCLABLE_CLASSES =
            Arrays.asList("cardboard", "glass", "metal", "paper", "plastic");

    private static final float[] IMAGENET_MEAN = {0.485f, 0.456f, 0.406f};
    private static final float[] IMAGENET_STD  = {0.229f, 0.224f, 0.225f};

    @Value("${ecoscan.model.cache-dir:model_cache}")
    private String cacheDir;

    @Value("${ecoscan.model.ts-url}")
    private String tsUrl;

    private ZooModel<Image, float[]> model;
    private Predictor<Image, float[]> predictor;

    // -----------------------------------------------------------------------
    // Startup — load model eagerly so first upload is fast
    // -----------------------------------------------------------------------
    @PostConstruct
    public void init() {
        try {
            Path modelFile = ensureModelDownloaded();
            model    = buildModel(modelFile);
            predictor = model.newPredictor();
            log.info("✅ DJL waste classifier ready.");
        } catch (Exception e) {
            log.error("❌ Failed to load ML model: {}", e.getMessage(), e);
            model     = null;
            predictor = null;
        }
    }

    @PreDestroy
    public void destroy() {
        if (predictor != null) predictor.close();
        if (model != null)     model.close();
    }

    // -----------------------------------------------------------------------
    // Public classify API
    // -----------------------------------------------------------------------
    public PredictionResult classify(Path imagePath) {
        if (predictor == null) {
            return mockResult(imagePath.toString());
        }
        try {
            // Convert image to a format DJL can handle (WEBP support is limited)
            Path processedPath = convertImageIfNeeded(imagePath);

            Image img = ImageFactory.getInstance().fromFile(processedPath);
            float[] probs = predictor.predict(img);

            int maxIdx = 0;
            float maxProb = 0f;
            for (int i = 0; i < probs.length; i++) {
                if (probs[i] > maxProb) { maxProb = probs[i]; maxIdx = i; }
            }

            String label      = CLASS_NAMES.get(maxIdx);
            boolean recyclable = RECYCLABLE_CLASSES.contains(label);
            double confidence  = Math.round(maxProb * 10000.0) / 100.0; // e.g. 87.43

            PredictionResult result = new PredictionResult(label, confidence, recyclable);
            result.setSuggestions(getSuggestions(label));
            return result;

        } catch (TranslateException | IOException e) {
            log.error("❌ Classification error: {}", e.getMessage(), e);
            PredictionResult err = new PredictionResult("Server Error", 0, false);
            err.setError("Classification failed: " + e.getMessage());
            err.setSuggestions(List.of("An error occurred during classification."));
            return err;
        }
    }

    /**
     * Converts WEBP or other problematic formats to PNG for DJL compatibility.
     * If conversion fails, returns original path.
     */
    private Path convertImageIfNeeded(Path originalPath) {
        String filename = originalPath.getFileName().toString().toLowerCase();

        // Check if conversion is needed (WEBP or other formats that DJL may not support)
        if (filename.endsWith(".webp") || filename.endsWith(".gif")) {
            try {
                Path tempDir = originalPath.getParent();
                Path convertedPath = tempDir.resolve(filename.replaceAll("\\.[^.]+$", "_converted.png"));

                log.info("🔄 Converting {} to PNG format for classification...", filename);

                // Read the image using Java's ImageIO (with webp-imageio plugin if available)
                BufferedImage bufferedImage = ImageIO.read(originalPath.toFile());

                if (bufferedImage == null) {
                    log.warn("⚠️ Could not read image format for: {}. Trying original file.", filename);
                    return originalPath;
                }

                // Write as PNG
                ImageIO.write(bufferedImage, "png", convertedPath.toFile());
                log.info("✅ Converted to: {}", convertedPath);

                return convertedPath;

            } catch (IOException e) {
                log.warn("⚠️ Image conversion failed for {}: {}. Using original.", filename, e.getMessage());
                return originalPath;
            }
        }

        return originalPath;
    }

    // -----------------------------------------------------------------------
    // Model building with DJL Criteria
    // -----------------------------------------------------------------------
    private ZooModel<Image, float[]> buildModel(Path modelFile)
            throws IOException, MalformedModelException,
                   ai.djl.repository.zoo.ModelNotFoundException {

        Translator<Image, float[]> translator = new Translator<>() {
            private final Pipeline pipeline = new Pipeline()
                    .add(new Resize(256))
                    .add(new CenterCrop(224, 224))
                    .add(new ToTensor())
                    .add(new Normalize(IMAGENET_MEAN, IMAGENET_STD));

            @Override
            public NDList processInput(TranslatorContext ctx, Image input) {
                NDArray array = input.toNDArray(ctx.getNDManager(), Image.Flag.COLOR);
                return pipeline.transform(new NDList(array));
            }

            @Override
            public float[] processOutput(TranslatorContext ctx, NDList list) {
                NDArray logits = list.singletonOrThrow();

                // Handle both 1D (single image) and 2D (batch) outputs
                NDArray probs;
                if (logits.getShape().dimension() == 1) {
                    // 1D tensor: apply softmax on dimension 0
                    probs = logits.softmax(0);
                } else {
                    // 2D tensor: apply softmax on dimension 1 (class dimension)
                    probs = logits.softmax(1).squeeze();
                }
                return probs.toFloatArray();
            }

            @Override
            public Batchifier getBatchifier() { return Batchifier.STACK; }
        };

        Criteria<Image, float[]> criteria = Criteria.builder()
                .setTypes(Image.class, float[].class)
                .optModelPath(modelFile.getParent())
                .optModelName(modelFile.getFileName().toString())
                .optDevice(Device.cpu())
                .optTranslator(translator)
                .optProgress(new ProgressBar())
                .build();

        return criteria.loadModel();
    }

    // -----------------------------------------------------------------------
    // Download model from HuggingFace if not cached
    // -----------------------------------------------------------------------
    private Path ensureModelDownloaded() throws IOException, InterruptedException {
        Path dir  = Paths.get(cacheDir);
        Files.createDirectories(dir);
        Path file = dir.resolve("waste_classifier_scripted.pt");

        if (Files.exists(file) && Files.size(file) > 1_000_000) {
            log.info("📂 Using cached model: {}", file);
            return file;
        }

        log.info("🌐 Downloading model from HuggingFace...");
        HttpClient client = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .build();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(tsUrl))
                .GET()
                .build();

        HttpResponse<InputStream> response =
                client.send(request, HttpResponse.BodyHandlers.ofInputStream());

        try (InputStream is = response.body()) {
            Files.copy(is, file, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        }
        log.info("✅ Model downloaded to: {}", file);
        return file;
    }

    // -----------------------------------------------------------------------
    // Recycling suggestions per label
    // -----------------------------------------------------------------------
    private List<String> getSuggestions(String label) {
        Map<String, List<String>> map = new HashMap<>();
        map.put("plastic",   List.of("Rinse and flatten container.", "Check local collection rules."));
        map.put("glass",     List.of("Rinse clean, remove lids.", "Glass may require drop-off."));
        map.put("metal",     List.of("Empty and rinse cans.", "Crush to save space."));
        map.put("paper",     List.of("Keep dry, remove plastic windows.", "Shredding not usually needed."));
        map.put("cardboard", List.of("Flatten boxes completely.", "Remove all packing tape/labels."));
        map.put("trash",     List.of("Dispose in standard waste bin.", "No recycling options available."));
        return map.getOrDefault(label.toLowerCase(), List.of("No specific guidance available."));
    }

    // -----------------------------------------------------------------------
    // Mock fallback when model unavailable
    // -----------------------------------------------------------------------
    private PredictionResult mockResult(String filepath) {
        String label = filepath.toLowerCase().contains("plastic") ? "plastic" : "trash";
        boolean recyclable = !label.equals("trash");
        PredictionResult r = new PredictionResult(label, 85.0, recyclable);
        r.setSuggestions(getSuggestions(label));
        r.setError("ML Model unavailable — using mock result.");
        return r;
    }
}
