# 🖼️ Deployment Image Classification (Digit 0–9)

Repository ini berisi implementasi deployment model **CNN untuk klasifikasi digit MNIST (0–9)** dengan dua pendekatan:

1. **Web App berbasis Flask + HTML/CSS/JS**  
   Menggunakan canvas untuk menggambar angka lalu model melakukan prediksi.
2. **Aplikasi berbasis Streamlit**  
   Memanfaatkan komponen `st_canvas` untuk menggambar langsung di dalam aplikasi.

---

## 📂 Struktur Project
.
├── app.py # Backend Flask
├── testing.py # Script pengujian Streamlit
├── image_classification_CNN.h5 # Model CNN terlatih
├── templates/
│ └── index.html # Frontend HTML
├── static/
│ ├── style.css # CSS untuk styling
│ └── script.js # JavaScript untuk canvas & prediksi
├── notebooks/
│ └── eksperimen.ipynb # Notebook training & eksperimen model
└── README.md # Dokumentasi project

---

## ⚙️ Requirements
Install dependensi utama:
```bash
pip install flask streamlit tensorflow pillow numpy
pip install streamlit-drawable-canvas
```

## 🚀 Menjalankan Proyek
# Jalankan server Flask
python app.py
Buka di browser: http://127.0.0.1:5000
Fitur:
1. Canvas berbasis HTML5 untuk menggambar angka.
2. Gambar dikirim ke backend Flask untuk diproses.
3. Prediksi digit ditampilkan langsung di halaman web.

# Streamlit App
Jalankan aplikasi Streamlit
py -m streamlit run testing.py


## 📊 Hasil
Akurasi training > 98% pada dataset MNIST
Streamlit & Flask sama-sama bisa melakukan prediksi real-time pada digit yang digambar.
