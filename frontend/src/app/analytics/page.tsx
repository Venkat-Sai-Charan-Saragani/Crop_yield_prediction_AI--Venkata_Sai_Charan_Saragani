"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Activity,
    AlertCircle,
    BarChart3,
    BrainCircuit,
    CheckCircle2,
    ChevronDown,
    Database,
    Leaf,
    Loader2,
    RefreshCw,
    Sprout,
    Target,
    TrendingDown,
    TrendingUp,
    Trophy,
    Wheat,
} from "lucide-react";

import {
    CartesianGrid,
    Bar,
    BarChart,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    useLanguage,
} from "@/context/LanguageContext";


// ============================================================
// TYPES
// ============================================================

interface AnalyticsSummary {
    total_predictions: number;
    total_farms: number;
    total_crops: number;
    average_yield: number;
    best_yield: number;
    lowest_yield: number;
    performance_score: number;
}

interface CropPerformance {
    crop: string;
    predictions: number;
    average_yield: number;
    best_yield: number;
    lowest_yield: number;
}

interface AreaPerformance {
    area: string;
    predictions: number;
    average_yield: number;
}

interface YearPerformance {
    year: number;
    predictions: number;
    average_yield: number;
    best_yield: number;
}

interface PredictionTrend {
    prediction_number: number;
    crop_prediction_number: number;
    label: string;
    crop: string;
    area: string;
    year: number | null;
    yield: number;
}

interface RecentPrediction {
    id: string;
    crop: string;
    area: string;
    year: number | null;
    yield: number;
    created_at: string | null;
}

interface Insight {
    type: "success" | "warning" | "info";
    title: string;
    description: string;
}

interface AnalyticsData {
    success: boolean;
    has_data: boolean;
    summary: AnalyticsSummary;
    crop_performance: CropPerformance[];
    area_performance: AreaPerformance[];
    year_performance: YearPerformance[];
    prediction_trend: PredictionTrend[];
    recent_predictions: RecentPrediction[];
    insights: Insight[];
    generated_at: string;
}


// ============================================================
// LOCAL PAGE TRANSLATIONS
//
// We intentionally keep these here instead of using
// predictionHistoryDescription from LanguageContext.
//
// This prevents the red TypeScript error and guarantees that
// this page changes language correctly.
// ============================================================

const translations = {

    en: {

        analytics: "Analytics",

        aiAnalytics: "AI Analytics",

        agriculturalIntelligence:
            "Agricultural Intelligence",

        agriculturalIntelligenceDescription:
            "Understand your prediction history, compare crop performance, and discover patterns across your agricultural conditions.",

        refreshAnalytics:
            "Refresh Analytics",

        buildingAnalytics:
            "Preparing your analytics...",

        analysingData:
            "Analyzing your farms, crops, and prediction history",

        analyticsUnavailable:
            "Analytics Unavailable",

        tryAgain:
            "Try Again",

        yourAnalyticsAreWaiting:
            "Your Analytics Are Waiting",

        generatePredictions:
            "Generate crop yield predictions to unlock performance trends, crop comparisons, historical information, and personalized insights.",

        analyticsCoverageScore:
            "Analytics Data Coverage Score",

        lookingStrong:
            "Looking strong.",

        takingShape:
            "Taking shape.",

        justGettingStarted:
            "Just getting started.",

        scoreDescription:
            "This score represents the amount of useful historical data available for your personalized analytics. It does not represent machine learning model accuracy.",

        predictions:
            "Predictions",

        currentModelScenarios:
            "Agricultural scenarios analyzed by the current model",

        averageYield:
            "Average Yield",

        averagePredictedProductivity:
            "Average predicted productivity",

        bestPredictedYield:
            "Best Predicted Yield",

        highestCurrentModelPrediction:
            "Highest prediction from the current model",

        lowestPredictedYield:
            "Lowest Predicted Yield",

        lowestCurrentModelPrediction:
            "Lowest prediction from the current model",

        farmsTracked:
            "Farms Tracked",

        cropsTracked:
            "Crops Tracked",

        cropScenarios:
            "Crop Scenarios",

        predictionYieldComparison:
            "Prediction Yield Comparison",

        predictionYieldDescription:
            "Each bar represents a unique crop yield prediction.",

        allCrops:
            "All Crops",

        yield:
            "Yield",

        year:
            "Year",

        area:
            "Area",

        predictedYield:
            "Predicted Yield",

        prediction:
            "prediction",

        predictionsPlural:
            "predictions",

        eachBarDescription:
            "Each bar represents a unique prediction. The label shows the crop and its prediction number.",

        cropPerformance:
            "Crop Performance",

        cropPerformanceDescription:
            "Average predicted yield for each crop.",

        yearWisePerformance:
            "Year-wise Performance",

        yearWiseDescription:
            "Compare average predicted yield across different years.",

        areaPerformance:
            "Area-wise Performance",

        areaPerformanceDescription:
            "Compare predicted performance across different areas.",

        noAreaData:
            "No area data is available.",

        intelligentInsights:
            "Intelligent Insights",

        intelligentInsightsDescription:
            "Automatically generated observations based on your current prediction history.",

        recentPredictionActivity:
            "Recent Prediction Activity",

        recentPredictionDescription:
            "Your latest crop yield prediction scenarios.",

        crop:
            "Crop",

        predictedYieldColumn:
            "Predicted Yield",

        footerNote:
            "Analytics use predictions generated by the current yield model. Yield values are displayed in tonnes per hectare (t/ha). Prediction records from older model formats have been excluded from these analytics.",

        predictionNumber:
            "Prediction Number",

        predictionYield:
            "Prediction Yield",

        predictionYear:
            "Year",

        predictionArea:
            "Area",

        averageYieldTooltip:
            "Average Yield",

        predictionCount:
            "Predictions",

        tonnesPerHectare:
            "Tonnes per hectare",

        analyticsEndpointMissing:
            "Analytics API endpoint was not found. Please restart the FastAPI backend.",

        loginRequired:
            "Please log in to view analytics.",

        sessionExpired:
            "Your session has expired. Please log in again.",

        invalidAnalyticsResponse:
            "The analytics information received from the server is invalid.",

        unableToLoadAnalytics:
            "Unable to load analytics.",

        serverError:
            "A server error occurred.",

        predictedYieldAxis:
            "Predicted Yield (t/ha)",

        topPerformingCrop:
            "Top performing crop",

        averageProductivity:
            "Average productivity",

        yieldVariation:
            "Yield variation",

        bestPrediction:
            "Best prediction",

        cropDiversity:
            "Crop diversity",

        highestAverageYield:
            "has the highest average predicted yield at",

        averageProductivityText:
            "Your average predicted productivity is",

        differenceBetween:
            "The difference between your highest and lowest prediction is",

        highestPredictedYield:
            "Your highest predicted yield is",

        differentCrops:
            "You have analysed",

        differentCropsSuffix:
            "different crops across your prediction history.",

        tonnes:
            "tonnes/ha",

        noInsights:
            "No insights are currently available.",
    },


    te: {

        analytics: "విశ్లేషణ",

        aiAnalytics: "AI విశ్లేషణ",

        agriculturalIntelligence:
            "వ్యవసాయ మేధస్సు",

        agriculturalIntelligenceDescription:
            "మీ దిగుబడి అంచనా చరిత్రను అర్థం చేసుకోండి, పంటల పనితీరును పోల్చండి మరియు మీ వ్యవసాయ పరిస్థితుల్లోని నమూనాలను గుర్తించండి.",

        refreshAnalytics:
            "విశ్లేషణను రిఫ్రెష్ చేయండి",

        buildingAnalytics:
            "మీ విశ్లేషణను సిద్ధం చేస్తోంది...",

        analysingData:
            "మీ పొలాలు, పంటలు మరియు అంచనా చరిత్రను విశ్లేషిస్తోంది",

        analyticsUnavailable:
            "విశ్లేషణ అందుబాటులో లేదు",

        tryAgain:
            "మళ్లీ ప్రయత్నించండి",

        yourAnalyticsAreWaiting:
            "మీ విశ్లేషణ సిద్ధంగా ఉంది",

        generatePredictions:
            "పంట దిగుబడి అంచనాలను రూపొందించి పనితీరు ధోరణులు, పంటల పోలికలు, చారిత్రక సమాచారం మరియు వ్యక్తిగత సూచనలను చూడండి.",

        analyticsCoverageScore:
            "విశ్లేషణ డేటా కవరేజ్ స్కోర్",

        lookingStrong:
            "చాలా బాగుంది.",

        takingShape:
            "మెరుగుపడుతోంది.",

        justGettingStarted:
            "ఇప్పుడే ప్రారంభమైంది.",

        scoreDescription:
            "ఈ స్కోర్ మీ వ్యక్తిగత విశ్లేషణ కోసం అందుబాటులో ఉన్న ఉపయోగకరమైన చారిత్రక డేటా పరిమాణాన్ని సూచిస్తుంది. ఇది మెషిన్ లెర్నింగ్ మోడల్ ఖచ్చితత్వాన్ని సూచించదు.",

        predictions:
            "అంచనాలు",

        currentModelScenarios:
            "ప్రస్తుత మోడల్ విశ్లేషించిన వ్యవసాయ పరిస్థితులు",

        averageYield:
            "సగటు దిగుబడి",

        averagePredictedProductivity:
            "సగటు అంచనా ఉత్పాదకత",

        bestPredictedYield:
            "అత్యధిక అంచనా దిగుబడి",

        highestCurrentModelPrediction:
            "ప్రస్తుత మోడల్‌లో అత్యధిక అంచనా",

        lowestPredictedYield:
            "అత్యల్ప అంచనా దిగుబడి",

        lowestCurrentModelPrediction:
            "ప్రస్తుత మోడల్‌లో అత్యల్ప అంచనా",

        farmsTracked:
            "ట్రాక్ చేస్తున్న పొలాలు",

        cropsTracked:
            "ట్రాక్ చేస్తున్న పంటలు",

        cropScenarios:
            "పంట పరిస్థితులు",

        predictionYieldComparison:
            "దిగుబడి అంచనాల పోలిక",

        predictionYieldDescription:
            "ప్రతి బార్ ఒక ప్రత్యేక పంట దిగుబడి అంచనాను సూచిస్తుంది.",

        allCrops:
            "అన్ని పంటలు",

        yield:
            "దిగుబడి",

        year:
            "సంవత్సరం",

        area:
            "ప్రాంతం",

        predictedYield:
            "అంచనా దిగుబడి",

        prediction:
            "అంచనా",

        predictionsPlural:
            "అంచనాలు",

        eachBarDescription:
            "ప్రతి బార్ ఒక ప్రత్యేక అంచనాను సూచిస్తుంది. లేబుల్ పంట మరియు దాని అంచనా సంఖ్యను చూపిస్తుంది.",

        cropPerformance:
            "పంట పనితీరు",

        cropPerformanceDescription:
            "ప్రతి పంటకు సగటు అంచనా దిగుబడి.",

        yearWisePerformance:
            "సంవత్సరాల వారీ పనితీరు",

        yearWiseDescription:
            "వివిధ సంవత్సరాల్లో సగటు అంచనా దిగుబడిని పోల్చండి.",

        areaPerformance:
            "ప్రాంతాల వారీ పనితీరు",

        areaPerformanceDescription:
            "వివిధ ప్రాంతాల్లో అంచనా పనితీరును పోల్చండి.",

        noAreaData:
            "ప్రాంతానికి సంబంధించిన డేటా అందుబాటులో లేదు.",

        intelligentInsights:
            "తెలివైన సూచనలు",

        intelligentInsightsDescription:
            "మీ ప్రస్తుత అంచనా చరిత్ర ఆధారంగా స్వయంచాలకంగా రూపొందించబడిన పరిశీలనలు.",

        recentPredictionActivity:
            "ఇటీవలి అంచనా కార్యకలాపాలు",

        recentPredictionDescription:
            "మీ తాజా పంట దిగుబడి అంచనా పరిస్థితులు.",

        crop:
            "పంట",

        predictedYieldColumn:
            "అంచనా దిగుబడి",

        footerNote:
            "విశ్లేషణ ప్రస్తుత దిగుబడి మోడల్ ద్వారా రూపొందించబడిన అంచనాలను ఉపయోగిస్తుంది. దిగుబడి విలువలు టన్నులు/హెక్టారులో (t/ha) చూపబడతాయి. పాత మోడల్ ఫార్మాట్‌లకు చెందిన అంచనా రికార్డులు ఈ విశ్లేషణ నుండి తొలగించబడ్డాయి.",

        predictionNumber:
            "అంచనా సంఖ్య",

        predictionYield:
            "అంచనా దిగుబడి",

        predictionYear:
            "సంవత్సరం",

        predictionArea:
            "ప్రాంతం",

        averageYieldTooltip:
            "సగటు దిగుబడి",

        predictionCount:
            "అంచనాలు",

        tonnesPerHectare:
            "హెక్టారుకు టన్నులు",

        analyticsEndpointMissing:
            "విశ్లేషణ API ఎండ్‌పాయింట్ కనుగొనబడలేదు. FastAPI backend‌ను పునఃప్రారంభించండి.",

        loginRequired:
            "విశ్లేషణను చూడటానికి దయచేసి లాగిన్ అవ్వండి.",

        sessionExpired:
            "మీ సెషన్ ముగిసింది. దయచేసి మళ్లీ లాగిన్ అవ్వండి.",

        invalidAnalyticsResponse:
            "సర్వర్ నుండి అందిన విశ్లేషణ సమాచారం చెల్లదు.",

        unableToLoadAnalytics:
            "విశ్లేషణను లోడ్ చేయడం సాధ్యం కాలేదు.",

        serverError:
            "సర్వర్ లోపం సంభవించింది.",

        predictedYieldAxis:
            "అంచనా దిగుబడి (t/ha)",

        topPerformingCrop:
            "అత్యుత్తమ పనితీరు కలిగిన పంట",

        averageProductivity:
            "సగటు ఉత్పాదకత",

        yieldVariation:
            "దిగుబడి వ్యత్యాసం",

        bestPrediction:
            "అత్యుత్తమ అంచనా",

        cropDiversity:
            "పంట వైవిధ్యం",

        highestAverageYield:
            "అత్యధిక సగటు అంచనా దిగుబడిని కలిగి ఉంది",

        averageProductivityText:
            "మీ సగటు అంచనా ఉత్పాదకత",

        differenceBetween:
            "మీ అత్యధిక మరియు అత్యల్ప అంచనాల మధ్య వ్యత్యాసం",

        highestPredictedYield:
            "మీ అత్యధిక అంచనా దిగుబడి",

        differentCrops:
            "మీరు",

        differentCropsSuffix:
            "వేర్వేరు పంటలను విశ్లేషించారు.",

        tonnes:
            "టన్నులు/హెక్టారు",

        noInsights:
            "ప్రస్తుతం ఎలాంటి సూచనలు అందుబాటులో లేవు.",
    },


    hi: {

        analytics: "विश्लेषण",

        aiAnalytics: "AI विश्लेषण",

        agriculturalIntelligence:
            "कृषि बुद्धिमत्ता",

        agriculturalIntelligenceDescription:
            "अपने उपज पूर्वानुमान इतिहास को समझें, फसल के प्रदर्शन की तुलना करें और अपनी कृषि परिस्थितियों में पैटर्न खोजें।",

        refreshAnalytics:
            "विश्लेषण रीफ्रेश करें",

        buildingAnalytics:
            "आपका विश्लेषण तैयार किया जा रहा है...",

        analysingData:
            "आपके खेतों, फसलों और पूर्वानुमान इतिहास का विश्लेषण किया जा रहा है",

        analyticsUnavailable:
            "विश्लेषण उपलब्ध नहीं है",

        tryAgain:
            "पुनः प्रयास करें",

        yourAnalyticsAreWaiting:
            "आपका विश्लेषण तैयार है",

        generatePredictions:
            "फसल उपज पूर्वानुमान तैयार करें और प्रदर्शन रुझान, फसल तुलना, ऐतिहासिक जानकारी तथा व्यक्तिगत सुझाव प्राप्त करें।",

        analyticsCoverageScore:
            "विश्लेषण डेटा कवरेज स्कोर",

        lookingStrong:
            "बहुत अच्छा।",

        takingShape:
            "बेहतर हो रहा है।",

        justGettingStarted:
            "अभी शुरुआत हुई है।",

        scoreDescription:
            "यह स्कोर आपके व्यक्तिगत विश्लेषण के लिए उपलब्ध उपयोगी ऐतिहासिक डेटा की मात्रा को दर्शाता है। यह मशीन लर्निंग मॉडल की सटीकता को नहीं दर्शाता है।",

        predictions:
            "पूर्वानुमान",

        currentModelScenarios:
            "वर्तमान मॉडल द्वारा विश्लेषित कृषि परिस्थितियाँ",

        averageYield:
            "औसत उपज",

        averagePredictedProductivity:
            "औसत अनुमानित उत्पादकता",

        bestPredictedYield:
            "सर्वोत्तम अनुमानित उपज",

        highestCurrentModelPrediction:
            "वर्तमान मॉडल का सबसे अधिक पूर्वानुमान",

        lowestPredictedYield:
            "सबसे कम अनुमानित उपज",

        lowestCurrentModelPrediction:
            "वर्तमान मॉडल का सबसे कम पूर्वानुमान",

        farmsTracked:
            "ट्रैक किए गए खेत",

        cropsTracked:
            "ट्रैक की गई फसलें",

        cropScenarios:
            "फसल परिस्थितियाँ",

        predictionYieldComparison:
            "उपज पूर्वानुमान तुलना",

        predictionYieldDescription:
            "प्रत्येक बार एक अलग फसल उपज पूर्वानुमान को दर्शाता है।",

        allCrops:
            "सभी फसलें",

        yield:
            "उपज",

        year:
            "वर्ष",

        area:
            "क्षेत्र",

        predictedYield:
            "अनुमानित उपज",

        prediction:
            "पूर्वानुमान",

        predictionsPlural:
            "पूर्वानुमान",

        eachBarDescription:
            "प्रत्येक बार एक अलग पूर्वानुमान को दर्शाता है। लेबल फसल और उसके पूर्वानुमान नंबर को दिखाता है।",

        cropPerformance:
            "फसल प्रदर्शन",

        cropPerformanceDescription:
            "प्रत्येक फसल की औसत अनुमानित उपज।",

        yearWisePerformance:
            "वर्षवार प्रदर्शन",

        yearWiseDescription:
            "विभिन्न वर्षों में औसत अनुमानित उपज की तुलना करें।",

        areaPerformance:
            "क्षेत्रवार प्रदर्शन",

        areaPerformanceDescription:
            "विभिन्न क्षेत्रों में अनुमानित प्रदर्शन की तुलना करें।",

        noAreaData:
            "क्षेत्र से संबंधित डेटा उपलब्ध नहीं है।",

        intelligentInsights:
            "बुद्धिमान सुझाव",

        intelligentInsightsDescription:
            "आपके वर्तमान पूर्वानुमान इतिहास के आधार पर स्वचालित रूप से तैयार किए गए अवलोकन।",

        recentPredictionActivity:
            "हाल की पूर्वानुमान गतिविधि",

        recentPredictionDescription:
            "आपके नवीनतम फसल उपज पूर्वानुमान।",

        crop:
            "फसल",

        predictedYieldColumn:
            "अनुमानित उपज",

        footerNote:
            "विश्लेषण वर्तमान उपज मॉडल द्वारा बनाए गए पूर्वानुमानों का उपयोग करता है। उपज मान टन प्रति हेक्टेयर (t/ha) में दिखाए जाते हैं। पुराने मॉडल प्रारूपों के पूर्वानुमान रिकॉर्ड को इन विश्लेषणों से हटा दिया गया है।",

        predictionNumber:
            "पूर्वानुमान संख्या",

        predictionYield:
            "पूर्वानुमान उपज",

        predictionYear:
            "वर्ष",

        predictionArea:
            "क्षेत्र",

        averageYieldTooltip:
            "औसत उपज",

        predictionCount:
            "पूर्वानुमान",

        tonnesPerHectare:
            "टन प्रति हेक्टेयर",

        analyticsEndpointMissing:
            "Analytics API endpoint नहीं मिला। कृपया FastAPI backend को पुनः प्रारंभ करें।",

        loginRequired:
            "विश्लेषण देखने के लिए कृपया लॉगिन करें।",

        sessionExpired:
            "आपका सत्र समाप्त हो गया है। कृपया फिर से लॉगिन करें।",

        invalidAnalyticsResponse:
            "सर्वर से प्राप्त विश्लेषण जानकारी अमान्य है।",

        unableToLoadAnalytics:
            "विश्लेषण लोड नहीं किया जा सका।",

        serverError:
            "सर्वर त्रुटि हुई।",

        predictedYieldAxis:
            "अनुमानित उपज (t/ha)",

        topPerformingCrop:
            "सर्वश्रेष्ठ प्रदर्शन वाली फसल",

        averageProductivity:
            "औसत उत्पादकता",

        yieldVariation:
            "उपज में अंतर",

        bestPrediction:
            "सर्वोत्तम पूर्वानुमान",

        cropDiversity:
            "फसल विविधता",

        highestAverageYield:
            "का औसत अनुमानित उपज सबसे अधिक है",

        averageProductivityText:
            "आपकी औसत अनुमानित उत्पादकता है",

        differenceBetween:
            "आपकी सबसे अधिक और सबसे कम उपज के बीच अंतर है",

        highestPredictedYield:
            "आपकी सबसे अधिक अनुमानित उपज है",

        differentCrops:
            "आपने",

        differentCropsSuffix:
            "अलग-अलग फसलों का विश्लेषण किया है।",

        tonnes:
            "टन/हेक्टेयर",

        noInsights:
            "फिलहाल कोई सुझाव उपलब्ध नहीं है.",
    },

};


// ============================================================
// API URL
// ============================================================

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";


// ============================================================
// TOKEN
// ============================================================

function getUserToken(): string | null {

    if (typeof window === "undefined") {
        return null;
    }

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("user_token")
    );
}


// ============================================================
// NUMBER FORMAT
// ============================================================

function formatNumber(
    value: number,
    decimals = 2
): string {

    return Number(
        value || 0
    ).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }
    );
}


// ============================================================
// YIELD FORMAT
// ============================================================

function formatYield(
    value: number
): string {

    return `${formatNumber(value, 2)} t/ha`;
}


// ============================================================
// EMPTY ANALYTICS
// ============================================================

function EmptyAnalytics({
    text,
}: {
    text: typeof translations.en;
}) {

    return (
        <div
            className="
                rounded-3xl
                border
                border-dashed
                border-slate-300
                bg-white
                p-12
                text-center
                shadow-sm
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-emerald-50
                    text-emerald-600
                "
            >
                <BarChart3 size={30} />
            </div>

            <h3
                className="
                    mt-5
                    text-xl
                    font-bold
                    text-slate-900
                "
            >
                {text.yourAnalyticsAreWaiting}
            </h3>

            <p
                className="
                    mx-auto
                    mt-2
                    max-w-lg
                    text-sm
                    leading-6
                    text-slate-600
                "
            >
                {text.generatePredictions}
            </p>

        </div>
    );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
    title,
    value,
    subtitle,
    icon,
    iconClass,
}: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    iconClass: string;
}) {

    return (
        <div
            className="
                group
                rounded-3xl
                bg-white
                p-6
                shadow-sm
                ring-1
                ring-slate-200
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
            "
        >

            <div className="flex items-start justify-between">

                <div className="min-w-0">

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            mt-3
                            text-3xl
                            font-bold
                            tracking-tight
                            text-slate-950
                        "
                    >
                        {value}
                    </p>

                    <p
                        className="
                            mt-2
                            text-xs
                            leading-5
                            text-slate-500
                        "
                    >
                        {subtitle}
                    </p>

                </div>

                <div
                    className={`
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        ${iconClass}
                    `}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}


// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {

    return (
        <div className="mb-6 flex items-start gap-3">

            <div
                className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-50
                    text-emerald-600
                "
            >
                {icon}
            </div>

            <div className="min-w-0">

                <h2
                    className="
                        text-xl
                        font-bold
                        text-slate-950
                    "
                >
                    {title}
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        leading-5
                        text-slate-600
                    "
                >
                    {description}
                </p>

            </div>

        </div>
    );
}


// ============================================================
// PREDICTION TOOLTIP
// ============================================================

function PredictionBarTooltip({
    active,
    payload,
    text,
}: {
    active?: boolean;

    payload?: Array<{
        value?: number;
        payload?: PredictionTrend;
    }>;

    text: typeof translations.en;
}) {

    if (
        !active ||
        !payload ||
        payload.length === 0
    ) {
        return null;
    }

    const data =
        payload[0]?.payload;

    if (!data) {
        return null;
    }

    return (
        <div
            className="
                min-w-[220px]
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-2xl
            "
        >

            <p
                className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {text.predictionNumber} #{data.prediction_number}
            </p>

            <p
                className="
                    mt-1
                    text-base
                    font-bold
                    text-slate-950
                "
            >
                {data.crop}
            </p>

            <div className="mt-3 space-y-2">

                <div className="flex items-center justify-between gap-4">

                    <span className="text-xs text-slate-600">
                        {text.yield}
                    </span>

                    <span className="text-sm font-bold text-emerald-700">
                        {formatYield(data.yield)}
                    </span>

                </div>

                <div className="flex items-center justify-between gap-4">

                    <span className="text-xs text-slate-600">
                        {text.year}
                    </span>

                    <span className="text-xs font-semibold text-slate-800">
                        {data.year ?? "—"}
                    </span>

                </div>

                <div className="flex items-center justify-between gap-4">

                    <span className="text-xs text-slate-600">
                        {text.area}
                    </span>

                    <span
                        className="
                            max-w-[120px]
                            truncate
                            text-xs
                            font-semibold
                            text-slate-800
                        "
                    >
                        {data.area}
                    </span>

                </div>

            </div>

        </div>
    );
}


// ============================================================
// YEAR TOOLTIP
// ============================================================

function YearTooltip({
    active,
    payload,
    text,
}: {
    active?: boolean;

    payload?: Array<{
        value?: number;
        payload?: YearPerformance;
    }>;

    text: typeof translations.en;
}) {

    if (
        !active ||
        !payload ||
        payload.length === 0
    ) {
        return null;
    }

    const data =
        payload[0]?.payload;

    if (!data) {
        return null;
    }

    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-2xl
            "
        >

            <p
                className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {text.year} {data.year}
            </p>

            <p
                className="
                    mt-2
                    text-lg
                    font-bold
                    text-slate-950
                "
            >
                {formatYield(data.average_yield)}
            </p>

            <p
                className="
                    mt-1
                    text-xs
                    font-medium
                    text-slate-600
                "
            >
                {data.predictions} {text.predictions}
            </p>

        </div>
    );
}


// ============================================================
// INSIGHT TRANSLATION
// ============================================================

function translateInsight(
    insight: Insight,
    text: typeof translations.en,
    analytics: AnalyticsData
): {
    title: string;
    description: string;
} {

    const title =
        insight.title.toLowerCase();

    if (
        title.includes("top performing crop") ||
        title.includes("highest average")
    ) {

        const crop =
            analytics.crop_performance.length > 0
                ? analytics.crop_performance.reduce(
                    (best, item) =>
                        item.average_yield >
                        best.average_yield
                            ? item
                            : best
                )
                : null;

        if (crop) {

            return {
                title: text.topPerformingCrop,

                description:
                    `${crop.crop} ${text.highestAverageYield} ${formatNumber(
                        crop.average_yield
                    )} ${text.tonnes}.`,
            };
        }
    }


    if (
        title.includes("average productivity")
    ) {

        return {
            title: text.averageProductivity,

            description:
                `${text.averageProductivityText} ${formatNumber(
                    analytics.summary.average_yield
                )} ${text.tonnes}.`,
        };
    }


    if (
        title.includes("yield variation") ||
        title.includes("yield difference")
    ) {

        const difference =
            analytics.summary.best_yield -
            analytics.summary.lowest_yield;

        return {
            title: text.yieldVariation,

            description:
                `${text.differenceBetween} ${formatNumber(
                    difference
                )} ${text.tonnes}.`,
        };
    }


    if (
        title.includes("best prediction") ||
        title.includes("highest prediction")
    ) {

        return {
            title: text.bestPrediction,

            description:
                `${text.highestPredictedYield} ${formatNumber(
                    analytics.summary.best_yield
                )} ${text.tonnes}.`,
        };
    }


    if (
        title.includes("crop diversity") ||
        title.includes("different crops")
    ) {

        return {
            title: text.cropDiversity,

            description:
                `${text.differentCrops} ${analytics.summary.total_crops} ${text.differentCropsSuffix}`,
        };
    }


    // Fallback for unknown backend insights.
    // We keep the backend text instead of breaking the UI.
    return {
        title: insight.title,
        description: insight.description,
    };
}


// ============================================================
// PAGE
// ============================================================

export default function AnalyticsPage() {

    // ========================================================
    // GLOBAL LANGUAGE
    // ========================================================

    const {
        language,
    } = useLanguage();


    // ========================================================
    // SELECT TRANSLATION
    // ========================================================

    const text =
        translations[
            language as keyof typeof translations
        ] ||
        translations.en;


    // ========================================================
    // STATE
    // ========================================================

    const [
        analytics,
        setAnalytics,
    ] = useState<AnalyticsData | null>(
        null
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        selectedCrop,
        setSelectedCrop,
    ] = useState("all");


    // ========================================================
    // LOAD ANALYTICS
    // ========================================================

    const loadAnalytics =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setError("");

                    const token =
                        getUserToken();

                    if (!token) {

                        throw new Error(
                            text.loginRequired
                        );

                    }

                    const response =
                        await fetch(
                            `${API_URL}/analytics/overview`,
                            {
                                method: "GET",

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,

                                    "Content-Type":
                                        "application/json",
                                },

                                cache:
                                    "no-store",
                            }
                        );

                    if (!response.ok) {

                        let backendMessage = "";

                        try {

                            const errorData =
                                await response.json();

                            backendMessage =
                                errorData?.detail ||
                                errorData?.message ||
                                errorData?.error ||
                                "";

                        } catch {
                            // Ignore parsing error
                        }


                        if (
                            response.status === 401
                        ) {

                            throw new Error(
                                text.sessionExpired
                            );

                        }


                        if (
                            response.status === 404
                        ) {

                            throw new Error(
                                text.analyticsEndpointMissing
                            );

                        }


                        throw new Error(
                            backendMessage ||
                            `${text.serverError} ${response.status}.`
                        );
                    }


                    const data =
                        await response.json();


                    if (
                        !data ||
                        !data.summary
                    ) {

                        throw new Error(
                            text.invalidAnalyticsResponse
                        );
                    }


                    setAnalytics(data);

                } catch (err) {

                    console.error(
                        "ANALYTICS ERROR:",
                        err
                    );

                    setError(
                        err instanceof Error
                            ? err.message
                            : text.unableToLoadAnalytics
                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                text,
            ]
        );


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(
        () => {

            loadAnalytics();

        },
        [loadAnalytics]
    );


    // ========================================================
    // FILTERED TREND
    // ========================================================

    const filteredTrend =
        useMemo(
            () => {

                if (!analytics) {
                    return [];
                }


                if (
                    selectedCrop === "all"
                ) {

                    return analytics.prediction_trend;

                }


                return analytics.prediction_trend.filter(
                    item =>
                        item.crop === selectedCrop
                );

            },
            [
                analytics,
                selectedCrop,
            ]
        );


    // ========================================================
    // CROP OPTIONS
    // ========================================================

    const cropOptions =
        useMemo(
            () => {

                if (!analytics) {
                    return [];
                }

                return analytics.crop_performance.map(
                    item =>
                        item.crop
                );

            },
            [analytics]
        );


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <main
                className="
                    min-h-screen
                    bg-slate-50
                    px-4
                    py-10
                    md:px-8
                "
            >

                <div
                    className="
                        flex
                        min-h-[70vh]
                        flex-col
                        items-center
                        justify-center
                    "
                >

                    <div
                        className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-emerald-50
                            text-emerald-600
                        "
                    >

                        <Loader2
                            size={34}
                            className="animate-spin"
                        />

                    </div>

                    <p
                        className="
                            mt-5
                            text-sm
                            font-bold
                            text-slate-800
                        "
                    >
                        {text.buildingAnalytics}
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            font-medium
                            text-slate-500
                        "
                    >
                        {text.analysingData}
                    </p>

                </div>

            </main>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (
            <main
                className="
                    min-h-screen
                    bg-slate-50
                    px-4
                    py-10
                    md:px-8
                "
            >

                <div className="mx-auto max-w-3xl">

                    <div
                        className="
                            rounded-3xl
                            border
                            border-red-200
                            bg-red-50
                            p-8
                        "
                    >

                        <div className="flex items-start gap-4">

                            <AlertCircle
                                size={25}
                                className="
                                    mt-1
                                    shrink-0
                                    text-red-600
                                "
                            />

                            <div>

                                <h2
                                    className="
                                        text-xl
                                        font-bold
                                        text-red-950
                                    "
                                >
                                    {text.analyticsUnavailable}
                                </h2>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        font-medium
                                        text-red-800
                                    "
                                >
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        loadAnalytics
                                    }
                                    className="
                                        mt-5
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-red-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-bold
                                        text-white
                                        transition
                                        hover:bg-red-700
                                    "
                                >

                                    <RefreshCw size={16} />

                                    {text.tryAgain}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </main>
        );
    }


    // ========================================================
    // NO ANALYTICS
    // ========================================================

    if (!analytics) {

        return (
            <main
                className="
                    min-h-screen
                    bg-slate-50
                    px-4
                    py-10
                    md:px-8
                "
            >

                <div className="mx-auto max-w-7xl">

                    <EmptyAnalytics
                        text={text}
                    />

                </div>

            </main>
        );
    }


    // ========================================================
    // SUMMARY
    // ========================================================

    const summary =
        analytics.summary;


    // ========================================================
    // SCORE MESSAGE
    // ========================================================

    let scoreMessage =
        text.justGettingStarted;


    if (
        summary.performance_score >= 75
    ) {

        scoreMessage =
            text.lookingStrong;

    } else if (
        summary.performance_score >= 40
    ) {

        scoreMessage =
            text.takingShape;
    }


    // ========================================================
    // MAIN
    // ========================================================

    return (

        <main
            className="
                min-h-screen
                bg-slate-50
                px-4
                py-8
                md:px-8
            "
        >

            <div className="mx-auto max-w-7xl">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-violet-50
                                px-4
                                py-2
                                text-sm
                                font-bold
                                text-violet-800
                            "
                        >

                            <BrainCircuit size={17} />

                            {text.aiAnalytics}

                        </div>

                        <h1
                            className="
                                mt-4
                                text-3xl
                                font-extrabold
                                tracking-tight
                                text-slate-950
                                md:text-4xl
                            "
                        >
                            {text.agriculturalIntelligence}
                        </h1>

                        <p
                            className="
                                mt-2
                                max-w-2xl
                                text-sm
                                font-medium
                                leading-6
                                text-slate-600
                                md:text-base
                            "
                        >
                            {text.agriculturalIntelligenceDescription}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            loadAnalytics
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-emerald-600
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-emerald-700
                        "
                    >

                        <RefreshCw size={17} />

                        {text.refreshAnalytics}

                    </button>

                </div>


                {/* ==================================================
                    SCORE
                ================================================== */}

                <section
                    className="
                        mb-8
                        overflow-hidden
                        rounded-3xl
                        bg-slate-900
                        p-6
                        text-white
                        shadow-lg
                        md:p-8
                    "
                >

                    <div
                        className="
                            grid
                            gap-8
                            lg:grid-cols-[1fr_auto]
                            lg:items-center
                        "
                    >

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-emerald-300
                                "
                            >

                                <Target size={19} />

                                <span
                                    className="
                                        text-sm
                                        font-bold
                                    "
                                >
                                    {text.analyticsCoverageScore}
                                </span>

                            </div>


                            <h2
                                className="
                                    mt-3
                                    text-2xl
                                    font-extrabold
                                    text-white
                                    md:text-3xl
                                "
                            >
                                {scoreMessage}
                            </h2>


                            <p
                                className="
                                    mt-3
                                    max-w-2xl
                                    text-sm
                                    font-medium
                                    leading-6
                                    text-slate-300
                                "
                            >
                                {text.scoreDescription}
                            </p>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                gap-5
                            "
                        >

                            <div
                                className="
                                    relative
                                    flex
                                    h-32
                                    w-32
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-8
                                    border-slate-700
                                "
                            >

                                <div className="text-center">

                                    <p
                                        className="
                                            text-4xl
                                            font-extrabold
                                            text-white
                                        "
                                    >
                                        {summary.performance_score}
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            font-semibold
                                            text-slate-400
                                        "
                                    >
                                        / 100
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    KPI CARDS
                ================================================== */}

                <section
                    className="
                        mb-8
                        grid
                        gap-5
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <StatCard
                        title={text.predictions}
                        value={
                            summary.total_predictions.toLocaleString(
                                "en-IN"
                            )
                        }
                        subtitle={
                            text.currentModelScenarios
                        }
                        icon={
                            <Activity size={23} />
                        }
                        iconClass="
                            bg-blue-50
                            text-blue-700
                        "
                    />


                    <StatCard
                        title={text.averageYield}
                        value={
                            formatYield(
                                summary.average_yield
                            )
                        }
                        subtitle={
                            text.averagePredictedProductivity
                        }
                        icon={
                            <TrendingUp size={23} />
                        }
                        iconClass="
                            bg-emerald-50
                            text-emerald-700
                        "
                    />


                    <StatCard
                        title={text.bestPredictedYield}
                        value={
                            formatYield(
                                summary.best_yield
                            )
                        }
                        subtitle={
                            text.highestCurrentModelPrediction
                        }
                        icon={
                            <Trophy size={23} />
                        }
                        iconClass="
                            bg-amber-50
                            text-amber-700
                        "
                    />


                    <StatCard
                        title={text.lowestPredictedYield}
                        value={
                            formatYield(
                                summary.lowest_yield
                            )
                        }
                        subtitle={
                            text.lowestCurrentModelPrediction
                        }
                        icon={
                            <TrendingDown size={23} />
                        }
                        iconClass="
                            bg-rose-50
                            text-rose-700
                        "
                    />

                </section>


                {/* ==================================================
                    DATA COVERAGE
                ================================================== */}

                <section
                    className="
                        mb-8
                        grid
                        gap-5
                        md:grid-cols-3
                    "
                >

                    <div
                        className="
                            rounded-2xl
                            bg-white
                            p-5
                            shadow-sm
                            ring-1
                            ring-slate-200
                        "
                    >

                        <div className="flex items-center gap-3">

                            <Database
                                size={20}
                                className="text-blue-700"
                            />

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    "
                                >
                                    {text.farmsTracked}
                                </p>

                                <p
                                    className="
                                        text-xl
                                        font-extrabold
                                        text-slate-950
                                    "
                                >
                                    {summary.total_farms}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div
                        className="
                            rounded-2xl
                            bg-white
                            p-5
                            shadow-sm
                            ring-1
                            ring-slate-200
                        "
                    >

                        <div className="flex items-center gap-3">

                            <Sprout
                                size={20}
                                className="text-emerald-700"
                            />

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    "
                                >
                                    {text.cropsTracked}
                                </p>

                                <p
                                    className="
                                        text-xl
                                        font-extrabold
                                        text-slate-950
                                    "
                                >
                                    {summary.total_crops}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div
                        className="
                            rounded-2xl
                            bg-white
                            p-5
                            shadow-sm
                            ring-1
                            ring-slate-200
                        "
                    >

                        <div className="flex items-center gap-3">

                            <Leaf
                                size={20}
                                className="text-lime-700"
                            />

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    "
                                >
                                    {text.cropScenarios}
                                </p>

                                <p
                                    className="
                                        text-xl
                                        font-extrabold
                                        text-slate-950
                                    "
                                >
                                    {
                                        analytics.prediction_trend.length
                                    }
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    NO PREDICTIONS
                ================================================== */}

                {
                    summary.total_predictions === 0 ? (

                        <EmptyAnalytics
                            text={text}
                        />

                    ) : (

                        <>


                            {/* ==================================================
                                PREDICTION + CROP
                            ================================================== */}

                            <section
                                className="
                                    mb-8
                                    grid
                                    gap-6
                                    xl:grid-cols-[1.6fr_1fr]
                                "
                            >


                                {/* ==================================================
                                    PREDICTION CHART
                                ================================================== */}

                                <div
                                    className="
                                        rounded-3xl
                                        bg-white
                                        p-6
                                        shadow-sm
                                        ring-1
                                        ring-slate-200
                                        md:p-8
                                    "
                                >

                                    <div
                                        className="
                                            mb-6
                                            flex
                                            flex-col
                                            gap-4
                                            md:flex-row
                                            md:items-start
                                            md:justify-between
                                        "
                                    >

                                        <SectionHeader
                                            icon={
                                                <BarChart3
                                                    size={21}
                                                />
                                            }
                                            title={
                                                text.predictionYieldComparison
                                            }
                                            description={
                                                text.predictionYieldDescription
                                            }
                                        />


                                        {
                                            cropOptions.length > 0 && (

                                                <div className="relative shrink-0">

                                                    <select
                                                        value={
                                                            selectedCrop
                                                        }
                                                        onChange={
                                                            event =>
                                                                setSelectedCrop(
                                                                    event.target.value
                                                                )
                                                        }
                                                        className="
                                                            appearance-none
                                                            rounded-xl
                                                            border
                                                            border-slate-300
                                                            bg-white
                                                            py-2.5
                                                            pl-4
                                                            pr-10
                                                            text-sm
                                                            font-semibold
                                                            text-slate-800
                                                            shadow-sm
                                                            outline-none
                                                            transition
                                                            focus:border-emerald-500
                                                            focus:ring-2
                                                            focus:ring-emerald-100
                                                        "
                                                    >

                                                        <option value="all">
                                                            {text.allCrops}
                                                        </option>

                                                        {
                                                            cropOptions.map(
                                                                crop => (

                                                                    <option
                                                                        key={crop}
                                                                        value={crop}
                                                                    >
                                                                        {crop}
                                                                    </option>

                                                                )
                                                            )
                                                        }

                                                    </select>


                                                    <ChevronDown
                                                        size={16}
                                                        className="
                                                            pointer-events-none
                                                            absolute
                                                            right-3
                                                            top-1/2
                                                            -translate-y-1/2
                                                            text-slate-500
                                                        "
                                                    />

                                                </div>

                                            )
                                        }

                                    </div>


                                    <div className="h-[400px] w-full">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={
                                                    filteredTrend
                                                }
                                                margin={{
                                                    top: 30,
                                                    right: 25,
                                                    left: 10,
                                                    bottom: 80,
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                />


                                                <XAxis
                                                    dataKey="label"
                                                    interval={0}
                                                    angle={-35}
                                                    textAnchor="end"
                                                    height={90}
                                                    tick={{
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                    }}
                                                    tickLine={false}
                                                />


                                                <YAxis
                                                    tick={{
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                    }}
                                                    tickLine={false}
                                                    tickFormatter={
                                                        value =>
                                                            `${value} t`
                                                    }
                                                    label={{
                                                        value:
                                                            text.predictedYieldAxis,
                                                        angle:
                                                            -90,
                                                        position:
                                                            "insideLeft",
                                                        fontSize:
                                                            12,
                                                    }}
                                                />


                                                <Tooltip
                                                    content={
                                                        <PredictionBarTooltip
                                                            text={text}
                                                        />
                                                    }
                                                />


                                                <Bar
                                                    dataKey="yield"
                                                    fill="#10b981"
                                                    radius={[
                                                        8,
                                                        8,
                                                        0,
                                                        0,
                                                    ]}
                                                    barSize={42}
                                                >

                                                    <LabelList
                                                        dataKey="yield"
                                                        position="top"
                                                        formatter={
                                                            value =>
                                                                `${formatNumber(
                                                                    Number(
                                                                        value
                                                                    ),
                                                                    2
                                                                )} t`
                                                        }
                                                        fontSize={10}
                                                        fontWeight={700}
                                                    />

                                                </Bar>

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>


                                    <div
                                        className="
                                            mt-2
                                            rounded-xl
                                            bg-slate-100
                                            p-3
                                            text-center
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                text-slate-600
                                            "
                                        >
                                            {text.eachBarDescription}
                                        </p>

                                    </div>

                                </div>


                                {/* ==================================================
                                    CROP PERFORMANCE
                                ================================================== */}

                                <div
                                    className="
                                        rounded-3xl
                                        bg-white
                                        p-6
                                        shadow-sm
                                        ring-1
                                        ring-slate-200
                                        md:p-8
                                    "
                                >

                                    <SectionHeader
                                        icon={
                                            <Wheat size={21} />
                                        }
                                        title={
                                            text.cropPerformance
                                        }
                                        description={
                                            text.cropPerformanceDescription
                                        }
                                    />


                                    <div className="h-[400px] w-full">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={
                                                    analytics.crop_performance
                                                }
                                                layout="vertical"
                                                margin={{
                                                    top: 5,
                                                    right: 45,
                                                    left: 5,
                                                    bottom: 5,
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                />


                                                <XAxis
                                                    type="number"
                                                    tick={{
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                    }}
                                                    tickLine={false}
                                                    tickFormatter={
                                                        value =>
                                                            `${value} t`
                                                    }
                                                />


                                                <YAxis
                                                    type="category"
                                                    dataKey="crop"
                                                    width={90}
                                                    tick={{
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                    }}
                                                    tickLine={false}
                                                />


                                                <Tooltip
                                                    formatter={
                                                        value => [
                                                            `${formatNumber(
                                                                Number(
                                                                    value
                                                                )
                                                            )} t/ha`,
                                                            text.averageYieldTooltip,
                                                        ]
                                                    }
                                                />


                                                <Bar
                                                    dataKey="average_yield"
                                                    fill="#10b981"
                                                    radius={[
                                                        0,
                                                        8,
                                                        8,
                                                        0,
                                                    ]}
                                                    barSize={30}
                                                >

                                                    <LabelList
                                                        dataKey="average_yield"
                                                        position="right"
                                                        formatter={
                                                            value =>
                                                                `${formatNumber(
                                                                    Number(
                                                                        value
                                                                    )
                                                                )} t`
                                                        }
                                                        fontSize={11}
                                                        fontWeight={700}
                                                    />

                                                </Bar>

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>

                                </div>

                            </section>


                            {/* ==================================================
                                YEAR + AREA
                            ================================================== */}

                            <section
                                className="
                                    mb-8
                                    grid
                                    gap-6
                                    xl:grid-cols-2
                                "
                            >


                                {/* ==================================================
                                    YEAR
                                ================================================== */}

                                <div
                                    className="
                                        rounded-3xl
                                        bg-white
                                        p-6
                                        shadow-sm
                                        ring-1
                                        ring-slate-200
                                        md:p-8
                                    "
                                >

                                    <SectionHeader
                                        icon={
                                            <BarChart3
                                                size={21}
                                            />
                                        }
                                        title={
                                            text.yearWisePerformance
                                        }
                                        description={
                                            text.yearWiseDescription
                                        }
                                    />


                                    <div className="h-[320px]">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={
                                                    analytics.year_performance
                                                }
                                                margin={{
                                                    top: 20,
                                                    right: 20,
                                                    left: 10,
                                                    bottom: 20,
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                />


                                                <XAxis
                                                    dataKey="year"
                                                    tick={{
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                    }}
                                                    tickLine={false}
                                                />


                                                <YAxis
                                                    tick={{
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                    }}
                                                    tickLine={false}
                                                    tickFormatter={
                                                        value =>
                                                            `${value} t`
                                                    }
                                                />


                                                <Tooltip
                                                    content={
                                                        <YearTooltip
                                                            text={text}
                                                        />
                                                    }
                                                />


                                                <Bar
                                                    dataKey="average_yield"
                                                    fill="#6366f1"
                                                    radius={[
                                                        8,
                                                        8,
                                                        0,
                                                        0,
                                                    ]}
                                                    barSize={38}
                                                >

                                                    <LabelList
                                                        dataKey="average_yield"
                                                        position="top"
                                                        formatter={
                                                            value =>
                                                                `${formatNumber(
                                                                    Number(
                                                                        value
                                                                    )
                                                                )} t`
                                                        }
                                                        fontSize={11}
                                                        fontWeight={700}
                                                    />

                                                </Bar>

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>


                                    <p
                                        className="
                                            mt-2
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-slate-500
                                        "
                                    >
                                        {text.tonnesPerHectare}
                                    </p>

                                </div>


                                {/* ==================================================
                                    AREA
                                ================================================== */}

                                <div
                                    className="
                                        rounded-3xl
                                        bg-white
                                        p-6
                                        shadow-sm
                                        ring-1
                                        ring-slate-200
                                        md:p-8
                                    "
                                >

                                    <SectionHeader
                                        icon={
                                            <MapPinIcon />
                                        }
                                        title={
                                            text.areaPerformance
                                        }
                                        description={
                                            text.areaPerformanceDescription
                                        }
                                    />


                                    <div className="space-y-5">

                                        {
                                            analytics.area_performance
                                                .slice(0, 6)
                                                .map(
                                                    (
                                                        item,
                                                        index
                                                    ) => {

                                                        const max =
                                                            Math.max(
                                                                ...analytics
                                                                    .area_performance
                                                                    .map(
                                                                        area =>
                                                                            area.average_yield
                                                                    ),
                                                                1
                                                            );


                                                        const percentage =
                                                            Math.min(
                                                                100,
                                                                Math.max(
                                                                    5,
                                                                    (
                                                                        item.average_yield /
                                                                        max
                                                                    ) *
                                                                    100
                                                                )
                                                            );


                                                        return (

                                                            <div
                                                                key={
                                                                    `${item.area}-${index}`
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

                                                                    <span
                                                                        className="
                                                                            truncate
                                                                            pr-3
                                                                            text-sm
                                                                            font-bold
                                                                            text-slate-800
                                                                        "
                                                                    >
                                                                        {
                                                                            item.area
                                                                        }
                                                                    </span>


                                                                    <span
                                                                        className="
                                                                            shrink-0
                                                                            text-sm
                                                                            font-extrabold
                                                                            text-emerald-700
                                                                        "
                                                                    >
                                                                        {
                                                                            formatYield(
                                                                                item.average_yield
                                                                            )
                                                                        }
                                                                    </span>

                                                                </div>


                                                                <div
                                                                    className="
                                                                        h-3
                                                                        overflow-hidden
                                                                        rounded-full
                                                                        bg-slate-200
                                                                    "
                                                                >

                                                                    <div
                                                                        className="
                                                                            h-full
                                                                            rounded-full
                                                                            bg-emerald-500
                                                                            transition-all
                                                                        "
                                                                        style={{
                                                                            width:
                                                                                `${percentage}%`,
                                                                        }}
                                                                    />

                                                                </div>


                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-xs
                                                                        font-medium
                                                                        text-slate-500
                                                                    "
                                                                >

                                                                    {
                                                                        item.predictions
                                                                    }

                                                                    {" "}

                                                                    {
                                                                        item.predictions ===
                                                                        1
                                                                            ? text.prediction
                                                                            : text.predictionsPlural
                                                                    }

                                                                </p>

                                                            </div>

                                                        );
                                                    }
                                                )
                                        }


                                        {
                                            analytics.area_performance.length ===
                                            0 && (

                                                <div
                                                    className="
                                                        rounded-2xl
                                                        bg-slate-100
                                                        p-6
                                                        text-center
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-slate-600
                                                        "
                                                    >
                                                        {text.noAreaData}
                                                    </p>

                                                </div>

                                            )
                                        }

                                    </div>

                                </div>

                            </section>


                            {/* ==================================================
                                INTELLIGENT INSIGHTS
                            ================================================== */}

                            <section
                                className="
                                    mb-8
                                    rounded-3xl
                                    bg-white
                                    p-6
                                    shadow-sm
                                    ring-1
                                    ring-slate-200
                                    md:p-8
                                "
                            >

                                <SectionHeader
                                    icon={
                                        <BrainCircuit
                                            size={21}
                                        />
                                    }
                                    title={
                                        text.intelligentInsights
                                    }
                                    description={
                                        text.intelligentInsightsDescription
                                    }
                                />


                                <div className="grid gap-4 md:grid-cols-2">

                                    {
                                        analytics.insights.length === 0 ? (

                                            <div
                                                className="
                                                    rounded-2xl
                                                    bg-slate-100
                                                    p-5
                                                    text-sm
                                                    font-semibold
                                                    text-slate-600
                                                "
                                            >
                                                {text.noInsights}
                                            </div>

                                        ) : (

                                            analytics.insights.map(
                                                (
                                                    insight,
                                                    index
                                                ) => {

                                                    const success =
                                                        insight.type ===
                                                        "success";

                                                    const warning =
                                                        insight.type ===
                                                        "warning";


                                                    const translated =
                                                        translateInsight(
                                                            insight,
                                                            text,
                                                            analytics
                                                        );


                                                    return (

                                                        <div
                                                            key={
                                                                `${insight.title}-${index}`
                                                            }
                                                            className={`
                                                                rounded-2xl
                                                                border
                                                                p-5
                                                                ${
                                                                    success
                                                                        ? "border-emerald-200 bg-emerald-50"
                                                                        : warning
                                                                            ? "border-amber-200 bg-amber-50"
                                                                            : "border-blue-200 bg-blue-50"
                                                                }
                                                            `}
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-start
                                                                    gap-3
                                                                "
                                                            >

                                                                <div className="mt-0.5">

                                                                    {
                                                                        success ? (

                                                                            <CheckCircle2
                                                                                size={20}
                                                                                className="
                                                                                    text-emerald-700
                                                                                "
                                                                            />

                                                                        ) : warning ? (

                                                                            <AlertCircle
                                                                                size={20}
                                                                                className="
                                                                                    text-amber-700
                                                                                "
                                                                            />

                                                                        ) : (

                                                                            <Activity
                                                                                size={20}
                                                                                className="
                                                                                    text-blue-700
                                                                                "
                                                                            />

                                                                        )
                                                                    }

                                                                </div>


                                                                <div>

                                                                    <h3
                                                                        className="
                                                                            font-extrabold
                                                                            text-slate-950
                                                                        "
                                                                    >
                                                                        {
                                                                            translated.title
                                                                        }
                                                                    </h3>


                                                                    <p
                                                                        className="
                                                                            mt-2
                                                                            text-sm
                                                                            font-medium
                                                                            leading-6
                                                                            text-slate-700
                                                                        "
                                                                    >
                                                                        {
                                                                            translated.description
                                                                        }
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    );
                                                }
                                            )

                                        )
                                    }

                                </div>

                            </section>


                            {/* ==================================================
                                RECENT PREDICTIONS
                            ================================================== */}

                            <section
                                className="
                                    mb-8
                                    rounded-3xl
                                    bg-white
                                    p-6
                                    shadow-sm
                                    ring-1
                                    ring-slate-200
                                    md:p-8
                                "
                            >

                                <SectionHeader
                                    icon={
                                        <Activity
                                            size={21}
                                        />
                                    }
                                    title={
                                        text.recentPredictionActivity
                                    }
                                    description={
                                        text.recentPredictionDescription
                                    }
                                />


                                <div className="overflow-x-auto">

                                    <table
                                        className="
                                            w-full
                                            min-w-[700px]
                                        "
                                    >

                                        <thead>

                                            <tr
                                                className="
                                                    border-b
                                                    border-slate-200
                                                    text-left
                                                "
                                            >

                                                <th
                                                    className="
                                                        pb-4
                                                        text-xs
                                                        font-extrabold
                                                        uppercase
                                                        tracking-wide
                                                        text-slate-600
                                                    "
                                                >
                                                    {text.crop}
                                                </th>


                                                <th
                                                    className="
                                                        pb-4
                                                        text-xs
                                                        font-extrabold
                                                        uppercase
                                                        tracking-wide
                                                        text-slate-600
                                                    "
                                                >
                                                    {text.area}
                                                </th>


                                                <th
                                                    className="
                                                        pb-4
                                                        text-xs
                                                        font-extrabold
                                                        uppercase
                                                        tracking-wide
                                                        text-slate-600
                                                    "
                                                >
                                                    {text.year}
                                                </th>


                                                <th
                                                    className="
                                                        pb-4
                                                        text-xs
                                                        font-extrabold
                                                        uppercase
                                                        tracking-wide
                                                        text-slate-600
                                                    "
                                                >
                                                    {text.predictedYieldColumn}
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {
                                                analytics.recent_predictions.map(
                                                    prediction => (

                                                        <tr
                                                            key={
                                                                prediction.id
                                                            }
                                                            className="
                                                                border-b
                                                                border-slate-100
                                                                last:border-0
                                                            "
                                                        >

                                                            <td className="py-4">

                                                                <div className="flex items-center gap-3">

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            h-9
                                                                            w-9
                                                                            items-center
                                                                            justify-center
                                                                            rounded-xl
                                                                            bg-emerald-50
                                                                            text-emerald-700
                                                                        "
                                                                    >

                                                                        <Sprout
                                                                            size={17}
                                                                        />

                                                                    </div>


                                                                    <span
                                                                        className="
                                                                            text-sm
                                                                            font-bold
                                                                            text-slate-900
                                                                        "
                                                                    >
                                                                        {
                                                                            prediction.crop
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </td>


                                                            <td
                                                                className="
                                                                    py-4
                                                                    text-sm
                                                                    font-medium
                                                                    text-slate-700
                                                                "
                                                            >
                                                                {
                                                                    prediction.area
                                                                }
                                                            </td>


                                                            <td
                                                                className="
                                                                    py-4
                                                                    text-sm
                                                                    font-medium
                                                                    text-slate-700
                                                                "
                                                            >
                                                                {
                                                                    prediction.year ??
                                                                    "—"
                                                                }
                                                            </td>


                                                            <td className="py-4">

                                                                <span
                                                                    className="
                                                                        rounded-full
                                                                        bg-emerald-50
                                                                        px-3
                                                                        py-1.5
                                                                        text-sm
                                                                        font-extrabold
                                                                        text-emerald-800
                                                                    "
                                                                >
                                                                    {
                                                                        formatYield(
                                                                            prediction.yield
                                                                        )
                                                                    }
                                                                </span>

                                                            </td>

                                                        </tr>

                                                    )
                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>

                            </section>


                            {/* ==================================================
                                FOOTER NOTE
                            ================================================== */}

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

                                <div className="flex items-start gap-3">

                                    <AlertCircle
                                        size={18}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-slate-500
                                        "
                                    />

                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            leading-5
                                            text-slate-600
                                        "
                                    >
                                        {text.footerNote}
                                    </p>

                                </div>

                            </div>

                        </>

                    )
                }

            </div>

        </main>
    );
}


// ============================================================
// MAP PIN ICON
// ============================================================

function MapPinIcon() {

    return (

        <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <path
                d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"
            />

            <circle
                cx="12"
                cy="10"
                r="3"
            />

        </svg>
    );
}