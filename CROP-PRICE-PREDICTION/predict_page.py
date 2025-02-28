import streamlit as st
import pickle
import numpy as np

def load_model():
    with open('saved_steps.pkl','rb') as file:
        mod = pickle.load(file)
    return mod
        
deploy = load_model()
regressor = deploy['model']
le_com = deploy['le_c']
le_s = deploy['le_s']
le_d = deploy['le_d']
le_m = deploy['le_m']

def predict():
    st.backgroundColor = 'blue'
    st.title("Crop Price Prediction")
    st.write("Please choose from the following:")
    com = ('Bhindi(Ladies Finger)', 'Brinjal', 'Cabbage', 'Cauliflower',
        'Coriander(Leaves)', 'Ginger(Green)', 'Green Chilli', 'Guar', 'Lemon',
        'Tomato', 'Apple', 'Banana', 'Beetroot', 'Bitter gourd', 'Bottle gourd',
        'Capsicum', 'Carrot', 'Colacasia', 'Cucumbar(Kheera)',
        'French Beans (Frasbean)', 'Garlic', 'Guava', 'Jack Fruit', 'Mango',
        'Mashrooms', 'Mousambi(Sweet Lime)', 'Onion', 'Papaya', 'Pear(Marasebu)',
        'Peas Wet', 'Pineapple', 'Plum', 'Potato', 'Pumpkin', 'Raddish', 'Spinach',
        'Sponge gourd', 'Tinda', 'Amaranthus', 'Amphophalus', 'Ashgourd',
        'Banana - Green', 'Cowpea(Veg)', 'Drumstick', 'Leafy Vegetable',
        'Pointed gourd (Parval)', 'Ridgeguard(Tori)', 'Snakeguard', 'Wheat', 'Rice',
        'Masur Dal', 'Pomegranate', 'Groundnut', 'Turmeric', 'Paddy(Dhan)(Common)',
        'Black Gram (Urd Beans)(Whole)', 'Jowar(Sorghum)', 'Maize',
        'Bengal Gram(Gram)(Whole)', 'Gur(Jaggery)', 'Tamarind Seed', 'Lak(Teora)',
        'Cluster beans', 'Orange', 'Soyabean', 'Mahua Seed(Hippe seed)', 'Mahua',
        'Arhar (Tur/Red Gram)(Whole)', 'Castor Seed', 'Corriander seed', 'Cotton',
        'Green Gram (Moong)(Whole)', 'Ground Nut Seed', 'Groundnut (Split)',
        'Sesamum(Sesame,Gingelly,Til)', 'Bajra(Pearl Millet/Cumbu)',
        'Guar Seed(Cluster Beans Seed)', 'Mustard', 'Rajgir', 'Chikoos(Sapota)',
        'Gram Raw(Chholia)', 'Onion Green', 'Methi Seeds', 'Cummin Seed(Jeera)',
        'Methi(Leaves)', 'Elephant Yam (Suran)', 'Little gourd (Kundru)',
        'Mint(Pudina)', 'Kartali (Kantola)', 'Kulthi(Horse Gram)',
        'Suva (Dill Seed)', 'Isabgul (Psyllium)', 'Kabuli Chana(Chickpeas-White)',
        'Beans', 'Groundnut pods (raw)', 'Indian Beans (Seam)', 'Papaya (Raw)',
        'Peas cod', 'Pegeon Pea (Arhar Fali)', 'Sweet Potato', 'Turmeric (raw)',
        'Ajwan', 'Green Fodder', 'Round gourd', 'Ginger(Dry)', 'Mango (Raw-Ripe)',
        'Tender Coconut', 'Water Melon', 'Grapes', 'Yam (Ratalu)', 'Amla(Nelli Kai)',
        'Squash(Chappal Kadoo)', 'Peach', 'Karbuja(Musk Melon)', 'Turnip',
        'Alsandikai', 'Green Avare (W)', 'Knool Khol', 'Seemebadnekai',
        'Chilly Capsicum', 'Arecanut(Betelnut/Supari)', 'Sheep', 'Chapparad Avare',
        'Bunch Beans', 'Thondekai', 'Dry Chillies', 'Arhar Dal(Tur Dal)',
        'Bengal Gram Dal (Chana Dal)', 'Black Gram Dal (Urd Dal)',
        'Green Gram Dal (Moong Dal)', 'Ragi (Finger Millet)', 'Black pepper',
        'Coconut Oil', 'Coconut', 'Tapioca', 'Yam', 'Long Melon(Kakri)', 'Lime',
        'Coconut Seed', 'Green Peas', 'Lentil (Masur)(Whole)', 'White Peas',
        'Cowpea (Lobia/Karamani)', 'Sabu Dan', 'Sweet Pumpkin', 'Betal Leaves',
        'Chow Chow', 'Fish', 'Cashewnuts', 'Jamun(Narale Hannu)', 'Field Pea',
        'Barley (Jau)', 'Litchi', 'Taramira', 'Custard Apple (Sharifa)',
        'Marigold(loose)', 'Rose(Loose)', 'Linseed', 'Gingelly Oil', 'Copra',
        'Sunflower', 'Rubber', 'Hybrid Cumbu', 'T.V. Cumbu',
        'Thinai (Italian Millet)', 'White Pumpkin', 'Tamarind Fruit', 'Wood',
        'Paddy(Dhan)(Basmati)', 'Cock', 'Ghee', 'Mustard Oil', 'Peas(Dry)', 'Tobacco',
        'Sugar', 'Firewood', 'Jute', 'Soanf', 'Seetapal', 'Cardamoms', 'Cloves', 'Cocoa',
        'Nutmeg', 'Pepper ungarbled', 'Duster Beans', 'Coffee', 'Jasmine', 'Kakada',
        'Marigold(Calcutta)', 'Season Leaves', 'Goat', 'Ox', 'Wheat Atta', 'Moath Dal',
        'Duck', 'Foxtail Millet(Navane)', 'Neem Seed', 'Kodo Millet(Varagu)',
        'Surat Beans (Papadi)', 'Chrysanthemum(Loose)', 'Chili Red', 'Same/Savi',
        'Cherry', 'Niger Seed (Ramtil)', 'Egg', 'Dry Fodder', 'Suvarna Gadde',
        'Safflower', 'Dry Grapes', 'Alasande Gram', 'Almond(Badam)',
        'Cinamon(Dalchini)', 'Mataki', 'Broomstick(Flower Broom)', 'Resinwood',
        'Anthorium', 'Carnation', 'Chrysanthemum', 'Gladiolus Cut Flower', 'Jaffri',
        'Jarbara', 'Lilly', 'Lotus', 'Orchid', 'Patti Calcutta', 'Raibel',
        'Rose(Local)', 'Tube Rose(Double)', 'Tube Rose(Single)', 'Bull', 'Calf', 'Cow',
        'He Buffalo', 'She Buffalo')
    state_names = ('Gujarat', 'Haryana', 'Himachal Pradesh', 'Kerala', 'Nagaland', 'Odisha',
        'Punjab', 'Rajasthan', 'Tripura', 'Uttar Pradesh', 'Uttrakhand',
        'Andhra Pradesh', 'Bihar', 'Chandigarh', 'Chattisgarh', 'Jammu and Kashmir',
        'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Meghalaya', 'NCT of Delhi',
        'Pondicherry', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Goa',
        'Andaman and Nicobar')
    district_names = ('Amreli', 'Gurgaon', 'Kangra', 'Alappuzha', 'Kohima', 'Dhenkanal', 'Amritsar',
        'Chittorgarh', 'Rajasamand', 'North Tripura', 'Baghpat', 'Bulandshahar',
        'Hathras', 'Meerut', 'Dehradoon', 'Haridwar', 'Chittor', 'Cuddapah',
        'East Godavari', 'Guntur', 'Kurnool', 'Visakhapatnam', 'Kishanganj',
        'Chandigarh', 'Balodabazar', 'Bijapur', 'Bilaspur', 'Dhamtari', 'Kabirdham',
        'Kanker', 'Koria', 'Mungeli', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Surajpur',
        'Banaskanth', 'Bharuch', 'Botad', 'Dahod', 'Gandhinagar', 'Jamnagar',
        'Junagarh', 'Mehsana', 'Morbi', 'Navsari', 'Patan', 'Porbandar', 'Rajkot',
        'Sabarkantha', 'Surat', 'Surendranagar', 'Vadodara(Baroda)', 'Ambala',
        'Bhiwani', 'Fatehabad', 'Hissar', 'Jind', 'Kaithal', 'Kurukshetra',
        'Mahendragarh-Narnaul', 'Mewat', 'Palwal', 'Panchkula', 'Panipat', 'Rewari',
        'Rohtak', 'Sirsa', 'Sonipat', 'Yamuna Nagar', 'Chamba', 'Hamirpur', 'Kullu',
        'Mandi', 'Shimla', 'Sirmore', 'Solan', 'Anantnag', 'Srinagar', 'Bangalore',
        'Chamrajnagar', 'Chikmagalur', 'Davangere', 'Haveri', 'Kolar', 'Raichur',
        'Shimoga', 'Kannur', 'Kollam', 'Kottayam', 'Kozhikode(Calicut)', 'Malappuram',
        'Palakad', 'Thirssur', 'Ashoknagar', 'Badwani', 'Bhopal', 'Dewas', 'Harda',
        'Indore', 'Jhabua', 'Khargone', 'Panna', 'Rajgarh', 'Ratlam', 'Sagar',
        'Shajapur', 'Sheopur', 'Sidhi', 'Ahmednagar', 'Amarawati', 'Aurangabad',
        'Chandrapur', 'Jalana', 'Mumbai', 'Nashik', 'Parbhani', 'Pune', 'Raigad',
        'Ratnagiri', 'Sangli', 'Thane', 'East Khasi Hills', 'Nongpoh (R-Bhoi)',
        'West Garo Hills', 'West Jaintia Hills', 'Dimapur', 'Kiphire', 'Longleng',
        'Mokokchung', 'Tuensang', 'Wokha', 'Delhi', 'Balasore', 'Bargarh', 'Bhadrak',
        'Bolangir', 'Boudh', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Khurda',
        'Mayurbhanja', 'Nayagarh', 'Nowarangpur', 'Puri', 'Rayagada', 'Sundergarh',
        'Karaikal', 'Bhatinda', 'Fatehgarh', 'Fazilka', 'Ferozpur', 'Gurdaspur',
        'Hoshiarpur', 'Jalandhar', 'Ludhiana', 'Moga', 'Mohali', 'Ropar (Rupnagar)',
        'Sangrur', 'Tarntaran', 'Ajmer', 'Barmer', 'Bikaner', 'Churu', 'Dausa',
        'Ganganagar', 'Hanumangarh', 'Jaipur', 'Jalore', 'Jhunjunu', 'Jodhpur', 'Kota',
        'Sikar', 'Tonk', 'Ariyalur', 'Coimbatore', 'Cuddalore', 'Dindigul', 'Erode',
        'Madurai', 'Nagercoil (Kannyiakumari)', 'Namakkal', 'Salem', 'Thanjavur',
        'Theni', 'Thiruvannamalai', 'Villupuram', 'Adilabad', 'Hyderabad', 'Jagityal',
        'Karimnagar', 'Khammam', 'Mahbubnagar', 'Medak', 'Nalgonda', 'Nizamabad',
        'Ranga Reddy', 'Warangal', 'Gomati', 'Sepahijala', 'South District',
        'West District', 'Agra', 'Aligarh', 'Allahabad', 'Ambedkarnagar', 'Auraiya',
        'Badaun', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly',
        'Basti', 'Bijnor', 'Chandauli', 'Etah', 'Etawah', 'Faizabad', 'Farukhabad',
        'Fatehpur', 'Firozabad', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur',
        'Hardoi', 'Jalaun (Orai)', 'Jaunpur', 'Jhansi', 'Kannuj', 'Kanpur', 'Kaushambi',
        'Khiri (Lakhimpur)', 'Lakhimpur', 'Lalitpur', 'Lucknow', 'Maharajganj',
        'Mahoba', 'Mainpuri', 'Mau(Maunathbhanjan)', 'Mirzapur', 'Muradabad',
        'Muzaffarnagar', 'Pillibhit', 'Pratapgarh', 'Raebarelli', 'Rampur',
        'Saharanpur', 'Shahjahanpur', 'Shravasti', 'Siddharth Nagar', 'Sitapur',
        'Sultanpur', 'Unnao', 'Champawat', 'Nanital', 'UdhamSinghNagar', 'Bankura',
        'Burdwan', 'Coochbehar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah',
        'Malda', 'Medinipur(W)', 'Murshidabad', 'Nadia', 'North 24 Parganas',
        'Sounth 24 Parganas', 'Uttar Dinajpur', 'Korba', 'Surguja', 'South Goa',
        'Anand', 'Bhavnagar', 'Kachchh', 'Faridabad', 'Karnal', 'Tumkur', 'Ernakulam',
        'Idukki', 'Kasargod', 'Pathanamthitta', 'Thiruvananthapuram', 'Wayanad',
        'Bhind', 'Burhanpur', 'Dhar', 'Shivpuri', 'Hingoli', 'Jalgaon', 'Kolhapur',
        'Nagpur', 'Satara', 'Sholapur', 'East Garo Hills', 'South Garo Hills',
        'South West Khasi Hills', 'Angul', 'Keonjhar', 'Sonepur', 'Mansa', 'Baran',
        'Jhalawar', 'Swai Madhopur', 'Dhalai', 'Azamgarh', 'Gautam Budh Nagar',
        'Jyotiba Phule Nagar', 'Sonbhadra', 'Jalpaiguri', 'Puruliya', 'Ahmedabad',
        'Koppal', 'Mandsaur', 'Nicobar', 'Janjgir', 'Mahasamund', 'North Goa',
        'Panchmahals', 'Kathua', 'Gulbarga', 'Mandya', 'Anupur', 'Mandla', 'Neemuch',
        'Rewa', 'Beed', 'Gadchiroli', 'Kalahandi', 'Kendrapara', 'Koraput', 'Barnala',
        'Bhilwara', 'Chitrakut', 'Mathura', 'Kaimur/Bhabhua', 'Sheikhpura', 'Durg',
        'Gariyaband', 'Sukma', 'Kheda', 'Jhajar', 'Una', 'Jammu', 'Bagalkot', 'Belgaum',
        'Bellary', 'Bidar', 'Chitradurga', 'Dharwad', 'Gadag', 'Hassan',
        'Karwar(Uttar Kannad)', 'Mangalore(Dakshin Kannad)', 'Udupi', 'Balaghat',
        'Damoh', 'Hoshangabad', 'Katni', 'Khandwa', 'Morena', 'Raisen', 'Sehore',
        'Seoni', 'Ujjain', 'Vidisha', 'Akola', 'Bhandara', 'Buldhana', 'Dhule', 'Latur',
        'Nanded', 'Nandurbar', 'Osmanabad', 'Vashim', 'Wardha', 'Yavatmal', 'Zunheboto',
        'Pondicherry', 'Faridkot', 'Kapurthala', 'Muktsar', 'Pathankot', 'Patiala',
        'Bundi', 'Nagaur', 'Udaipur', 'Vellore', 'Khowai', 'Deoria',
        'Padrauna(Kusinagar)', 'Sant Kabir Nagar', 'Varanasi', 'Garhwal (Pauri)',
        'Birbhum', 'Medinipur(E)', 'Madhubani')
    
    commodity = st.selectbox('Commodity', com)
    state = st.selectbox('State',state_names)
    district =  st.selectbox('District',district_names)
    market = st.selectbox('Market',district_names)
    min_price = st.slider('Minimum price of the commodity per 1kg',0,500,100)
    max_price = st.slider('Maximum price of the commodity per 1kg',0,1000,700)

    result = st.button('Predict the price')
    if result:
        X = np.array([[commodity,state,district,market,min_price,max_price]])
        X[:,0] = le_com.fit_transform(X[:,0])
        X[:,1] = le_s.fit_transform(X[:,1])
        X[:,2] = le_d.fit_transform(X[:,2])
        X[:,3] = le_m.fit_transform(X[:,3])
        calc = regressor.predict(X)
        st.subheader(f'The estimated price is Rs.{calc[0]:.2f} per Kg')