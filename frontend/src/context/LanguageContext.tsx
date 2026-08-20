"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";


// ============================================================
// LANGUAGE TYPE
// ============================================================

export type Language =
    | "en"
    | "te"
    | "hi";


// ============================================================
// TRANSLATION DICTIONARY
// ============================================================

export type TranslationDictionary = {

    // ========================================================
    // COMMON
    // ========================================================

    cropYieldAI: string;
    intelligentAgriculture: string;

    dashboard: string;
    yieldPrediction: string;
    weather: string;
    soilAnalysis: string;
    analytics: string;
    agriculturalist: string;
    myChats: string;
    profile: string;

    myAccount: string;

    aiOnline: string;
    notifications: string;

    mainMenu: string;
    signOut: string;
    logoutConfirmation: string;


    // ========================================================
    // DASHBOARD
    // ========================================================

    aiAgricultureSystem: string;
    operational: string;

    intelligentAgricultureBetterDecisions: string;
    dashboardDescription: string;

    aiPrediction: string;
    smartAnalytics: string;
    environmentalInsights: string;

    overview: string;
    yourFarmIntelligence: string;
    realTimeFarmSnapshot: string;
    systemOperational: string;

    totalFarms: string;
    totalCrops: string;
    aiPredictions: string;
    modelAccuracy: string;

    registeredFarmingLocations: string;
    cropsCurrentlyTracked: string;
    yieldForecastsGenerated: string;
    currentPredictionPerformance: string;


    // ========================================================
    // QUICK ACTIONS
    // ========================================================

    quickActions: string;
    whatWouldYouLikeToDo: string;
    manageFarmIntelligence: string;

    addFarm: string;
    addFarmDescription: string;

    addCrop: string;
    addCropDescription: string;

    predictYield: string;
    predictYieldDescription: string;

    checkWeather: string;
    checkWeatherDescription: string;

    analyzeSoil: string;
    analyzeSoilDescription: string;

    viewAnalytics: string;
    viewAnalyticsDescription: string;


    // ========================================================
    // AI INTELLIGENCE
    // ========================================================

    aiIntelligence: string;
    predictYourNextHarvest: string;
    aiWorkspaceDescription: string;

    aiPoweredYieldEstimation: string;
    agriculturalDataAnalysis: string;
    fastPredictionResults: string;

    enterFarmConditions: string;


    // ========================================================
    // PREDICTION FORM
    // ========================================================

    predictionWorkspace: string;
    predictionWorkspaceDescription: string;

    farm: string;
    selectFarm: string;
    selectFarmDescription: string;

    crop: string;
    selectCrop: string;
    selectCropDescription: string;

    area: string;
    areaDescription: string;
    areaUnit: string;

    year: string;
    yearDescription: string;

    rainfall: string;
    rainfallDescription: string;
    rainfallUnit: string;

    pesticides: string;
    pesticidesDescription: string;
    pesticidesUnit: string;

    temperature: string;
    temperatureDescription: string;
    temperatureUnit: string;

    enterPredictionData: string;

    predictNow: string;
    predicting: string;
    clearForm: string;
    resetForm: string;

    predictionResult: string;
    predictedYield: string;
    estimatedYield: string;

    predictionSuccess: string;
    predictionFailed: string;

    predictionRequiredFields: string;
    noPredictionYet: string;


    // ========================================================
    // ACTIVITY
    // ========================================================

    activity: string;
    recentPredictions: string;


    // ========================================================
    // ANALYTICS
    // ========================================================

    analyticsTitle: string;
    analyticsDescription: string;

    predictionAnalytics: string;
    predictionAnalyticsDescription: string;

    totalPredictions: string;
    averageYield: string;
    highestYield: string;
    lowestYield: string;

    yieldTrend: string;
    predictionTrend: string;

    cropPerformance: string;
    farmPerformance: string;

    predictionsOverview: string;
    yieldOverview: string;

    noAnalyticsData: string;
    noPredictionData: string;

    recentPredictionActivity: string;
    predictionCount: string;

    averagePrediction: string;
    maximumPrediction: string;
    minimumPrediction: string;

    cropDistribution: string;
    yieldDistribution: string;

    performanceInsights: string;
    performanceInsightsDescription: string;

    yearlyPerformance: string;
    monthlyPerformance: string;

    allCrops: string;
    allFarms: string;
    allYears: string;

    selectCropFilter: string;
    selectFarmFilter: string;
    selectYearFilter: string;

    clearFilters: string;
    applyFilters: string;

    loadingAnalytics: string;
    analyticsError: string;
    retry: string;


    // ========================================================
    // FARM INTELLIGENCE
    // ========================================================

    farmIntelligence: string;
    yourDataYourAdvantage: string;

    farmIntelligenceDescription: string;

    farmsTracked: string;
    cropsTracked: string;

    predictSmarter: string;


    // ========================================================
    // LANDING PAGE
    // ========================================================

    aiPoweredAgriculturalIntelligence: string;

    predictBetter: string;
    growSmarter: string;

    landingDescription: string;

    startPredicting: string;
    openDashboard: string;
    explorePlatform: string;

    features: string;
    howItWorks: string;
    about: string;

    aiPoweredPredictions: string;
    dataDrivenInsights: string;
    smarterFarming: string;

    builtForSmarterAgriculture: string;
    everythingYouNeed: string;
    featuresDescription: string;

    aiYieldPrediction: string;
    aiYieldPredictionDescription: string;

    farmManagement: string;
    farmManagementDescription: string;

    agriculturalAnalytics: string;
    agriculturalAnalyticsDescription: string;

    weatherIntelligence: string;
    weatherIntelligenceDescription: string;

    soilInsights: string;
    soilInsightsDescription: string;

    predictionHistory: string;
    predictionHistoryDescription: string;

    simpleWorkflow: string;
    fromDataToDecision: string;
    workflowDescription: string;

    addYourFarm: string;
    addYourFarmDescription: string;

    enterCropData: string;
    enterCropDataDescription: string;

    getYourPrediction: string;
    getYourPredictionDescription: string;

    futureOfFarming: string;
    confidenceDecision: string;
    aboutDescription: string;

    getStartedWithYieldSenseAI: string;

    intelligentAgricultureSmarterDecisions: string;

    allRightsReserved: string;

    footerCopyright: string;
    footerTagline: string;
};


// ============================================================
// TRANSLATIONS
// ============================================================

const translations: Record<
    Language,
    TranslationDictionary
> = {

    // ========================================================
    // ENGLISH
    // ========================================================

    en: {

        // ====================================================
        // COMMON
        // ====================================================

        cropYieldAI:
            "Crop Yield Prediction AI",

        intelligentAgriculture:
            "Intelligent Agriculture",

        dashboard:
            "Dashboard",

        yieldPrediction:
            "Yield Prediction",

        weather:
            "Weather",

        soilAnalysis:
            "Soil Analysis",

        analytics:
            "Analytics",

        agriculturalist:
            "Agriculturalist",

        myChats:
            "My Chats",

        profile:
            "Profile",

        myAccount:
            "My Account",

        aiOnline:
            "AI Online",

        notifications:
            "Notifications",

        mainMenu:
            "Main Menu",

        signOut:
            "Sign Out",

        logoutConfirmation:
            "Do you want to log out?",


        // ====================================================
        // DASHBOARD
        // ====================================================

        aiAgricultureSystem:
            "AI Agriculture System",

        operational:
            "Operational",

        intelligentAgricultureBetterDecisions:
            "Intelligent agriculture. Better decisions.",

        dashboardDescription:
            "Welcome to CROP_YIELD_PREDICTION-AI — your intelligent workspace for crop yield forecasting, agricultural insights, and data-driven decisions.",

        aiPrediction:
            "AI Prediction",

        smartAnalytics:
            "Smart Analytics",

        environmentalInsights:
            "Environmental Insights",

        overview:
            "Overview",

        yourFarmIntelligence:
            "Your farm intelligence",

        realTimeFarmSnapshot:
            "A real-time snapshot of your agricultural activity.",

        systemOperational:
            "System operational",

        totalFarms:
            "Total Farms",

        totalCrops:
            "Total Crops",

        aiPredictions:
            "AI Predictions",

        modelAccuracy:
            "Model Accuracy",

        registeredFarmingLocations:
            "Registered farming locations",

        cropsCurrentlyTracked:
            "Crops currently being tracked",

        yieldForecastsGenerated:
            "Yield forecasts generated",

        currentPredictionPerformance:
            "Current prediction model performance",


        // ====================================================
        // QUICK ACTIONS
        // ====================================================

        quickActions:
            "Quick Actions",

        whatWouldYouLikeToDo:
            "What would you like to do?",

        manageFarmIntelligence:
            "Manage your farm intelligence",

        addFarm:
            "Add Farm",

        addFarmDescription:
            "Register a new farming location and keep your farm information organized.",

        addCrop:
            "Add Crop",

        addCropDescription:
            "Add a crop to one of your registered farms and track its information.",

        predictYield:
            "Predict Yield",

        predictYieldDescription:
            "Use agricultural and environmental data to estimate your expected crop yield.",

        checkWeather:
            "Check Weather",

        checkWeatherDescription:
            "View current and upcoming weather conditions that may affect your crops.",

        analyzeSoil:
            "Analyze Soil",

        analyzeSoilDescription:
            "Review soil information to better understand your growing conditions.",

        viewAnalytics:
            "View Analytics",

        viewAnalyticsDescription:
            "Explore your prediction history and agricultural performance insights.",


        // ====================================================
        // AI INTELLIGENCE
        // ====================================================

        aiIntelligence:
            "AI Intelligence",

        predictYourNextHarvest:
            "Predict your next harvest.",

        aiWorkspaceDescription:
            "Feed the model with your crop, environmental, and agricultural conditions to generate a data-driven yield forecast.",

        aiPoweredYieldEstimation:
            "AI-powered yield estimation",

        agriculturalDataAnalysis:
            "Agricultural data analysis",

        fastPredictionResults:
            "Fast prediction results",

        enterFarmConditions:
            "Enter your farm conditions below.",


        // ====================================================
        // PREDICTION FORM
        // ====================================================

        predictionWorkspace:
            "Yield Prediction",

        predictionWorkspaceDescription:
            "Provide your farm, crop, and environmental conditions to generate an AI-powered yield forecast.",

        farm:
            "Farm",

        selectFarm:
            "Select Farm",

        selectFarmDescription:
            "Choose the farm where the crop is being cultivated.",

        crop:
            "Crop",

        selectCrop:
            "Select Crop",

        selectCropDescription:
            "Choose the crop you want to predict.",

        area:
            "Cultivated Area",

        areaDescription:
            "Enter the total area used for cultivating the selected crop.",

        areaUnit:
            "hectares",

        year:
            "Growing Year",

        yearDescription:
            "Enter the agricultural year for the prediction.",

        rainfall:
            "Annual Rainfall",

        rainfallDescription:
            "Enter the expected or recorded annual rainfall for the farming area.",

        rainfallUnit:
            "mm",

        pesticides:
            "Pesticide Usage",

        pesticidesDescription:
            "Enter the amount of pesticides applied to the crop.",

        pesticidesUnit:
            "tonnes",

        temperature:
            "Average Temperature",

        temperatureDescription:
            "Enter the average temperature during the crop-growing period.",

        temperatureUnit:
            "°C",

        enterPredictionData:
            "Enter Prediction Data",

        predictNow:
            "Predict Yield",

        predicting:
            "Generating Prediction...",

        clearForm:
            "Clear Form",

        resetForm:
            "Reset",

        predictionResult:
            "Prediction Result",

        predictedYield:
            "Predicted Yield",

        estimatedYield:
            "Estimated Yield",

        predictionSuccess:
            "Yield prediction generated successfully.",

        predictionFailed:
            "Unable to generate the yield prediction.",

        predictionRequiredFields:
            "Please complete all required fields before generating a prediction.",

        noPredictionYet:
            "Your prediction result will appear here.",


        // ====================================================
        // ACTIVITY
        // ====================================================

        activity:
            "Activity",

        recentPredictions:
            "Recent Predictions",


        // ====================================================
        // ANALYTICS
        // ====================================================

        analyticsTitle:
            "Analytics",

        analyticsDescription:
            "Analyze your crop predictions, yield performance, and agricultural trends.",

        predictionAnalytics:
            "Prediction Analytics",

        predictionAnalyticsDescription:
            "Explore your prediction history and understand your agricultural performance.",

        totalPredictions:
            "Total Predictions",

        averageYield:
            "Average Yield",

        highestYield:
            "Highest Yield",

        lowestYield:
            "Lowest Yield",

        yieldTrend:
            "Yield Trend",

        predictionTrend:
            "Prediction Trend",

        cropPerformance:
            "Crop Performance",

        farmPerformance:
            "Farm Performance",

        predictionsOverview:
            "Predictions Overview",

        yieldOverview:
            "Yield Overview",

        noAnalyticsData:
            "No analytics data available.",

        noPredictionData:
            "No prediction data available yet.",

        recentPredictionActivity:
            "Recent Prediction Activity",

        predictionCount:
            "Prediction Count",

        averagePrediction:
            "Average Prediction",

        maximumPrediction:
            "Maximum Prediction",

        minimumPrediction:
            "Minimum Prediction",

        cropDistribution:
            "Crop Distribution",

        yieldDistribution:
            "Yield Distribution",

        performanceInsights:
            "Performance Insights",

        performanceInsightsDescription:
            "Review your agricultural performance and identify important yield trends.",

        yearlyPerformance:
            "Yearly Performance",

        monthlyPerformance:
            "Monthly Performance",

        allCrops:
            "All Crops",

        allFarms:
            "All Farms",

        allYears:
            "All Years",

        selectCropFilter:
            "Select Crop",

        selectFarmFilter:
            "Select Farm",

        selectYearFilter:
            "Select Year",

        clearFilters:
            "Clear Filters",

        applyFilters:
            "Apply Filters",

        loadingAnalytics:
            "Loading analytics...",

        analyticsError:
            "Unable to load analytics data.",

        retry:
            "Retry",


        // ====================================================
        // FARM INTELLIGENCE
        // ====================================================

        farmIntelligence:
            "Farm Intelligence",

        yourDataYourAdvantage:
            "Your data. Your advantage.",

        farmIntelligenceDescription:
            "Track your farms, analyze crop performance, monitor conditions, and use AI predictions to make more informed agricultural decisions.",

        farmsTracked:
            "Farms tracked",

        cropsTracked:
            "Crops tracked",

        predictSmarter:
            "Predict smarter",


        // ====================================================
        // LANDING PAGE
        // ====================================================

        aiPoweredAgriculturalIntelligence:
            "AI-POWERED AGRICULTURAL INTELLIGENCE",

        predictBetter:
            "Predict better.",

        growSmarter:
            "Grow smarter.",

        landingDescription:
            "Transform farm, crop, weather, soil, and agricultural data into intelligent yield forecasts that help you make better farming decisions.",

        startPredicting:
            "Start Predicting",

        openDashboard:
            "Open Dashboard",

        explorePlatform:
            "Explore Platform",

        features:
            "Features",

        howItWorks:
            "How It Works",

        about:
            "About",

        aiPoweredPredictions:
            "AI-Powered Predictions",

        dataDrivenInsights:
            "Data-Driven Insights",

        smarterFarming:
            "Smarter Farming",

        builtForSmarterAgriculture:
            "Built for smarter agriculture",

        everythingYouNeed:
            "Everything you need to make better farming decisions.",

        featuresDescription:
            "From farm management and crop tracking to AI-powered yield prediction, weather intelligence, soil insights, and analytics, CROP_YIELD_PREDICTION-AI brings your agricultural information together in one intelligent platform.",

        aiYieldPrediction:
            "AI Yield Prediction",

        aiYieldPredictionDescription:
            "Use farm, crop, and environmental conditions to estimate crop yield before harvest.",

        farmManagement:
            "Farm Management",

        farmManagementDescription:
            "Register farms, organize agricultural information, and keep your farming data structured.",

        agriculturalAnalytics:
            "Agricultural Analytics",

        agriculturalAnalyticsDescription:
            "Turn prediction history and farm information into meaningful agricultural insights.",

        weatherIntelligence:
            "Weather Intelligence",

        weatherIntelligenceDescription:
            "Monitor environmental conditions that can influence crop growth and agricultural performance.",

        soilInsights:
            "Soil Insights",

        soilInsightsDescription:
            "Understand soil-related information and use it as part of your agricultural decision-making process.",

        predictionHistory:
            "Prediction History",

        predictionHistoryDescription:
            "Review previous yield predictions and understand how your agricultural forecasts change over time.",

        simpleWorkflow:
            "Simple Workflow",

        fromDataToDecision:
            "From data to decision.",

        workflowDescription:
            "A simple process that turns your agricultural information into useful AI-powered insights.",

        addYourFarm:
            "Add Your Farm",

        addYourFarmDescription:
            "Create your farm profile and organize the information needed for smarter agricultural decisions.",

        enterCropData:
            "Enter Crop Data",

        enterCropDataDescription:
            "Provide crop, environmental, and agricultural conditions required by the prediction model.",

        getYourPrediction:
            "Get Your Prediction",

        getYourPredictionDescription:
            "Generate an AI-powered yield estimate and use the result to support better farming decisions.",

        futureOfFarming:
            "The future of farming",

        confidenceDecision:
            "Make every agricultural decision with more confidence.",

        aboutDescription:
            "CROP_YIELD_PREDICTION-AI combines agricultural data, machine learning, environmental information, and intuitive analytics to help you understand crop performance before harvest.",

        getStartedWithYieldSenseAI:
            "Get started with CROP_YIELD_PREDICTION-AI",

        intelligentAgricultureSmarterDecisions:
            "Intelligent agriculture. Smarter decisions.",

        allRightsReserved:
            "All rights reserved.",

        footerCopyright:
            "© 2026 CROP_YIELD_PREDICTION-AI",

        footerTagline:
            "Intelligent agriculture. Better decisions.",
    },


    // ========================================================
    // TELUGU
    // ========================================================

    te: {

        // ====================================================
        // COMMON
        // ====================================================

        cropYieldAI:
            "పంట దిగుబడి అంచనా AI",

        intelligentAgriculture:
            "తెలివైన వ్యవసాయం",

        dashboard:
            "డ్యాష్‌బోర్డ్",

        yieldPrediction:
            "దిగుబడి అంచనా",

        weather:
            "వాతావరణం",

        soilAnalysis:
            "నేల విశ్లేషణ",

        analytics:
            "విశ్లేషణలు",

        agriculturalist:
            "వ్యవసాయ నిపుణుడు",

        myChats:
            "నా చాట్‌లు",

        profile:
            "ప్రొఫైల్",

        myAccount:
            "నా ఖాతా",

        aiOnline:
            "AI ఆన్‌లైన్",

        notifications:
            "నోటిఫికేషన్‌లు",

        mainMenu:
            "ప్రధాన మెను",

        signOut:
            "సైన్ అవుట్",

        logoutConfirmation:
            "మీరు సైన్ అవుట్ చేయాలనుకుంటున్నారా?",


        // ====================================================
        // DASHBOARD
        // ====================================================

        aiAgricultureSystem:
            "AI వ్యవసాయ వ్యవస్థ",

        operational:
            "పనిచేస్తోంది",

        intelligentAgricultureBetterDecisions:
            "తెలివైన వ్యవసాయం. మెరుగైన నిర్ణయాలు.",

        dashboardDescription:
            "CROP_YIELD_PREDICTION-AI కి స్వాగతం — పంట దిగుబడి అంచనాలు, వ్యవసాయ సమాచారం మరియు డేటా ఆధారిత నిర్ణయాల కోసం మీ తెలివైన వర్క్‌స్పేస్.",

        aiPrediction:
            "AI అంచనా",

        smartAnalytics:
            "స్మార్ట్ విశ్లేషణలు",

        environmentalInsights:
            "పర్యావరణ సమాచారం",

        overview:
            "అవలోకనం",

        yourFarmIntelligence:
            "మీ వ్యవసాయ సమాచారం",

        realTimeFarmSnapshot:
            "మీ వ్యవసాయ కార్యకలాపాల నిజ-సమయ అవలోకనం.",

        systemOperational:
            "వ్యవస్థ పనిచేస్తోంది",

        totalFarms:
            "మొత్తం పొలాలు",

        totalCrops:
            "మొత్తం పంటలు",

        aiPredictions:
            "AI అంచనాలు",

        modelAccuracy:
            "మోడల్ ఖచ్చితత్వం",

        registeredFarmingLocations:
            "నమోదైన వ్యవసాయ ప్రాంతాలు",

        cropsCurrentlyTracked:
            "ప్రస్తుతం ట్రాక్ చేస్తున్న పంటలు",

        yieldForecastsGenerated:
            "సృష్టించిన దిగుబడి అంచనాలు",

        currentPredictionPerformance:
            "ప్రస్తుత అంచనా మోడల్ పనితీరు",


        // ====================================================
        // QUICK ACTIONS
        // ====================================================

        quickActions:
            "త్వరిత చర్యలు",

        whatWouldYouLikeToDo:
            "మీరు ఏమి చేయాలనుకుంటున్నారు?",

        manageFarmIntelligence:
            "మీ వ్యవసాయ సమాచారాన్ని నిర్వహించండి",

        addFarm:
            "పొలం జోడించండి",

        addFarmDescription:
            "కొత్త వ్యవసాయ ప్రాంతాన్ని నమోదు చేసి మీ పొలం సమాచారాన్ని క్రమబద్ధంగా ఉంచండి.",

        addCrop:
            "పంట జోడించండి",

        addCropDescription:
            "మీ నమోదైన పొలాల్లో ఒకదానికి పంటను జోడించి దాని సమాచారాన్ని ట్రాక్ చేయండి.",

        predictYield:
            "దిగుబడిని అంచనా వేయండి",

        predictYieldDescription:
            "వ్యవసాయ మరియు పర్యావరణ డేటాను ఉపయోగించి పంట దిగుబడిని అంచనా వేయండి.",

        checkWeather:
            "వాతావరణాన్ని చూడండి",

        checkWeatherDescription:
            "మీ పంటలను ప్రభావితం చేసే ప్రస్తుత మరియు రాబోయే వాతావరణ పరిస్థితులను చూడండి.",

        analyzeSoil:
            "నేలను విశ్లేషించండి",

        analyzeSoilDescription:
            "మీ పంట పెరుగుదల పరిస్థితులను అర్థం చేసుకోవడానికి నేల సమాచారాన్ని పరిశీలించండి.",

        viewAnalytics:
            "విశ్లేషణలను చూడండి",

        viewAnalyticsDescription:
            "మీ అంచనా చరిత్ర మరియు వ్యవసాయ పనితీరు సమాచారాన్ని పరిశీలించండి.",


        // ====================================================
        // AI INTELLIGENCE
        // ====================================================

        aiIntelligence:
            "AI మేధస్సు",

        predictYourNextHarvest:
            "మీ తదుపరి పంట దిగుబడిని అంచనా వేయండి.",

        aiWorkspaceDescription:
            "మీ పంట, పర్యావరణ మరియు వ్యవసాయ పరిస్థితులను మోడల్‌కు అందించి డేటా ఆధారిత దిగుబడి అంచానాను పొందండి.",

        aiPoweredYieldEstimation:
            "AI ఆధారిత దిగుబడి అంచనా",

        agriculturalDataAnalysis:
            "వ్యవసాయ డేటా విశ్లేషణ",

        fastPredictionResults:
            "వేగవంతమైన అంచనా ఫలితాలు",

        enterFarmConditions:
            "క్రింద మీ వ్యవసాయ పరిస్థితులను నమోదు చేయండి.",


        // ====================================================
        // PREDICTION FORM
        // ====================================================

        predictionWorkspace:
            "దిగుబడి అంచనా",

        predictionWorkspaceDescription:
            "AI ఆధారిత దిగుబడి అంచనాను రూపొందించడానికి మీ పొలం, పంట మరియు పర్యావరణ పరిస్థితులను నమోదు చేయండి.",

        farm:
            "పొలం",

        selectFarm:
            "పొలాన్ని ఎంచుకోండి",

        selectFarmDescription:
            "పంట సాగు చేస్తున్న పొలాన్ని ఎంచుకోండి.",

        crop:
            "పంట",

        selectCrop:
            "పంటను ఎంచుకోండి",

        selectCropDescription:
            "మీరు అంచనా వేయాలనుకుంటున్న పంటను ఎంచుకోండి.",

        area:
            "సాగు విస్తీర్ణం",

        areaDescription:
            "ఎంచుకున్న పంట సాగు కోసం ఉపయోగించిన మొత్తం విస్తీర్ణాన్ని నమోదు చేయండి.",

        areaUnit:
            "హెక్టార్లు",

        year:
            "సాగు సంవత్సరం",

        yearDescription:
            "అంచనా కోసం వ్యవసాయ సంవత్సరాన్ని నమోదు చేయండి.",

        rainfall:
            "వార్షిక వర్షపాతం",

        rainfallDescription:
            "వ్యవసాయ ప్రాంతానికి సంబంధించిన వార్షిక వర్షపాతాన్ని నమోదు చేయండి.",

        rainfallUnit:
            "మి.మీ",

        pesticides:
            "పురుగుమందుల వినియోగం",

        pesticidesDescription:
            "పంటకు ఉపయోగించిన పురుగుమందుల పరిమాణాన్ని నమోదు చేయండి.",

        pesticidesUnit:
            "టన్నులు",

        temperature:
            "సగటు ఉష్ణోగ్రత",

        temperatureDescription:
            "పంట పెరుగుతున్న కాలంలో సగటు ఉష్ణోగ్రతను నమోదు చేయండి.",

        temperatureUnit:
            "°C",

        enterPredictionData:
            "అంచనా డేటాను నమోదు చేయండి",

        predictNow:
            "దిగుబడిని అంచనా వేయండి",

        predicting:
            "అంచనా రూపొందిస్తోంది...",

        clearForm:
            "ఫారమ్‌ను క్లియర్ చేయండి",

        resetForm:
            "రీసెట్",

        predictionResult:
            "అంచనా ఫలితం",

        predictedYield:
            "అంచనా దిగుబడి",

        estimatedYield:
            "అంచనా వేసిన దిగుబడి",

        predictionSuccess:
            "దిగుబడి అంచనా విజయవంతంగా రూపొందించబడింది.",

        predictionFailed:
            "దిగుబడి అంచనాను రూపొందించడం సాధ్యపడలేదు.",

        predictionRequiredFields:
            "అంచనా రూపొందించే ముందు అవసరమైన అన్ని వివరాలను నమోదు చేయండి.",

        noPredictionYet:
            "మీ అంచనా ఫలితం ఇక్కడ కనిపిస్తుంది.",


        // ====================================================
        // ACTIVITY
        // ====================================================

        activity:
            "కార్యకలాపం",

        recentPredictions:
            "ఇటీవలి అంచనాలు",


        // ====================================================
        // ANALYTICS
        // ====================================================

        analyticsTitle:
            "విశ్లేషణలు",

        analyticsDescription:
            "మీ పంట అంచనాలు, దిగుబడి పనితీరు మరియు వ్యవసాయ ధోరణులను విశ్లేషించండి.",

        predictionAnalytics:
            "అంచనా విశ్లేషణలు",

        predictionAnalyticsDescription:
            "మీ అంచనా చరిత్రను పరిశీలించి వ్యవసాయ పనితీరును అర్థం చేసుకోండి.",

        totalPredictions:
            "మొత్తం అంచనాలు",

        averageYield:
            "సగటు దిగుబడి",

        highestYield:
            "అత్యధిక దిగుబడి",

        lowestYield:
            "అత్యల్ప దిగుబడి",

        yieldTrend:
            "దిగుబడి ధోరణి",

        predictionTrend:
            "అంచనా ధోరణి",

        cropPerformance:
            "పంట పనితీరు",

        farmPerformance:
            "పొలం పనితీరు",

        predictionsOverview:
            "అంచనాల అవలోకనం",

        yieldOverview:
            "దిగుబడి అవలోకనం",

        noAnalyticsData:
            "విశ్లేషణ డేటా అందుబాటులో లేదు.",

        noPredictionData:
            "ఇంకా అంచనా డేటా అందుబాటులో లేదు.",

        recentPredictionActivity:
            "ఇటీవలి అంచనా కార్యకలాపాలు",

        predictionCount:
            "అంచనాల సంఖ్య",

        averagePrediction:
            "సగటు అంచనా",

        maximumPrediction:
            "గరిష్ట అంచనా",

        minimumPrediction:
            "కనిష్ట అంచనా",

        cropDistribution:
            "పంటల పంపిణీ",

        yieldDistribution:
            "దిగుబడి పంపిణీ",

        performanceInsights:
            "పనితీరు సమాచారం",

        performanceInsightsDescription:
            "మీ వ్యవసాయ పనితీరును పరిశీలించి ముఖ్యమైన దిగుబడి ధోరణులను గుర్తించండి.",

        yearlyPerformance:
            "వార్షిక పనితీరు",

        monthlyPerformance:
            "నెలవారీ పనితీరు",

        allCrops:
            "అన్ని పంటలు",

        allFarms:
            "అన్ని పొలాలు",

        allYears:
            "అన్ని సంవత్సరాలు",

        selectCropFilter:
            "పంటను ఎంచుకోండి",

        selectFarmFilter:
            "పొలాన్ని ఎంచుకోండి",

        selectYearFilter:
            "సంవత్సరాన్ని ఎంచుకోండి",

        clearFilters:
            "ఫిల్టర్‌లను క్లియర్ చేయండి",

        applyFilters:
            "ఫిల్టర్‌లను వర్తింపజేయండి",

        loadingAnalytics:
            "విశ్లేషణలను లోడ్ చేస్తోంది...",

        analyticsError:
            "విశ్లేషణ డేటాను లోడ్ చేయడం సాధ్యపడలేదు.",

        retry:
            "మళ్లీ ప్రయత్నించండి",


        // ====================================================
        // FARM INTELLIGENCE
        // ====================================================

        farmIntelligence:
            "వ్యవసాయ మేధస్సు",

        yourDataYourAdvantage:
            "మీ డేటా. మీ ప్రయోజనం.",

        farmIntelligenceDescription:
            "మీ పొలాలను ట్రాక్ చేయండి, పంట పనితీరును విశ్లేషించండి, పరిస్థితులను పర్యవేక్షించండి మరియు మెరుగైన వ్యవసాయ నిర్ణయాల కోసం AI అంచనాలను ఉపయోగించండి.",

        farmsTracked:
            "ట్రాక్ చేస్తున్న పొలాలు",

        cropsTracked:
            "ట్రాక్ చేస్తున్న పంటలు",

        predictSmarter:
            "తెలివిగా అంచనా వేయండి",


        // ====================================================
        // LANDING PAGE
        // ====================================================

        aiPoweredAgriculturalIntelligence:
            "AI ఆధారిత వ్యవసాయ మేధస్సు",

        predictBetter:
            "మెరుగ్గా అంచనా వేయండి.",

        growSmarter:
            "తెలివిగా పండించండి.",

        landingDescription:
            "పొలం, పంట, వాతావరణం, నేల మరియు వ్యవసాయ డేటాను తెలివైన దిగుబడి అంచనాలుగా మార్చి మెరుగైన వ్యవసాయ నిర్ణయాలు తీసుకోవడంలో సహాయపడుతుంది.",

        startPredicting:
            "అంచనా ప్రారంభించండి",

        openDashboard:
            "డ్యాష్‌బోర్డ్ తెరవండి",

        explorePlatform:
            "ప్లాట్‌ఫారమ్‌ను చూడండి",

        features:
            "ఫీచర్లు",

        howItWorks:
            "ఇది ఎలా పనిచేస్తుంది",

        about:
            "మా గురించి",

        aiPoweredPredictions:
            "AI ఆధారిత అంచనాలు",

        dataDrivenInsights:
            "డేటా ఆధారిత సమాచారం",

        smarterFarming:
            "తెలివైన వ్యవసాయం",

        builtForSmarterAgriculture:
            "తెలివైన వ్యవసాయం కోసం రూపొందించబడింది",

        everythingYouNeed:
            "మెరుగైన వ్యవసాయ నిర్ణయాల కోసం అవసరమైన ప్రతిదీ.",

        featuresDescription:
            "వ్యవసాయ నిర్వహణ మరియు పంట ట్రాకింగ్ నుండి AI దిగుబడి అంచనా, వాతావరణ సమాచారం, నేల విశ్లేషణ మరియు విశ్లేషణల వరకు అవసరమైన వ్యవసాయ సమాచారాన్ని ఒకే తెలివైన ప్లాట్‌ఫారమ్‌లో అందిస్తుంది.",

        aiYieldPrediction:
            "AI దిగుబడి అంచనా",

        aiYieldPredictionDescription:
            "పొలం, పంట మరియు పర్యావరణ పరిస్థితులను ఉపయోగించి కోతకు ముందే పంట దిగుబడిని అంచనా వేయండి.",

        farmManagement:
            "వ్యవసాయ నిర్వహణ",

        farmManagementDescription:
            "పొలాలను నమోదు చేసి వ్యవసాయ సమాచారాన్ని క్రమబద్ధంగా నిర్వహించండి.",

        agriculturalAnalytics:
            "వ్యవసాయ విశ్లేషణలు",

        agriculturalAnalyticsDescription:
            "అంచనా చరిత్ర మరియు పొలం సమాచారాన్ని ఉపయోగకరమైన వ్యవసాయ సమాచారంగా మార్చండి.",

        weatherIntelligence:
            "వాతావరణ సమాచారం",

        weatherIntelligenceDescription:
            "పంట పెరుగుదల మరియు వ్యవసాయ పనితీరును ప్రభావితం చేసే పర్యావరణ పరిస్థితులను పర్యవేక్షించండి.",

        soilInsights:
            "నేల సమాచారం",

        soilInsightsDescription:
            "నేల సంబంధిత సమాచారాన్ని అర్థం చేసుకుని వ్యవసాయ నిర్ణయాలలో ఉపయోగించండి.",

        predictionHistory:
            "అంచనా చరిత్ర",

        predictionHistoryDescription:
            "మునుపటి దిగుబడి అంచనాలను పరిశీలించి కాలక్రమేణా మీ అంచనాలు ఎలా మారుతున్నాయో తెలుసుకోండి.",

        simpleWorkflow:
            "సులభమైన విధానం",

        fromDataToDecision:
            "డేటా నుండి నిర్ణయం వరకు.",

        workflowDescription:
            "వ్యవసాయ సమాచారాన్ని ఉపయోగకరమైన AI ఆధారిత సమాచారంగా మార్చే సరళమైన ప్రక్రియ.",

        addYourFarm:
            "మీ పొలాన్ని జోడించండి",

        addYourFarmDescription:
            "మీ పొలం ప్రొఫైల్‌ను సృష్టించి మెరుగైన వ్యవసాయ నిర్ణయాలకు అవసరమైన సమాచారాన్ని నిర్వహించండి.",

        enterCropData:
            "పంట డేటాను నమోదు చేయండి",

        enterCropDataDescription:
            "అంచనా మోడల్‌కు అవసరమైన పంట, పర్యావరణ మరియు వ్యవసాయ పరిస్థితులను నమోదు చేయండి.",

        getYourPrediction:
            "మీ అంచనాను పొందండి",

        getYourPredictionDescription:
            "AI ఆధారిత దిగుబడి అంచనాను రూపొందించి మెరుగైన వ్యవసాయ నిర్ణయాలకు ఉపయోగించండి.",

        futureOfFarming:
            "వ్యవసాయ భవిష్యత్తు",

        confidenceDecision:
            "ప్రతి వ్యవసాయ నిర్ణయాన్ని మరింత నమ్మకంతో తీసుకోండి.",

        aboutDescription:
            "CROP_YIELD_PREDICTION-AI వ్యవసాయ డేటా, మెషిన్ లెర్నింగ్, పర్యావరణ సమాచారం మరియు సులభమైన విశ్లేషణలను కలిపి కోతకు ముందే పంట పనితీరును అర్థం చేసుకోవడంలో సహాయపడుతుంది.",

        getStartedWithYieldSenseAI:
            "CROP_YIELD_PREDICTION-AI తో ప్రారంభించండి",

        intelligentAgricultureSmarterDecisions:
            "తెలివైన వ్యవసాయం. మెరుగైన నిర్ణయాలు.",

        allRightsReserved:
            "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",

        footerCopyright:
            "© 2026 CROP_YIELD_PREDICTION-AI",

        footerTagline:
            "తెలివైన వ్యవసాయం. మెరుగైన నిర్ణయాలు.",
    },


    // ========================================================
    // HINDI
    // ========================================================

    hi: {

        // ====================================================
        // COMMON
        // ====================================================

        cropYieldAI:
            "फसल उपज पूर्वानुमान AI",

        intelligentAgriculture:
            "स्मार्ट कृषि",

        dashboard:
            "डैशबोर्ड",

        yieldPrediction:
            "उपज पूर्वानुमान",

        weather:
            "मौसम",

        soilAnalysis:
            "मृदा विश्लेषण",

        analytics:
            "विश्लेषण",

        agriculturalist:
            "कृषि विशेषज्ञ",

        myChats:
            "मेरी चैट",

        profile:
            "प्रोफ़ाइल",

        myAccount:
            "मेरा खाता",

        aiOnline:
            "AI ऑनलाइन",

        notifications:
            "सूचनाएँ",

        mainMenu:
            "मुख्य मेनू",

        signOut:
            "साइन आउट",

        logoutConfirmation:
            "क्या आप लॉग आउट करना चाहते हैं?",


        // ====================================================
        // DASHBOARD
        // ====================================================

        aiAgricultureSystem:
            "AI कृषि प्रणाली",

        operational:
            "सक्रिय",

        intelligentAgricultureBetterDecisions:
            "स्मार्ट कृषि। बेहतर निर्णय।",

        dashboardDescription:
            "CROP_YIELD_PREDICTION-AI में आपका स्वागत है — फसल उपज पूर्वानुमान, कृषि जानकारी और डेटा आधारित निर्णयों के लिए आपका स्मार्ट कार्यक्षेत्र।",

        aiPrediction:
            "AI पूर्वानुमान",

        smartAnalytics:
            "स्मार्ट विश्लेषण",

        environmentalInsights:
            "पर्यावरणीय जानकारी",

        overview:
            "अवलोकन",

        yourFarmIntelligence:
            "आपकी कृषि जानकारी",

        realTimeFarmSnapshot:
            "आपकी कृषि गतिविधियों का वास्तविक समय का अवलोकन।",

        systemOperational:
            "सिस्टम सक्रिय है",

        totalFarms:
            "कुल खेत",

        totalCrops:
            "कुल फसलें",

        aiPredictions:
            "AI पूर्वानुमान",

        modelAccuracy:
            "मॉडल सटीकता",

        registeredFarmingLocations:
            "पंजीकृत कृषि स्थान",

        cropsCurrentlyTracked:
            "वर्तमान में ट्रैक की जा रही फसलें",

        yieldForecastsGenerated:
            "उत्पन्न उपज पूर्वानुमान",

        currentPredictionPerformance:
            "वर्तमान पूर्वानुमान मॉडल प्रदर्शन",


        // ====================================================
        // QUICK ACTIONS
        // ====================================================

        quickActions:
            "त्वरित कार्य",

        whatWouldYouLikeToDo:
            "आप क्या करना चाहेंगे?",

        manageFarmIntelligence:
            "अपनी कृषि जानकारी प्रबंधित करें",

        addFarm:
            "खेत जोड़ें",

        addFarmDescription:
            "नया कृषि स्थान पंजीकृत करें और अपने खेत की जानकारी व्यवस्थित रखें।",

        addCrop:
            "फसल जोड़ें",

        addCropDescription:
            "अपने पंजीकृत खेत में फसल जोड़ें और उसकी जानकारी ट्रैक करें।",

        predictYield:
            "उपज का पूर्वानुमान लगाएँ",

        predictYieldDescription:
            "कृषि और पर्यावरणीय डेटा का उपयोग करके अपनी फसल की अपेक्षित उपज का अनुमान लगाएँ।",

        checkWeather:
            "मौसम देखें",

        checkWeatherDescription:
            "अपनी फसलों को प्रभावित करने वाली वर्तमान और आगामी मौसम स्थितियों को देखें।",

        analyzeSoil:
            "मिट्टी का विश्लेषण करें",

        analyzeSoilDescription:
            "अपनी फसल की बढ़ती परिस्थितियों को बेहतर समझने के लिए मिट्टी की जानकारी देखें।",

        viewAnalytics:
            "विश्लेषण देखें",

        viewAnalyticsDescription:
            "अपने पूर्वानुमान इतिहास और कृषि प्रदर्शन की जानकारी देखें.",


        // ====================================================
        // AI INTELLIGENCE
        // ====================================================

        aiIntelligence:
            "AI बुद्धिमत्ता",

        predictYourNextHarvest:
            "अपनी अगली फसल की उपज का पूर्वानुमान लगाएँ।",

        aiWorkspaceDescription:
            "अपनी फसल, पर्यावरणीय और कृषि परिस्थितियों को मॉडल में दर्ज करें और डेटा आधारित उपज पूर्वानुमान प्राप्त करें।",

        aiPoweredYieldEstimation:
            "AI आधारित उपज अनुमान",

        agriculturalDataAnalysis:
            "कृषि डेटा विश्लेषण",

        fastPredictionResults:
            "तेज़ पूर्वानुमान परिणाम",

        enterFarmConditions:
            "नीचे अपनी कृषि परिस्थितियाँ दर्ज करें।",


        // ====================================================
        // PREDICTION FORM
        // ====================================================

        predictionWorkspace:
            "उपज पूर्वानुमान",

        predictionWorkspaceDescription:
            "AI आधारित उपज पूर्वानुमान तैयार करने के लिए अपने खेत, फसल और पर्यावरणीय परिस्थितियाँ दर्ज करें।",

        farm:
            "खेत",

        selectFarm:
            "खेत चुनें",

        selectFarmDescription:
            "उस खेत का चयन करें जहाँ फसल उगाई जा रही है।",

        crop:
            "फसल",

        selectCrop:
            "फसल चुनें",

        selectCropDescription:
            "उस फसल का चयन करें जिसका पूर्वानुमान लगाना है।",

        area:
            "खेती का क्षेत्रफल",

        areaDescription:
            "चयनित फसल की खेती के लिए उपयोग किए गए कुल क्षेत्रफल को दर्ज करें।",

        areaUnit:
            "हेक्टेयर",

        year:
            "खेती का वर्ष",

        yearDescription:
            "पूर्वानुमान के लिए कृषि वर्ष दर्ज करें।",

        rainfall:
            "वार्षिक वर्षा",

        rainfallDescription:
            "कृषि क्षेत्र की वार्षिक वर्षा दर्ज करें।",

        rainfallUnit:
            "मिमी",

        pesticides:
            "कीटनाशक उपयोग",

        pesticidesDescription:
            "फसल पर उपयोग किए गए कीटनाशकों की मात्रा दर्ज करें।",

        pesticidesUnit:
            "टन",

        temperature:
            "औसत तापमान",

        temperatureDescription:
            "फसल के बढ़ने की अवधि के दौरान औसत तापमान दर्ज करें।",

        temperatureUnit:
            "°C",

        enterPredictionData:
            "पूर्वानुमान डेटा दर्ज करें",

        predictNow:
            "उपज का पूर्वानुमान लगाएँ",

        predicting:
            "पूर्वानुमान तैयार किया जा रहा है...",

        clearForm:
            "फॉर्म साफ़ करें",

        resetForm:
            "रीसेट",

        predictionResult:
            "पूर्वानुमान परिणाम",

        predictedYield:
            "पूर्वानुमानित उपज",

        estimatedYield:
            "अनुमानित उपज",

        predictionSuccess:
            "उपज पूर्वानुमान सफलतापूर्वक तैयार किया गया।",

        predictionFailed:
            "उपज पूर्वानुमान तैयार नहीं किया जा सका।",

        predictionRequiredFields:
            "पूर्वानुमान तैयार करने से पहले सभी आवश्यक फ़ील्ड भरें।",

        noPredictionYet:
            "आपका पूर्वानुमान परिणाम यहाँ दिखाई देगा।",


        // ====================================================
        // ACTIVITY
        // ====================================================

        activity:
            "गतिविधि",

        recentPredictions:
            "हाल के पूर्वानुमान",


        // ====================================================
        // ANALYTICS
        // ====================================================

        analyticsTitle:
            "विश्लेषण",

        analyticsDescription:
            "अपने फसल पूर्वानुमानों, उपज प्रदर्शन और कृषि रुझानों का विश्लेषण करें।",

        predictionAnalytics:
            "पूर्वानुमान विश्लेषण",

        predictionAnalyticsDescription:
            "अपने पूर्वानुमान इतिहास को देखें और कृषि प्रदर्शन को समझें।",

        totalPredictions:
            "कुल पूर्वानुमान",

        averageYield:
            "औसत उपज",

        highestYield:
            "सबसे अधिक उपज",

        lowestYield:
            "सबसे कम उपज",

        yieldTrend:
            "उपज प्रवृत्ति",

        predictionTrend:
            "पूर्वानुमान प्रवृत्ति",

        cropPerformance:
            "फसल प्रदर्शन",

        farmPerformance:
            "खेत का प्रदर्शन",

        predictionsOverview:
            "पूर्वानुमान अवलोकन",

        yieldOverview:
            "उपज अवलोकन",

        noAnalyticsData:
            "विश्लेषण डेटा उपलब्ध नहीं है।",

        noPredictionData:
            "अभी तक कोई पूर्वानुमान डेटा उपलब्ध नहीं है।",

        recentPredictionActivity:
            "हाल की पूर्वानुमान गतिविधि",

        predictionCount:
            "पूर्वानुमानों की संख्या",

        averagePrediction:
            "औसत पूर्वानुमान",

        maximumPrediction:
            "अधिकतम पूर्वानुमान",

        minimumPrediction:
            "न्यूनतम पूर्वानुमान",

        cropDistribution:
            "फसल वितरण",

        yieldDistribution:
            "उपज वितरण",

        performanceInsights:
            "प्रदर्शन जानकारी",

        performanceInsightsDescription:
            "अपने कृषि प्रदर्शन की समीक्षा करें और महत्वपूर्ण उपज रुझानों की पहचान करें।",

        yearlyPerformance:
            "वार्षिक प्रदर्शन",

        monthlyPerformance:
            "मासिक प्रदर्शन",

        allCrops:
            "सभी फसलें",

        allFarms:
            "सभी खेत",

        allYears:
            "सभी वर्ष",

        selectCropFilter:
            "फसल चुनें",

        selectFarmFilter:
            "खेत चुनें",

        selectYearFilter:
            "वर्ष चुनें",

        clearFilters:
            "फ़िल्टर साफ़ करें",

        applyFilters:
            "फ़िल्टर लागू करें",

        loadingAnalytics:
            "विश्लेषण लोड हो रहा है...",

        analyticsError:
            "विश्लेषण डेटा लोड नहीं किया जा सका।",

        retry:
            "पुनः प्रयास करें",


        // ====================================================
        // FARM INTELLIGENCE
        // ====================================================

        farmIntelligence:
            "कृषि बुद्धिमत्ता",

        yourDataYourAdvantage:
            "आपका डेटा। आपका लाभ।",

        farmIntelligenceDescription:
            "अपने खेतों को ट्रैक करें, फसल प्रदर्शन का विश्लेषण करें, परिस्थितियों की निगरानी करें और बेहतर कृषि निर्णयों के लिए AI पूर्वानुमानों का उपयोग करें।",

        farmsTracked:
            "ट्रैक किए गए खेत",

        cropsTracked:
            "ट्रैक की गई फसलें",

        predictSmarter:
            "स्मार्ट पूर्वानुमान",


        // ====================================================
        // LANDING PAGE
        // ====================================================

        aiPoweredAgriculturalIntelligence:
            "AI आधारित कृषि बुद्धिमत्ता",

        predictBetter:
            "बेहतर पूर्वानुमान लगाएँ।",

        growSmarter:
            "स्मार्ट तरीके से उगाएँ।",

        landingDescription:
            "खेत, फसल, मौसम, मिट्टी और कृषि डेटा को बुद्धिमान उपज पूर्वानुमानों में बदलें और बेहतर कृषि निर्णय लें।",

        startPredicting:
            "पूर्वानुमान शुरू करें",

        openDashboard:
            "डैशबोर्ड खोलें",

        explorePlatform:
            "प्लेटफ़ॉर्म देखें",

        features:
            "विशेषताएँ",

        howItWorks:
            "यह कैसे काम करता है",

        about:
            "हमारे बारे में",

        aiPoweredPredictions:
            "AI आधारित पूर्वानुमान",

        dataDrivenInsights:
            "डेटा आधारित जानकारी",

        smarterFarming:
            "स्मार्ट खेती",

        builtForSmarterAgriculture:
            "स्मार्ट कृषि के लिए बनाया गया",

        everythingYouNeed:
            "बेहतर कृषि निर्णय लेने के लिए आवश्यक सब कुछ।",

        featuresDescription:
            "फार्म प्रबंधन और फसल ट्रैकिंग से लेकर AI उपज पूर्वानुमान, मौसम जानकारी, मृदा विश्लेषण और एनालिटिक्स तक, CROP_YIELD_PREDICTION-AI आवश्यक कृषि जानकारी को एक स्मार्ट प्लेटफ़ॉर्म में लाता है।",

        aiYieldPrediction:
            "AI उपज पूर्वानुमान",

        aiYieldPredictionDescription:
            "खेत, फसल और पर्यावरणीय परिस्थितियों का उपयोग करके कटाई से पहले फसल की उपज का अनुमान लगाएँ।",

        farmManagement:
            "फार्म प्रबंधन",

        farmManagementDescription:
            "खेतों को पंजीकृत करें और अपनी कृषि जानकारी को व्यवस्थित रूप से प्रबंधित करें।",

        agriculturalAnalytics:
            "कृषि विश्लेषण",

        agriculturalAnalyticsDescription:
            "पूर्वानुमान इतिहास और खेत की जानकारी को उपयोगी कृषि जानकारी में बदलें।",

        weatherIntelligence:
            "मौसम संबंधी जानकारी",

        weatherIntelligenceDescription:
            "फसल वृद्धि और कृषि प्रदर्शन को प्रभावित करने वाली पर्यावरणीय परिस्थितियों की निगरानी करें।",

        soilInsights:
            "मृदा जानकारी",

        soilInsightsDescription:
            "मिट्टी से संबंधित जानकारी को समझें और कृषि निर्णयों में उसका उपयोग करें।",

        predictionHistory:
            "पूर्वानुमान इतिहास",

        predictionHistoryDescription:
            "पिछले उपज पूर्वानुमानों की समीक्षा करें और समय के साथ अपने पूर्वानुमानों में होने वाले बदलावों को समझें।",

        simpleWorkflow:
            "सरल प्रक्रिया",

        fromDataToDecision:
            "डेटा से निर्णय तक।",

        workflowDescription:
            "कृषि जानकारी को उपयोगी AI आधारित जानकारी में बदलने की सरल प्रक्रिया।",

        addYourFarm:
            "अपना खेत जोड़ें",

        addYourFarmDescription:
            "अपनी खेत प्रोफ़ाइल बनाएँ और बेहतर कृषि निर्णयों के लिए आवश्यक जानकारी व्यवस्थित रखें।",

        enterCropData:
            "फसल डेटा दर्ज करें",

        enterCropDataDescription:
            "पूर्वानुमान मॉडल के लिए आवश्यक फसल, पर्यावरणीय और कृषि परिस्थितियाँ दर्ज करें।",

        getYourPrediction:
            "अपना पूर्वानुमान प्राप्त करें",

        getYourPredictionDescription:
            "AI आधारित उपज अनुमान तैयार करें और बेहतर कृषि निर्णय लेने में इसका उपयोग करें।",

        futureOfFarming:
            "खेती का भविष्य",

        confidenceDecision:
            "हर कृषि निर्णय अधिक आत्मविश्वास के साथ लें।",

        aboutDescription:
            "CROP_YIELD_PREDICTION-AI कृषि डेटा, मशीन लर्निंग, पर्यावरणीय जानकारी और सहज विश्लेषण को जोड़कर कटाई से पहले फसल प्रदर्शन को समझने में सहायता करता है।",

        getStartedWithYieldSenseAI:
            "CROP_YIELD_PREDICTION-AI के साथ शुरू करें",

        intelligentAgricultureSmarterDecisions:
            "स्मार्ट कृषि। बेहतर निर्णय।",

        allRightsReserved:
            "सर्वाधिकार सुरक्षित।",

        footerCopyright:
            "© 2026 CROP_YIELD_PREDICTION-AI",

        footerTagline:
            "स्मार्ट कृषि। बेहतर निर्णय।",
    },
};


// ============================================================
// CONTEXT TYPE
// ============================================================

interface LanguageContextType {

    language: Language;

    setLanguage: (
        language: Language
    ) => void;

    t: TranslationDictionary;
}


// ============================================================
// CONTEXT
// ============================================================

const LanguageContext =
    createContext<
        LanguageContextType | undefined
    >(undefined);


// ============================================================
// STORAGE KEY
// ============================================================

const LANGUAGE_STORAGE_KEY =
    "app-language";


// ============================================================
// VALIDATE LANGUAGE
// ============================================================

function isValidLanguage(
    value: string | null
): value is Language {

    return (
        value === "en" ||
        value === "te" ||
        value === "hi"
    );
}


// ============================================================
// PROVIDER
// ============================================================

export function LanguageProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    // ========================================================
    // INITIAL LANGUAGE
    // ========================================================

    const [
        language,
        setLanguageState,
    ] = useState<Language>(() => {

        // ----------------------------------------------------
        // SERVER
        // ----------------------------------------------------

        if (
            typeof window === "undefined"
        ) {
            return "en";
        }


        // ----------------------------------------------------
        // BROWSER
        // ----------------------------------------------------

        try {

            const savedLanguage =
                window.localStorage.getItem(
                    LANGUAGE_STORAGE_KEY
                );


            if (
                isValidLanguage(
                    savedLanguage
                )
            ) {

                return savedLanguage;
            }

        } catch (error) {

            console.warn(
                "Unable to read saved language:",
                error
            );
        }


        return "en";
    });


    // ========================================================
    // KEEP HTML LANG ATTRIBUTE UPDATED
    // ========================================================

    useEffect(() => {

        document.documentElement.lang =
            language;

    }, [language]);


    // ========================================================
    // CHANGE LANGUAGE
    // ========================================================

    const setLanguage = (
        newLanguage: Language
    ) => {

        // ----------------------------------------------------
        // SAFETY CHECK
        // ----------------------------------------------------

        if (
            !isValidLanguage(
                newLanguage
            )
        ) {
            return;
        }


        // ----------------------------------------------------
        // UPDATE REACT STATE
        // ----------------------------------------------------

        setLanguageState(
            newLanguage
        );


        // ----------------------------------------------------
        // SAVE LANGUAGE
        // ----------------------------------------------------

        try {

            window.localStorage.setItem(
                LANGUAGE_STORAGE_KEY,
                newLanguage
            );

        } catch (error) {

            console.warn(
                "Unable to save language:",
                error
            );
        }


        // ----------------------------------------------------
        // UPDATE HTML
        // ----------------------------------------------------

        if (
            typeof document !==
            "undefined"
        ) {

            document.documentElement.lang =
                newLanguage;
        }
    };


    // ========================================================
    // CURRENT TRANSLATION
    // ========================================================

    const currentTranslations =
        translations[language];


    // ========================================================
    // CONTEXT VALUE
    // ========================================================

    const value =
        useMemo(
            () => ({

                language,

                setLanguage,

                t:
                    currentTranslations,

            }),
            [
                language,
                currentTranslations,
            ]
        );


    // ========================================================
    // PROVIDER
    // ========================================================

    return (

        <LanguageContext.Provider
            value={value}
        >

            {children}

        </LanguageContext.Provider>
    );
}


// ============================================================
// HOOK
// ============================================================

export function useLanguage() {

    const context =
        useContext(
            LanguageContext
        );


    if (!context) {

        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }


    return context;
}