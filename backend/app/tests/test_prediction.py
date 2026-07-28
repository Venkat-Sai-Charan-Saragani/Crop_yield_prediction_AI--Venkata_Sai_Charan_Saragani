from app.ml.predictor import predict_yield


sample_data = {

    "Area": "India",

    "Item": "Rice, paddy",

    "Year": 2025,

    "rainfall": 1200,

    "pesticides": 500,

    "temperature": 26

}


prediction = predict_yield(sample_data)


print("Predicted Yield:", prediction)