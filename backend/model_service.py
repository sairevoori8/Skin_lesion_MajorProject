import numpy as np
import cv2
import tensorflow as tf
import os


class SkinLesionModel:

    def __init__(self, model_path="model.keras"):

        base_dir = os.path.dirname(os.path.abspath(__file__))
        full_path = os.path.join(base_dir, model_path)

        print("Loading model from:", full_path)

        self.model = tf.keras.models.load_model(full_path)
        self.last_conv_layer_name = self._find_last_conv_layer()
        self.img_size = (71, 71)
        self.class_names = ["nv", "mel", "bkl", "bcc", "akiec", "vasc", "df"]

        print("✅ Model Loaded Successfully")

    def _find_last_conv_layer(self):
        for layer in reversed(self.model.layers):
            if isinstance(layer, tf.keras.layers.Conv2D):
                return layer.name
        raise ValueError("No Conv2D layer found in model.")

    def preprocess(self, image_file):
        img = cv2.imdecode(
            np.frombuffer(image_file.read(), np.uint8),
            cv2.IMREAD_COLOR
        )

        if img is None:
            raise ValueError("Invalid image file")

        original = img.copy()

        img = cv2.resize(img, self.img_size)
        img = img / 255.0
        img = np.expand_dims(img, axis=0)

        return img, original

    def predict(self, image_file):

        processed_img, _ = self.preprocess(image_file)

        preds = self.model.predict(processed_img)
        probabilities = preds[0]  # shape (7,)

        idx = int(np.argmax(probabilities))
        confidence = float(np.max(probabilities))

        # Create dictionary of all class confidences
        all_class_confidences = {
            self.class_names[i]: round(float(probabilities[i]) * 100, 2)
            for i in range(len(self.class_names))
        }

        return {
            "predicted_class": self.class_names[idx],
            "confidence": round(confidence * 100, 2),
            "class_index": idx,
            "all_class_confidences": all_class_confidences
        }

    def generate_gradcam(self, image_file):

        processed_img, original_img = self.preprocess(image_file)

        # Create GradCAM model
        grad_model = tf.keras.models.Model(
            inputs=self.model.input,
            outputs=[
                self.model.get_layer(self.last_conv_layer_name).output,
                self.model.output
            ]
        )

        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(processed_img)

            # 🔥 Safety check for multi-output models
            if isinstance(predictions, list):
                predictions = predictions[0]

            pred_index = tf.argmax(predictions[0])
            class_channel = predictions[:, pred_index]

        # Compute gradients
        grads = tape.gradient(class_channel, conv_outputs)

        # Global average pooling on gradients
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        # Remove batch dimension
        conv_outputs = conv_outputs[0]

        # Weight feature maps by gradients
        heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)

        # ReLU (keep positive influence only)
        heatmap = tf.maximum(heatmap, 0)

        # Normalize
        max_val = tf.reduce_max(heatmap)
        if max_val > 0:
            heatmap /= max_val

        heatmap = heatmap.numpy()

        # Resize to original image size
        heatmap = cv2.resize(
            heatmap,
            (original_img.shape[1], original_img.shape[0])
        )

        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

        # Overlay heatmap on original
        overlay = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)

        # Encode image for API response
        success, buffer = cv2.imencode(".jpg", overlay)
        if not success:
            raise ValueError("Could not encode GradCAM image")

        return buffer.tobytes()