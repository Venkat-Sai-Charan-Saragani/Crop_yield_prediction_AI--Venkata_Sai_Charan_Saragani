"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    getToken,
} from "@/utils/auth";

import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

import {
    useLanguage,
} from "@/context/LanguageContext";


// =============================================================
// LANGUAGE TYPES
// =============================================================

type Language =
    | "en"
    | "te"
    | "hi";


// =============================================================
// LANDING PAGE TRANSLATIONS
//
// These are kept here because the landing page has some
// page-specific keys that are not currently present in the
// global LanguageContext dictionary.
//
// IMPORTANT:
// The actual selected language now comes from LanguageContext.
// =============================================================

type LandingTranslations = {
    productName: string;
    subtitle: string;

    features: string;
    howItWorks: string;
    about: string;

    signIn: string;
    dashboard: string;
    getStarted: string;

    badge: string;

    heroTitle: string;
    heroTitleAccent: string;
    heroDescription: string;

    startPredicting: string;
    openDashboard: string;
    explorePlatform: string;

    aiPredictions: string;
    dataInsights: string;
    smarterFarming: string;

    modelAccuracy: string;
    intelligentInsights: string;
    decisionSupport: string;

    featuresLabel: string;
    featuresTitle: string;
    featuresDescription: string;

    feature1Title: string;
    feature1Description: string;

    feature2Title: string;
    feature2Description: string;

    feature3Title: string;
    feature3Description: string;

    feature4Title: string;
    feature4Description: string;

    feature5Title: string;
    feature5Description: string;

    feature6Title: string;
    feature6Description: string;

    workflowLabel: string;
    workflowTitle: string;
    workflowDescription: string;

    step1Title: string;
    step1Description: string;

    step2Title: string;
    step2Description: string;

    step3Title: string;
    step3Description: string;

    futureLabel: string;
    futureTitle: string;
    futureDescription: string;

    getStartedYieldSense: string;

    footerTagline: string;
    rights: string;
};


// =============================================================
// TRANSLATIONS
// =============================================================

const translations: Record<
    Language,
    LandingTranslations
> = {

    // =========================================================
    // ENGLISH
    // =========================================================

    en: {

        productName:
            "Crop_Yield_Prediction-AI",

        subtitle:
            "Intelligent Agriculture",

        features:
            "Features",

        howItWorks:
            "How it works",

        about:
            "About",

        signIn:
            "Sign in",

        dashboard:
            "Dashboard",

        getStarted:
            "Get started",

        badge:
            "AI-POWERED AGRICULTURAL INTELLIGENCE",

        heroTitle:
            "Predict better.",

        heroTitleAccent:
            "Grow smarter.",

        heroDescription:
            "Crop_Yield_Prediction-AI transforms agricultural data into intelligent crop yield predictions, helping agriculturalists make smarter decisions with confidence.",

        startPredicting:
            "Start Predicting",

        openDashboard:
            "Open Dashboard",

        explorePlatform:
            "Explore platform",

        aiPredictions:
            "AI-powered predictions",

        dataInsights:
            "Data-driven insights",

        smarterFarming:
            "Smarter farming",

        modelAccuracy:
            "Model accuracy",

        intelligentInsights:
            "Intelligent insights",

        decisionSupport:
            "Decision support",

        featuresLabel:
            "Built for smarter agriculture",

        featuresTitle:
            "Everything you need to understand your yield.",

        featuresDescription:
            "From farm management to AI-powered predictions, YieldSenseAI brings the most important agricultural insights into one intelligent platform.",

        feature1Title:
            "AI Yield Prediction",

        feature1Description:
            "Use agricultural and environmental data to estimate crop yield before harvest.",

        feature2Title:
            "Farm Management",

        feature2Description:
            "Keep your farms, crop information and agricultural data organized in one place.",

        feature3Title:
            "Agricultural Analytics",

        feature3Description:
            "Turn prediction history and farm data into clear, useful performance insights.",

        feature4Title:
            "Weather Intelligence",

        feature4Description:
            "Understand environmental conditions that can influence agricultural performance.",

        feature5Title:
            "Soil Insights",

        feature5Description:
            "Bring soil-related information into your agricultural decision-making workflow.",

        feature6Title:
            "Prediction History",

        feature6Description:
            "Review previous predictions and track how your agricultural decisions evolve.",

        workflowLabel:
            "Simple workflow",

        workflowTitle:
            "From data to decision.",

        workflowDescription:
            "A straightforward workflow designed to turn agricultural information into useful predictions.",

        step1Title:
            "Add your farm",

        step1Description:
            "Create your farm profile and keep your agricultural information organized.",

        step2Title:
            "Enter crop data",

        step2Description:
            "Provide crop and environmental information used by the prediction model.",

        step3Title:
            "Get your prediction",

        step3Description:
            "Receive an AI-powered yield estimate and use it to support better decisions.",

        futureLabel:
            "The future of farming",

        futureTitle:
            "Make every agricultural decision with more confidence.",

        futureDescription:
            "Crop_Yield_Prediction-AI combines agricultural data, machine learning and intuitive analytics to help you understand your crops before harvest.",

        getStartedYieldSense:
            "Get started with YieldSenseAI",

        footerTagline:
            "Intelligent agriculture. Smarter decisions.",

        rights:
            "All rights reserved.",
    },


    // =========================================================
    // TELUGU
    // =========================================================

    te: {

        productName:
            "పంట_దిగుబడి_అంచనా-AI",

        subtitle:
            "తెలివైన వ్యవసాయం",

        features:
            "ఫీచర్లు",

        howItWorks:
            "ఎలా పనిచేస్తుంది",

        about:
            "మా గురించి",

        signIn:
            "సైన్ ఇన్",

        dashboard:
            "డ్యాష్‌బోర్డ్",

        getStarted:
            "ప్రారంభించండి",

        badge:
            "AI ఆధారిత వ్యవసాయ మేధస్సు",

        heroTitle:
            "మెరుగ్గా అంచనా వేయండి.",

        heroTitleAccent:
            "తెలివిగా సాగు చేయండి.",

        heroDescription:
            "Crop_Yield_Prediction-AI వ్యవసాయ డేటాను తెలివైన పంట దిగుబడి అంచనాలుగా మార్చి, వ్యవసాయదారులు మరింత నమ్మకంతో మెరుగైన నిర్ణయాలు తీసుకోవడానికి సహాయపడుతుంది.",

        startPredicting:
            "అంచనా ప్రారంభించండి",

        openDashboard:
            "డ్యాష్‌బోర్డ్ తెరవండి",

        explorePlatform:
            "ప్లాట్‌ఫారమ్‌ను అన్వేషించండి",

        aiPredictions:
            "AI ఆధారిత అంచనాలు",

        dataInsights:
            "డేటా ఆధారిత సమాచారం",

        smarterFarming:
            "తెలివైన వ్యవసాయం",

        modelAccuracy:
            "మోడల్ ఖచ్చితత్వం",

        intelligentInsights:
            "తెలివైన సమాచారం",

        decisionSupport:
            "నిర్ణయ సహాయం",

        featuresLabel:
            "తెలివైన వ్యవసాయం కోసం రూపొందించబడింది",

        featuresTitle:
            "మీ పంట దిగుబడిని అర్థం చేసుకోవడానికి అవసరమైన ప్రతిదీ.",

        featuresDescription:
            "వ్యవసాయ నిర్వహణ నుండి AI ఆధారిత అంచనాల వరకు, YieldSenseAI ముఖ్యమైన వ్యవసాయ సమాచారాన్ని ఒకే తెలివైన ప్లాట్‌ఫారమ్‌లో అందిస్తుంది.",

        feature1Title:
            "AI దిగుబడి అంచనా",

        feature1Description:
            "పంట కోతకు ముందే దిగుబడిని అంచనా వేయడానికి వ్యవసాయ మరియు పర్యావరణ డేటాను ఉపయోగించండి.",

        feature2Title:
            "వ్యవసాయ నిర్వహణ",

        feature2Description:
            "మీ పొలాలు, పంట సమాచారం మరియు వ్యవసాయ డేటాను ఒకే చోట సక్రమంగా నిర్వహించండి.",

        feature3Title:
            "వ్యవసాయ విశ్లేషణలు",

        feature3Description:
            "అంచనా చరిత్ర మరియు పొలాల డేటాను స్పష్టమైన, ఉపయోగకరమైన పనితీరు సమాచారంగా మార్చండి.",

        feature4Title:
            "వాతావరణ మేధస్సు",

        feature4Description:
            "వ్యవసాయ పనితీరును ప్రభావితం చేసే పర్యావరణ పరిస్థితులను అర్థం చేసుకోండి.",

        feature5Title:
            "నేల సమాచారం",

        feature5Description:
            "మీ వ్యవసాయ నిర్ణయ ప్రక్రియలో నేలకు సంబంధించిన సమాచారాన్ని ఉపయోగించండి.",

        feature6Title:
            "అంచనా చరిత్ర",

        feature6Description:
            "మునుపటి అంచనాలను పరిశీలించి, మీ వ్యవసాయ నిర్ణయాలు ఎలా మారుతున్నాయో తెలుసుకోండి.",

        workflowLabel:
            "సులభమైన ప్రక్రియ",

        workflowTitle:
            "డేటా నుండి నిర్ణయం వరకు.",

        workflowDescription:
            "వ్యవసాయ సమాచారాన్ని ఉపయోగకరమైన అంచనాలుగా మార్చడానికి రూపొందించిన సరళమైన ప్రక్రియ.",

        step1Title:
            "మీ పొలాన్ని జోడించండి",

        step1Description:
            "మీ పొలం ప్రొఫైల్‌ను సృష్టించి, వ్యవసాయ సమాచారాన్ని సక్రమంగా నిర్వహించండి.",

        step2Title:
            "పంట డేటాను నమోదు చేయండి",

        step2Description:
            "అంచనా మోడల్ ఉపయోగించే పంట మరియు పర్యావరణ సమాచారాన్ని అందించండి.",

        step3Title:
            "మీ అంచనాను పొందండి",

        step3Description:
            "AI ఆధారిత దిగుబడి అంచనాను పొందండి మరియు మెరుగైన నిర్ణయాలకు ఉపయోగించండి.",

        futureLabel:
            "వ్యవసాయం యొక్క భవిష్యత్తు",

        futureTitle:
            "ప్రతి వ్యవసాయ నిర్ణయాన్ని మరింత నమ్మకంతో తీసుకోండి.",

        futureDescription:
            "Crop_Yield_Prediction-AI వ్యవసాయ డేటా, మెషిన్ లెర్నింగ్ మరియు సులభమైన విశ్లేషణలను కలిపి, పంట కోతకు ముందే మీ పంటలను అర్థం చేసుకోవడానికి సహాయపడుతుంది.",

        getStartedYieldSense:
            "YieldSenseAIతో ప్రారంభించండి",

        footerTagline:
            "తెలివైన వ్యవసాయం. మెరుగైన నిర్ణయాలు.",

        rights:
            "అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.",
    },


    // =========================================================
    // HINDI
    // =========================================================

    hi: {

        productName:
            "फसल_उपज_पूर्वानुमान-AI",

        subtitle:
            "बुद्धिमान कृषि",

        features:
            "विशेषताएँ",

        howItWorks:
            "यह कैसे काम करता है",

        about:
            "हमारे बारे में",

        signIn:
            "साइन इन",

        dashboard:
            "डैशबोर्ड",

        getStarted:
            "शुरू करें",

        badge:
            "AI-संचालित कृषि बुद्धिमत्ता",

        heroTitle:
            "बेहतर पूर्वानुमान लगाएँ.",

        heroTitleAccent:
            "और स्मार्ट तरीके से खेती करें.",

        heroDescription:
            "Crop_Yield_Prediction-AI कृषि डेटा को बुद्धिमान फसल उपज पूर्वानुमानों में बदलता है, जिससे कृषि विशेषज्ञ अधिक आत्मविश्वास के साथ बेहतर निर्णय ले सकते हैं।",

        startPredicting:
            "पूर्वानुमान शुरू करें",

        openDashboard:
            "डैशबोर्ड खोलें",

        explorePlatform:
            "प्लेटफ़ॉर्म देखें",

        aiPredictions:
            "AI-संचालित पूर्वानुमान",

        dataInsights:
            "डेटा-आधारित जानकारी",

        smarterFarming:
            "स्मार्ट खेती",

        modelAccuracy:
            "मॉडल सटीकता",

        intelligentInsights:
            "बुद्धिमान जानकारी",

        decisionSupport:
            "निर्णय सहायता",

        featuresLabel:
            "स्मार्ट कृषि के लिए बनाया गया",

        featuresTitle:
            "अपनी फसल की उपज को समझने के लिए आवश्यक सभी सुविधाएँ।",

        featuresDescription:
            "फार्म प्रबंधन से लेकर AI-संचालित पूर्वानुमानों तक, YieldSenseAI महत्वपूर्ण कृषि जानकारी को एक बुद्धिमान प्लेटफ़ॉर्म में लाता है।",

        feature1Title:
            "AI उपज पूर्वानुमान",

        feature1Description:
            "कटाई से पहले फसल की उपज का अनुमान लगाने के लिए कृषि और पर्यावरणीय डेटा का उपयोग करें।",

        feature2Title:
            "फार्म प्रबंधन",

        feature2Description:
            "अपने खेतों, फसल की जानकारी और कृषि डेटा को एक ही स्थान पर व्यवस्थित रखें।",

        feature3Title:
            "कृषि विश्लेषण",

        feature3Description:
            "पूर्वानुमान इतिहास और खेत के डेटा को स्पष्ट और उपयोगी प्रदर्शन जानकारी में बदलें।",

        feature4Title:
            "मौसम संबंधी जानकारी",

        feature4Description:
            "उन पर्यावरणीय परिस्थितियों को समझें जो कृषि प्रदर्शन को प्रभावित कर सकती हैं।",

        feature5Title:
            "मृदा जानकारी",

        feature5Description:
            "अपने कृषि निर्णय लेने की प्रक्रिया में मिट्टी से संबंधित जानकारी का उपयोग करें।",

        feature6Title:
            "पूर्वानुमान इतिहास",

        feature6Description:
            "पिछले पूर्वानुमानों की समीक्षा करें और देखें कि आपके कृषि निर्णय कैसे बदल रहे हैं।",

        workflowLabel:
            "सरल प्रक्रिया",

        workflowTitle:
            "डेटा से निर्णय तक।",

        workflowDescription:
            "कृषि जानकारी को उपयोगी पूर्वानुमानों में बदलने के लिए बनाई गई सरल प्रक्रिया।",

        step1Title:
            "अपना खेत जोड़ें",

        step1Description:
            "अपनी खेत प्रोफ़ाइल बनाएँ और अपनी कृषि जानकारी को व्यवस्थित रखें।",

        step2Title:
            "फसल डेटा दर्ज करें",

        step2Description:
            "पूर्वानुमान मॉडल द्वारा उपयोग की जाने वाली फसल और पर्यावरणीय जानकारी प्रदान करें।",

        step3Title:
            "अपना पूर्वानुमान प्राप्त करें",

        step3Description:
            "AI-संचालित उपज अनुमान प्राप्त करें और बेहतर निर्णय लेने में इसका उपयोग करें।",

        futureLabel:
            "खेती का भविष्य",

        futureTitle:
            "हर कृषि निर्णय अधिक आत्मविश्वास के साथ लें।",

        futureDescription:
            "Crop_Yield_Prediction-AI कृषि डेटा, मशीन लर्निंग और सहज विश्लेषण को जोड़कर कटाई से पहले आपकी फसलों को समझने में मदद करता है।",

        getStartedYieldSense:
            "YieldSenseAI के साथ शुरू करें",

        footerTagline:
            "बुद्धिमान कृषि। बेहतर निर्णय।",

        rights:
            "सर्वाधिकार सुरक्षित।",
    },
};


// =============================================================
// HOME PAGE
// =============================================================

export default function Home() {

    const router =
        useRouter();


    // =========================================================
    // GET GLOBAL LANGUAGE
    //
    // THIS IS THE IMPORTANT FIX.
    //
    // LanguageSwitcher changes LanguageContext.
    // This component now listens to the same context.
    // =========================================================

    const {
        language,
    } = useLanguage();

    const [languageReady, setLanguageReady] = useState(false);
    useEffect(() => {
        setLanguageReady(true);
    }, []);


    // =========================================================
    // AUTH STATE
    // =========================================================

    const [
        isLoggedIn,
        setIsLoggedIn,
    ] = useState(false);


    const [
        loaded,
        setLoaded,
    ] = useState(false);


    // =========================================================
    // CURRENT LANDING PAGE TRANSLATION
    // =========================================================

    const t =
        translations[
            languageReady
            ? language
            : "en"
        ];


    // =========================================================
    // AUTH
    //
    // LANGUAGE IS NO LONGER MANAGED HERE.
    // LanguageContext is now the single source of truth.
    // =========================================================

    useEffect(() => {

        const token =
            getToken();


        setIsLoggedIn(
            Boolean(token)
        );


        setLoaded(
            true
        );

    }, []);


    // =========================================================
    // ACTIONS
    // =========================================================

    const handleGetStarted = () => {

        if (isLoggedIn) {

            router.push(
                "/dashboard"
            );

        } else {

            router.push(
                "/register"
            );
        }
    };


    const handleLogin = () => {

        router.push(
            "/login"
        );
    };


    const handleDashboard = () => {

        router.push(
            "/dashboard"
        );
    };


    const handleExplore = () => {

        document
            .getElementById(
                "features"
            )
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };


    return (

        <main
            className="
                min-h-screen
                overflow-x-hidden
                bg-[#06130d]
                text-white
            "
        >

            {/* ========================================================= */}
            {/* HERO */}
            {/* ========================================================= */}

            <section
                className="
                    relative
                    flex
                    min-h-screen
                    flex-col
                    overflow-hidden
                "
            >

                {/* Background Video */}

                <video
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        scale-[1.02]
                        object-cover
                    "
                    src="/videos/yieldsense-hero.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                />


                {/* Cinematic overlay */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-black/45
                    "
                />


                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-b
                        from-[#03150c]/80
                        via-[#062516]/45
                        to-[#06130d]
                    "
                />


                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-[#03150c]/80
                        via-transparent
                        to-[#03150c]/35
                    "
                />


                {/* ===================================================== */}
                {/* NAVBAR */}
                {/* ===================================================== */}

                <nav
                    className="
                        relative
                        z-20
                        w-full
                        border-b
                        border-white/10
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-20
                            max-w-7xl
                            items-center
                            justify-between
                            px-5
                            sm:px-8
                            lg:px-10
                        "
                    >

                        {/* Logo */}

                        <button
                            onClick={() =>
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            className="
                                flex
                                items-center
                                gap-3
                                group
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-white/20
                                    bg-white/10
                                    backdrop-blur-xl
                                    shadow-2xl
                                    transition
                                    group-hover:bg-white/15
                                "
                            >

                                <svg
                                    width="23"
                                    height="23"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >

                                    <path
                                        d="M12 21C12 21 19 16.8 19 10.5C19 6.4 15.9 3 12 3C8.1 3 5 6.4 5 10.5C5 16.8 12 21 12 21Z"
                                    />

                                    <path
                                        d="M12 21V8"
                                    />

                                    <path
                                        d="M12 13C9.5 12.5 8 11.2 7 9.5"
                                    />

                                    <path
                                        d="M12 15C14.5 14.5 16 13.2 17 11.5"
                                    />

                                </svg>

                            </div>


                            <div className="text-left">

                                <p
                                    className="
                                        text-lg
                                        font-bold
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    {t.productName}
                                </p>


                                <p
                                    className="
                                        hidden
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-[0.2em]
                                        text-white/55
                                        sm:block
                                    "
                                >
                                    {t.subtitle}
                                </p>

                            </div>

                        </button>


                        {/* Desktop navigation */}

                        <div
                            className="
                                hidden
                                items-center
                                gap-8
                                md:flex
                            "
                        >

                            <button
                                onClick={handleExplore}
                                className="
                                    text-sm
                                    font-medium
                                    text-white/75
                                    transition
                                    hover:text-white
                                "
                            >
                                {t.features}
                            </button>


                            <button
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "how-it-works"
                                        )
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                                className="
                                    text-sm
                                    font-medium
                                    text-white/75
                                    transition
                                    hover:text-white
                                "
                            >
                                {t.howItWorks}
                            </button>


                            <button
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "about"
                                        )
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                                className="
                                    text-sm
                                    font-medium
                                    text-white/75
                                    transition
                                    hover:text-white
                                "
                            >
                                {t.about}
                            </button>

                        </div>


                        {/* Authentication + Language */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                sm:gap-3
                            "
                        >

                            <LanguageSwitcher />


                            {!loaded ? (

                                <div
                                    className="
                                        h-10
                                        w-24
                                        animate-pulse
                                        rounded-xl
                                        bg-white/10
                                    "
                                />

                            ) : isLoggedIn ? (

                                <button
                                    onClick={
                                        handleDashboard
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-white/20
                                        bg-white/10
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        backdrop-blur-md
                                        transition
                                        hover:bg-white/20
                                        sm:px-5
                                    "
                                >
                                    {t.dashboard}
                                </button>

                            ) : (

                                <>
                                    <button
                                        onClick={
                                            handleLogin
                                        }
                                        className="
                                            hidden
                                            rounded-xl
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-white/85
                                            transition
                                            hover:text-white
                                            sm:block
                                        "
                                    >
                                        {t.signIn}
                                    </button>


                                    <button
                                        onClick={
                                            handleGetStarted
                                        }
                                        className="
                                            rounded-xl
                                            bg-white
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-bold
                                            text-emerald-950
                                            shadow-xl
                                            shadow-black/10
                                            transition
                                            hover:-translate-y-0.5
                                            hover:bg-emerald-50
                                            sm:px-5
                                        "
                                    >
                                        {t.getStarted}
                                    </button>
                                </>

                            )}

                        </div>

                    </div>

                </nav>


                {/* ===================================================== */}
                {/* HERO CONTENT */}
                {/* ===================================================== */}

                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-1
                        items-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-7xl
                            px-5
                            py-20
                            sm:px-8
                            lg:px-10
                            lg:py-24
                        "
                    >

                        <div className="max-w-4xl">

                            {/* Badge */}

                            <div
                                className="
                                    mb-7
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-emerald-300/20
                                    bg-emerald-950/35
                                    px-3.5
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-emerald-200
                                    backdrop-blur-xl
                                "
                            >

                                <span
                                    className="
                                        relative
                                        flex
                                        h-2
                                        w-2
                                    "
                                >

                                    <span
                                        className="
                                            absolute
                                            inline-flex
                                            h-full
                                            w-full
                                            animate-ping
                                            rounded-full
                                            bg-emerald-400
                                            opacity-75
                                        "
                                    />

                                    <span
                                        className="
                                            relative
                                            inline-flex
                                            h-2
                                            w-2
                                            rounded-full
                                            bg-emerald-400
                                        "
                                    />

                                </span>


                                {t.badge}

                            </div>


                            {/* Heading */}

                            <h1
                                className="
                                    max-w-4xl
                                    text-5xl
                                    font-black
                                    leading-[0.98]
                                    tracking-[-0.04em]
                                    text-white
                                    sm:text-6xl
                                    lg:text-8xl
                                "
                            >

                                {t.heroTitle}

                                <br />

                                <span
                                    className="
                                        bg-gradient-to-r
                                        from-emerald-200
                                        via-green-300
                                        to-lime-200
                                        bg-clip-text
                                        text-transparent
                                    "
                                >
                                    {t.heroTitleAccent}
                                </span>

                            </h1>


                            {/* Description */}

                            <p
                                className="
                                    mt-7
                                    max-w-2xl
                                    text-base
                                    leading-7
                                    text-white/70
                                    sm:text-lg
                                    sm:leading-8
                                "
                            >
                                {t.heroDescription}
                            </p>


                            {/* CTA */}

                            <div
                                className="
                                    mt-9
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                "
                            >

                                <button
                                    onClick={
                                        handleGetStarted
                                    }
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2.5
                                        rounded-2xl
                                        bg-emerald-400
                                        px-6
                                        py-4
                                        text-sm
                                        font-bold
                                        text-emerald-950
                                        shadow-2xl
                                        shadow-emerald-950/30
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:bg-emerald-300
                                        hover:shadow-emerald-400/20
                                    "
                                >

                                    {isLoggedIn
                                        ? t.openDashboard
                                        : t.startPredicting
                                    }


                                    <svg
                                        className="
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >

                                        <path
                                            d="M5 12h14"
                                        />

                                        <path
                                            d="m13 6 6 6-6 6"
                                        />

                                    </svg>

                                </button>


                                <button
                                    onClick={
                                        handleExplore
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-2xl
                                        border
                                        border-white/15
                                        bg-white/10
                                        px-6
                                        py-4
                                        text-sm
                                        font-semibold
                                        text-white
                                        backdrop-blur-xl
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:bg-white/15
                                    "
                                >

                                    {t.explorePlatform}


                                    <svg
                                        width="17"
                                        height="17"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >

                                        <path
                                            d="M12 5v14"
                                        />

                                        <path
                                            d="m19 12-7 7-7-7"
                                        />

                                    </svg>

                                </button>

                            </div>


                            {/* Trust indicators */}

                            <div
                                className="
                                    mt-10
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-6
                                    gap-y-3
                                    text-xs
                                    text-white/55
                                "
                            >

                                <TrustItem
                                    text={
                                        t.aiPredictions
                                    }
                                />

                                <TrustItem
                                    text={
                                        t.dataInsights
                                    }
                                />

                                <TrustItem
                                    text={
                                        t.smarterFarming
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ===================================================== */}
                {/* FLOATING STATS */}
                {/* ===================================================== */}

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        hidden
                        w-full
                        max-w-7xl
                        px-10
                        pb-10
                        lg:block
                    "
                >

                    <div className="flex justify-end">

                        <div
                            className="
                                grid
                                w-[570px]
                                grid-cols-3
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/10
                                bg-black/20
                                backdrop-blur-xl
                            "
                        >

                            <Stat
                                value="95%"
                                label={
                                    t.modelAccuracy
                                }
                            />

                            <Stat
                                value="AI"
                                label={
                                    t.intelligentInsights
                                }
                            />

                            <Stat
                                value="24/7"
                                label={
                                    t.decisionSupport
                                }
                                last
                            />

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* FEATURES */}
            {/* ========================================================= */}

            <section
                id="features"
                className="
                    relative
                    bg-[#06130d]
                    px-5
                    py-24
                    sm:px-8
                    lg:px-10
                    lg:py-32
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                    "
                >

                    <div
                        className="
                            max-w-2xl
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.25em]
                                text-emerald-400
                            "
                        >
                            {t.featuresLabel}
                        </p>


                        <h2
                            className="
                                mt-4
                                text-3xl
                                font-bold
                                tracking-tight
                                text-white
                                sm:text-5xl
                            "
                        >
                            {t.featuresTitle}
                        </h2>


                        <p
                            className="
                                mt-5
                                text-base
                                leading-7
                                text-white/55
                            "
                        >
                            {t.featuresDescription}
                        </p>

                    </div>


                    <div
                        className="
                            mt-14
                            grid
                            gap-5
                            md:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        <FeatureCard
                            number="01"
                            title={
                                t.feature1Title
                            }
                            description={
                                t.feature1Description
                            }
                            icon={
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >

                                    <path
                                        d="M3 3v18h18"
                                    />

                                    <path
                                        d="m7 15 4-5 3 3 5-7"
                                    />

                                </svg>
                            }
                        />


                        <FeatureCard
                            number="02"
                            title={
                                t.feature2Title
                            }
                            description={
                                t.feature2Description
                            }
                            icon={
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >

                                    <path
                                        d="M3 21h18"
                                    />

                                    <path
                                        d="M5 21V8l7-5 7 5v13"
                                    />

                                    <path
                                        d="M9 21v-6h6v6"
                                    />

                                </svg>
                            }
                        />


                        <FeatureCard
                            number="03"
                            title={
                                t.feature3Title
                            }
                            description={
                                t.feature3Description
                            }
                            icon={
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >

                                    <path
                                        d="M4 19V5"
                                    />

                                    <path
                                        d="M4 19h16"
                                    />

                                    <path
                                        d="m7 15 3-4 3 2 5-7"
                                    />

                                </svg>
                            }
                        />


                        <FeatureCard
                            number="04"
                            title={
                                t.feature4Title
                            }
                            description={
                                t.feature4Description
                            }
                            icon={
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >

                                    <path
                                        d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4 4 0 0 1 0 8Z"
                                    />

                                    <path
                                        d="M12 3v2"
                                    />

                                    <path
                                        d="m4.9 5.9 1.4 1.4"
                                    />

                                    <path
                                        d="M3 13h2"
                                    />

                                </svg>
                            }
                        />


                        <FeatureCard
                            number="05"
                            title={
                                t.feature5Title
                            }
                            description={
                                t.feature5Description
                            }
                            icon={
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >

                                    <path
                                        d="M4 18c4-1 5-5 8-5s4 4 8 5"
                                    />

                                    <path
                                        d="M5 18v3"
                                    />

                                    <path
                                        d="M19 18v3"
                                    />

                                    <path
                                        d="M7 13c1-5 3-8 5-8s4 3 5 8"
                                    />

                                </svg>
                            }
                        />


                        <FeatureCard
                            number="06"
                            title={
                                t.feature6Title
                            }
                            description={
                                t.feature6Description
                            }
                            icon={
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >

                                    <path
                                        d="M3 12a9 9 0 1 0 3-6.7"
                                    />

                                    <path
                                        d="M3 4v5h5"
                                    />

                                    <path
                                        d="M12 7v5l3 2"
                                    />

                                </svg>
                            }
                        />

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* HOW IT WORKS */}
            {/* ========================================================= */}

            <section
                id="how-it-works"
                className="
                    border-y
                    border-white/5
                    bg-[#081a11]
                    px-5
                    py-24
                    sm:px-8
                    lg:px-10
                    lg:py-32
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                    "
                >

                    <div className="text-center">

                        <p
                            className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.25em]
                                text-emerald-400
                            "
                        >
                            {t.workflowLabel}
                        </p>


                        <h2
                            className="
                                mt-4
                                text-3xl
                                font-bold
                                tracking-tight
                                text-white
                                sm:text-5xl
                            "
                        >
                            {t.workflowTitle}
                        </h2>


                        <p
                            className="
                                mx-auto
                                mt-5
                                max-w-2xl
                                text-white/55
                            "
                        >
                            {t.workflowDescription}
                        </p>

                    </div>


                    <div
                        className="
                            mt-16
                            grid
                            gap-8
                            md:grid-cols-3
                        "
                    >

                        <Step
                            number="01"
                            title={
                                t.step1Title
                            }
                            description={
                                t.step1Description
                            }
                        />


                        <Step
                            number="02"
                            title={
                                t.step2Title
                            }
                            description={
                                t.step2Description
                            }
                        />


                        <Step
                            number="03"
                            title={
                                t.step3Title
                            }
                            description={
                                t.step3Description
                            }
                        />

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* ABOUT / CTA */}
            {/* ========================================================= */}

            <section
                id="about"
                className="
                    px-5
                    py-24
                    sm:px-8
                    lg:px-10
                    lg:py-32
                "
            >

                <div
                    className="
                        relative
                        mx-auto
                        max-w-7xl
                        overflow-hidden
                        rounded-[2rem]
                        border
                        border-emerald-400/10
                        bg-gradient-to-br
                        from-emerald-950
                        via-[#092218]
                        to-[#0c2418]
                        p-8
                        sm:p-12
                        lg:p-16
                    "
                >

                    {/* Decorative glow */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-32
                            -top-32
                            h-80
                            w-80
                            rounded-full
                            bg-emerald-400/10
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-32
                            -left-32
                            h-80
                            w-80
                            rounded-full
                            bg-green-500/10
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            max-w-3xl
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.25em]
                                text-emerald-400
                            "
                        >
                            {t.futureLabel}
                        </p>


                        <h2
                            className="
                                mt-5
                                text-3xl
                                font-bold
                                tracking-tight
                                text-white
                                sm:text-5xl
                            "
                        >
                            {t.futureTitle}
                        </h2>


                        <p
                            className="
                                mt-5
                                max-w-2xl
                                text-base
                                leading-7
                                text-white/55
                            "
                        >
                            {t.futureDescription}
                        </p>


                        <button
                            onClick={
                                handleGetStarted
                            }
                            className="
                                group
                                mt-8
                                inline-flex
                                items-center
                                gap-2.5
                                rounded-2xl
                                bg-emerald-400
                                px-6
                                py-4
                                text-sm
                                font-bold
                                text-emerald-950
                                transition
                                hover:-translate-y-1
                                hover:bg-emerald-300
                            "
                        >

                            {isLoggedIn
                                ? t.openDashboard
                                : t.getStartedYieldSense
                            }


                            <svg
                                className="
                                    transition
                                    group-hover:translate-x-1
                                "
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >

                                <path
                                    d="M5 12h14"
                                />

                                <path
                                    d="m13 6 6 6-6 6"
                                />

                            </svg>

                        </button>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* FOOTER */}
            {/* ========================================================= */}

            <footer
                className="
                    border-t
                    border-white/5
                    bg-[#040d08]
                    px-5
                    py-10
                    sm:px-8
                    lg:px-10
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        max-w-7xl
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                font-bold
                                text-white
                            "
                        >

                            {t.productName}

                            <span
                                className="
                                    text-emerald-400
                                "
                            >
                            
                            </span>

                        </p>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-white/40
                            "
                        >
                            {t.footerTagline}
                        </p>

                    </div>


                    <p
                        className="
                            text-xs
                            text-white/35
                        "
                    >
                        © {new Date().getFullYear()} YieldSenseAI.{" "}
                        {t.rights}
                    </p>

                </div>

            </footer>

        </main>
    );
}


// =============================================================
// TRUST ITEM
// =============================================================

function TrustItem({
    text,
}: {
    text: string;
}) {

    return (

        <div
            className="
                flex
                items-center
                gap-2
            "
        >

            <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-400"
            >

                <path
                    d="M20 6 9 17l-5-5"
                />

            </svg>

            {text}

        </div>
    );
}


// =============================================================
// STAT
// =============================================================

function Stat({
    value,
    label,
    last = false,
}: {
    value: string;
    label: string;
    last?: boolean;
}) {

    return (

        <div
            className={
                last
                    ? "p-5"
                    : "border-r border-white/10 p-5"
            }
        >

            <p
                className="
                    text-2xl
                    font-bold
                    text-white
                "
            >
                {value}
            </p>


            <p
                className="
                    mt-1
                    text-xs
                    text-white/50
                "
            >
                {label}
            </p>

        </div>
    );
}


// =============================================================
// FEATURE CARD
// =============================================================

function FeatureCard({
    number,
    title,
    description,
    icon,
}: {
    number: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}) {

    return (

        <div
            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/8
                bg-white/[0.035]
                p-7
                transition-all
                duration-500
                hover:-translate-y-1
                hover:border-emerald-400/20
                hover:bg-white/[0.055]
            "
        >

            <div
                className="
                    absolute
                    right-5
                    top-5
                    text-xs
                    font-bold
                    tracking-widest
                    text-white/15
                "
            >
                {number}
            </div>


            <div
                className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-emerald-400/10
                    bg-emerald-400/10
                    text-emerald-300
                    transition
                    duration-300
                    group-hover:scale-105
                    group-hover:bg-emerald-400/15
                "
            >
                {icon}
            </div>


            <h3
                className="
                    mt-6
                    text-lg
                    font-bold
                    text-white
                "
            >
                {title}
            </h3>


            <p
                className="
                    mt-3
                    text-sm
                    leading-6
                    text-white/45
                "
            >
                {description}
            </p>

        </div>
    );
}


// =============================================================
// HOW IT WORKS STEP
// =============================================================

function Step({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) {

    return (

        <div
            className="
                relative
            "
        >

            <div
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-emerald-400/15
                    bg-emerald-400/10
                    text-sm
                    font-bold
                    text-emerald-300
                "
            >
                {number}
            </div>


            <h3
                className="
                    mt-6
                    text-xl
                    font-bold
                    text-white
                "
            >
                {title}
            </h3>


            <p
                className="
                    mt-3
                    max-w-sm
                    text-sm
                    leading-6
                    text-white/45
                "
            >
                {description}
            </p>

        </div>
    );
}