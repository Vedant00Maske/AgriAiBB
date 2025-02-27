import streamlit as st
import pickle
import numpy as np
from googletrans import Translator

# Load models
model = pickle.load(open('classifier.pkl', 'rb'))
ferti = pickle.load(open('fertilizer.pkl', 'rb'))

# Initialize Translator
translator = Translator()

# Language Selection
languages = {"English": "en", "Hindi": "hi", "Telugu": "te", "Tamil": "ta", "Spanish": "es"}
selected_lang = st.sidebar.selectbox("Choose Language", list(languages.keys()))

def translate_text(text):
    return translator.translate(text, dest=languages[selected_lang]).text

# Streamlit UI
st.title(translate_text("Plant Fertilizer Prediction"))

st.sidebar.header(translate_text("Input Parameters"))

# Input fields
temp = st.sidebar.number_input(translate_text("Temperature"), min_value=0, max_value=100, value=25)
humi = st.sidebar.number_input(translate_text("Humidity"), min_value=0, max_value=100, value=50)
mois = st.sidebar.number_input(translate_text("Moisture"), min_value=0, max_value=100, value=30)
soil = st.sidebar.number_input(translate_text("Soil Type (Numeric)"), min_value=0, max_value=10, value=1)
crop = st.sidebar.number_input(translate_text("Crop Type (Numeric)"), min_value=0, max_value=10, value=1)
nitro = st.sidebar.number_input(translate_text("Nitrogen Level"), min_value=0, max_value=100, value=20)
pota = st.sidebar.number_input(translate_text("Potassium Level"), min_value=0, max_value=100, value=20)
phosp = st.sidebar.number_input(translate_text("Phosphorus Level"), min_value=0, max_value=100, value=20)

# Prediction button
if st.sidebar.button(translate_text("Predict Fertilizer")):
    input_data = np.array([temp, humi, mois, soil, crop, nitro, pota, phosp]).reshape(1, -1)
    prediction = ferti.classes_[model.predict(input_data)][0]
    
    st.subheader(translate_text("Prediction:"))
    st.success(f"{translate_text('The recommended fertilizer is')}: {translate_text(prediction)}")