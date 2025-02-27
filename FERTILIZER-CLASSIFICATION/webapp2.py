import streamlit as st
import pickle
import numpy as np

# Load models
model = pickle.load(open('classifier.pkl', 'rb'))
ferti = pickle.load(open('fertilizer.pkl', 'rb'))

# Streamlit UI
st.title("Plant Fertilizer Prediction")

st.sidebar.header("Input Parameters")

# Input fields
temp = st.sidebar.number_input("Temperature", min_value=0, max_value=100, value=25)
humi = st.sidebar.number_input("Humidity", min_value=0, max_value=100, value=50)
mois = st.sidebar.number_input("Moisture", min_value=0, max_value=100, value=30)
soil = st.sidebar.number_input("Soil Type (Numeric)", min_value=0, max_value=10, value=1)
crop = st.sidebar.number_input("Crop Type (Numeric)", min_value=0, max_value=10, value=1)
nitro = st.sidebar.number_input("Nitrogen Level", min_value=0, max_value=100, value=20)
pota = st.sidebar.number_input("Potassium Level", min_value=0, max_value=100, value=20)
phosp = st.sidebar.number_input("Phosphorus Level", min_value=0, max_value=100, value=20)

# Prediction button
if st.sidebar.button("Predict Fertilizer"):
    input_data = np.array([temp, humi, mois, soil, crop, nitro, pota, phosp]).reshape(1, -1)
    prediction = ferti.classes_[model.predict(input_data)][0]
    
    st.subheader("Prediction:")
    st.success(f"The recommended fertilizer is: {prediction}")