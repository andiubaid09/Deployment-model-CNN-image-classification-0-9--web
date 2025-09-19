import io
import base64
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify, render_template
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt

app = Flask(__name__)

# Load model
model = load_model("Model/image_classification_CNN.h5")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Ambil data dari request
        data = request.get_json()
        if "image" not in data:
            return jsonify({"error": "No image found"}), 400

        # Decode base64 image
        image_data = data["image"].split(",")[1]
        image_bytes = base64.b64decode(image_data)

        # Convert ke PIL Image grayscale
        image = Image.open(io.BytesIO(image_bytes)).convert("L")

        # Resize ke 28x28 (tanpa invert, samakan dengan Streamlit)
        image = image.resize((28, 28))

        # Convert ke array & normalisasi
        img_array = np.array(image) / 255.0
        img_array = img_array.reshape(1, 28, 28, 1)

        # Debug mode → tampilkan gambar hasil preprocessing
        debug = request.args.get("debug", "false").lower() == "true"
        if debug:
            plt.imshow(img_array.reshape(28, 28), cmap="gray")
            plt.title("Processed Image (Debug Mode)")
            plt.show()

        # Prediksi
        pred = model.predict(img_array)
        predicted_class = int(np.argmax(pred, axis=1)[0])
        confidence = float(np.max(pred))

        return jsonify({
            "digit": predicted_class,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
