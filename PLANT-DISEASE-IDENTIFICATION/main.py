import streamlit as st
import tensorflow as tf
import numpy as np
import time
from PIL import Image
from gemini_service import get_treatment  # Import Gemini API function

# Sidebar with new color
st.sidebar.markdown(
    """
    <style>
    [data-testid="stSidebar"] {
        background-color: #2C3930;
        color: white;
    }
    </style>
    """,
    unsafe_allow_html=True,
)
# Custom CSS for the entire app
st.markdown(
    """
    <style>
    .stButton>button {
        background-color: #A27B5C;
        color: white;
        border: none;
    }
    .stButton>button:hover {
        background-color: #8B6B4F;
    }
    .main {
        background-color: #3F4F44;
    }
    h1, h2 {
        color: #A27B5C !important;
    }
    div[data-testid="stMarkdownContainer"] {
        color: white;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Load the model
@st.cache_resource
def load_model():
    return tf.keras.models.load_model("trained_plant_disease_model.keras")

model = load_model()

def model_prediction(test_image):
    image = tf.keras.preprocessing.image.load_img(test_image, target_size=(128, 128))
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = np.array([input_arr])  # Convert single image to batch
    predictions = model.predict(input_arr)
    return np.argmax(predictions)  # Return index of max element

# Sidebar
st.sidebar.title("🌱 BioSage")
app_mode = st.sidebar.selectbox("Select Page", ["🏠 HOME", "🔬 DISEASE RECOGNITION"])

# Display header image
img = Image.open("Diseases.png")
st.image(img, use_container_width=True)

# Disease labels
class_names = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
               'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 
               'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 
               'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 
               'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 
               'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
               'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 
               'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy', 
               'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 
               'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 
               'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 
               'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 
               'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
               'Tomato___healthy']

# Main Page
if app_mode == "🏠 HOME":
    st.markdown("<h1 style='text-align: center; color: green;'>🌿 SMART DISEASE DETECTION</h1>", unsafe_allow_html=True)
    st.write("Welcome to BioSage! Select **Disease Recognition** from the sidebar to detect plant diseases.")

# Prediction Page
elif app_mode == "🔬 DISEASE RECOGNITION":
    st.markdown("<h2 style='text-align: center; color: darkgreen;'>🦠 DISEASE RECOGNITION</h2>", unsafe_allow_html=True)
    
    test_image = st.file_uploader("📸 **Upload an Image of the Affected Plant:**", type=["jpg", "png", "jpeg"])
    
    # Display image preview automatically when uploaded in a contained box
    if test_image:
        col1, col2, col3 = st.columns([1,2,1])
        with col2:
            st.markdown("""
                <style>
                .contained-image {
                    width: 300px;
                    height: 300px;
                    margin: auto;
                    padding: 10px;
                    border: 2px solid #A27B5C;
                    border-radius: 10px;
                    object-fit: cover;
                }
                </style>
            """, unsafe_allow_html=True)
            st.image(
                test_image, 
                width=300,  # Smaller fixed width
                caption="Uploaded Plant Image",
                clamp=True,
                output_format="PNG"
            )
    if test_image and st.button("🔍 Predict Disease"):
        st.snow()
        st.write("🔬 **Analyzing...** Please wait...")
        result_index = model_prediction(test_image)
        predicted_disease = class_names[result_index]
        
        st.session_state['predicted_disease'] = predicted_disease
        st.success(f"🌱 **Identified Disease:** **{predicted_disease}**")

    if 'predicted_disease' in st.session_state:
        predicted_disease = st.session_state['predicted_disease']
        
        # Treatment button with loading animation
        if st.button("💊 Get Treatment Solution", key="treatment_btn"):
            with st.spinner("🧑‍⚕️ Fetching AI-powered treatment recommendations..."):
                time.sleep(2)  # Simulate loading delay
                treatment = get_treatment(predicted_disease)
                st.session_state['treatment'] = treatment

        if 'treatment' in st.session_state:
            treatment = st.session_state['treatment']
            st.markdown(f"""
        <div style="background-color: #2C3930; padding: 15px; border-radius: 10px; margin-top: 10px; border: 1px solid #A27B5C;">
            <h3 style="color: #A27B5C;">Recommended Treatment for {predicted_disease}:</h3>
            <p style="color: white;">{treatment}</p>
        </div>
        """, unsafe_allow_html=True)