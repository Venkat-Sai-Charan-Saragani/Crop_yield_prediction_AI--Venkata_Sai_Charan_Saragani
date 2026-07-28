from pydantic import BaseModel


class PredictionRequest(BaseModel):

    Area: str

    Item: str

    Year: int

    rainfall: float

    pesticides: float

    temperature: float