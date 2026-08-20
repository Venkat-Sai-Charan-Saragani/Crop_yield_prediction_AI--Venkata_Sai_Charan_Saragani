"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Activity,
    ArrowRight,
    BarChart3,
    BrainCircuit,
    CheckCircle2,
    CloudSun,
    Leaf,
    MapPin,
    Sprout,
    Target,
    TrendingUp,
    Wheat,
} from "lucide-react";

import Sidebar
    from "@/components/layout/Sidebar";

import Navbar
    from "@/components/layout/Navbar";

import StatsCard
    from "@/components/dashboard/StatsCard";

import QuickActions
    from "@/components/dashboard/QuickActions";

import PredictionForm
    from "@/components/prediction/PredictionForm";

import PredictionHistory
    from "@/components/prediction/PredictionHistory";

import {
    getDashboardStats,
} from "@/services/dashboard";

import {
    useLanguage,
} from "@/context/LanguageContext";


// ============================================================
// TYPES
// ============================================================

interface DashboardStats {

    total_farms: number;

    total_crops: number;

    total_predictions: number;

    model_accuracy: number;
}


// ============================================================
// PAGE
// ============================================================

export default function DashboardPage() {

    // ========================================================
    // LANGUAGE
    // ========================================================

    const {
        t,
        language,
    } = useLanguage();


    // ========================================================
    // STATE
    // ========================================================

    const [
        stats,
        setStats,
    ] = useState<DashboardStats>({

        total_farms: 0,

        total_crops: 0,

        total_predictions: 0,

        model_accuracy: 0,
    });


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ========================================================
    // FETCH DASHBOARD DATA
    // ========================================================

    useEffect(() => {

        let mounted = true;


        const loadDashboard =
            async () => {

                try {

                    if (!mounted) {
                        return;
                    }

                    setLoading(true);

                    setError("");


                    const data =
                        await getDashboardStats();


                    if (!mounted) {
                        return;
                    }


                    setStats({

                        total_farms:
                            Number(
                                data?.total_farms ??
                                0
                            ),

                        total_crops:
                            Number(
                                data?.total_crops ??
                                0
                            ),

                        total_predictions:
                            Number(
                                data?.total_predictions ??
                                0
                            ),

                        model_accuracy:
                            Number(
                                data?.model_accuracy ??
                                0
                            ),
                    });


                } catch (
                    dashboardError
                ) {

                    console.error(
                        "DASHBOARD ERROR:",
                        dashboardError
                    );


                    if (!mounted) {
                        return;
                    }


                    // Use the existing translation
                    // instead of hard-coded English.
                    setError(
                        t.analyticsError
                    );


                } finally {

                    if (mounted) {

                        setLoading(
                            false
                        );
                    }
                }
            };


        loadDashboard();


        return () => {

            mounted = false;
        };

    }, [t.analyticsError]);


    // ========================================================
    // UI
    // ========================================================

    return (

        <div
            key={`dashboard-${language}`}
            className="
                min-h-screen
                bg-[#f5f7f5]
                text-slate-900
            "
        >

            {/* =================================================
                APPLICATION SHELL
            ================================================= */}

            <div
                className="
                    flex
                    min-h-screen
                "
            >

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <Sidebar />


                {/* =================================================
                    MAIN AREA
                ================================================= */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <Navbar />


                    <main
                        className="
                            mx-auto
                            w-full
                            max-w-[1800px]
                            px-4
                            py-6
                            sm:px-6
                            lg:px-8
                            xl:px-10
                        "
                    >

                        {/* =================================================
                            HERO
                        ================================================= */}

                        <section
                            className="
                                relative
                                mb-8
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-emerald-900/10
                                bg-slate-950
                                shadow-[0_25px_70px_-25px_rgba(15,23,42,0.35)]
                            "
                        >

                            {/* VIDEO */}

                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                aria-hidden="true"
                                className="
                                    absolute
                                    inset-0
                                    h-full
                                    w-full
                                    object-cover
                                "
                            >

                                <source
                                    src="/videos/dashboard.mp4"
                                    type="video/mp4"
                                />

                            </video>


                            {/* OVERLAY */}

                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-gradient-to-r
                                    from-slate-950/95
                                    via-emerald-950/80
                                    to-slate-950/35
                                "
                            />


                            {/* GLOW */}

                            <div
                                className="
                                    absolute
                                    -right-32
                                    -top-32
                                    h-96
                                    w-96
                                    rounded-full
                                    bg-emerald-400/20
                                    blur-3xl
                                "
                            />


                            <div
                                className="
                                    relative
                                    z-10
                                    flex
                                    min-h-[430px]
                                    items-center
                                    px-6
                                    py-12
                                    sm:px-10
                                    lg:px-14
                                    xl:px-16
                                "
                            >

                                <div
                                    className="
                                        max-w-4xl
                                    "
                                >

                                    {/* STATUS */}

                                    <div
                                        className="
                                            mb-6
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-white/15
                                            bg-white/10
                                            px-4
                                            py-2
                                            text-sm
                                            font-medium
                                            text-white
                                            shadow-lg
                                            backdrop-blur-xl
                                        "
                                    >

                                        <span
                                            className="
                                                flex
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-emerald-400
                                                shadow-[0_0_12px_rgba(52,211,153,0.9)]
                                            "
                                        />

                                        {t.aiAgricultureSystem}

                                        <span
                                            className="
                                                text-white/40
                                            "
                                        >
                                            •
                                        </span>

                                        {t.operational}

                                    </div>


                                    {/* HEADING */}

                                    <h1
                                        className="
                                            max-w-4xl
                                            text-4xl
                                            font-black
                                            leading-[0.98]
                                            tracking-[-0.04em]
                                            text-white
                                            sm:text-5xl
                                            lg:text-6xl
                                            xl:text-7xl
                                        "
                                    >

                                        {
                                            t
                                                .intelligentAgricultureBetterDecisions
                                                .split(". ")[0]
                                        }.

                                        <br />

                                        <span
                                            className="
                                                bg-gradient-to-r
                                                from-emerald-300
                                                via-green-200
                                                to-white
                                                bg-clip-text
                                                text-transparent
                                            "
                                        >

                                            {
                                                t
                                                    .intelligentAgricultureBetterDecisions
                                                    .split(". ")
                                                    .slice(1)
                                                    .join(". ")
                                            }

                                        </span>

                                    </h1>


                                    {/* DESCRIPTION */}

                                    <p
                                        className="
                                            mt-6
                                            max-w-2xl
                                            text-base
                                            leading-7
                                            text-white/75
                                            sm:text-lg
                                        "
                                    >

                                        {
                                            t.dashboardDescription
                                        }

                                    </p>


                                    {/* TAGS */}

                                    <div
                                        className="
                                            mt-8
                                            flex
                                            flex-wrap
                                            gap-3
                                        "
                                    >

                                        {/* AI PREDICTION */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                rounded-full
                                                border
                                                border-white/10
                                                bg-white/10
                                                px-4
                                                py-2
                                                text-sm
                                                text-white/90
                                                backdrop-blur-md
                                            "
                                        >

                                            <BrainCircuit
                                                size={16}
                                                className="
                                                    text-emerald-300
                                                "
                                            />

                                            {t.aiPrediction}

                                        </div>


                                        {/* ANALYTICS */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                rounded-full
                                                border
                                                border-white/10
                                                bg-white/10
                                                px-4
                                                py-2
                                                text-sm
                                                text-white/90
                                                backdrop-blur-md
                                            "
                                        >

                                            <BarChart3
                                                size={16}
                                                className="
                                                    text-emerald-300
                                                "
                                            />

                                            {t.smartAnalytics}

                                        </div>


                                        {/* ENVIRONMENT */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                rounded-full
                                                border
                                                border-white/10
                                                bg-white/10
                                                px-4
                                                py-2
                                                text-sm
                                                text-white/90
                                                backdrop-blur-md
                                            "
                                        >

                                            <CloudSun
                                                size={16}
                                                className="
                                                    text-emerald-300
                                                "
                                            />

                                            {t.environmentalInsights}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div
                                className="
                                    mb-6
                                    flex
                                    items-center
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-amber-200
                                    bg-amber-50
                                    px-5
                                    py-4
                                    text-sm
                                    text-amber-800
                                "
                            >

                                <Activity
                                    size={18}
                                />

                                {error}

                            </div>

                        )}


                        {/* =================================================
                            OVERVIEW
                        ================================================= */}

                        <section
                            className="
                                mb-5
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >

                            <div>

                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <span
                                        className="
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            bg-emerald-500
                                        "
                                    />

                                    <span
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-emerald-700
                                        "
                                    >

                                        {t.overview}

                                    </span>

                                </div>


                                <h2
                                    className="
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-slate-950
                                    "
                                >

                                    {t.yourFarmIntelligence}

                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    {t.realTimeFarmSnapshot}

                                </p>

                            </div>


                            <div
                                className="
                                    hidden
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-emerald-100
                                    bg-white
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-slate-600
                                    shadow-sm
                                    sm:flex
                                "
                            >

                                <CheckCircle2
                                    size={15}
                                    className="
                                        text-emerald-500
                                    "
                                />

                                {t.systemOperational}

                            </div>

                        </section>


                        {/* =================================================
                            STAT CARDS
                        ================================================= */}

                        <section
                            className="
                                mb-10
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                                xl:grid-cols-4
                            "
                        >

                            <StatsCard
                                title={
                                    t.totalFarms
                                }
                                value={
                                    stats.total_farms
                                }
                                description={
                                    t.registeredFarmingLocations
                                }
                                icon={Wheat}
                                loading={
                                    loading
                                }
                            />


                            <StatsCard
                                title={
                                    t.totalCrops
                                }
                                value={
                                    stats.total_crops
                                }
                                description={
                                    t.cropsCurrentlyTracked
                                }
                                icon={Sprout}
                                loading={
                                    loading
                                }
                            />


                            <StatsCard
                                title={
                                    t.aiPredictions
                                }
                                value={
                                    stats.total_predictions
                                }
                                description={
                                    t.yieldForecastsGenerated
                                }
                                icon={
                                    BrainCircuit
                                }
                                loading={
                                    loading
                                }
                            />


                            <StatsCard
                                title={
                                    t.modelAccuracy
                                }
                                value={
                                    `${stats.model_accuracy}%`
                                }
                                description={
                                    t.currentPredictionPerformance
                                }
                                icon={
                                    Target
                                }
                                loading={
                                    loading
                                }
                            />

                        </section>


                        {/* =================================================
                            QUICK ACTIONS
                        ================================================= */}

                        <section
                            className="
                                mb-10
                                rounded-[26px]
                                border
                                border-slate-200/80
                                bg-white
                                p-5
                                shadow-sm
                                sm:p-7
                            "
                        >

                            <div
                                className="
                                    mb-6
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-emerald-600
                                        "
                                    >

                                        {t.quickActions}

                                    </p>


                                    <h2
                                        className="
                                            mt-1
                                            text-xl
                                            font-bold
                                            text-slate-950
                                        "
                                    >

                                        {t.whatWouldYouLikeToDo}

                                    </h2>

                                </div>


                                <div
                                    className="
                                        hidden
                                        items-center
                                        gap-2
                                        text-sm
                                        text-slate-400
                                        md:flex
                                    "
                                >

                                    <Leaf
                                        size={16}
                                    />

                                    {t.manageFarmIntelligence}

                                </div>

                            </div>


                            <QuickActions />

                        </section>


                        {/* =================================================
                            AI WORKSPACE
                        ================================================= */}

                        <section
                            className="
                                mb-10
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-emerald-100
                                bg-gradient-to-br
                                from-emerald-950
                                via-emerald-900
                                to-slate-950
                                shadow-[0_25px_70px_-30px_rgba(6,78,59,0.55)]
                            "
                        >

                            <div
                                className="
                                    grid
                                    lg:grid-cols-[0.75fr_1.25fr]
                                "
                            >

                                {/* LEFT */}

                                <div
                                    className="
                                        relative
                                        overflow-hidden
                                        p-7
                                        sm:p-10
                                    "
                                >

                                    <div
                                        className="
                                            absolute
                                            -right-24
                                            -top-24
                                            h-64
                                            w-64
                                            rounded-full
                                            bg-emerald-400/10
                                            blur-2xl
                                        "
                                    />


                                    <div
                                        className="
                                            relative
                                            z-10
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-2xl
                                                border
                                                border-emerald-300/20
                                                bg-emerald-400/10
                                                text-emerald-300
                                            "
                                        >

                                            <BrainCircuit
                                                size={25}
                                            />

                                        </div>


                                        <p
                                            className="
                                                mt-7
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.2em]
                                                text-emerald-300
                                            "
                                        >

                                            {t.aiIntelligence}

                                        </p>


                                        <h2
                                            className="
                                                mt-3
                                                text-3xl
                                                font-black
                                                tracking-tight
                                                text-white
                                                sm:text-4xl
                                            "
                                        >

                                            {t.predictYourNextHarvest}

                                        </h2>


                                        <p
                                            className="
                                                mt-5
                                                max-w-md
                                                text-sm
                                                leading-7
                                                text-emerald-100/70
                                            "
                                        >

                                            {t.aiWorkspaceDescription}

                                        </p>


                                        <div
                                            className="
                                                mt-8
                                                space-y-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    text-sm
                                                    text-white/80
                                                "
                                            >

                                                <CheckCircle2
                                                    size={17}
                                                    className="
                                                        text-emerald-400
                                                    "
                                                />

                                                {t.aiPoweredYieldEstimation}

                                            </div>


                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    text-sm
                                                    text-white/80
                                                "
                                            >

                                                <CheckCircle2
                                                    size={17}
                                                    className="
                                                        text-emerald-400
                                                    "
                                                />

                                                {t.agriculturalDataAnalysis}

                                            </div>


                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    text-sm
                                                    text-white/80
                                                "
                                            >

                                                <CheckCircle2
                                                    size={17}
                                                    className="
                                                        text-emerald-400
                                                    "
                                                />

                                                {t.fastPredictionResults}

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* RIGHT */}

                                <div
                                    className="
                                        bg-white
                                        p-5
                                        sm:p-8
                                    "
                                >

                                    <div
                                        className="
                                            mb-6
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <div>

                                            <h3
                                                className="
                                                    text-xl
                                                    font-bold
                                                    text-slate-950
                                                "
                                            >

                                                {t.yieldPrediction}

                                            </h3>


                                            <p
                                                className="
                                                    mt-1
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >

                                                {t.enterFarmConditions}

                                            </p>

                                        </div>


                                        <div
                                            className="
                                                hidden
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-emerald-50
                                                text-emerald-600
                                                sm:flex
                                            "
                                        >

                                            <TrendingUp
                                                size={19}
                                            />

                                        </div>

                                    </div>


                                    <PredictionForm />

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            LOWER DASHBOARD
                        ================================================= */}

                        <section
                            className="
                                grid
                                gap-6
                                xl:grid-cols-[1.35fr_0.65fr]
                            "
                        >

                            {/* PREDICTION HISTORY */}

                            <div
                                className="
                                    overflow-hidden
                                    rounded-[26px]
                                    border
                                    border-slate-200
                                    bg-white
                                    shadow-sm
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-slate-100
                                        px-6
                                        py-5
                                        sm:px-7
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.18em]
                                                text-emerald-600
                                            "
                                        >

                                            {t.activity}

                                        </p>


                                        <h2
                                            className="
                                                mt-1
                                                text-xl
                                                font-bold
                                                text-slate-950
                                            "
                                        >

                                            {t.recentPredictions}

                                        </h2>

                                    </div>


                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-slate-50
                                            text-slate-500
                                        "
                                    >

                                        <Activity
                                            size={18}
                                        />

                                    </div>

                                </div>


                                <div
                                    className="
                                        p-4
                                        sm:p-6
                                    "
                                >

                                    <PredictionHistory />

                                </div>

                            </div>


                            {/* INTELLIGENCE CARD */}

                            <div
                                className="
                                    relative
                                    overflow-hidden
                                    rounded-[26px]
                                    bg-slate-950
                                    p-7
                                    text-white
                                    shadow-xl
                                    sm:p-8
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        -right-24
                                        -top-24
                                        h-64
                                        w-64
                                        rounded-full
                                        bg-emerald-500/20
                                        blur-3xl
                                    "
                                />


                                <div
                                    className="
                                        absolute
                                        -bottom-28
                                        -left-20
                                        h-56
                                        w-56
                                        rounded-full
                                        bg-green-400/10
                                        blur-3xl
                                    "
                                />


                                <div
                                    className="
                                        relative
                                        z-10
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-emerald-500/15
                                            text-emerald-300
                                        "
                                    >

                                        <BarChart3
                                            size={23}
                                        />

                                    </div>


                                    <p
                                        className="
                                            mt-7
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-emerald-300
                                        "
                                    >

                                        {t.farmIntelligence}

                                    </p>


                                    <h2
                                        className="
                                            mt-2
                                            text-2xl
                                            font-bold
                                        "
                                    >

                                        {t.yourDataYourAdvantage}

                                    </h2>


                                    <p
                                        className="
                                            mt-4
                                            text-sm
                                            leading-7
                                            text-slate-400
                                        "
                                    >

                                        {t.farmIntelligenceDescription}

                                    </p>


                                    <div
                                        className="
                                            mt-7
                                            grid
                                            grid-cols-2
                                            gap-3
                                        "
                                    >

                                        {/* FARMS */}

                                        <div
                                            className="
                                                rounded-2xl
                                                border
                                                border-white/10
                                                bg-white/5
                                                p-4
                                            "
                                        >

                                            <MapPin
                                                size={17}
                                                className="
                                                    text-emerald-300
                                                "
                                            />


                                            <p
                                                className="
                                                    mt-3
                                                    text-2xl
                                                    font-bold
                                                "
                                            >

                                                {loading
                                                    ? "—"
                                                    : stats.total_farms
                                                }

                                            </p>


                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >

                                                {t.farmsTracked}

                                            </p>

                                        </div>


                                        {/* CROPS */}

                                        <div
                                            className="
                                                rounded-2xl
                                                border
                                                border-white/10
                                                bg-white/5
                                                p-4
                                            "
                                        >

                                            <Sprout
                                                size={17}
                                                className="
                                                    text-emerald-300
                                                "
                                            />


                                            <p
                                                className="
                                                    mt-3
                                                    text-2xl
                                                    font-bold
                                                "
                                            >

                                                {loading
                                                    ? "—"
                                                    : stats.total_crops
                                                }

                                            </p>


                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >

                                                {t.cropsTracked}

                                            </p>

                                        </div>

                                    </div>


                                    <div
                                        className="
                                            mt-7
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            font-semibold
                                            text-emerald-300
                                        "
                                    >

                                        <span>
                                            {t.predictSmarter}
                                        </span>

                                        <ArrowRight
                                            size={17}
                                        />

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <footer
                            className="
                                mt-10
                                border-t
                                border-slate-200
                                py-7
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    text-center
                                    text-xs
                                    text-slate-400
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    sm:text-left
                                "
                            >

                                <p>
                                    {t.footerCopyright}
                                </p>

                                <p>
                                    {t.footerTagline}
                                </p>

                            </div>

                        </footer>

                    </main>

                </div>

            </div>

        </div>
    );
}