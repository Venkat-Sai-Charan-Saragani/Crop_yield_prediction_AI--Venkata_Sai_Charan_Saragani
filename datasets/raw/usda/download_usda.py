import requests
import pandas as pd
import time

API_KEY = "68071BF8-CF1F-342D-BA5B-E87C320CFD84"

URL = "https://quickstats.nass.usda.gov/api/api_GET/"

crops = [
    "CORN",
    "WHEAT",
    "RICE",
    "SOYBEANS"
]

all_data = []

for crop in crops:

    print(f"\nDownloading {crop}...")

    params = {
        "key": API_KEY,
        "source_desc": "SURVEY",
        "sector_desc": "CROPS",
        "group_desc": "FIELD CROPS",
        "commodity_desc": crop,
        "statisticcat_desc": "YIELD",
        "year__GE": "2010",
        "format": "JSON"
    }

    response = requests.get(URL, params=params)

    print("Status:", response.status_code)

    if response.status_code == 200:

        data = response.json()["data"]

        print(f"{crop}: {len(data)} rows")

        all_data.extend(data)

    else:

        print(response.text)

    time.sleep(1)

df = pd.DataFrame(all_data)

print("\nTotal Rows:", len(df))

df.to_csv("usda_crop_yield.csv", index=False)

print("\nSaved as usda_crop_yield.csv")