from app.ml.model_loader import (
    yield_model,
    area_encoder,
    item_encoder
)


print("Model loaded:", yield_model)

print("Area classes:")
print(area_encoder.classes_[:10])

print("Item classes:")
print(item_encoder.classes_[:10])