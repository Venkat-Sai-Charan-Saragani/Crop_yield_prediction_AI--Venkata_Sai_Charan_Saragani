export type Language =
    | "en"
    | "te"
    | "hi"
    | "ta"
    | "kn";

export const languageNames: Record<Language, string> = {
    en: "English",
    te: "తెలుగు",
    hi: "हिन्दी",
    ta: "தமிழ்",
    kn: "ಕನ್ನಡ",
};

export const translations = {

    en: {

        // =====================================================
        // COMMON
        // =====================================================

        dashboard: "Dashboard",
        signIn: "Sign in",
        getStarted: "Get started",
        openDashboard: "Open Dashboard",
        startPredicting: "Start Predicting",
        explorePlatform: "Explore platform",
        features: "Features",
        howItWorks: "How it works",
        about: "About",
        language: "Language",

        // =====================================================
        // HOME
        // =====================================================

        intelligentAgriculture:
            "Intelligent Agriculture",

        aiPoweredAgriculturalIntelligence:
            "AI-POWERED AGRICULTURAL INTELLIGENCE",

        predictBetter:
            "Predict better.",

        growSmarter:
            "Grow smarter.",

        homeDescription:
            "Crop_Yield_Prediction-AI transforms agricultural data into intelligent crop yield predictions, helping agriculturalists make smarter decisions with confidence.",

        aiPoweredPredictions:
            "AI-powered predictions",

        dataDrivenInsights:
            "Data-driven insights",

        smarterFarming:
            "Smarter farming",

        modelAccuracy:
            "Model accuracy",

        intelligentInsights:
            "Intelligent insights",

        decisionSupport:
            "Decision support",

        builtForSmarterAgriculture:
            "Built for smarter agriculture",

        everythingYouNeed:
            "Everything you need to understand your yield.",

        platformDescription:
            "From farm management to AI-powered predictions, YieldSenseAI brings the most important agricultural insights into one intelligent platform.",

        aiYieldPrediction:
            "AI Yield Prediction",

        aiYieldPredictionDescription:
            "Use agricultural and environmental data to estimate crop yield before harvest.",

        farmManagement:
            "Farm Management",

        farmManagementDescription:
            "Keep your farms, crop information and agricultural data organized in one place.",

        agriculturalAnalytics:
            "Agricultural Analytics",

        agriculturalAnalyticsDescription:
            "Turn prediction history and farm data into clear, useful performance insights.",

        weatherIntelligence:
            "Weather Intelligence",

        weatherIntelligenceDescription:
            "Understand environmental conditions that can influence agricultural performance.",

        soilInsights:
            "Soil Insights",

        soilInsightsDescription:
            "Bring soil-related information into your agricultural decision-making workflow.",

        predictionHistory:
            "Prediction History",

        predictionHistoryDescription:
            "Review previous predictions and track how your agricultural decisions evolve.",

        simpleWorkflow:
            "Simple workflow",

        fromDataToDecision:
            "From data to decision.",

        workflowDescription:
            "A straightforward workflow designed to turn agricultural information into useful predictions.",

        addYourFarm:
            "Add your farm",

        addYourFarmDescription:
            "Create your farm profile and keep your agricultural information organized.",

        enterCropData:
            "Enter crop data",

        enterCropDataDescription:
            "Provide crop and environmental information used by the prediction model.",

        getYourPrediction:
            "Get your prediction",

        getYourPredictionDescription:
            "Receive an AI-powered yield estimate and use it to support better decisions.",

        futureOfFarming:
            "The future of farming",

        agriculturalDecision:
            "Make every agricultural decision with more confidence.",

        aboutDescription:
            "Crop_Yield_Prediction-AI combines agricultural data, machine learning and intuitive analytics to help you understand your crops before harvest.",

        getStartedWithYieldSenseAI:
            "Get started with YieldSenseAI",

        intelligentAgricultureSmarterDecisions:
            "Intelligent agriculture. Smarter decisions.",

        allRightsReserved:
            "All rights reserved.",

        // =====================================================
        // DASHBOARD
        // =====================================================

        aiAgricultureSystem:
            "AI Agriculture System",

        operational:
            "Operational",

        intelligentAgricultureBetterDecisions:
            "Intelligent agriculture.",

        betterDecisions:
            "Better decisions.",

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

        realTimeSnapshot:
            "A real-time snapshot of your agricultural activity.",

        systemOperational:
            "System operational",

        totalFarms:
            "Total Farms",

        registeredFarmingLocations:
            "Registered farming locations",

        totalCrops:
            "Total Crops",

        cropsCurrentlyTracked:
            "Crops currently being tracked",

        aiPredictions:
            "AI Predictions",

        yieldForecastsGenerated:
            "Yield forecasts generated",

        currentModelPerformance:
            "Current prediction model performance",

        quickActions:
            "Quick actions",

        whatWouldYouLikeToDo:
            "What would you like to do?",

        manageFarmIntelligence:
            "Manage your farm intelligence",

        aiIntelligence:
            "AI Intelligence",

        predictYourNextHarvest:
            "Predict your next harvest.",

        predictionDescription:
            "Feed the model with your crop, environmental, and agricultural conditions to generate a data-driven yield forecast.",

        aiPoweredYieldEstimation:
            "AI-powered yield estimation",

        agriculturalDataAnalysis:
            "Agricultural data analysis",

        fastPredictionResults:
            "Fast prediction results",

        yieldPrediction:
            "Yield Prediction",

        enterFarmConditions:
            "Enter your farm conditions below.",

        activity:
            "Activity",

        recentPredictions:
            "Recent predictions",

        farmIntelligence:
            "Farm intelligence",

        yourData:
            "Your data.",

        yourAdvantage:
            "Your advantage.",

        intelligenceDescription:
            "Track your farms, analyze crop performance, monitor conditions, and use AI predictions to make more informed agricultural decisions.",

        farmsTracked:
            "Farms tracked",

        cropsTracked:
            "Crops tracked",

        predictSmarter:
            "Predict smarter",

        unableToLoadDashboard:
            "Unable to load some dashboard statistics.",

        // =====================================================
        // SIDEBAR / NAVIGATION
        // =====================================================

        home:
            "Home",

        analytics:
            "Analytics",

        weather:
            "Weather",

        soil:
            "Soil",

        profile:
            "Profile",

        logout:
            "Logout",

        farms:
            "Farms",

        crops:
            "Crops",

        predictions:
            "Predictions",

    },


    // =========================================================
    // TELUGU
    // =========================================================

    te: {

        dashboard: "డ్యాష్‌బోర్డ్",
        signIn: "సైన్ ఇన్",
        getStarted: "ప్రారంభించండి",
        openDashboard: "డ్యాష్‌బోర్డ్ తెరవండి",
        startPredicting: "అంచనా ప్రారంభించండి",
        explorePlatform: "ప్లాట్‌ఫారమ్‌ను చూడండి",
        features: "ఫీచర్లు",
        howItWorks: "ఇది ఎలా పనిచేస్తుంది",
        about: "మా గురించి",
        language: "భాష",

        intelligentAgriculture:
            "తెలివైన వ్యవసాయం",

        aiPoweredAgriculturalIntelligence:
            "AI ఆధారిత వ్యవసాయ మేధస్సు",

        predictBetter:
            "మెరుగ్గా అంచనా వేయండి.",

        growSmarter:
            "తెలివిగా పండించండి.",

        homeDescription:
            "Crop_Yield_Prediction-AI వ్యవసాయ డేటాను తెలివైన పంట దిగుబడి అంచనాలుగా మార్చి, వ్యవసాయ నిపుణులు మరింత నమ్మకంతో మెరుగైన నిర్ణయాలు తీసుకునేందుకు సహాయపడుతుంది.",

        aiPoweredPredictions:
            "AI ఆధారిత అంచనాలు",

        dataDrivenInsights:
            "డేటా ఆధారిత విశ్లేషణలు",

        smarterFarming:
            "తెలివైన వ్యవసాయం",

        modelAccuracy:
            "మోడల్ ఖచ్చితత్వం",

        intelligentInsights:
            "తెలివైన విశ్లేషణలు",

        decisionSupport:
            "నిర్ణయ సహాయం",

        builtForSmarterAgriculture:
            "తెలివైన వ్యవసాయం కోసం రూపొందించబడింది",

        everythingYouNeed:
            "మీ పంట దిగుబడిని అర్థం చేసుకోవడానికి అవసరమైన ప్రతిదీ.",

        platformDescription:
            "వ్యవసాయ నిర్వహణ నుండి AI ఆధారిత అంచనాల వరకు, YieldSenseAI ముఖ్యమైన వ్యవసాయ సమాచారాన్ని ఒకే తెలివైన ప్లాట్‌ఫారమ్‌లో అందిస్తుంది.",

        aiYieldPrediction:
            "AI పంట దిగుబడి అంచనా",

        aiYieldPredictionDescription:
            "పంట కోతకు ముందే దిగుబడిని అంచనా వేయడానికి వ్యవసాయ మరియు పర్యావరణ డేటాను ఉపయోగించండి.",

        farmManagement:
            "వ్యవసాయ నిర్వహణ",

        farmManagementDescription:
            "మీ పొలాలు, పంట సమాచారం మరియు వ్యవసాయ డేటాను ఒకే చోట క్రమబద్ధంగా నిర్వహించండి.",

        agriculturalAnalytics:
            "వ్యవసాయ విశ్లేషణలు",

        agriculturalAnalyticsDescription:
            "అంచనా చరిత్ర మరియు వ్యవసాయ డేటాను స్పష్టమైన, ఉపయోగకరమైన సమాచారంగా మార్చండి.",

        weatherIntelligence:
            "వాతావరణ సమాచారం",

        weatherIntelligenceDescription:
            "వ్యవసాయ పనితీరును ప్రభావితం చేసే పర్యావరణ పరిస్థితులను అర్థం చేసుకోండి.",

        soilInsights:
            "నేల సమాచారం",

        soilInsightsDescription:
            "మీ వ్యవసాయ నిర్ణయాలలో నేలకు సంబంధించిన సమాచారాన్ని ఉపయోగించండి.",

        predictionHistory:
            "అంచనా చరిత్ర",

        predictionHistoryDescription:
            "గత అంచనాలను పరిశీలించి మీ వ్యవసాయ నిర్ణయాలు ఎలా మారుతున్నాయో తెలుసుకోండి.",

        simpleWorkflow:
            "సులభమైన విధానం",

        fromDataToDecision:
            "డేటా నుండి నిర్ణయం వరకు.",

        workflowDescription:
            "వ్యవసాయ సమాచారాన్ని ఉపయోగకరమైన అంచనాలుగా మార్చే సరళమైన విధానం.",

        addYourFarm:
            "మీ పొలాన్ని జోడించండి",

        addYourFarmDescription:
            "మీ పొలం ప్రొఫైల్‌ను సృష్టించి వ్యవసాయ సమాచారాన్ని క్రమబద్ధంగా నిర్వహించండి.",

        enterCropData:
            "పంట డేటాను నమోదు చేయండి",

        enterCropDataDescription:
            "అంచనా మోడల్ ఉపయోగించే పంట మరియు పర్యావరణ సమాచారాన్ని అందించండి.",

        getYourPrediction:
            "మీ అంచనాను పొందండి",

        getYourPredictionDescription:
            "AI ఆధారిత దిగుబడి అంచనాను పొందండి మరియు మెరుగైన నిర్ణయాలకు ఉపయోగించండి.",

        futureOfFarming:
            "వ్యవసాయం యొక్క భవిష్యత్తు",

        agriculturalDecision:
            "ప్రతి వ్యవసాయ నిర్ణయాన్ని మరింత నమ్మకంతో తీసుకోండి.",

        aboutDescription:
            "Crop_Yield_Prediction-AI వ్యవసాయ డేటా, మెషిన్ లెర్నింగ్ మరియు సులభమైన విశ్లేషణలను కలిపి పంట కోతకు ముందే మీ పంటలను అర్థం చేసుకోవడానికి సహాయపడుతుంది.",

        getStartedWithYieldSenseAI:
            "YieldSenseAIతో ప్రారంభించండి",

        intelligentAgricultureSmarterDecisions:
            "తెలివైన వ్యవసాయం. మెరుగైన నిర్ణయాలు.",

        allRightsReserved:
            "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",

        aiAgricultureSystem:
            "AI వ్యవసాయ వ్యవస్థ",

        operational:
            "పనిచేస్తోంది",

        intelligentAgricultureBetterDecisions:
            "తెలివైన వ్యవసాయం.",

        betterDecisions:
            "మెరుగైన నిర్ణయాలు.",

        dashboardDescription:
            "CROP_YIELD_PREDICTION-AIకి స్వాగతం — పంట దిగుబడి అంచనాలు, వ్యవసాయ విశ్లేషణలు మరియు డేటా ఆధారిత నిర్ణయాల కోసం మీ తెలివైన వర్క్‌స్పేస్.",

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

        realTimeSnapshot:
            "మీ వ్యవసాయ కార్యకలాపాల రియల్-టైమ్ సమాచారం.",

        systemOperational:
            "సిస్టమ్ పనిచేస్తోంది",

        totalFarms:
            "మొత్తం పొలాలు",

        registeredFarmingLocations:
            "నమోదైన వ్యవసాయ ప్రాంతాలు",

        totalCrops:
            "మొత్తం పంటలు",

        cropsCurrentlyTracked:
            "ప్రస్తుతం ట్రాక్ చేస్తున్న పంటలు",

        aiPredictions:
            "AI అంచనాలు",

        yieldForecastsGenerated:
            "సృష్టించిన దిగుబడి అంచనాలు",

        currentModelPerformance:
            "ప్రస్తుత అంచనా మోడల్ పనితీరు",

        quickActions:
            "త్వరిత చర్యలు",

        whatWouldYouLikeToDo:
            "మీరు ఏమి చేయాలనుకుంటున్నారు?",

        manageFarmIntelligence:
            "మీ వ్యవసాయ సమాచారాన్ని నిర్వహించండి",

        aiIntelligence:
            "AI మేధస్సు",

        predictYourNextHarvest:
            "మీ తదుపరి పంట దిగుబడిని అంచనా వేయండి.",

        predictionDescription:
            "మీ పంట, పర్యావరణ మరియు వ్యవసాయ పరిస్థితులను మోడల్‌కు అందించి డేటా ఆధారిత దిగుబడి అంచనాను పొందండి.",

        aiPoweredYieldEstimation:
            "AI ఆధారిత దిగుబడి అంచనా",

        agriculturalDataAnalysis:
            "వ్యవసాయ డేటా విశ్లేషణ",

        fastPredictionResults:
            "వేగవంతమైన అంచనా ఫలితాలు",

        yieldPrediction:
            "దిగుబడి అంచనా",

        enterFarmConditions:
            "క్రింద మీ పొలం పరిస్థితులను నమోదు చేయండి.",

        activity:
            "కార్యకలాపాలు",

        recentPredictions:
            "ఇటీవలి అంచనాలు",

        farmIntelligence:
            "వ్యవసాయ మేధస్సు",

        yourData:
            "మీ డేటా.",

        yourAdvantage:
            "మీ ప్రయోజనం.",

        intelligenceDescription:
            "మీ పొలాలను ట్రాక్ చేయండి, పంట పనితీరును విశ్లేషించండి, పరిస్థితులను పర్యవేక్షించండి మరియు మెరుగైన వ్యవసాయ నిర్ణయాల కోసం AI అంచనాలను ఉపయోగించండి.",

        farmsTracked:
            "ట్రాక్ చేస్తున్న పొలాలు",

        cropsTracked:
            "ట్రాక్ చేస్తున్న పంటలు",

        predictSmarter:
            "తెలివిగా అంచనా వేయండి",

        unableToLoadDashboard:
            "కొన్ని డ్యాష్‌బోర్డ్ గణాంకాలను లోడ్ చేయడం సాధ్యం కాలేదు.",

        home:
            "హోమ్",

        analytics:
            "విశ్లేషణలు",

        weather:
            "వాతావరణం",

        soil:
            "నేల",

        profile:
            "ప్రొఫైల్",

        logout:
            "లాగ్ అవుట్",

        farms:
            "పొలాలు",

        crops:
            "పంటలు",

        predictions:
            "అంచనాలు",
    },


    // =========================================================
    // HINDI
    // =========================================================

    hi: {

        dashboard: "डैशबोर्ड",
        signIn: "साइन इन",
        getStarted: "शुरू करें",
        openDashboard: "डैशबोर्ड खोलें",
        startPredicting: "पूर्वानुमान शुरू करें",
        explorePlatform: "प्लेटफ़ॉर्म देखें",
        features: "विशेषताएँ",
        howItWorks: "यह कैसे काम करता है",
        about: "हमारे बारे में",
        language: "भाषा",

        intelligentAgriculture:
            "स्मार्ट कृषि",

        aiPoweredAgriculturalIntelligence:
            "AI आधारित कृषि बुद्धिमत्ता",

        predictBetter:
            "बेहतर पूर्वानुमान लगाएँ।",

        growSmarter:
            "स्मार्ट तरीके से उगाएँ।",

        homeDescription:
            "Crop_Yield_Prediction-AI कृषि डेटा को बुद्धिमान फसल उपज पूर्वानुमानों में बदलता है और कृषि विशेषज्ञों को बेहतर निर्णय लेने में सहायता करता है।",

        aiPoweredPredictions:
            "AI आधारित पूर्वानुमान",

        dataDrivenInsights:
            "डेटा आधारित जानकारी",

        smarterFarming:
            "स्मार्ट खेती",

        modelAccuracy:
            "मॉडल सटीकता",

        intelligentInsights:
            "बुद्धिमान जानकारी",

        decisionSupport:
            "निर्णय सहायता",

        builtForSmarterAgriculture:
            "स्मार्ट कृषि के लिए बनाया गया",

        everythingYouNeed:
            "अपनी फसल की उपज समझने के लिए आपको आवश्यक सब कुछ।",

        platformDescription:
            "फार्म प्रबंधन से लेकर AI आधारित पूर्वानुमान तक, YieldSenseAI महत्वपूर्ण कृषि जानकारी को एक बुद्धिमान प्लेटफ़ॉर्म में लाता है।",

        aiYieldPrediction:
            "AI फसल उपज पूर्वानुमान",

        aiYieldPredictionDescription:
            "कटाई से पहले फसल की उपज का अनुमान लगाने के लिए कृषि और पर्यावरणीय डेटा का उपयोग करें।",

        farmManagement:
            "फार्म प्रबंधन",

        farmManagementDescription:
            "अपने फार्म, फसल की जानकारी और कृषि डेटा को एक ही स्थान पर व्यवस्थित रखें।",

        agriculturalAnalytics:
            "कृषि विश्लेषण",

        agriculturalAnalyticsDescription:
            "पूर्वानुमान इतिहास और फार्म डेटा को स्पष्ट और उपयोगी जानकारी में बदलें।",

        weatherIntelligence:
            "मौसम जानकारी",

        weatherIntelligenceDescription:
            "कृषि प्रदर्शन को प्रभावित करने वाली पर्यावरणीय परिस्थितियों को समझें।",

        soilInsights:
            "मृदा जानकारी",

        soilInsightsDescription:
            "अपने कृषि निर्णयों में मिट्टी से संबंधित जानकारी का उपयोग करें।",

        predictionHistory:
            "पूर्वानुमान इतिहास",

        predictionHistoryDescription:
            "पिछले पूर्वानुमानों की समीक्षा करें और अपने कृषि निर्णयों को ट्रैक करें।",

        simpleWorkflow:
            "सरल प्रक्रिया",

        fromDataToDecision:
            "डेटा से निर्णय तक।",

        workflowDescription:
            "कृषि जानकारी को उपयोगी पूर्वानुमानों में बदलने के लिए सरल प्रक्रिया।",

        addYourFarm:
            "अपना फार्म जोड़ें",

        addYourFarmDescription:
            "अपना फार्म प्रोफ़ाइल बनाएँ और कृषि जानकारी को व्यवस्थित रखें।",

        enterCropData:
            "फसल डेटा दर्ज करें",

        enterCropDataDescription:
            "पूर्वानुमान मॉडल द्वारा उपयोग की जाने वाली फसल और पर्यावरणीय जानकारी दें।",

        getYourPrediction:
            "अपना पूर्वानुमान प्राप्त करें",

        getYourPredictionDescription:
            "AI आधारित उपज पूर्वानुमान प्राप्त करें और बेहतर निर्णय लेने में इसका उपयोग करें।",

        futureOfFarming:
            "खेती का भविष्य",

        agriculturalDecision:
            "हर कृषि निर्णय अधिक आत्मविश्वास के साथ लें।",

        aboutDescription:
            "Crop_Yield_Prediction-AI कृषि डेटा, मशीन लर्निंग और विश्लेषण को जोड़कर कटाई से पहले आपकी फसलों को समझने में मदद करता है।",

        getStartedWithYieldSenseAI:
            "YieldSenseAI के साथ शुरू करें",

        intelligentAgricultureSmarterDecisions:
            "स्मार्ट कृषि। बेहतर निर्णय।",

        allRightsReserved:
            "सर्वाधिकार सुरक्षित।",

        aiAgricultureSystem:
            "AI कृषि प्रणाली",

        operational:
            "सक्रिय",

        intelligentAgricultureBetterDecisions:
            "स्मार्ट कृषि।",

        betterDecisions:
            "बेहतर निर्णय।",

        dashboardDescription:
            "CROP_YIELD_PREDICTION-AI में आपका स्वागत है — फसल उपज पूर्वानुमान, कृषि जानकारी और डेटा आधारित निर्णयों के लिए आपका बुद्धिमान कार्यक्षेत्र।",

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

        realTimeSnapshot:
            "आपकी कृषि गतिविधि का रियल-टाइम विवरण।",

        systemOperational:
            "सिस्टम सक्रिय है",

        totalFarms:
            "कुल फार्म",

        registeredFarmingLocations:
            "पंजीकृत कृषि स्थान",

        totalCrops:
            "कुल फसलें",

        cropsCurrentlyTracked:
            "वर्तमान में ट्रैक की जा रही फसलें",

        aiPredictions:
            "AI पूर्वानुमान",

        yieldForecastsGenerated:
            "उत्पन्न उपज पूर्वानुमान",

        currentModelPerformance:
            "वर्तमान पूर्वानुमान मॉडल प्रदर्शन",

        quickActions:
            "त्वरित कार्य",

        whatWouldYouLikeToDo:
            "आप क्या करना चाहते हैं?",

        manageFarmIntelligence:
            "अपनी कृषि जानकारी प्रबंधित करें",

        aiIntelligence:
            "AI बुद्धिमत्ता",

        predictYourNextHarvest:
            "अपनी अगली फसल का पूर्वानुमान लगाएँ।",

        predictionDescription:
            "अपनी फसल, पर्यावरणीय और कृषि परिस्थितियों को मॉडल में डालकर डेटा आधारित उपज पूर्वानुमान प्राप्त करें।",

        aiPoweredYieldEstimation:
            "AI आधारित उपज अनुमान",

        agriculturalDataAnalysis:
            "कृषि डेटा विश्लेषण",

        fastPredictionResults:
            "तेज़ पूर्वानुमान परिणाम",

        yieldPrediction:
            "उपज पूर्वानुमान",

        enterFarmConditions:
            "नीचे अपने फार्म की परिस्थितियाँ दर्ज करें।",

        activity:
            "गतिविधि",

        recentPredictions:
            "हाल के पूर्वानुमान",

        farmIntelligence:
            "कृषि बुद्धिमत्ता",

        yourData:
            "आपका डेटा।",

        yourAdvantage:
            "आपका लाभ।",

        intelligenceDescription:
            "अपने फार्म ट्रैक करें, फसल प्रदर्शन का विश्लेषण करें, परिस्थितियों की निगरानी करें और बेहतर कृषि निर्णयों के लिए AI पूर्वानुमानों का उपयोग करें।",

        farmsTracked:
            "ट्रैक किए गए फार्म",

        cropsTracked:
            "ट्रैक की गई फसलें",

        predictSmarter:
            "स्मार्ट पूर्वानुमान लगाएँ",

        unableToLoadDashboard:
            "कुछ डैशबोर्ड आँकड़े लोड नहीं किए जा सके।",

        home:
            "होम",

        analytics:
            "विश्लेषण",

        weather:
            "मौसम",

        soil:
            "मिट्टी",

        profile:
            "प्रोफ़ाइल",

        logout:
            "लॉग आउट",

        farms:
            "फार्म",

        crops:
            "फसलें",

        predictions:
            "पूर्वानुमान",
    },


    // =========================================================
    // TAMIL
    // =========================================================

    ta: {

        dashboard: "டாஷ்போர்டு",
        signIn: "உள்நுழைக",
        getStarted: "தொடங்குங்கள்",
        openDashboard: "டாஷ்போர்டைத் திறக்கவும்",
        startPredicting: "கணிப்பைத் தொடங்குங்கள்",
        explorePlatform: "தளத்தைப் பார்க்கவும்",
        features: "அம்சங்கள்",
        howItWorks: "இது எப்படி செயல்படுகிறது",
        about: "எங்களைப் பற்றி",
        language: "மொழி",

        intelligentAgriculture:
            "புத்திசாலித்தனமான விவசாயம்",

        aiPoweredAgriculturalIntelligence:
            "AI அடிப்படையிலான விவசாய நுண்ணறிவு",

        predictBetter:
            "சிறப்பாக கணிக்கவும்.",

        growSmarter:
            "புத்திசாலித்தனமாக வளர்க்கவும்.",

        homeDescription:
            "Crop_Yield_Prediction-AI விவசாயத் தரவை புத்திசாலித்தனமான பயிர் விளைச்சல் கணிப்புகளாக மாற்றி சிறந்த முடிவுகளை எடுக்க உதவுகிறது.",

        aiPoweredPredictions:
            "AI அடிப்படையிலான கணிப்புகள்",

        dataDrivenInsights:
            "தரவு அடிப்படையிலான நுண்ணறிவுகள்",

        smarterFarming:
            "புத்திசாலித்தனமான விவசாயம்",

        modelAccuracy:
            "மாதிரி துல்லியம்",

        intelligentInsights:
            "புத்திசாலித்தனமான நுண்ணறிவுகள்",

        decisionSupport:
            "முடிவு ஆதரவு",

        builtForSmarterAgriculture:
            "புத்திசாலித்தனமான விவசாயத்திற்காக உருவாக்கப்பட்டது",

        everythingYouNeed:
            "உங்கள் விளைச்சலைப் புரிந்துகொள்ள தேவையான அனைத்தும்.",

        platformDescription:
            "பண்ணை மேலாண்மை முதல் AI கணிப்புகள் வரை, YieldSenseAI முக்கியமான விவசாயத் தகவல்களை ஒரே தளத்தில் வழங்குகிறது.",

        aiYieldPrediction:
            "AI பயிர் விளைச்சல் கணிப்பு",

        aiYieldPredictionDescription:
            "அறுவடைக்கு முன் பயிர் விளைச்சலை மதிப்பிட விவசாய மற்றும் சுற்றுச்சூழல் தரவைப் பயன்படுத்தவும்.",

        farmManagement:
            "பண்ணை மேலாண்மை",

        farmManagementDescription:
            "உங்கள் பண்ணைகள், பயிர் தகவல்கள் மற்றும் விவசாயத் தரவை ஒரே இடத்தில் ஒழுங்குபடுத்துங்கள்.",

        agriculturalAnalytics:
            "விவசாய பகுப்பாய்வு",

        agriculturalAnalyticsDescription:
            "கணிப்பு வரலாறு மற்றும் பண்ணைத் தரவை பயனுள்ள நுண்ணறிவுகளாக மாற்றுங்கள்.",

        weatherIntelligence:
            "வானிலை நுண்ணறிவு",

        weatherIntelligenceDescription:
            "விவசாய செயல்திறனை பாதிக்கக்கூடிய சுற்றுச்சூழல் நிலைமைகளைப் புரிந்துகொள்ளுங்கள்.",

        soilInsights:
            "மண் நுண்ணறிவு",

        soilInsightsDescription:
            "உங்கள் விவசாய முடிவுகளில் மண் தொடர்பான தகவல்களைப் பயன்படுத்துங்கள்.",

        predictionHistory:
            "கணிப்பு வரலாறு",

        predictionHistoryDescription:
            "முந்தைய கணிப்புகளை மதிப்பாய்வு செய்து உங்கள் விவசாய முடிவுகளை கண்காணிக்கவும்.",

        simpleWorkflow:
            "எளிய செயல்முறை",

        fromDataToDecision:
            "தரவிலிருந்து முடிவுக்கு.",

        workflowDescription:
            "விவசாயத் தகவலை பயனுள்ள கணிப்புகளாக மாற்றும் எளிய செயல்முறை.",

        addYourFarm:
            "உங்கள் பண்ணையைச் சேர்க்கவும்",

        addYourFarmDescription:
            "உங்கள் பண்ணை சுயவிவரத்தை உருவாக்கி விவசாயத் தகவலை ஒழுங்குபடுத்துங்கள்.",

        enterCropData:
            "பயிர் தரவை உள்ளிடவும்",

        enterCropDataDescription:
            "கணிப்பு மாதிரி பயன்படுத்தும் பயிர் மற்றும் சுற்றுச்சூழல் தகவல்களை வழங்குங்கள்.",

        getYourPrediction:
            "உங்கள் கணிப்பைப் பெறுங்கள்",

        getYourPredictionDescription:
            "AI அடிப்படையிலான விளைச்சல் கணிப்பைப் பெற்று சிறந்த முடிவுகளுக்கு பயன்படுத்துங்கள்.",

        futureOfFarming:
            "விவசாயத்தின் எதிர்காலம்",

        agriculturalDecision:
            "ஒவ்வொரு விவசாய முடிவையும் அதிக நம்பிக்கையுடன் எடுக்கவும்.",

        aboutDescription:
            "Crop_Yield_Prediction-AI விவசாயத் தரவு, இயந்திரக் கற்றல் மற்றும் பகுப்பாய்வுகளை இணைத்து அறுவடைக்கு முன் உங்கள் பயிர்களைப் புரிந்துகொள்ள உதவுகிறது.",

        getStartedWithYieldSenseAI:
            "YieldSenseAI உடன் தொடங்குங்கள்",

        intelligentAgricultureSmarterDecisions:
            "புத்திசாலித்தனமான விவசாயம். சிறந்த முடிவுகள்.",

        allRightsReserved:
            "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",

        aiAgricultureSystem:
            "AI விவசாய அமைப்பு",

        operational:
            "செயலில் உள்ளது",

        intelligentAgricultureBetterDecisions:
            "புத்திசாலித்தனமான விவசாயம்.",

        betterDecisions:
            "சிறந்த முடிவுகள்.",

        dashboardDescription:
            "CROP_YIELD_PREDICTION-AI க்கு வரவேற்கிறோம் — பயிர் விளைச்சல் கணிப்பு, விவசாய நுண்ணறிவு மற்றும் தரவு சார்ந்த முடிவுகளுக்கான உங்கள் புத்திசாலித்தனமான பணியிடம்.",

        aiPrediction:
            "AI கணிப்பு",

        smartAnalytics:
            "ஸ்மார்ட் பகுப்பாய்வு",

        environmentalInsights:
            "சுற்றுச்சூழல் நுண்ணறிவு",

        overview:
            "மேலோட்டம்",

        yourFarmIntelligence:
            "உங்கள் விவசாய நுண்ணறிவு",

        realTimeSnapshot:
            "உங்கள் விவசாய செயல்பாட்டின் நேரடி நிலை.",

        systemOperational:
            "அமைப்பு செயல்பாட்டில் உள்ளது",

        totalFarms:
            "மொத்த பண்ணைகள்",

        registeredFarmingLocations:
            "பதிவு செய்யப்பட்ட விவசாய இடங்கள்",

        totalCrops:
            "மொத்த பயிர்கள்",

        cropsCurrentlyTracked:
            "தற்போது கண்காணிக்கப்படும் பயிர்கள்",

        aiPredictions:
            "AI கணிப்புகள்",

        yieldForecastsGenerated:
            "உருவாக்கப்பட்ட விளைச்சல் கணிப்புகள்",

        currentModelPerformance:
            "தற்போதைய கணிப்பு மாதிரி செயல்திறன்",

        quickActions:
            "விரைவு செயல்கள்",

        whatWouldYouLikeToDo:
            "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",

        manageFarmIntelligence:
            "உங்கள் விவசாய நுண்ணறிவை நிர்வகிக்கவும்",

        aiIntelligence:
            "AI நுண்ணறிவு",

        predictYourNextHarvest:
            "உங்கள் அடுத்த அறுவடையை கணிக்கவும்.",

        predictionDescription:
            "உங்கள் பயிர், சுற்றுச்சூழல் மற்றும் விவசாய நிலைமைகளை மாதிரியில் உள்ளிட்டு தரவு சார்ந்த விளைச்சல் கணிப்பைப் பெறுங்கள்.",

        aiPoweredYieldEstimation:
            "AI அடிப்படையிலான விளைச்சல் மதிப்பீடு",

        agriculturalDataAnalysis:
            "விவசாயத் தரவு பகுப்பாய்வு",

        fastPredictionResults:
            "வேகமான கணிப்பு முடிவுகள்",

        yieldPrediction:
            "விளைச்சல் கணிப்பு",

        enterFarmConditions:
            "கீழே உங்கள் பண்ணை நிலைமைகளை உள்ளிடவும்.",

        activity:
            "செயல்பாடு",

        recentPredictions:
            "சமீபத்திய கணிப்புகள்",

        farmIntelligence:
            "விவசாய நுண்ணறிவு",

        yourData:
            "உங்கள் தரவு.",

        yourAdvantage:
            "உங்கள் நன்மை.",

        intelligenceDescription:
            "உங்கள் பண்ணைகளைக் கண்காணிக்கவும், பயிர் செயல்திறனை பகுப்பாய்வு செய்யவும், நிலைமைகளைக் கண்காணிக்கவும் மற்றும் சிறந்த விவசாய முடிவுகளுக்கு AI கணிப்புகளைப் பயன்படுத்தவும்.",

        farmsTracked:
            "கண்காணிக்கப்படும் பண்ணைகள்",

        cropsTracked:
            "கண்காணிக்கப்படும் பயிர்கள்",

        predictSmarter:
            "புத்திசாலித்தனமாக கணிக்கவும்",

        unableToLoadDashboard:
            "சில டாஷ்போர்டு புள்ளிவிவரங்களை ஏற்ற முடியவில்லை.",

        home: "முகப்பு",
        analytics: "பகுப்பாய்வு",
        weather: "வானிலை",
        soil: "மண்",
        profile: "சுயவிவரம்",
        logout: "வெளியேறு",
        farms: "பண்ணைகள்",
        crops: "பயிர்கள்",
        predictions: "கணிப்புகள்",
    },


    // =========================================================
    // KANNADA
    // =========================================================

    kn: {

        dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        signIn: "ಸೈನ್ ಇನ್",
        getStarted: "ಪ್ರಾರಂಭಿಸಿ",
        openDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ",
        startPredicting: "ಮುನ್ಸೂಚನೆ ಪ್ರಾರಂಭಿಸಿ",
        explorePlatform: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ನೋಡಿ",
        features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
        howItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
        about: "ನಮ್ಮ ಬಗ್ಗೆ",
        language: "ಭಾಷೆ",

        intelligentAgriculture:
            "ಬುದ್ಧಿವಂತ ಕೃಷಿ",

        aiPoweredAgriculturalIntelligence:
            "AI ಆಧಾರಿತ ಕೃಷಿ ಬುದ್ಧಿವಂತಿಕೆ",

        predictBetter:
            "ಉತ್ತಮವಾಗಿ ಊಹಿಸಿ.",

        growSmarter:
            "ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಬೆಳೆಸಿ.",

        homeDescription:
            "Crop_Yield_Prediction-AI ಕೃಷಿ ಡೇಟಾವನ್ನು ಬುದ್ಧಿವಂತ ಬೆಳೆ ಇಳುವರಿ ಮುನ್ಸೂಚನೆಗಳಾಗಿ ಪರಿವರ್ತಿಸಿ ಉತ್ತಮ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",

        aiPoweredPredictions:
            "AI ಆಧಾರಿತ ಮುನ್ಸೂಚನೆಗಳು",

        dataDrivenInsights:
            "ಡೇಟಾ ಆಧಾರಿತ ಒಳನೋಟಗಳು",

        smarterFarming:
            "ಬುದ್ಧಿವಂತ ಕೃಷಿ",

        modelAccuracy:
            "ಮಾದರಿ ನಿಖರತೆ",

        intelligentInsights:
            "ಬುದ್ಧಿವಂತ ಒಳನೋಟಗಳು",

        decisionSupport:
            "ನಿರ್ಧಾರ ಸಹಾಯ",

        builtForSmarterAgriculture:
            "ಬುದ್ಧಿವಂತ ಕೃಷಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",

        everythingYouNeed:
            "ನಿಮ್ಮ ಬೆಳೆ ಇಳುವರಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಬೇಕಾದ ಎಲ್ಲವೂ.",

        platformDescription:
            "ಕೃಷಿ ನಿರ್ವಹಣೆಯಿಂದ AI ಆಧಾರಿತ ಮುನ್ಸೂಚನೆಗಳವರೆಗೆ, YieldSenseAI ಪ್ರಮುಖ ಕೃಷಿ ಮಾಹಿತಿಯನ್ನು ಒಂದೇ ಬುದ್ಧಿವಂತ ವೇದಿಕೆಯಲ್ಲಿ ಒದಗಿಸುತ್ತದೆ.",

        aiYieldPrediction:
            "AI ಬೆಳೆ ಇಳುವರಿ ಮುನ್ಸೂಚನೆ",

        aiYieldPredictionDescription:
            "ಕೊಯ್ಲಿನ ಮೊದಲು ಬೆಳೆ ಇಳುವರಿಯನ್ನು ಅಂದಾಜಿಸಲು ಕೃಷಿ ಮತ್ತು ಪರಿಸರ ಡೇಟಾವನ್ನು ಬಳಸಿ.",

        farmManagement:
            "ಕೃಷಿ ನಿರ್ವಹಣೆ",

        farmManagementDescription:
            "ನಿಮ್ಮ ಜಮೀನುಗಳು, ಬೆಳೆ ಮಾಹಿತಿ ಮತ್ತು ಕೃಷಿ ಡೇಟಾವನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ವ್ಯವಸ್ಥಿತವಾಗಿ ನಿರ್ವಹಿಸಿ.",

        agriculturalAnalytics:
            "ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ",

        agriculturalAnalyticsDescription:
            "ಮುನ್ಸೂಚನೆ ಇತಿಹಾಸ ಮತ್ತು ಕೃಷಿ ಡೇಟಾವನ್ನು ಸ್ಪಷ್ಟ ಮತ್ತು ಉಪಯುಕ್ತ ಮಾಹಿತಿಯಾಗಿ ಪರಿವರ್ತಿಸಿ.",

        weatherIntelligence:
            "ಹವಾಮಾನ ಮಾಹಿತಿ",

        weatherIntelligenceDescription:
            "ಕೃಷಿ ಕಾರ್ಯಕ್ಷಮತೆಯ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುವ ಪರಿಸರ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",

        soilInsights:
            "ಮಣ್ಣಿನ ಮಾಹಿತಿ",

        soilInsightsDescription:
            "ನಿಮ್ಮ ಕೃಷಿ ನಿರ್ಧಾರಗಳಲ್ಲಿ ಮಣ್ಣಿಗೆ ಸಂಬಂಧಿಸಿದ ಮಾಹಿತಿಯನ್ನು ಬಳಸಿ.",

        predictionHistory:
            "ಮುನ್ಸೂಚನೆ ಇತಿಹಾಸ",

        predictionHistoryDescription:
            "ಹಿಂದಿನ ಮುನ್ಸೂಚನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಕೃಷಿ ನಿರ್ಧಾರಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",

        simpleWorkflow:
            "ಸರಳ ಪ್ರಕ್ರಿಯೆ",

        fromDataToDecision:
            "ಡೇಟಾದಿಂದ ನಿರ್ಧಾರಕ್ಕೆ.",

        workflowDescription:
            "ಕೃಷಿ ಮಾಹಿತಿಯನ್ನು ಉಪಯುಕ್ತ ಮುನ್ಸೂಚನೆಗಳಾಗಿ ಪರಿವರ್ತಿಸುವ ಸರಳ ಪ್ರಕ್ರಿಯೆ.",

        addYourFarm:
            "ನಿಮ್ಮ ಜಮೀನನ್ನು ಸೇರಿಸಿ",

        addYourFarmDescription:
            "ನಿಮ್ಮ ಜಮೀನಿನ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ ಮತ್ತು ಕೃಷಿ ಮಾಹಿತಿಯನ್ನು ವ್ಯವಸ್ಥಿತವಾಗಿ ನಿರ್ವಹಿಸಿ.",

        enterCropData:
            "ಬೆಳೆ ಡೇಟಾ ನಮೂದಿಸಿ",

        enterCropDataDescription:
            "ಮುನ್ಸೂಚನೆ ಮಾದರಿ ಬಳಸುವ ಬೆಳೆ ಮತ್ತು ಪರಿಸರ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಿ.",

        getYourPrediction:
            "ನಿಮ್ಮ ಮುನ್ಸೂಚನೆ ಪಡೆಯಿರಿ",

        getYourPredictionDescription:
            "AI ಆಧಾರಿತ ಇಳುವರಿ ಮುನ್ಸೂಚನೆಯನ್ನು ಪಡೆದು ಉತ್ತಮ ನಿರ್ಧಾರಗಳಿಗೆ ಬಳಸಿ.",

        futureOfFarming:
            "ಕೃಷಿಯ ಭವಿಷ್ಯ",

        agriculturalDecision:
            "ಪ್ರತಿ ಕೃಷಿ ನಿರ್ಧಾರವನ್ನು ಹೆಚ್ಚಿನ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ತೆಗೆದುಕೊಳ್ಳಿ.",

        aboutDescription:
            "Crop_Yield_Prediction-AI ಕೃಷಿ ಡೇಟಾ, ಯಂತ್ರ ಕಲಿಕೆ ಮತ್ತು ವಿಶ್ಲೇಷಣೆಯನ್ನು ಸಂಯೋಜಿಸಿ ಕೊಯ್ಲಿನ ಮೊದಲು ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",

        getStartedWithYieldSenseAI:
            "YieldSenseAI ಜೊತೆ ಪ್ರಾರಂಭಿಸಿ",

        intelligentAgricultureSmarterDecisions:
            "ಬುದ್ಧಿವಂತ ಕೃಷಿ. ಉತ್ತಮ ನಿರ್ಧಾರಗಳು.",

        allRightsReserved:
            "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",

        aiAgricultureSystem:
            "AI ಕೃಷಿ ವ್ಯವಸ್ಥೆ",

        operational:
            "ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ",

        intelligentAgricultureBetterDecisions:
            "ಬುದ್ಧಿವಂತ ಕೃಷಿ.",

        betterDecisions:
            "ಉತ್ತಮ ನಿರ್ಧಾರಗಳು.",

        dashboardDescription:
            "CROP_YIELD_PREDICTION-AI ಗೆ ಸ್ವಾಗತ — ಬೆಳೆ ಇಳುವರಿ ಮುನ್ಸೂಚನೆ, ಕೃಷಿ ಒಳನೋಟಗಳು ಮತ್ತು ಡೇಟಾ ಆಧಾರಿತ ನಿರ್ಧಾರಗಳಿಗಾಗಿ ನಿಮ್ಮ ಬುದ್ಧಿವಂತ ಕಾರ್ಯಕ್ಷೇತ್ರ.",

        aiPrediction:
            "AI ಮುನ್ಸೂಚನೆ",

        smartAnalytics:
            "ಸ್ಮಾರ್ಟ್ ವಿಶ್ಲೇಷಣೆ",

        environmentalInsights:
            "ಪರಿಸರ ಒಳನೋಟಗಳು",

        overview:
            "ಅವಲೋಕನ",

        yourFarmIntelligence:
            "ನಿಮ್ಮ ಕೃಷಿ ಬುದ್ಧಿವಂತಿಕೆ",

        realTimeSnapshot:
            "ನಿಮ್ಮ ಕೃಷಿ ಚಟುವಟಿಕೆಯ ನೈಜ ಸಮಯದ ಮಾಹಿತಿ.",

        systemOperational:
            "ವ್ಯವಸ್ಥೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ",

        totalFarms:
            "ಒಟ್ಟು ಜಮೀನುಗಳು",

        registeredFarmingLocations:
            "ನೋಂದಾಯಿತ ಕೃಷಿ ಸ್ಥಳಗಳು",

        totalCrops:
            "ಒಟ್ಟು ಬೆಳೆಗಳು",

        cropsCurrentlyTracked:
            "ಪ್ರಸ್ತುತ ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತಿರುವ ಬೆಳೆಗಳು",

        aiPredictions:
            "AI ಮುನ್ಸೂಚನೆಗಳು",

        yieldForecastsGenerated:
            "ರಚಿಸಲಾದ ಇಳುವರಿ ಮುನ್ಸೂಚನೆಗಳು",

        currentModelPerformance:
            "ಪ್ರಸ್ತುತ ಮುನ್ಸೂಚನೆ ಮಾದರಿ ಕಾರ್ಯಕ್ಷಮತೆ",

        quickActions:
            "ತ್ವರಿತ ಕಾರ್ಯಗಳು",

        whatWouldYouLikeToDo:
            "ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",

        manageFarmIntelligence:
            "ನಿಮ್ಮ ಕೃಷಿ ಬುದ್ಧಿವಂತಿಕೆಯನ್ನು ನಿರ್ವಹಿಸಿ",

        aiIntelligence:
            "AI ಬುದ್ಧಿವಂತಿಕೆ",

        predictYourNextHarvest:
            "ನಿಮ್ಮ ಮುಂದಿನ ಕೊಯ್ಲನ್ನು ಊಹಿಸಿ.",

        predictionDescription:
            "ನಿಮ್ಮ ಬೆಳೆ, ಪರಿಸರ ಮತ್ತು ಕೃಷಿ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಮಾದರಿಗೆ ನೀಡಿ ಡೇಟಾ ಆಧಾರಿತ ಇಳುವರಿ ಮುನ್ಸೂಚನೆಯನ್ನು ಪಡೆಯಿರಿ.",

        aiPoweredYieldEstimation:
            "AI ಆಧಾರಿತ ಇಳುವರಿ ಅಂದಾಜು",

        agriculturalDataAnalysis:
            "ಕೃಷಿ ಡೇಟಾ ವಿಶ್ಲೇಷಣೆ",

        fastPredictionResults:
            "ವೇಗವಾದ ಮುನ್ಸೂಚನೆ ಫಲಿತಾಂಶಗಳು",

        yieldPrediction:
            "ಇಳುವರಿ ಮುನ್ಸೂಚನೆ",

        enterFarmConditions:
            "ಕೆಳಗೆ ನಿಮ್ಮ ಜಮೀನಿನ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ನಮೂದಿಸಿ.",

        activity:
            "ಚಟುವಟಿಕೆ",

        recentPredictions:
            "ಇತ್ತೀಚಿನ ಮುನ್ಸೂಚನೆಗಳು",

        farmIntelligence:
            "ಕೃಷಿ ಬುದ್ಧಿವಂತಿಕೆ",

        yourData:
            "ನಿಮ್ಮ ಡೇಟಾ.",

        yourAdvantage:
            "ನಿಮ್ಮ ಪ್ರಯೋಜನ.",

        intelligenceDescription:
            "ನಿಮ್ಮ ಜಮೀನುಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ, ಬೆಳೆ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ, ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ ಮತ್ತು ಉತ್ತಮ ಕೃಷಿ ನಿರ್ಧಾರಗಳಿಗಾಗಿ AI ಮುನ್ಸೂಚನೆಗಳನ್ನು ಬಳಸಿ.",

        farmsTracked:
            "ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾದ ಜಮೀನುಗಳು",

        cropsTracked:
            "ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾದ ಬೆಳೆಗಳು",

        predictSmarter:
            "ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಊಹಿಸಿ",

        unableToLoadDashboard:
            "ಕೆಲವು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅಂಕಿಅಂಶಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",

        home: "ಮುಖಪುಟ",
        analytics: "ವಿಶ್ಲೇಷಣೆ",
        weather: "ಹವಾಮಾನ",
        soil: "ಮಣ್ಣು",
        profile: "ಪ್ರೊಫೈಲ್",
        logout: "ಲಾಗ್ ಔಟ್",
        farms: "ಜಮೀನುಗಳು",
        crops: "ಬೆಳೆಗಳು",
        predictions: "ಮುನ್ಸೂಚನೆಗಳು",
    },

} as const;

export type TranslationKey =
    keyof typeof translations.en;