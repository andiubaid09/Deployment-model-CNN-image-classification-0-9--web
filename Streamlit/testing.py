import streamlit as st
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image, ImageOps
from streamlit_drawable_canvas import st_canvas

# Load model
model = load_model("image_classification_CNN.h5")

st.title("Digit Recognition (0–9)")

st.write("Gambar angka (0–9) di bawah ini lalu klik 'Predict'.")

# Canvas untuk menggambar
canvas_result = st_canvas(
    fill_color="black",  # default fill (tidak dipakai)
    stroke_width=10,
    stroke_color="white",  # angka warna putih
    background_color="black",  # background hitam
    width=280,
    height=280,
    drawing_mode="freedraw",
    key="canvas",
)

if st.button("Predict"):
    if canvas_result.image_data is not None:
        # Convert canvas ke image PIL
        image = Image.fromarray((canvas_result.image_data).astype("uint8")).convert("L")
        
        # Resize ke 28x28
        image = image.resize((28, 28))
        
        # Preprocessing sama seperti training
        img_array = np.array(image) / 255.0
        img_array = img_array.reshape(1, 28, 28, 1)

        # Prediksi
        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction, axis=1)[0]

        st.image(image, caption=f"Predicted Digit: {predicted_class}", width=150)
        st.write("Confidence scores:", prediction)
    else:
        st.warning("Silakan gambar angka dulu di canvas!")
