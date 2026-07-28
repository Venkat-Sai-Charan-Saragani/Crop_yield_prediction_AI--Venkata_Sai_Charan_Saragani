import pandas as pd

from backend.app.ml.model_loader import (
    yield_model,
    area_encoder,
    item_encoder
)


def predict_yield(data):

    #Encode  categorical values

    area_encoded = area_encoder.transform(
        [data["Area"]]
    )[0]

    item_encoded = item_encoder.transform(
        [data["Item"]]
    )[0]


    #create dataframe with same order as training

    input_data = pd.DataFrame(
        [[
            area_encoded,
            item_encoded,
            data["Year"],
            data["rainfall"],
            data["pesticides"],
            data["temperature"],
        ]],
        columns=[
            "Area",
            "Item",
            "Year",
            "rainfall",
            "pesticides",
            "temperature"
        ]
    )

    predictions = yield_model.predict(
        input_data
    )

    return predictions[0]