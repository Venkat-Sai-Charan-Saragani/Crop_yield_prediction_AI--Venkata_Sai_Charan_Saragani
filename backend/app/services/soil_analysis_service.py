# ============================================================
# SOIL ANALYSIS SERVICE
# backend/app/services/soil_analysis_service.py
# ============================================================

from typing import Optional


# ============================================================
# HELPERS
# ============================================================

def safe_round(
    value: Optional[float],
    digits: int = 2,
):

    if value is None:
        return None

    return round(
        float(value),
        digits,
    )


# ============================================================
# PH ANALYSIS
# ============================================================

def analyze_ph(
    ph: float,
):

    if ph < 4.5:

        return {
            "classification": "Extremely acidic",
            "status": "critical",

            "description": (
                "The soil is extremely acidic. "
                "Strong acidity can restrict root growth, "
                "reduce the availability of some nutrients "
                "such as phosphorus and increase the "
                "availability of elements such as iron, "
                "manganese and aluminium."
            ),

            "recommendation": (
                "Confirm the pH with laboratory testing. "
                "If liming is recommended by the soil-test "
                "report, apply the recommended amount rather "
                "than making an unverified amendment."
            ),
        }


    if ph < 5.5:

        return {
            "classification": "Strongly acidic",
            "status": "high",

            "description": (
                "The soil is strongly acidic. Phosphorus "
                "availability can be restricted, while iron "
                "and manganese can become more available. "
                "Some crops may also experience reduced "
                "nutrient-use efficiency."
            ),

            "recommendation": (
                "Use laboratory soil-test results to determine "
                "whether pH correction is required and select "
                "crop-specific nutrient management."
            ),
        }


    if ph < 6.0:

        return {
            "classification": "Moderately acidic",
            "status": "medium",

            "description": (
                "The soil is moderately acidic. Many crops "
                "can grow in this range, although nutrient "
                "availability varies by crop and soil type."
            ),

            "recommendation": (
                "Maintain regular soil testing and manage "
                "nutrients according to crop requirements."
            ),
        }


    if ph < 6.5:

        return {
            "classification": "Slightly acidic",
            "status": "good",

            "description": (
                "The soil is slightly acidic and is generally "
                "favorable for nutrient availability for "
                "many agricultural crops."
            ),

            "recommendation": (
                "Maintain the current pH through appropriate "
                "soil and nutrient management."
            ),
        }


    if ph <= 7.5:

        return {
            "classification": "Near neutral",
            "status": "excellent",

            "description": (
                "The soil is near neutral. This range is "
                "generally favorable for the availability "
                "of many essential plant nutrients."
            ),

            "recommendation": (
                "Continue regular soil testing and avoid "
                "unnecessary pH-changing amendments."
            ),
        }


    if ph <= 8.0:

        return {
            "classification": "Slightly alkaline",
            "status": "medium",

            "description": (
                "The soil is slightly alkaline. Iron, zinc "
                "and phosphorus availability may decline "
                "depending on soil conditions."
            ),

            "recommendation": (
                "Monitor nutrient availability through "
                "laboratory testing and use crop-specific "
                "management."
            ),
        }


    if ph <= 8.5:

        return {
            "classification": "Moderately alkaline",
            "status": "high",

            "description": (
                "The soil is moderately alkaline. Iron, zinc, "
                "phosphorus and some other micronutrients "
                "can become less available."
            ),

            "recommendation": (
                "Use laboratory testing before making major "
                "soil amendments."
            ),
        }


    return {
        "classification": "Strongly alkaline",
        "status": "critical",

        "description": (
            "The soil is strongly alkaline. Several nutrients, "
            "particularly phosphorus and micronutrients such "
            "as iron and zinc, may have reduced availability."
        ),

        "recommendation": (
            "Obtain laboratory soil-test guidance before "
            "making major soil amendments."
        ),
    }


# ============================================================
# PH-BASED NUTRIENT AVAILABILITY
# ============================================================

def get_ph_nutrient_availability(
    ph: float,
):
    """
    Provides qualitative information about how soil pH
    can influence nutrient availability.

    IMPORTANT:
    This does NOT estimate actual nutrient concentration.
    Actual N, P, K, Fe and Zn values require laboratory
    testing.
    """

    results = []


    # ========================================================
    # NITROGEN
    # ========================================================

    if ph < 5.5:

        results.append({

            "name": "Nitrogen",

            "status": "Potentially reduced",

            "description": (
                "Strongly acidic conditions can reduce "
                "microbial activity involved in nitrogen "
                "cycling and may reduce nitrogen-use "
                "efficiency. The actual nitrogen level "
                "cannot be determined from pH."
            ),
        })

    elif ph <= 7.5:

        results.append({

            "name": "Nitrogen",

            "status": "Generally favorable",

            "description": (
                "This pH range is generally favorable for "
                "the biological processes involved in "
                "nitrogen cycling. Actual nitrogen "
                "concentration still requires laboratory "
                "measurement."
            ),
        })

    else:

        results.append({

            "name": "Nitrogen",

            "status": "May be affected",

            "description": (
                "Alkaline conditions can influence nitrogen "
                "transformations and nitrogen-use efficiency. "
                "Actual nitrogen status requires laboratory "
                "testing."
            ),
        })


    # ========================================================
    # PHOSPHORUS
    # ========================================================

    if ph < 5.5:

        results.append({

            "name": "Phosphorus",

            "status": "Potentially restricted",

            "description": (
                "In strongly acidic soils, phosphorus can "
                "become fixed by iron and aluminium compounds, "
                "reducing the amount available to plants."
            ),
        })

    elif ph <= 7.5:

        results.append({

            "name": "Phosphorus",

            "status": "Generally favorable",

            "description": (
                "Phosphorus availability is generally favorable "
                "through much of this pH range, although actual "
                "availability depends on soil properties and "
                "the measured phosphorus concentration."
            ),
        })

    else:

        results.append({

            "name": "Phosphorus",

            "status": "Potentially restricted",

            "description": (
                "In alkaline soils, phosphorus can react with "
                "calcium compounds and become less available "
                "to plants."
            ),
        })


    # ========================================================
    # POTASSIUM
    # ========================================================

    if ph < 5.5:

        results.append({

            "name": "Potassium",

            "status": "May be affected",

            "description": (
                "Strongly acidic conditions can contribute to "
                "nutrient imbalance and potassium losses in "
                "some soils. Actual potassium concentration "
                "cannot be determined from pH alone."
            ),
        })

    elif ph <= 7.5:

        results.append({

            "name": "Potassium",

            "status": "Generally favorable",

            "description": (
                "Soil pH in this range is generally suitable "
                "for potassium availability. Actual potassium "
                "status requires laboratory measurement."
            ),
        })

    else:

        results.append({

            "name": "Potassium",

            "status": "Generally available",

            "description": (
                "Potassium availability is usually less directly "
                "affected by pH than phosphorus or micronutrients, "
                "but soil type and nutrient balance remain important."
            ),
        })


    # ========================================================
    # IRON
    # ========================================================

    if ph < 6.0:

        results.append({

            "name": "Iron",

            "status": "More available",

            "description": (
                "Iron generally becomes more soluble and more "
                "available as soil pH decreases. Very acidic "
                "conditions can therefore increase the risk of "
                "excess iron availability."
            ),
        })

    elif ph <= 7.5:

        results.append({

            "name": "Iron",

            "status": "Generally available",

            "description": (
                "Iron availability is generally adequate for "
                "many soils in this pH range, although actual "
                "iron status depends on soil conditions."
            ),
        })

    else:

        results.append({

            "name": "Iron",

            "status": "Potentially reduced",

            "description": (
                "Iron becomes less soluble as soil pH increases. "
                "Alkaline soils can therefore increase the risk "
                "of iron deficiency."
            ),
        })


    # ========================================================
    # ZINC
    # ========================================================

    if ph < 5.5:

        results.append({

            "name": "Zinc",

            "status": "Generally more available",

            "description": (
                "Zinc is generally more soluble in acidic soils. "
                "Very acidic conditions can increase availability "
                "and may contribute to excessive availability in "
                "some soils."
            ),
        })

    elif ph <= 7.5:

        results.append({

            "name": "Zinc",

            "status": "Generally favorable",

            "description": (
                "Zinc availability is generally suitable through "
                "this range, but the actual zinc concentration "
                "requires laboratory measurement."
            ),
        })

    else:

        results.append({

            "name": "Zinc",

            "status": "Potentially reduced",

            "description": (
                "Zinc availability generally decreases as soil "
                "pH increases, particularly in alkaline soils."
            ),
        })


    return results


# ============================================================
# NITROGEN
# ============================================================

def analyze_nitrogen(
    value: Optional[float],
):

    if value is None:
        return None


    if value < 40:

        return {

            "name": "Nitrogen (N)",

            "value": safe_round(value),

            "unit": "kg/ha",

            "status": "low",

            "level": "Low",

            "description": (
                "The laboratory-reported nitrogen value is "
                "below the indicative range used by this "
                "application."
            ),

            "recommendation": (
                "Review the crop's nitrogen requirement and "
                "follow the fertilizer recommendation provided "
                "with the soil-test report."
            ),
        }


    if value < 80:

        return {

            "name": "Nitrogen (N)",

            "value": safe_round(value),

            "unit": "kg/ha",

            "status": "medium",

            "level": "Medium",

            "description": (
                "The laboratory-reported nitrogen value is "
                "within the application's indicative moderate "
                "range."
            ),

            "recommendation": (
                "Maintain balanced nitrogen management and "
                "avoid unnecessary application."
            ),
        }


    return {

        "name": "Nitrogen (N)",

        "value": safe_round(value),

        "unit": "kg/ha",

        "status": "good",

        "level": "Adequate",

        "description": (
            "The laboratory-reported nitrogen value is "
            "relatively high compared with the indicative "
            "range used by this application."
        ),

        "recommendation": (
            "Avoid unnecessary nitrogen application and "
            "follow crop-specific recommendations."
        ),
    }


# ============================================================
# PHOSPHORUS
# ============================================================

def analyze_phosphorus(
    value: Optional[float],
):

    if value is None:
        return None


    if value < 20:

        return {

            "name": "Phosphorus (P)",

            "value": safe_round(value),

            "unit": "kg/ha",

            "status": "low",

            "level": "Low",

            "description": (
                "The laboratory-reported phosphorus value "
                "is below the indicative range used by this "
                "application."
            ),

            "recommendation": (
                "Review phosphorus requirements for the selected "
                "crop and use the fertilizer recommendation from "
                "the laboratory report."
            ),
        }


    if value < 40:

        return {

            "name": "Phosphorus (P)",

            "value": safe_round(value),

            "unit": "kg/ha",

            "status": "medium",

            "level": "Medium",

            "description": (
                "The laboratory-reported phosphorus value is "
                "within the application's indicative moderate "
                "range."
            ),

            "recommendation": (
                "Maintain balanced phosphorus management and "
                "avoid unnecessary application."
            ),
        }


    return {

        "name": "Phosphorus (P)",

        "value": safe_round(value),

        "unit": "kg/ha",

        "status": "good",

        "level": "Adequate",

        "description": (
            "The laboratory-reported phosphorus value is "
            "relatively high compared with the indicative "
            "range used by this application."
        ),

        "recommendation": (
            "Avoid excessive phosphorus application and "
            "maintain balanced nutrient management."
        ),
    }


# ============================================================
# POTASSIUM
# ============================================================

def analyze_potassium(
    value: Optional[float],
):

    if value is None:
        return None


    if value < 120:

        return {

            "name": "Potassium (K)",

            "value": safe_round(value),

            "unit": "kg/ha",

            "status": "low",

            "level": "Low",

            "description": (
                "The laboratory-reported potassium value "
                "is below the indicative range used by this "
                "application."
            ),

            "recommendation": (
                "Review potassium requirements using the "
                "laboratory recommendation and crop-specific "
                "nutrient requirements."
            ),
        }


    if value < 280:

        return {

            "name": "Potassium (K)",

            "value": safe_round(value),

            "unit": "kg/ha",

            "status": "medium",

            "level": "Medium",

            "description": (
                "The laboratory-reported potassium value is "
                "within the application's indicative moderate "
                "range."
            ),

            "recommendation": (
                "Continue monitoring potassium and maintain "
                "balanced nutrient management."
            ),
        }


    return {

        "name": "Potassium (K)",

        "value": safe_round(value),

        "unit": "kg/ha",

        "status": "good",

        "level": "Adequate",

        "description": (
            "The laboratory-reported potassium value is "
            "relatively high compared with the indicative "
            "range used by this application."
        ),

        "recommendation": (
            "Avoid unnecessary potassium application and "
            "follow crop-specific recommendations."
        ),
    }


# ============================================================
# ORGANIC CARBON
# ============================================================

def analyze_organic_carbon(
    value: Optional[float],
):

    if value is None:
        return None


    if value < 0.5:

        status = "low"
        level = "Low"

        recommendation = (
            "Consider locally recommended organic-matter "
            "management practices such as appropriate "
            "crop residues or compost."
        )


    elif value < 0.75:

        status = "medium"
        level = "Medium"

        recommendation = (
            "Maintain organic matter through suitable residue "
            "and soil-management practices."
        )


    else:

        status = "good"
        level = "Adequate"

        recommendation = (
            "Maintain current organic-matter management "
            "practices."
        )


    return {

        "name": "Organic Carbon",

        "value": safe_round(value),

        "unit": "%",

        "status": status,

        "level": level,

        "description": (
            "Organic carbon is an important indicator of "
            "soil organic matter and overall soil health."
        ),

        "recommendation":
            recommendation,
    }


# ============================================================
# ELECTRICAL CONDUCTIVITY
# ============================================================

def analyze_ec(
    value: Optional[float],
):

    if value is None:
        return None


    if value < 2:

        status = "good"
        level = "Low salinity concern"

        recommendation = (
            "Electrical conductivity indicates a relatively "
            "low salinity concern. Continue regular monitoring."
        )


    elif value < 4:

        status = "medium"
        level = "Moderate"

        recommendation = (
            "Monitor salinity and consider crop sensitivity "
            "when planning irrigation and nutrient management."
        )


    else:

        status = "high"
        level = "High"

        recommendation = (
            "Elevated electrical conductivity may indicate "
            "salinity concerns. Confirm the laboratory "
            "interpretation and consider appropriate "
            "salinity-management practices."
        )


    return {

        "name": "Electrical Conductivity",

        "value": safe_round(value),

        "unit": "dS/m",

        "status": status,

        "level": level,

        "description": (
            "Electrical conductivity is an indicator of "
            "soluble salts in soil and can be useful for "
            "assessing salinity risk."
        ),

        "recommendation":
            recommendation,
    }


# ============================================================
# MICRONUTRIENT ANALYSIS
# ============================================================

def analyze_micronutrient(
    name: str,
    value: Optional[float],
    unit: str,
    low_limit: float,
    adequate_limit: float,
):

    if value is None:
        return None


    # --------------------------------------------------------
    # LOW
    # --------------------------------------------------------

    if value < low_limit:

        return {

            "name": name,

            "value": safe_round(value),

            "unit": unit,

            "status": "low",

            "level": "Low",

            "description": (
                f"The laboratory-reported {name} value "
                f"({safe_round(value)} {unit}) is below "
                f"the indicative sufficiency range used "
                f"by this application."
            ),

            "recommendation": (
                f"Review the laboratory recommendation for "
                f"{name} and consider crop-specific nutrient "
                f"requirements before applying any amendment."
            ),
        }


    # --------------------------------------------------------
    # MARGINAL
    # --------------------------------------------------------

    if value < adequate_limit:

        return {

            "name": name,

            "value": safe_round(value),

            "unit": unit,

            "status": "medium",

            "level": "Marginal",

            "description": (
                f"The laboratory-reported {name} value "
                f"({safe_round(value)} {unit}) is in an "
                f"indicative marginal range."
            ),

            "recommendation": (
                f"Monitor {name} and follow the laboratory "
                f"recommendation, especially for sensitive crops."
            ),
        }


    # --------------------------------------------------------
    # ADEQUATE
    # --------------------------------------------------------

    return {

        "name": name,

        "value": safe_round(value),

        "unit": unit,

        "status": "good",

        "level": "Adequate",

        "description": (
            f"The laboratory-reported {name} value "
            f"({safe_round(value)} {unit}) is within "
            f"the indicative adequate range."
        ),

        "recommendation": (
            f"Maintain balanced nutrient management and "
            f"avoid unnecessary {name} application."
        ),
    }


# ============================================================
# PH-BASED CROP SUITABILITY
# ============================================================

def get_general_crops_for_ph(
    ph: float,
):

    if 5.5 <= ph <= 7.5:

        return [
            "Rice",
            "Maize",
            "Wheat",
            "Groundnut",
            "Soybean",
            "Gram",
            "Vegetables",
        ]


    if ph < 5.5:

        return [
            "Potato",
            "Tea",
            "Pineapple",
            "Certain acid-tolerant crops",
        ]


    return [
        "Barley",
        "Some pulses",
        "Certain alkaline-tolerant crops",
    ]


# ============================================================
# QUICK PH ANALYSIS
# ============================================================

def perform_ph_analysis(
    ph: float,
):

    ph_result = analyze_ph(ph)

    crops = get_general_crops_for_ph(ph)

    nutrient_availability = (
        get_ph_nutrient_availability(ph)
    )


    return {

        "success": True,

        "analysis_type": "ph",

        "soil_ph":
            safe_round(ph),

        "soil_classification":
            ph_result["classification"],

        "overall_status":
            ph_result["status"],

        "summary": (
            "The soil pH has been interpreted to show the "
            "general effect of acidity or alkalinity on "
            "important plant nutrients. These are qualitative "
            "pH-based implications, not laboratory nutrient "
            "measurements."
        ),

        "ph_analysis":
            ph_result,

        "nutrient_availability":
            nutrient_availability,

        "suitable_crops":
            crops,

        "recommendations": [

            {
                "title":
                    "Maintain appropriate soil pH",

                "priority":
                    ph_result["status"],

                "description":
                    ph_result["recommendation"],
            },


            {
                "title":
                    "Understand nutrient availability",

                "priority":
                    "medium",

                "description": (
                    "Soil pH can strongly influence phosphorus "
                    "and micronutrient availability. However, "
                    "pH does not provide the actual concentration "
                    "of nitrogen, phosphorus, potassium, iron "
                    "or zinc."
                ),
            },


            {
                "title":
                    "Use laboratory testing for actual nutrients",

                "priority":
                    "medium",

                "description": (
                    "For fertilizer decisions, obtain laboratory "
                    "measurements of N, P, K and relevant "
                    "micronutrients instead of estimating their "
                    "concentrations from pH."
                ),
            },


            {
                "title":
                    "Avoid unnecessary amendments",

                "priority":
                    "low",

                "description": (
                    "Do not apply lime, sulphur or other "
                    "pH-changing materials without confirming "
                    "the requirement through soil testing."
                ),
            },

        ],

        "disclaimer": (
            "This is a general pH-based soil assessment. "
            "The nutrient information describes how soil pH "
            "may influence nutrient availability and does not "
            "represent measured nutrient concentrations. "
            "Laboratory soil testing should be used for "
            "fertilizer and amendment decisions."
        ),
    }


# ============================================================
# LABORATORY ANALYSIS
# ============================================================

def perform_laboratory_analysis(
    data,
):

    ph = float(
        data["pH"]
    )


    ph_result = analyze_ph(
        ph
    )


    parameters = []


    # ========================================================
    # PRIMARY NUTRIENTS
    # ========================================================

    nitrogen = analyze_nitrogen(
        data.get("N")
    )


    phosphorus = analyze_phosphorus(
        data.get("P")
    )


    potassium = analyze_potassium(
        data.get("K")
    )


    organic_carbon = analyze_organic_carbon(
        data.get("organic_carbon")
    )


    ec = analyze_ec(
        data.get("electrical_conductivity")
    )


    for item in [
        nitrogen,
        phosphorus,
        potassium,
        organic_carbon,
        ec,
    ]:

        if item is not None:

            parameters.append(
                item
            )


    # ========================================================
    # MICRONUTRIENTS
    # ========================================================

    micronutrients = []


    # Zinc
    zinc = analyze_micronutrient(
        name="Zinc",
        value=data.get("zinc"),
        unit="mg/kg",
        low_limit=0.6,
        adequate_limit=1.2,
    )


    # Iron
    iron = analyze_micronutrient(
        name="Iron",
        value=data.get("iron"),
        unit="mg/kg",
        low_limit=4.5,
        adequate_limit=10.0,
    )


    # Copper
    copper = analyze_micronutrient(
        name="Copper",
        value=data.get("copper"),
        unit="mg/kg",
        low_limit=0.2,
        adequate_limit=0.5,
    )


    # Manganese
    manganese = analyze_micronutrient(
        name="Manganese",
        value=data.get("manganese"),
        unit="mg/kg",
        low_limit=2.0,
        adequate_limit=5.0,
    )


    # Boron
    boron = analyze_micronutrient(
        name="Boron",
        value=data.get("boron"),
        unit="mg/kg",
        low_limit=0.5,
        adequate_limit=1.0,
    )


    # Sulphur
    sulphur = analyze_micronutrient(
        name="Sulphur",
        value=data.get("sulphur"),
        unit="mg/kg",
        low_limit=10.0,
        adequate_limit=20.0,
    )


    for item in [
        zinc,
        iron,
        copper,
        manganese,
        boron,
        sulphur,
    ]:

        if item is not None:

            micronutrients.append(
                item
            )


    # ========================================================
    # ALL RESULTS FOR OVERALL STATUS
    # ========================================================

    all_results = (
        parameters +
        micronutrients
    )


    statuses = [
        item["status"]
        for item in all_results
    ]


    # ========================================================
    # OVERALL STATUS
    # ========================================================

    if "low" in statuses:

        overall_status = (
            "needs_attention"
        )

    elif "high" in statuses:

        overall_status = (
            "attention"
        )

    elif (
        "medium" in statuses or
        ph_result["status"] in [
            "medium",
            "high",
            "critical",
        ]
    ):

        overall_status = "good"

    else:

        overall_status = "good"


    # ========================================================
    # RECOMMENDATIONS
    # ========================================================

    recommendations = []


    # --------------------------------------------------------
    # PH
    # --------------------------------------------------------

    recommendations.append({

        "title":
            "Review soil pH",

        "priority":
            ph_result["status"],

        "description":
            ph_result["recommendation"],
    })


    # --------------------------------------------------------
    # LOW / ATTENTION PARAMETERS
    # --------------------------------------------------------

    for item in all_results:

        if item["status"] in [
            "low",
            "high",
        ]:

            recommendations.append({

                "title":
                    f"Review {item['name']}",

                "priority":
                    item["status"],

                "description":
                    item["recommendation"],
            })


    # --------------------------------------------------------
    # GENERAL NUTRIENT MANAGEMENT
    # --------------------------------------------------------

    recommendations.append({

        "title":
            "Use laboratory values for fertilizer planning",

        "priority":
            "medium",

        "description": (
            "The measured N, P, K and micronutrient values "
            "should be interpreted together with the crop, "
            "soil type, laboratory method and local "
            "agricultural recommendations."
        ),
    })


    # ========================================================
    # SUMMARY
    # ========================================================

    measured_count = len(
        all_results
    )


    summary = (
        f"The laboratory analysis contains "
        f"{measured_count} measured soil parameters. "
        "The results shown below are interpreted using "
        "indicative reference ranges. Actual fertilizer "
        "recommendations should follow the reference ranges "
        "and recommendations supplied by the testing "
        "laboratory."
    )


    # ========================================================
    # RETURN
    # ========================================================

    return {

        "success": True,

        "analysis_type":
            "laboratory",

        "overall_status":
            overall_status,

        "soil_ph":
            safe_round(ph),

        "soil_classification":
            ph_result["classification"],

        "ph_analysis":
            ph_result,

        "soil_texture":
            data.get(
                "soil_texture"
            ),

        "parameters":
            parameters,

        "micronutrients":
            micronutrients,

        "recommendations":
            recommendations,

        "summary":
            summary,

        "disclaimer": (
            "This laboratory analysis is decision-support "
            "information based on the values entered from "
            "the soil-test report. The nutrient reference "
            "ranges used by this application are indicative "
            "and can vary according to extraction method, "
            "soil type, crop, region and laboratory standard. "
            "For final fertilizer and amendment decisions, "
            "follow the interpretation provided by the "
            "qualified soil-testing laboratory or agricultural "
            "professional."
        ),
    }