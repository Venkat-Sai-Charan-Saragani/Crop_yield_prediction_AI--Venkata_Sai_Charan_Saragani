"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    BrainCircuit,
    CheckCircle2,
    CloudRain,
    Droplets,
    FlaskConical,
    Leaf,
    Loader2,
    MapPin,
    Sprout,
    Thermometer,
    Wheat,
} from "lucide-react";

import api from "@/services/api";

import {
    getToken,
} from "@/services/authServices";

import {
    useLanguage,
} from "@/context/LanguageContext";


// ============================================================
// TYPES
// ============================================================

interface ImpactFactor {
    feature: string;
    name: string;
    value: string | number;
    unit: string;
    impact: number;
    absolute_impact: number;
    direction: "positive" | "negative";
    importance: "high" | "medium" | "low";
    impact_percentage: number;
}


interface Recommendation {
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    message: string;
}


// ============================================================
// NUMERIC INPUT TYPE
// ============================================================

type NumericInput = number | "";


// ============================================================
// LANGUAGE
// ============================================================

type SupportedLanguage =
    | "en"
    | "te"
    | "hi";


// ============================================================
// LOCAL TRANSLATIONS
//
// These translations are specifically for text returned by
// the prediction recommendation engine.
//
// Backend recommendation values remain English internally.
// Only the UI representation is translated.
// ============================================================

const recommendationTranslations: Record<
    SupportedLanguage,
    {
        high: string;
        medium: string;
        low: string;

        humidityTitle: string;
        humidityMessage: (value: string) => string;

        soilPhTitle: string;
        soilPhMessage: (
            value: string,
            crop: string
        ) => string;

        temperatureTitle: string;
        temperatureMessage: (value: string) => string;

        nitrogenTitle: string;
        nitrogenMessage: (value: string) => string;

        phosphorusTitle: string;
        phosphorusMessage: (value: string) => string;

        potassiumTitle: string;
        potassiumMessage: (value: string) => string;

        rainfallTitle: string;
        rainfallMessage: (value: string) => string;

        fertilizerTitle: string;
        fertilizerMessage: (value: string) => string;

        pesticideTitle: string;
        pesticideMessage: (value: string) => string;
    }
> = {

    // ========================================================
    // ENGLISH
    // ========================================================

    en: {

        high: "High",

        medium: "Medium",

        low: "Low",


        humidityTitle:
            "Monitor humidity and moisture",

        humidityMessage:
            (value) =>
                `The entered average humidity is ${value}%. High humidity can increase moisture-related crop risks. Monitor field moisture, drainage and crop conditions regularly.`,


        soilPhTitle:
            "Monitor soil pH",

        soilPhMessage:
            (value, crop) =>
                `The entered soil pH is ${value} and soil pH has a strong influence on this model prediction. Continue regular soil testing and maintain conditions appropriate for ${crop}.`,


        temperatureTitle:
            "Monitor temperature",

        temperatureMessage:
            (value) =>
                `The entered average temperature is ${value}°C. Temperature has a strong influence on this prediction. Continue monitoring temperature changes during important crop growth stages.`,


        nitrogenTitle:
            "Maintain balanced nitrogen management",

        nitrogenMessage:
            (value) =>
                `The entered nitrogen level is ${value} kg/ha. Continue monitoring nitrogen availability through soil testing and avoid applying more fertilizer than the crop requires.`,


        phosphorusTitle:
            "Maintain balanced phosphorus management",

        phosphorusMessage:
            (value) =>
                `The entered phosphorus level is ${value} kg/ha. Maintain balanced nutrient management using soil-test results and crop-specific guidance.`,


        potassiumTitle:
            "Maintain balanced potassium management",

        potassiumMessage:
            (value) =>
                `The entered potassium level is ${value} kg/ha. Continue monitoring soil nutrient availability and maintain balanced nutrient management.`,


        rainfallTitle:
            "Monitor water availability",

        rainfallMessage:
            (value) =>
                `The entered rainfall is ${value} mm. Continue monitoring soil moisture and rainfall variation throughout the growing season.`,


        fertilizerTitle:
            "Maintain balanced fertilizer management",

        fertilizerMessage:
            (value) =>
                `The entered fertilizer usage is ${value} kg/ha. Use soil-test information and crop-specific recommendations to maintain balanced nutrient application and avoid unnecessary fertilizer use.`,


        pesticideTitle:
            "Use pesticides carefully",

        pesticideMessage:
            (value) =>
                `The entered pesticide usage is ${value} kg/ha. Follow the crop- and product-specific label, recommended dosage and applicable agricultural guidance. Avoid unnecessary applications.`,

    },


    // ========================================================
    // TELUGU
    // ========================================================

    te: {

        high:
            "అధిక",

        medium:
            "మధ్యస్థ",

        low:
            "తక్కువ",


        humidityTitle:
            "తేమ మరియు మట్టిలో తేమను పర్యవేక్షించండి",

        humidityMessage:
            (value) =>
                `నమోదు చేసిన సగటు తేమ ${value}%. అధిక తేమ వల్ల పంటకు సంబంధించిన తేమ సమస్యలు పెరిగే అవకాశం ఉంది. పొలంలోని తేమ, నీటి పారుదల మరియు పంట పరిస్థితులను క్రమం తప్పకుండా పర్యవేక్షించండి.`,


        soilPhTitle:
            "మట్టి pH ను పర్యవేక్షించండి",

        soilPhMessage:
            (value, crop) =>
                `నమోదు చేసిన మట్టి pH ${value}. మట్టి pH ఈ మోడల్ అంచనాపై గణనీయమైన ప్రభావాన్ని చూపుతుంది. క్రమం తప్పకుండా మట్టి పరీక్షలు నిర్వహించి ${crop} పంటకు అనుకూలమైన పరిస్థితులను కొనసాగించండి.`,


        temperatureTitle:
            "ఉష్ణోగ్రతను పర్యవేక్షించండి",

        temperatureMessage:
            (value) =>
                `నమోదు చేసిన సగటు ఉష్ణోగ్రత ${value}°C. ఈ అంచనాపై ఉష్ణోగ్రత గణనీయమైన ప్రభావాన్ని చూపుతుంది. పంట ముఖ్యమైన పెరుగుదల దశల్లో ఉష్ణోగ్రత మార్పులను పర్యవేక్షించండి.`,


        nitrogenTitle:
            "సమతుల్య నైట్రోజన్ నిర్వహణను కొనసాగించండి",

        nitrogenMessage:
            (value) =>
                `నమోదు చేసిన నైట్రోజన్ స్థాయి ${value} kg/ha. మట్టి పరీక్షల ద్వారా నైట్రోజన్ లభ్యతను పర్యవేక్షించండి మరియు పంటకు అవసరమైన దానికంటే ఎక్కువ ఎరువులను ఉపయోగించకుండా ఉండండి.`,


        phosphorusTitle:
            "సమతుల్య ఫాస్ఫరస్ నిర్వహణను కొనసాగించండి",

        phosphorusMessage:
            (value) =>
                `నమోదు చేసిన ఫాస్ఫరస్ స్థాయి ${value} kg/ha. మట్టి పరీక్ష ఫలితాలు మరియు పంటకు అనుకూలమైన మార్గదర్శకాలను ఉపయోగించి సమతుల్య పోషక నిర్వహణను కొనసాగించండి.`,


        potassiumTitle:
            "సమతుల్య పొటాషియం నిర్వహణను కొనసాగించండి",

        potassiumMessage:
            (value) =>
                `నమోదు చేసిన పొటాషియం స్థాయి ${value} kg/ha. మట్టిలో పోషకాల లభ్యతను పర్యవేక్షిస్తూ సమతుల్య పోషక నిర్వహణను కొనసాగించండి.`,


        rainfallTitle:
            "నీటి లభ్యతను పర్యవేక్షించండి",

        rainfallMessage:
            (value) =>
                `నమోదు చేసిన వర్షపాతం ${value} mm. పంట పెరుగుదల కాలంలో మట్టి తేమ మరియు వర్షపాతం మార్పులను నిరంతరం పర్యవేక్షించండి.`,


        fertilizerTitle:
            "సమతుల్య ఎరువుల నిర్వహణను కొనసాగించండి",

        fertilizerMessage:
            (value) =>
                `నమోదు చేసిన ఎరువుల వినియోగం ${value} kg/ha. సమతుల్య పోషక వినియోగాన్ని కొనసాగించడానికి మట్టి పరీక్ష సమాచారం మరియు పంటకు అనుకూలమైన సిఫార్సులను ఉపయోగించండి. అవసరం లేని ఎరువుల వినియోగాన్ని నివారించండి.`,


        pesticideTitle:
            "పురుగుమందులను జాగ్రత్తగా ఉపయోగించండి",

        pesticideMessage:
            (value) =>
                `నమోదు చేసిన పురుగుమందుల వినియోగం ${value} kg/ha. పంట మరియు ఉత్పత్తికి సంబంధించిన లేబుల్, సిఫార్సు చేసిన మోతాదు మరియు వ్యవసాయ మార్గదర్శకాలను పాటించండి. అవసరం లేని పురుగుమందుల వినియోగాన్ని నివారించండి.`,

    },


    // ========================================================
    // HINDI
    // ========================================================

    hi: {

        high:
            "उच्च",

        medium:
            "मध्यम",

        low:
            "कम",


        humidityTitle:
            "नमी और मिट्टी की नमी की निगरानी करें",

        humidityMessage:
            (value) =>
                `दर्ज की गई औसत आर्द्रता ${value}% है। अधिक आर्द्रता से फसल से संबंधित नमी के जोखिम बढ़ सकते हैं। खेत की नमी, जल निकासी और फसल की स्थिति की नियमित निगरानी करें।`,


        soilPhTitle:
            "मिट्टी के pH की निगरानी करें",

        soilPhMessage:
            (value, crop) =>
                `दर्ज किया गया मिट्टी का pH ${value} है और मिट्टी का pH इस मॉडल की भविष्यवाणी पर महत्वपूर्ण प्रभाव डालता है। नियमित रूप से मिट्टी की जांच करें और ${crop} के लिए उपयुक्त परिस्थितियों को बनाए रखें।`,


        temperatureTitle:
            "तापमान की निगरानी करें",

        temperatureMessage:
            (value) =>
                `दर्ज किया गया औसत तापमान ${value}°C है। तापमान इस भविष्यवाणी को महत्वपूर्ण रूप से प्रभावित करता है। फसल की महत्वपूर्ण वृद्धि अवस्थाओं के दौरान तापमान में होने वाले बदलावों की निगरानी करते रहें।`,


        nitrogenTitle:
            "संतुलित नाइट्रोजन प्रबंधन बनाए रखें",

        nitrogenMessage:
            (value) =>
                `दर्ज किया गया नाइट्रोजन स्तर ${value} kg/ha है। मिट्टी की जांच के माध्यम से नाइट्रोजन की उपलब्धता की निगरानी करें और फसल की आवश्यकता से अधिक उर्वरक का प्रयोग न करें।`,


        phosphorusTitle:
            "संतुलित फास्फोरस प्रबंधन बनाए रखें",

        phosphorusMessage:
            (value) =>
                `दर्ज किया गया फास्फोरस स्तर ${value} kg/ha है। मिट्टी की जांच के परिणामों और फसल-विशिष्ट मार्गदर्शन का उपयोग करके संतुलित पोषक तत्व प्रबंधन बनाए रखें।`,


        potassiumTitle:
            "संतुलित पोटैशियम प्रबंधन बनाए रखें",

        potassiumMessage:
            (value) =>
                `दर्ज किया गया पोटैशियम स्तर ${value} kg/ha है। मिट्टी में पोषक तत्वों की उपलब्धता की निगरानी करते रहें और संतुलित पोषक तत्व प्रबंधन बनाए रखें।`,


        rainfallTitle:
            "जल की उपलब्धता की निगरानी करें",

        rainfallMessage:
            (value) =>
                `दर्ज की गई वर्षा ${value} mm है। पूरे फसल मौसम के दौरान मिट्टी की नमी और वर्षा में होने वाले बदलावों की निगरानी करते रहें।`,


        fertilizerTitle:
            "संतुलित उर्वरक प्रबंधन बनाए रखें",

        fertilizerMessage:
            (value) =>
                `दर्ज किया गया उर्वरक उपयोग ${value} kg/ha है। संतुलित पोषक तत्व उपयोग बनाए रखने के लिए मिट्टी की जांच और फसल-विशिष्ट सिफारिशों का उपयोग करें तथा अनावश्यक उर्वरक उपयोग से बचें।`,


        pesticideTitle:
            "कीटनाशकों का सावधानीपूर्वक उपयोग करें",

        pesticideMessage:
            (value) =>
                `दर्ज किया गया कीटनाशक उपयोग ${value} kg/ha है। फसल और उत्पाद के अनुसार लेबल, अनुशंसित मात्रा और लागू कृषि दिशानिर्देशों का पालन करें। अनावश्यक उपयोग से बचें।`,

    },

};


// ============================================================
// COMPONENT
// ============================================================

export default function PredictionForm() {

    const router =
        useRouter();


    // ========================================================
    // LANGUAGE
    // ========================================================

    const {
        language,
        t,
    } = useLanguage();


    const currentLanguage:
        SupportedLanguage =
        language === "te"
            ? "te"
            : language === "hi"
                ? "hi"
                : "en";


    const recommendationText =
        recommendationTranslations[
            currentLanguage
        ];


    // ========================================================
    // SAFE TRANSLATION HELPER
    //
    // Your existing t object is a flat dictionary.
    //
    // If a particular key does not exist, English fallback
    // text is returned instead of breaking the page.
    // ========================================================

    const translate =
        (
            key: string,
            fallback: string
        ): string => {

            const value =
                (t as Record<string, unknown>)?.[
                    key
                ];


            if (
                typeof value ===
                "string" &&
                value.trim()
            ) {

                return value;

            }


            return fallback;

        };


    // ========================================================
    // STATIC TEXT
    // ========================================================

    const text = useMemo(
        () => ({

            aiIntelligence:
                translate(
                    "aiIntelligence",
                    "AI Intelligence"
                ),

            cropAnalysis:
                currentLanguage === "te"
                    ? "పంట విశ్లేషణ"
                    : currentLanguage === "hi"
                        ? "फसल विश्लेषण"
                        : "Crop Analysis",

            cropYieldPrediction:
                currentLanguage === "te"
                    ? "పంట దిగుబడి అంచనా"
                    : currentLanguage === "hi"
                        ? "फसल उपज पूर्वानुमान"
                        : "Crop Yield Prediction",

            predictionDescription:
                translate(
                    "predictionDescription",
                    "Enter crop, soil and environmental conditions to estimate expected yield."
                ),

            cropLocation:
                currentLanguage === "te"
                    ? "పంట మరియు ప్రాంతం"
                    : currentLanguage === "hi"
                        ? "फसल और स्थान"
                        : "Crop & Location",

            cropLocationDescription:
                currentLanguage === "te"
                    ? "పంట మరియు భౌగోళిక పరిస్థితులను ఎంచుకోండి."
                    : currentLanguage === "hi"
                        ? "फसल और भौगोलिक परिस्थितियों का चयन करें।"
                        : "Select the crop and geographical conditions.",

            crop:
                translate(
                    "crop",
                    "Crop"
                ),

            season:
                currentLanguage === "te"
                    ? "కాలం"
                    : currentLanguage === "hi"
                        ? "मौसम"
                        : "Season",

            state:
                currentLanguage === "te"
                    ? "రాష్ట్రం"
                    : currentLanguage === "hi"
                        ? "राज्य"
                        : "State",

            farmCropInputs:
                currentLanguage === "te"
                    ? "వ్యవసాయ భూమి మరియు పంట ఇన్‌పుట్‌లు"
                    : currentLanguage === "hi"
                        ? "खेत और फसल इनपुट"
                        : "Farm & Crop Inputs",

            farmCropInputsDescription:
                currentLanguage === "te"
                    ? "వ్యవసాయ మరియు పోషక పరిస్థితులను నమోదు చేయండి."
                    : currentLanguage === "hi"
                        ? "कृषि और पोषक तत्वों की परिस्थितियां दर्ज करें।"
                        : "Enter agricultural and nutrient conditions.",

            year:
                translate(
                    "year",
                    "Year"
                ),

            farmArea:
                currentLanguage === "te"
                    ? "వ్యవసాయ భూమి విస్తీర్ణం"
                    : currentLanguage === "hi"
                        ? "खेत का क्षेत्रफल"
                        : "Farm Area",

            fertilizer:
                currentLanguage === "te"
                    ? "ఎరువు"
                    : currentLanguage === "hi"
                        ? "उर्वरक"
                        : "Fertilizer",

            pesticide:
                currentLanguage === "te"
                    ? "పురుగుమందు"
                    : currentLanguage === "hi"
                        ? "कीटनाशक"
                        : "Pesticide",

            nitrogen:
                currentLanguage === "te"
                    ? "నైట్రోజన్ (N)"
                    : currentLanguage === "hi"
                        ? "नाइट्रोजन (N)"
                        : "Nitrogen (N)",

            phosphorus:
                currentLanguage === "te"
                    ? "ఫాస్ఫరస్ (P)"
                    : currentLanguage === "hi"
                        ? "फास्फोरस (P)"
                        : "Phosphorus (P)",

            potassium:
                currentLanguage === "te"
                    ? "పొటాషియం (K)"
                    : currentLanguage === "hi"
                        ? "पोटैशियम (K)"
                        : "Potassium (K)",

            soilPh:
                currentLanguage === "te"
                    ? "మట్టి pH"
                    : currentLanguage === "hi"
                        ? "मिट्टी का pH"
                        : "Soil pH",

            environmentalConditions:
                currentLanguage === "te"
                    ? "పర్యావరణ పరిస్థితులు"
                    : currentLanguage === "hi"
                        ? "पर्यावरणीय परिस्थितियां"
                        : "Environmental Conditions",

            environmentalDescription:
                currentLanguage === "te"
                    ? "ఉష్ణోగ్రత, వర్షపాతం మరియు తేమను నమోదు చేయండి."
                    : currentLanguage === "hi"
                        ? "तापमान, वर्षा और आर्द्रता दर्ज करें।"
                        : "Enter temperature, rainfall and humidity.",

            averageTemperature:
                currentLanguage === "te"
                    ? "సగటు ఉష్ణోగ్రత"
                    : currentLanguage === "hi"
                        ? "औसत तापमान"
                        : "Average Temperature",

            totalRainfall:
                currentLanguage === "te"
                    ? "మొత్తం వర్షపాతం"
                    : currentLanguage === "hi"
                        ? "कुल वर्षा"
                        : "Total Rainfall",

            averageHumidity:
                currentLanguage === "te"
                    ? "సగటు తేమ"
                    : currentLanguage === "hi"
                        ? "औसत आर्द्रता"
                        : "Average Humidity",

            readyToPredict:
                currentLanguage === "te"
                    ? "అంచనా వేయడానికి సిద్ధంగా ఉన్నారా?"
                    : currentLanguage === "hi"
                        ? "पूर्वानुमान के लिए तैयार हैं?"
                        : "Ready to predict?",

            readyDescription:
                currentLanguage === "te"
                    ? "AI మోడల్ మీరు అందించిన పంట, మట్టి మరియు వాతావరణ పరిస్థితులను విశ్లేషిస్తుంది."
                    : currentLanguage === "hi"
                        ? "AI मॉडल आपके द्वारा दी गई फसल, मिट्टी और मौसम की सभी परिस्थितियों का विश्लेषण करेगा।"
                        : "The AI model will analyze all provided crop, soil and weather conditions.",

            analyzing:
                translate(
                    "predicting",
                    currentLanguage === "te"
                        ? "విశ్లేషిస్తోంది..."
                        : currentLanguage === "hi"
                            ? "विश्लेषण हो रहा है..."
                            : "Analyzing..."
                ),

            generatePrediction:
                currentLanguage === "te"
                    ? "అంచనాను రూపొందించండి"
                    : currentLanguage === "hi"
                        ? "पूर्वानुमान तैयार करें"
                        : "Generate Prediction",

            predictionComplete:
                currentLanguage === "te"
                    ? "అంచనా పూర్తయింది"
                    : currentLanguage === "hi"
                        ? "पूर्वानुमान पूरा हुआ"
                        : "Prediction Complete",

            estimatedCropYield:
                currentLanguage === "te"
                    ? "అంచనా పంట దిగుబడి"
                    : currentLanguage === "hi"
                        ? "अनुमानित फसल उपज"
                        : "Estimated crop yield",

            estimatedYield:
                translate(
                    "estimatedYield",
                    currentLanguage === "te"
                        ? "అంచనా దిగుబడి"
                        : currentLanguage === "hi"
                            ? "अनुमानित उपज"
                            : "Estimated Yield"
                ),

            tonnesPerHectare:
                currentLanguage === "te"
                    ? "టన్నులు / హెక్టారు"
                    : currentLanguage === "hi"
                        ? "टन / हेक्टेयर"
                        : "tonnes / hectare",

            kgPerHectare:
                currentLanguage === "te"
                    ? "కిలోలు / హెక్టారు"
                    : currentLanguage === "hi"
                        ? "किग्रा / हेक्टेयर"
                        : "kg / hectare",

            factorsInfluencing:
                currentLanguage === "te"
                    ? "మీ అంచనాను ప్రభావితం చేసే అంశాలు"
                    : currentLanguage === "hi"
                        ? "आपके पूर्वानुमान को प्रभावित करने वाले कारक"
                        : "Factors Influencing Your Prediction",

            factorsDescription:
                currentLanguage === "te"
                    ? "ఈ ఫలితంపై మోడల్‌కు అత్యంత ప్రభావం చూపిన ఇన్‌పుట్ అంశాలు."
                    : currentLanguage === "hi"
                        ? "इस परिणाम के लिए मॉडल द्वारा सबसे प्रभावशाली इनपुट कारक।"
                        : "The model's most influential input factors for this result.",

            aiExplainability:
                currentLanguage === "te"
                    ? "AI వివరణ"
                    : currentLanguage === "hi"
                        ? "AI व्याख्या"
                        : "AI Explainability",

            modelAnalysis:
                currentLanguage === "te"
                    ? "మోడల్ విశ్లేషణ"
                    : currentLanguage === "hi"
                        ? "मॉडल विश्लेषण"
                        : "Model Analysis",

            positive:
                currentLanguage === "te"
                    ? "అనుకూల"
                    : currentLanguage === "hi"
                        ? "सकारात्मक"
                        : "Positive",

            negative:
                currentLanguage === "te"
                    ? "ప్రతికూల"
                    : currentLanguage === "hi"
                        ? "नकारात्मक"
                        : "Negative",

            input:
                currentLanguage === "te"
                    ? "ఇన్‌పుట్"
                    : currentLanguage === "hi"
                        ? "इनपुट"
                        : "Input",

            relativeImpact:
                currentLanguage === "te"
                    ? "సాపేక్ష ప్రభావం"
                    : currentLanguage === "hi"
                        ? "सापेक्ष प्रभाव"
                        : "relative impact",

            note:
                currentLanguage === "te"
                    ? "గమనిక:"
                    : currentLanguage === "hi"
                        ? "नोट:"
                        : "Note:",

            impactDescription:
                currentLanguage === "te"
                    ? "ప్రభావం అనేది మోడల్ ఇన్‌పుట్‌లు ఈ అంచనాకు ఎలా సహకరించాయో సూచిస్తుంది. ఒక అంశాన్ని మాత్రమే మార్చడం వల్ల వాస్తవ వ్యవసాయ దిగుబడి తప్పనిసరిగా పెరుగుతుందని లేదా తగ్గుతుందని దీని అర్థం కాదు."
                    : currentLanguage === "hi"
                        ? "प्रभाव यह दर्शाता है कि मॉडल के इनपुट ने इस पूर्वानुमान में कैसे योगदान दिया। इसका अर्थ यह नहीं है कि केवल एक कारक बदलने से वास्तविक खेत की उपज आवश्यक रूप से बढ़ेगी या घटेगी।"
                        : "Impact indicates how the model's inputs contributed to this prediction. It does not mean that changing one factor alone will necessarily increase or decrease actual farm yield.",

            personalizedRecommendations:
                currentLanguage === "te"
                    ? "వ్యక్తిగత సిఫార్సులు"
                    : currentLanguage === "hi"
                        ? "व्यक्तिगत सिफारिशें"
                        : "Personalized Recommendations",

            recommendationsDescription:
                currentLanguage === "te"
                    ? "ఈ అంచనా కోసం మీరు నమోదు చేసిన పరిస్థితుల ఆధారంగా మార్గదర్శకం."
                    : currentLanguage === "hi"
                        ? "इस पूर्वानुमान के लिए आपके द्वारा दर्ज की गई परिस्थितियों के आधार पर मार्गदर्शन।"
                        : "Guidance based on the conditions you entered for this prediction.",

            recommendationsNote:
                currentLanguage === "te"
                    ? "ఈ సిఫార్సులు మీరు నమోదు చేసిన డేటా ఆధారంగా నిర్ణయ సహాయక మార్గదర్శకంగా అందించబడుతున్నాయి. పంటకు సంబంధించిన చికిత్స లేదా ఎరువుల నిర్ణయాల కోసం మట్టి పరీక్షలు మరియు అర్హత కలిగిన వ్యవసాయ నిపుణుడి సలహాను పరిగణించండి."
                    : currentLanguage === "hi"
                        ? "ये सिफारिशें आपके द्वारा दर्ज किए गए डेटा के आधार पर निर्णय-सहायक मार्गदर्शन के रूप में दी गई हैं। फसल-विशिष्ट उपचार या उर्वरक संबंधी निर्णयों के लिए मिट्टी की जांच और योग्य कृषि विशेषज्ञ से परामर्श पर विचार करें।"
                        : "These recommendations are intended as decision-support guidance based on your entered data. For crop-specific treatment or fertilizer decisions, consider soil testing and consultation with a qualified agricultural professional.",

            predictionFooter:
                currentLanguage === "te"
                    ? "అంచనా మరియు ప్రభావ విశ్లేషణ శిక్షణ పొందిన YieldSenseAI మోడల్ నుండి రూపొందించబడ్డాయి."
                    : currentLanguage === "hi"
                        ? "पूर्वानुमान और प्रभाव विश्लेषण प्रशिक्षित YieldSenseAI मॉडल से तैयार किए गए हैं।"
                        : "Prediction and impact analysis are generated from the trained YieldSenseAI model.",

            predictionGenerated:
                currentLanguage === "te"
                    ? "అంచనా విజయవంతంగా రూపొందించబడింది!"
                    : currentLanguage === "hi"
                        ? "पूर्वानुमान सफलतापूर्वक तैयार किया गया!"
                        : "Prediction generated successfully!",

            pleaseLogin:
                currentLanguage === "te"
                    ? "దయచేసి ముందుగా లాగిన్ చేయండి."
                    : currentLanguage === "hi"
                        ? "कृपया पहले लॉगिन करें।"
                        : "Please login first.",

            selectCrop:
                currentLanguage === "te"
                    ? "దయచేసి పంటను ఎంచుకోండి."
                    : currentLanguage === "hi"
                        ? "कृपया फसल चुनें।"
                        : "Please select a crop.",

            selectSeason:
                currentLanguage === "te"
                    ? "దయచేసి కాలాన్ని ఎంచుకోండి."
                    : currentLanguage === "hi"
                        ? "कृपया मौसम चुनें।"
                        : "Please select a season.",

            selectState:
                currentLanguage === "te"
                    ? "దయచేసి రాష్ట్రాన్ని ఎంచుకోండి."
                    : currentLanguage === "hi"
                        ? "कृपया राज्य चुनें।"
                        : "Please select a state.",

            fillNumeric:
                currentLanguage === "te"
                    ? "దయచేసి అన్ని సంఖ్యా ఫీల్డ్‌లను పూరించండి."
                    : currentLanguage === "hi"
                        ? "कृपया सभी संख्यात्मक फ़ील्ड भरें।"
                        : "Please fill in all numeric fields.",

            areaPositive:
                currentLanguage === "te"
                    ? "విస్తీర్ణం సున్నా కంటే ఎక్కువగా ఉండాలి."
                    : currentLanguage === "hi"
                        ? "क्षेत्रफल शून्य से अधिक होना चाहिए।"
                        : "Area must be greater than zero.",

            fertilizerNegative:
                currentLanguage === "te"
                    ? "ఎరువు ప్రతికూలంగా ఉండకూడదు."
                    : currentLanguage === "hi"
                        ? "उर्वरक ऋणात्मक नहीं हो सकता।"
                        : "Fertilizer cannot be negative.",

            pesticideNegative:
                currentLanguage === "te"
                    ? "పురుగుమందు ప్రతికూలంగా ఉండకూడదు."
                    : currentLanguage === "hi"
                        ? "कीटनाशक ऋणात्मक नहीं हो सकता।"
                        : "Pesticide cannot be negative.",

            nitrogenNegative:
                currentLanguage === "te"
                    ? "నైట్రోజన్ ప్రతికూలంగా ఉండకూడదు."
                    : currentLanguage === "hi"
                        ? "नाइट्रोजन ऋणात्मक नहीं हो सकता।"
                        : "Nitrogen cannot be negative.",

            phosphorusNegative:
                currentLanguage === "te"
                    ? "ఫాస్ఫరస్ ప్రతికూలంగా ఉండకూడదు."
                    : currentLanguage === "hi"
                        ? "फास्फोरस ऋणात्मक नहीं हो सकता।"
                        : "Phosphorus cannot be negative.",

            potassiumNegative:
                currentLanguage === "te"
                    ? "పొటాషియం ప్రతికూలంగా ఉండకూడదు."
                    : currentLanguage === "hi"
                        ? "पोटैशियम ऋणात्मक नहीं हो सकता।"
                        : "Potassium cannot be negative.",

            validPh:
                currentLanguage === "te"
                    ? "దయచేసి 0 మరియు 14 మధ్య సరైన మట్టి pH ను నమోదు చేయండి."
                    : currentLanguage === "hi"
                        ? "कृपया 0 और 14 के बीच एक मान्य मिट्टी pH दर्ज करें।"
                        : "Please enter a valid soil pH between 0 and 14.",

            rainfallNegative:
                currentLanguage === "te"
                    ? "వర్షపాతం ప్రతికూలంగా ఉండకూడదు."
                    : currentLanguage === "hi"
                        ? "वर्षा ऋणात्मक नहीं हो सकती।"
                        : "Rainfall cannot be negative.",

            humidityRange:
                currentLanguage === "te"
                    ? "తేమ 0 మరియు 100% మధ్య ఉండాలి."
                    : currentLanguage === "hi"
                        ? "आर्द्रता 0 और 100% के बीच होनी चाहिए।"
                        : "Humidity must be between 0 and 100%.",

            sessionExpired:
                currentLanguage === "te"
                    ? "మీ సెషన్ గడువు ముగిసింది. దయచేసి మళ్లీ లాగిన్ చేయండి."
                    : currentLanguage === "hi"
                        ? "आपका सत्र समाप्त हो गया है। कृपया फिर से लॉगिन करें।"
                        : "Your session has expired. Please login again.",

            predictionFailed:
                currentLanguage === "te"
                    ? "అంచనా విఫలమైంది"
                    : currentLanguage === "hi"
                        ? "पूर्वानुमान विफल हुआ"
                        : "Prediction failed",

        }),
        [
            currentLanguage,
            t,
        ]
    );


    // ========================================================
    // OPTIONS
    // ========================================================

    const [
        crops,
        setCrops,
    ] = useState<string[]>([]);

    const [
        seasons,
        setSeasons,
    ] = useState<string[]>([]);

    const [
        states,
        setStates,
    ] = useState<string[]>([]);


    // ========================================================
    // FORM STATE
    // ========================================================

    const [
        crop,
        setCrop,
    ] = useState("");

    const [
        season,
        setSeason,
    ] = useState("");

    const [
        state,
        setState,
    ] = useState("");


    const [
        year,
        setYear,
    ] = useState<NumericInput>(2025);

    const [
        area,
        setArea,
    ] = useState<NumericInput>(1);

    const [
        fertilizer,
        setFertilizer,
    ] = useState<NumericInput>(100);

    const [
        pesticide,
        setPesticide,
    ] = useState<NumericInput>(50);

    const [
        nitrogen,
        setNitrogen,
    ] = useState<NumericInput>(50);

    const [
        phosphorus,
        setPhosphorus,
    ] = useState<NumericInput>(30);

    const [
        potassium,
        setPotassium,
    ] = useState<NumericInput>(40);

    const [
        soilPh,
        setSoilPh,
    ] = useState<NumericInput>(6.5);

    const [
        temperature,
        setTemperature,
    ] = useState<NumericInput>(27);

    const [
        rainfall,
        setRainfall,
    ] = useState<NumericInput>(2500);

    const [
        humidity,
        setHumidity,
    ] = useState<NumericInput>(80);


    // ========================================================
    // PREDICTION STATE
    // ========================================================

    const [
        prediction,
        setPrediction,
    ] = useState<number | null>(null);

    const [
        predictionTonnes,
        setPredictionTonnes,
    ] = useState<number | null>(null);

    const [
        predictionKg,
        setPredictionKg,
    ] = useState<number | null>(null);


    // ========================================================
    // EXPLANATION STATE
    // ========================================================

    const [
        impactFactors,
        setImpactFactors,
    ] = useState<ImpactFactor[]>([]);

    const [
        recommendations,
        setRecommendations,
    ] = useState<Recommendation[]>([]);

    const [
        explanationMethod,
        setExplanationMethod,
    ] = useState("");


    // ========================================================
    // LOADING
    // ========================================================

    const [
        loading,
        setLoading,
    ] = useState(false);


    // ========================================================
    // LOAD MODEL OPTIONS
    // ========================================================

    useEffect(() => {

        const fetchPredictionOptions =
            async () => {

                try {

                    const response =
                        await api.get(
                            "/prediction/options"
                        );

                    const data =
                        response.data;


                    const availableCrops =
                        Array.isArray(
                            data.crops
                        )
                            ? data.crops
                            : [];


                    const availableSeasons =
                        Array.isArray(
                            data.seasons
                        )
                            ? data.seasons
                            : [];


                    const availableStates =
                        Array.isArray(
                            data.states
                        )
                            ? data.states
                            : [];


                    setCrops(
                        availableCrops
                    );

                    setSeasons(
                        availableSeasons
                    );

                    setStates(
                        availableStates
                    );


                    if (
                        availableCrops.length > 0
                    ) {

                        setCrop(
                            availableCrops[0]
                        );

                    }


                    if (
                        availableSeasons.length > 0
                    ) {

                        setSeason(
                            availableSeasons[0]
                        );

                    }


                    if (
                        availableStates.length > 0
                    ) {

                        setState(
                            availableStates[0]
                        );

                    }

                }
                catch (error) {

                    console.error(
                        "Prediction options error:",
                        error
                    );

                }

            };


        fetchPredictionOptions();

    }, []);


    // ========================================================
    // INPUT CLASS
    // ========================================================

    const inputClass = `
        w-full
        rounded-xl
        border
        border-slate-200
        bg-slate-50/70
        px-4
        py-3.5
        text-sm
        font-medium
        text-slate-900
        outline-none
        transition-all
        duration-200
        placeholder:text-slate-400
        hover:border-slate-300
        focus:border-emerald-500
        focus:bg-white
        focus:ring-4
        focus:ring-emerald-500/10
        disabled:cursor-not-allowed
        disabled:opacity-60
    `;


    // ========================================================
    // NUMERIC INPUT HANDLER
    // ========================================================

    const handleNumericChange = (
        value: string,
        setter: React.Dispatch<
            React.SetStateAction<NumericInput>
        >
    ) => {

        if (
            value === ""
        ) {

            setter("");

            return;

        }


        const numericValue =
            Number(value);


        if (
            Number.isFinite(
                numericValue
            )
        ) {

            setter(
                numericValue
            );

        }

    };


    // ========================================================
    // CLEAR PREDICTION
    // ========================================================

    const clearPrediction =
        () => {

            setPrediction(
                null
            );

            setPredictionTonnes(
                null
            );

            setPredictionKg(
                null
            );

            setImpactFactors(
                []
            );

            setRecommendations(
                []
            );

            setExplanationMethod(
                ""
            );

        };


    // ========================================================
    // TRANSLATE RECOMMENDATION
    //
    // The backend returns English recommendation titles and
    // messages.
    //
    // We identify the recommendation from its title/category
    // and generate the corresponding translated version.
    // ========================================================

    const translateRecommendation =
        (
            recommendation: Recommendation
        ): Recommendation => {

            const title =
                recommendation.title
                    .toLowerCase();


            const message =
                recommendation.message
                    .toLowerCase();


            const combined =
                `${title} ${message}`;


            // ==================================================
            // HUMIDITY
            // ==================================================

            if (
                combined.includes(
                    "humidity"
                ) ||
                combined.includes(
                    "moisture"
                ) ||
                combined.includes(
                    "humid"
                )
            ) {

                const value =
                    String(
                        humidity === ""
                            ? ""
                            : Number(
                                humidity
                            ).toFixed(1)
                    );


                return {

                    ...recommendation,

                    title:
                        recommendationText
                            .humidityTitle,

                    message:
                        recommendationText
                            .humidityMessage(
                                value
                            ),

                };

            }


            // ==================================================
            // SOIL PH
            // ==================================================

            if (
                combined.includes(
                    "soil ph"
                ) ||
                combined.includes(
                    "ph"
                )
            ) {

                const value =
                    String(
                        soilPh === ""
                            ? ""
                            : Number(
                                soilPh
                            ).toFixed(2)
                    );


                return {

                    ...recommendation,

                    title:
                        recommendationText
                            .soilPhTitle,

                    message:
                        recommendationText
                            .soilPhMessage(
                                value,
                                crop
                            ),

                };

            }


            // ==================================================
            // TEMPERATURE
            // ==================================================

            if (
                combined.includes(
                    "temperature"
                )
            ) {

                const value =
                    String(
                        temperature === ""
                            ? ""
                            : Number(
                                temperature
                            ).toFixed(1)
                    );


                return {

                    ...recommendation,

                    title:
                        recommendationText
                            .temperatureTitle,

                    message:
                        recommendationText
                            .temperatureMessage(
                                value
                            ),

                };

            }


            // ==================================================
            // NITROGEN
            // ==================================================

            if (
                combined.includes(
                    "nitrogen"
                )
            ) {

                const value =
                    String(
                        nitrogen === ""
                            ? ""
                            : Number(
                                nitrogen
                            ).toFixed(2)
                    );


                return {

                    ...recommendation,

                    title:
                        recommendationText
                            .nitrogenTitle,

                    message:
                        recommendationText
                            .nitrogenMessage(
                                value
                            ),

                };

            }


            // ==================================================
            // PHOSPHORUS
            // ==================================================

            if (
                combined.includes(
                    "phosphorus"
                ) ||
                combined.includes(
                    "phosphorous"
                )
            ) {

                const value =
                    String(
                        phosphorus === ""
                            ? ""
                            : Number(
                                phosphorus
                            ).toFixed(2)
                    );


                return {

                    ...recommendation,

                    title:
                        recommendationText
                            .phosphorusTitle,

                    message:
                        recommendationText
                            .phosphorusMessage(
                                value
                            ),

                };

            }


            // ==================================================
            // POTASSIUM
            // ==================================================

            if (
                combined.includes(
                    "potassium"
                )
            ) {

                const value =
                    String(
                        potassium === ""
                            ? ""
                            : Number(
                                potassium
                            ).toFixed(2)
                    );


                return {

                    ...recommendation,

                    title:
                        recommendationText
                            .potassiumTitle,

                    message:
                        recommendationText
                            .potassiumMessage(
                                value
                            ),

                };

            }


            // ==================================================
            // RAINFALL
            // ==================================================

            if (
                combined.includes(
                    "rainfall"
                ) ||
                combined.includes(
                    "water availability"
                ) ||
                combined.includes(
                    "water"
                )
            ) {

                const value =
                    String(
                        rainfall === ""
                            ? ""
                            : Number(
                                rainfall
                            ).toFixed(1)
                    );


                return {

                    ...recommendation,

                    title:
                        recommendationText
                            .rainfallTitle,

                    message:
                        recommendationText
                            .rainfallMessage(
                                value
                            ),

                };

            }


            // ==================================================
            // FERTILIZER
            // ==================================================

            if (
                combined.includes(
                    "fertilizer"
                )
            ) {

                const value =
                    String(
                        fertilizer === ""
                            ? ""
                            : Number(
                                fertilizer
                            ).toFixed(2)
                    );


                return {

                    ...recommendation,

                    title:
                        recommendationText
                            .fertilizerTitle,

                    message:
                        recommendationText
                            .fertilizerMessage(
                                value
                            ),

                };

            }


            // ==================================================
            // PESTICIDE
            // ==================================================

            if (
                combined.includes(
                    "pesticide"
                )
            ) {

                const value =
                    String(
                        pesticide === ""
                            ? ""
                            : Number(
                                pesticide
                            ).toFixed(2)
                    );


                return {

                    ...recommendation,

                    title:
                        recommendationText
                            .pesticideTitle,

                    message:
                        recommendationText
                            .pesticideMessage(
                                value
                            ),

                };

            }


            // ==================================================
            // FALLBACK
            //
            // If the backend later introduces another
            // recommendation type, we keep it instead of
            // displaying nothing.
            // ==================================================

            return {
                ...recommendation,
            };

        };


    // ========================================================
    // TRANSLATED RECOMMENDATIONS
    // ========================================================

    const translatedRecommendations =
        useMemo(
            () =>
                recommendations.map(
                    translateRecommendation
                ),
            [
                recommendations,
                currentLanguage,
                humidity,
                soilPh,
                temperature,
                nitrogen,
                phosphorus,
                potassium,
                rainfall,
                fertilizer,
                pesticide,
                crop,
            ]
        );


    // ========================================================
    // PREDICT
    // ========================================================

    const handlePredict =
        async (
            e: FormEvent<HTMLFormElement>
        ) => {

            e.preventDefault();


            const token =
                getToken();


            if (!token) {

                alert(
                    text.pleaseLogin
                );

                router.push(
                    "/login"
                );

                return;

            }


            // ==================================================
            // BASIC VALIDATION
            // ==================================================

            if (!crop) {

                alert(
                    text.selectCrop
                );

                return;

            }


            if (!season) {

                alert(
                    text.selectSeason
                );

                return;

            }


            if (!state) {

                alert(
                    text.selectState
                );

                return;

            }


            // ==================================================
            // CHECK EMPTY NUMERIC FIELDS
            // ==================================================

            if (
                year === "" ||
                area === "" ||
                fertilizer === "" ||
                pesticide === "" ||
                nitrogen === "" ||
                phosphorus === "" ||
                potassium === "" ||
                soilPh === "" ||
                temperature === "" ||
                rainfall === "" ||
                humidity === ""
            ) {

                alert(
                    text.fillNumeric
                );

                return;

            }


            // ==================================================
            // NUMERIC VALIDATION
            // ==================================================

            if (
                area <= 0
            ) {

                alert(
                    text.areaPositive
                );

                return;

            }


            if (
                fertilizer < 0
            ) {

                alert(
                    text.fertilizerNegative
                );

                return;

            }


            if (
                pesticide < 0
            ) {

                alert(
                    text.pesticideNegative
                );

                return;

            }


            if (
                nitrogen < 0
            ) {

                alert(
                    text.nitrogenNegative
                );

                return;

            }


            if (
                phosphorus < 0
            ) {

                alert(
                    text.phosphorusNegative
                );

                return;

            }


            if (
                potassium < 0
            ) {

                alert(
                    text.potassiumNegative
                );

                return;

            }


            if (
                soilPh < 0 ||
                soilPh > 14
            ) {

                alert(
                    text.validPh
                );

                return;

            }


            if (
                rainfall < 0
            ) {

                alert(
                    text.rainfallNegative
                );

                return;

            }


            if (
                humidity < 0 ||
                humidity > 100
            ) {

                alert(
                    text.humidityRange
                );

                return;

            }


            setLoading(
                true
            );


            clearPrediction();


            try {

                // ==============================================
                // SEND MODEL INPUTS
                // ==============================================

                const response =
                    await api.post(
                        "/prediction/predict",
                        {

                            crop:
                                crop,

                            season:
                                season,

                            state:
                                state,

                            year:
                                Number(year),

                            area:
                                Number(area),

                            fertilizer:
                                Number(fertilizer),

                            pesticide:
                                Number(pesticide),

                            N:
                                Number(nitrogen),

                            P:
                                Number(phosphorus),

                            K:
                                Number(potassium),

                            pH:
                                Number(soilPh),

                            avg_temp_c:
                                Number(temperature),

                            total_rainfall_mm:
                                Number(rainfall),

                            avg_humidity_percent:
                                Number(humidity),

                        }
                    );


                console.log(
                    "Prediction Response:",
                    response.data
                );


                // ==============================================
                // PREDICTION
                // ==============================================

                const predictedYield =
                    Number(
                        response.data
                            .predicted_yield
                    );


                if (
                    !Number.isFinite(
                        predictedYield
                    )
                ) {

                    throw new Error(
                        "Invalid prediction returned by the server."
                    );

                }


                const tonnesPerHectare =
                    Number(
                        response.data
                            .yield_tonnes_per_hectare
                    );


                const kgPerHectare =
                    Number(
                        response.data
                            .yield_kg_per_hectare
                    );


                if (
                    !Number.isFinite(
                        tonnesPerHectare
                    )
                ) {

                    throw new Error(
                        "Invalid tonnes/hectare value returned by the server."
                    );

                }


                if (
                    !Number.isFinite(
                        kgPerHectare
                    )
                ) {

                    throw new Error(
                        "Invalid kg/hectare value returned by the server."
                    );

                }


                // ==============================================
                // IMPACT FACTORS
                // ==============================================

                const factors =
                    Array.isArray(
                        response.data
                            .impact_factors
                    )
                        ? response.data
                            .impact_factors
                        : [];


                // ==============================================
                // RECOMMENDATIONS
                // ==============================================

                const recommendationData =
                    Array.isArray(
                        response.data
                            .recommendations
                    )
                        ? response.data
                            .recommendations
                        : [];


                // ==============================================
                // SAVE RESULTS
                // ==============================================

                setPrediction(
                    predictedYield
                );

                setPredictionTonnes(
                    tonnesPerHectare
                );

                setPredictionKg(
                    kgPerHectare
                );

                setImpactFactors(
                    factors
                );

                setRecommendations(
                    recommendationData
                );

                setExplanationMethod(
                    response.data
                        .explanation_method ||
                    ""
                );


                alert(
                    text.predictionGenerated
                );

            }
            catch (
                error: any
            ) {

                console.error(
                    "Prediction Error:",
                    error.response?.data ||
                    error
                );


                if (
                    error.response?.status ===
                    401
                ) {

                    alert(
                        text.sessionExpired
                    );

                    router.push(
                        "/login"
                    );

                    return;

                }


                alert(

                    error.response?.data?.detail ||

                    error.response?.data?.error ||

                    error.message ||

                    text.predictionFailed

                );

            }
            finally {

                setLoading(
                    false
                );

            }

        };


    // ========================================================
    // UI
    // ========================================================

    return (

        <form
            onSubmit={
                handlePredict
            }
            className="
                relative
                max-w-5xl
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200/80
                bg-white
                shadow-[0_16px_50px_rgba(15,23,42,0.07)]
            "
        >

            {/* ==================================================
                TOP ACCENT
            ================================================== */}

            <div
                className="
                    h-1
                    w-full
                    bg-gradient-to-r
                    from-emerald-500
                    via-green-500
                    to-lime-400
                "
            />


            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="
                    border-b
                    border-slate-100
                    bg-gradient-to-br
                    from-emerald-50/80
                    via-white
                    to-lime-50/30
                    px-5
                    py-6
                    sm:px-7
                    sm:py-7
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >

                    <div
                        className="
                            flex
                            h-14
                            w-14
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-emerald-600
                            text-white
                            shadow-lg
                            shadow-emerald-600/20
                        "
                    >

                        <BrainCircuit
                            size={27}
                        />

                    </div>


                    <div>

                        <div
                            className="
                                mb-1
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.16em]
                                    text-emerald-600
                                "
                            >
                                {text.aiIntelligence}
                            </span>

                            <span
                                className="
                                    h-1
                                    w-1
                                    rounded-full
                                    bg-slate-300
                                "
                            />

                            <span
                                className="
                                    text-[11px]
                                    font-medium
                                    text-slate-400
                                "
                            >
                                {text.cropAnalysis}
                            </span>

                        </div>


                        <h2
                            className="
                                text-xl
                                font-bold
                                tracking-tight
                                text-slate-950
                                sm:text-2xl
                            "
                        >
                            {text.cropYieldPrediction}
                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            {text.predictionDescription}
                        </p>

                    </div>

                </div>

            </div>


            {/* ==================================================
                BODY
            ================================================== */}

            <div
                className="
                    p-5
                    sm:p-7
                "
            >

                {/* ==================================================
                    CROP & LOCATION
                ================================================== */}

                <div
                    className="
                        mb-5
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            h-8
                            w-1
                            rounded-full
                            bg-emerald-500
                        "
                    />

                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            {text.cropLocation}
                        </h3>

                        <p
                            className="
                                text-xs
                                text-slate-400
                            "
                        >
                            {text.cropLocationDescription}
                        </p>

                    </div>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-3
                    "
                >

                    {/* CROP */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >

                            <Wheat
                                size={14}
                                className="text-lime-600"
                            />

                            {text.crop}

                        </label>


                        <select
                            className={inputClass}
                            value={crop}
                            onChange={
                                (e) =>
                                    setCrop(
                                        e.target.value
                                    )
                            }
                            disabled={loading}
                        >

                            {crops.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* SEASON */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >

                            <Leaf
                                size={14}
                                className="text-emerald-600"
                            />

                            {text.season}

                        </label>


                        <select
                            className={inputClass}
                            value={season}
                            onChange={
                                (e) =>
                                    setSeason(
                                        e.target.value
                                    )
                            }
                            disabled={loading}
                        >

                            {seasons.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* STATE */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >

                            <MapPin
                                size={14}
                                className="text-red-500"
                            />

                            {text.state}

                        </label>


                        <select
                            className={inputClass}
                            value={state}
                            onChange={
                                (e) =>
                                    setState(
                                        e.target.value
                                    )
                            }
                            disabled={loading}
                        >

                            {states.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>


                {/* ==================================================
                    FARM & INPUTS
                ================================================== */}

                <div
                    className="
                        mt-8
                        mb-5
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            h-8
                            w-1
                            rounded-full
                            bg-emerald-500
                        "
                    />

                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            {text.farmCropInputs}
                        </h3>

                        <p
                            className="
                                text-xs
                                text-slate-400
                            "
                        >
                            {text.farmCropInputsDescription}
                        </p>

                    </div>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-3
                    "
                >

                    {/* YEAR */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >
                            {text.year}
                        </label>


                        <input
                            type="number"
                            className={inputClass}
                            value={year}
                            onChange={
                                (e) =>
                                    handleNumericChange(
                                        e.target.value,
                                        setYear
                                    )
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* AREA */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >
                            {text.farmArea}
                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className={`${inputClass} pr-16`}
                                value={area}
                                onChange={
                                    (e) =>
                                        handleNumericChange(
                                            e.target.value,
                                            setArea
                                        )
                                }
                                disabled={loading}
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                ha
                            </span>

                        </div>

                    </div>


                    {/* FERTILIZER */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >

                            <FlaskConical
                                size={14}
                                className="text-amber-600"
                            />

                            {text.fertilizer}

                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                className={`${inputClass} pr-20`}
                                value={fertilizer}
                                onChange={
                                    (e) =>
                                        handleNumericChange(
                                            e.target.value,
                                            setFertilizer
                                        )
                                }
                                disabled={loading}
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                kg/ha
                            </span>

                        </div>

                    </div>


                    {/* PESTICIDE */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >
                            {text.pesticide}
                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                className={`${inputClass} pr-20`}
                                value={pesticide}
                                onChange={
                                    (e) =>
                                        handleNumericChange(
                                            e.target.value,
                                            setPesticide
                                        )
                                }
                                disabled={loading}
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                kg/ha
                            </span>

                        </div>

                    </div>


                    {/* NITROGEN */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >
                            {text.nitrogen}
                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                className={`${inputClass} pr-20`}
                                value={nitrogen}
                                onChange={
                                    (e) =>
                                        handleNumericChange(
                                            e.target.value,
                                            setNitrogen
                                        )
                                }
                                disabled={loading}
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                kg/ha
                            </span>

                        </div>

                    </div>


                    {/* PHOSPHORUS */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >
                            {text.phosphorus}
                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                className={`${inputClass} pr-20`}
                                value={phosphorus}
                                onChange={
                                    (e) =>
                                        handleNumericChange(
                                            e.target.value,
                                            setPhosphorus
                                        )
                                }
                                disabled={loading}
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                kg/ha
                            </span>

                        </div>

                    </div>


                    {/* POTASSIUM */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >
                            {text.potassium}
                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                className={`${inputClass} pr-20`}
                                value={potassium}
                                onChange={
                                    (e) =>
                                        handleNumericChange(
                                            e.target.value,
                                            setPotassium
                                        )
                                }
                                disabled={loading}
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                kg/ha
                            </span>

                        </div>

                    </div>


                    {/* PH */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >
                            {text.soilPh}
                        </label>


                        <input
                            type="number"
                            min="0"
                            max="14"
                            step="0.1"
                            className={inputClass}
                            value={soilPh}
                            onChange={
                                (e) =>
                                    handleNumericChange(
                                        e.target.value,
                                        setSoilPh
                                    )
                            }
                            disabled={loading}
                        />

                    </div>

                </div>


                {/* ==================================================
                    ENVIRONMENT
                ================================================== */}

                <div
                    className="
                        mt-8
                        mb-5
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            h-8
                            w-1
                            rounded-full
                            bg-sky-500
                        "
                    />

                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            {text.environmentalConditions}
                        </h3>

                        <p
                            className="
                                text-xs
                                text-slate-400
                            "
                        >
                            {text.environmentalDescription}
                        </p>

                    </div>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-3
                    "
                >

                    {/* TEMPERATURE */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >

                            <Thermometer
                                size={14}
                                className="text-orange-500"
                            />

                            {text.averageTemperature}

                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <input
                                type="number"
                                step="0.1"
                                className={`${inputClass} pr-16`}
                                value={temperature}
                                onChange={
                                    (e) =>
                                        handleNumericChange(
                                            e.target.value,
                                            setTemperature
                                        )
                                }
                                disabled={loading}
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                °C
                            </span>

                        </div>

                    </div>


                    {/* RAINFALL */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >

                            <CloudRain
                                size={14}
                                className="text-sky-600"
                            />

                            {text.totalRainfall}

                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                className={`${inputClass} pr-20`}
                                value={rainfall}
                                onChange={
                                    (e) =>
                                        handleNumericChange(
                                            e.target.value,
                                            setRainfall
                                        )
                                }
                                disabled={loading}
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                mm
                            </span>

                        </div>

                    </div>


                    {/* HUMIDITY */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                            "
                        >

                            <Droplets
                                size={14}
                                className="text-sky-600"
                            />

                            {text.averageHumidity}

                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                className={`${inputClass} pr-20`}
                                value={humidity}
                                onChange={
                                    (e) =>
                                        handleNumericChange(
                                            e.target.value,
                                            setHumidity
                                        )
                                }
                                disabled={loading}
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                %
                            </span>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <div
                    className="
                        mt-7
                        flex
                        flex-col
                        gap-4
                        rounded-2xl
                        border
                        border-slate-100
                        bg-slate-50/80
                        p-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                mt-0.5
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-emerald-100
                                text-emerald-700
                            "
                        >

                            <Sprout
                                size={18}
                            />

                        </div>


                        <div>

                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {text.readyToPredict}
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    leading-5
                                    text-slate-500
                                "
                            >
                                {text.readyDescription}
                            </p>

                        </div>

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            inline-flex
                            min-h-12
                            items-center
                            justify-center
                            gap-2.5
                            rounded-xl
                            bg-slate-950
                            px-6
                            text-sm
                            font-bold
                            text-white
                            shadow-lg
                            shadow-slate-950/10
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-emerald-700
                            hover:shadow-emerald-700/20
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        {loading ? (

                            <>

                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                {text.analyzing}

                            </>

                        ) : (

                            <>

                                <BrainCircuit
                                    size={18}
                                />

                                {text.generatePrediction}

                            </>

                        )}

                    </button>

                </div>


                {/* ==================================================
                    RESULT
                ================================================== */}

                {prediction !== null && (

                    <div
                        className="
                            mt-6
                            space-y-5
                        "
                    >

                        {/* ==================================================
                            PREDICTION CARD
                        ================================================== */}

                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-2xl
                                border
                                border-emerald-200
                                bg-gradient-to-br
                                from-emerald-50
                                via-white
                                to-lime-50
                                p-5
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-emerald-600
                                        text-white
                                        shadow-lg
                                    "
                                >

                                    <CheckCircle2
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.14em]
                                            text-emerald-700
                                        "
                                    >
                                        {text.predictionComplete}
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        {text.estimatedCropYield}
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    mt-5
                                    grid
                                    grid-cols-1
                                    gap-4
                                    sm:grid-cols-2
                                "
                            >

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-emerald-100
                                        bg-white/80
                                        p-4
                                    "
                                >

                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                        "
                                    >
                                        {text.estimatedYield}
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-3xl
                                            font-black
                                            text-slate-950
                                        "
                                    >
                                        {
                                            predictionTonnes !== null
                                                ? predictionTonnes.toFixed(2)
                                                : "--"
                                        }
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            font-semibold
                                            text-emerald-700
                                        "
                                    >
                                        {text.tonnesPerHectare}
                                    </p>

                                </div>


                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-slate-100
                                        bg-white/80
                                        p-4
                                    "
                                >

                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                        "
                                    >
                                        {text.estimatedYield}
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-3xl
                                            font-black
                                            text-slate-950
                                        "
                                    >
                                        {
                                            predictionKg !== null
                                                ? predictionKg.toLocaleString()
                                                : "--"
                                        }
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            font-semibold
                                            text-slate-500
                                        "
                                    >
                                        {text.kgPerHectare}
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    mt-4
                                    flex
                                    justify-end
                                "
                            >

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-emerald-100
                                        bg-white/80
                                        px-4
                                        py-3
                                    "
                                >

                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                        "
                                    >
                                        {text.crop}
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        {crop}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            IMPACT ANALYSIS
                        ================================================== */}

                        {impactFactors.length > 0 && (

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-5
                                    shadow-sm
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-4
                                    "
                                >

                                    <div>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-violet-100
                                                    text-violet-700
                                                "
                                            >

                                                <BrainCircuit
                                                    size={20}
                                                />

                                            </div>


                                            <div>

                                                <h3
                                                    className="
                                                        text-base
                                                        font-bold
                                                        text-slate-900
                                                    "
                                                >
                                                    {text.factorsInfluencing}
                                                </h3>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-xs
                                                        text-slate-500
                                                    "
                                                >
                                                    {text.factorsDescription}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    <span
                                        className="
                                            hidden
                                            rounded-full
                                            bg-violet-50
                                            px-3
                                            py-1
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-violet-700
                                            sm:inline-flex
                                        "
                                    >
                                        {
                                            explanationMethod === "SHAP"
                                                ? text.aiExplainability
                                                : text.modelAnalysis
                                        }
                                    </span>

                                </div>


                                <div
                                    className="
                                        mt-5
                                        space-y-4
                                    "
                                >

                                    {impactFactors
                                        .slice(
                                            0,
                                            8
                                        )
                                        .map(
                                            (
                                                factor,
                                                index
                                            ) => (

                                                <div
                                                    key={
                                                        factor.feature
                                                    }
                                                >

                                                    <div
                                                        className="
                                                            mb-2
                                                            flex
                                                            items-center
                                                            justify-between
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                min-w-0
                                                                items-center
                                                                gap-2
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                    flex
                                                                    h-6
                                                                    w-6
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-slate-100
                                                                    text-[10px]
                                                                    font-bold
                                                                    text-slate-500
                                                                "
                                                            >
                                                                {
                                                                    index + 1
                                                                }
                                                            </span>


                                                            <span
                                                                className="
                                                                    truncate
                                                                    text-sm
                                                                    font-bold
                                                                    text-slate-800
                                                                "
                                                            >
                                                                {
                                                                    factor.name
                                                                }
                                                            </span>

                                                        </div>


                                                        <div
                                                            className="
                                                                flex
                                                                shrink-0
                                                                items-center
                                                                gap-2
                                                            "
                                                        >

                                                            <span
                                                                className={`
                                                                    rounded-full
                                                                    px-2.5
                                                                    py-1
                                                                    text-[10px]
                                                                    font-bold
                                                                    uppercase
                                                                    ${
                                                                        factor.importance ===
                                                                        "high"
                                                                            ? "bg-red-50 text-red-700"
                                                                            : factor.importance ===
                                                                                "medium"
                                                                                ? "bg-amber-50 text-amber-700"
                                                                                : "bg-slate-100 text-slate-600"
                                                                    }
                                                                `}
                                                            >
                                                                {
                                                                    factor.importance ===
                                                                    "high"
                                                                        ? recommendationText.high
                                                                        : factor.importance ===
                                                                            "medium"
                                                                            ? recommendationText.medium
                                                                            : recommendationText.low
                                                                }
                                                            </span>


                                                            <span
                                                                className={`
                                                                    text-xs
                                                                    font-bold
                                                                    ${
                                                                        factor.direction ===
                                                                        "positive"
                                                                            ? "text-emerald-600"
                                                                            : "text-red-600"
                                                                    }
                                                                `}
                                                            >
                                                                {
                                                                    factor.direction ===
                                                                    "positive"
                                                                        ? text.positive
                                                                        : text.negative
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>


                                                    <div
                                                        className="
                                                            h-2
                                                            overflow-hidden
                                                            rounded-full
                                                            bg-slate-100
                                                        "
                                                    >

                                                        <div
                                                            className={`
                                                                h-full
                                                                rounded-full
                                                                ${
                                                                    factor.direction ===
                                                                    "positive"
                                                                        ? "bg-emerald-500"
                                                                        : "bg-red-500"
                                                                }
                                                            `}
                                                            style={{
                                                                width: `${Math.min(
                                                                    100,
                                                                    Math.max(
                                                                        4,
                                                                        factor.impact_percentage
                                                                    )
                                                                )}%`,
                                                            }}
                                                        />

                                                    </div>


                                                    <div
                                                        className="
                                                            mt-1.5
                                                            flex
                                                            justify-between
                                                            gap-3
                                                            text-[11px]
                                                            text-slate-400
                                                        "
                                                    >

                                                        <span>

                                                            {text.input}:{" "}

                                                            <span
                                                                className="
                                                                    font-semibold
                                                                    text-slate-600
                                                                "
                                                            >

                                                                {
                                                                    String(
                                                                        factor.value
                                                                    )
                                                                }

                                                                {
                                                                    factor.unit
                                                                        ? ` ${factor.unit}`
                                                                        : ""
                                                                }

                                                            </span>

                                                        </span>


                                                        <span>

                                                            {
                                                                Number(
                                                                    factor.impact_percentage
                                                                ).toFixed(
                                                                    1
                                                                )
                                                            }

                                                            %{" "}

                                                            {
                                                                text.relativeImpact
                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                </div>


                                <div
                                    className="
                                        mt-5
                                        rounded-xl
                                        border
                                        border-violet-100
                                        bg-violet-50/60
                                        p-3
                                    "
                                >

                                    <p
                                        className="
                                            text-[11px]
                                            leading-5
                                            text-violet-800
                                        "
                                    >

                                        <strong>
                                            {text.note}
                                        </strong>{" "}

                                        {text.impactDescription}

                                    </p>

                                </div>

                            </div>

                        )}


                        {/* ==================================================
                            RECOMMENDATIONS
                        ================================================== */}

                        {translatedRecommendations.length > 0 && (

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-emerald-200
                                    bg-gradient-to-br
                                    from-emerald-50/70
                                    via-white
                                    to-lime-50/50
                                    p-5
                                    shadow-sm
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-emerald-600
                                            text-white
                                            shadow-lg
                                        "
                                    >

                                        <Sprout
                                            size={20}
                                        />

                                    </div>


                                    <div>

                                        <h3
                                            className="
                                                text-base
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            {
                                                text.personalizedRecommendations
                                            }
                                        </h3>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                text-slate-500
                                            "
                                        >
                                            {
                                                text.recommendationsDescription
                                            }
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-5
                                        grid
                                        grid-cols-1
                                        gap-3
                                    "
                                >

                                    {translatedRecommendations.map(
                                        (
                                            recommendation,
                                            index
                                        ) => (

                                            <div
                                                key={`${recommendation.category}-${index}`}
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-slate-100
                                                    bg-white
                                                    p-4
                                                    shadow-sm
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                    "
                                                >

                                                    <div
                                                        className={`
                                                            mt-0.5
                                                            h-2.5
                                                            w-2.5
                                                            shrink-0
                                                            rounded-full
                                                            ${
                                                                recommendation.priority ===
                                                                "high"
                                                                    ? "bg-red-500"
                                                                    : recommendation.priority ===
                                                                        "medium"
                                                                        ? "bg-amber-500"
                                                                        : "bg-emerald-500"
                                                            }
                                                        `}
                                                    />


                                                    <div
                                                        className="
                                                            min-w-0
                                                            flex-1
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                flex-wrap
                                                                items-center
                                                                gap-2
                                                            "
                                                        >

                                                            <h4
                                                                className="
                                                                    text-sm
                                                                    font-bold
                                                                    text-slate-900
                                                                "
                                                            >
                                                                {
                                                                    recommendation.title
                                                                }
                                                            </h4>


                                                            <span
                                                                className={`
                                                                    rounded-full
                                                                    px-2
                                                                    py-0.5
                                                                    text-[9px]
                                                                    font-bold
                                                                    uppercase
                                                                    tracking-wide
                                                                    ${
                                                                        recommendation.priority ===
                                                                        "high"
                                                                            ? "bg-red-50 text-red-700"
                                                                            : recommendation.priority ===
                                                                                "medium"
                                                                                ? "bg-amber-50 text-amber-700"
                                                                                : "bg-emerald-50 text-emerald-700"
                                                                    }
                                                                `}
                                                            >

                                                                {
                                                                    recommendation.priority ===
                                                                    "high"
                                                                        ? recommendationText.high
                                                                        : recommendation.priority ===
                                                                            "medium"
                                                                            ? recommendationText.medium
                                                                            : recommendationText.low
                                                                }

                                                            </span>

                                                        </div>


                                                        <p
                                                            className="
                                                                mt-1.5
                                                                text-xs
                                                                leading-5
                                                                text-slate-600
                                                            "
                                                        >
                                                            {
                                                                recommendation.message
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>


                                <div
                                    className="
                                        mt-4
                                        rounded-xl
                                        border
                                        border-emerald-100
                                        bg-white/70
                                        p-3
                                    "
                                >

                                    <p
                                        className="
                                            text-[11px]
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        {
                                            text.recommendationsNote
                                        }
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* ==================================================
                            FOOTER NOTE
                        ================================================== */}

                        <p
                            className="
                                text-center
                                text-[11px]
                                text-slate-400
                            "
                        >
                            {
                                text.predictionFooter
                            }
                        </p>

                    </div>

                )}

            </div>

        </form>

    );

}