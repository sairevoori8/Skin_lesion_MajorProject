from flask import Flask, request, jsonify, send_file
from model_service import SkinLesionModel
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
model = SkinLesionModel("model.keras")


@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files["image"]
    result = model.predict(image_file)

    return jsonify(result)


@app.route("/gradcam", methods=["POST"])
def gradcam():

    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files["image"]

    heatmap_bytes = model.generate_gradcam(image_file)

    return send_file(
        io.BytesIO(heatmap_bytes),
        mimetype="image/jpeg"
    )


if __name__ == "__main__":
    app.run(debug=True)