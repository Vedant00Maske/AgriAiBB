## Importing necessary libraries for the web app
import streamlit as st
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report
from sklearn import metrics
from sklearn import tree
from sklearn.metrics import accuracy_score
import warnings
warnings.filterwarnings('ignore')
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Display Images
from PIL import Image

df = pd.read_csv('Crop_recommendation.csv')

# Features and labels
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']
labels = df['label']

# Split the data into training and testing sets
Xtrain, Xtest, Ytrain, Ytest = train_test_split(X, y, test_size=0.3, random_state=42)
RF = RandomForestClassifier(n_estimators=20, random_state=5)
RF.fit(Xtrain, Ytrain)
predicted_values = RF.predict(Xtest)
x = metrics.accuracy_score(Ytest, predicted_values)

# Function to load and display an image of the predicted crop
def show_crop_image(crop_name):
    image_path = os.path.join('crop_images', crop_name.lower() + '.jpg')
    if os.path.exists(image_path):
        st.image(image_path, caption=f"Recommended crop: {crop_name}", use_container_width=True)
    else:
        st.error("Image not found for the predicted crop.")

# Save the trained model
RF_pkl_filename = 'RF.pkl'
with open(RF_pkl_filename, 'wb') as file:
    pickle.dump(RF, file)

# Load the trained model
RF_Model_pkl = pickle.load(open('RF.pkl', 'rb'))

# Function to make predictions
def predict_crop(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall):
    prediction = RF_Model_pkl.predict(np.array([nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]).reshape(1, -1))
    return prediction

# Custom CSS for the app
st.markdown(
    """
    <style>
    .stApp {
        background-color: #2C3930;
        color: white;
    }
    .stButton>button {
        background-color: #A27B5C;
        color: white;
        border: none;
    }
    .stButton>button:hover {
        background-color: #8B6B4F;
    }
    .stSidebar {
        background-color: #3F4F44;
    }
    .stSidebar .stNumberInput input {
        background-color: #2C3930;
        color: white;
    }
    .stSidebar .stSelectbox select {
        background-color: #2C3930;
        color: white;
    }
    .stSidebar .stSlider > div > div > div > div {
        background: #9DC08B;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Streamlit UI
def main():
    st.markdown("<h1 style='text-align: center;'>SMART CROP RECOMMENDATIONS</h1>", unsafe_allow_html=True)
    
    st.sidebar.title("🌱BioSage")
    st.sidebar.header("Enter Crop Details")
    
    nitrogen = st.sidebar.slider("Nitrogen", min_value=0.0, max_value=140.0, value=0.0, step=0.1)
    phosphorus = st.sidebar.slider("Phosphorus", min_value=0.0, max_value=145.0, value=0.0, step=0.1)
    potassium = st.sidebar.slider("Potassium", min_value=0.0, max_value=205.0, value=0.0, step=0.1)
    temperature = st.sidebar.slider("Temperature (°C)", min_value=0.0, max_value=51.0, value=0.0, step=0.1)
    humidity = st.sidebar.slider("Humidity (%)", min_value=0.0, max_value=100.0, value=0.0, step=0.1)
    ph = st.sidebar.slider("pH Level", min_value=0.0, max_value=14.0, value=0.0, step=0.1)
    rainfall = st.sidebar.slider("Rainfall (mm)", min_value=0.0, max_value=500.0, value=0.0, step=0.1)
    
    inputs = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
    if st.sidebar.button("Predict"):
        if not inputs.any() or np.isnan(inputs).any() or (inputs == 0).all():
            st.error("Please fill in all input fields with valid values before predicting.")
        else:
            prediction = predict_crop(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall)
            st.success(f"The recommended crop is: {prediction[0]}")

if __name__ == '__main__':
    main()