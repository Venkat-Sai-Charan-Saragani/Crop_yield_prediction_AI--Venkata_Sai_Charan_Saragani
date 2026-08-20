"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Leaf,
    Loader2,
    MapPin,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import api from "@/services/api";

import {
    getToken,
} from "@/services/authServices";


// ============================================================
// INTERFACE
// ============================================================

interface Prediction {

    id?: string;

    _id?: string;

    crop?: string;

    crop_name?: string;

    area?: number | string;

    year?: number | string;

    predicted_yield?: number;

    yield_tonnes_per_hectare?: number;

    yield_kg_per_hectare?: number;

    previous_yield_tonnes_per_hectare?: number;

    previous_yield_kg_per_hectare?: number;

    yield_difference_tonnes?: number;

    yield_difference_kg?: number;

    percentage_change?: number;

    trend?:
        | "improving"
        | "declining"
        | "stable"
        | "first";

    created_at?: string;

}


// ============================================================
// NORMALIZED PREDICTION
// ============================================================

interface NormalizedPrediction {

    id: string;

    crop: string;

    area: string;

    year: number | string;

    yieldTons: number;

    yieldKg: number;

    previousYieldTons?: number;

    previousYieldKg?: number;

    differenceTons?: number;

    differenceKg?: number;

    percentageChange?: number;

    trend:
        | "improving"
        | "declining"
        | "stable"
        | "first";

    createdAt?: string;

}


// ============================================================
// HELPERS
// ============================================================

function safeNumber(
    value: unknown,
    fallback = 0
): number {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


// ============================================================
// COMPONENT
// ============================================================

export default function PredictionHistory() {

    const router =
        useRouter();

    // ========================================================
    // STATE
    // ========================================================

    const [
        predictions,
        setPredictions,
    ] = useState<NormalizedPrediction[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    // ========================================================
    // FETCH HISTORY
    // ========================================================

    useEffect(() => {

        let mounted = true;

        const fetchHistory =
            async () => {

                const token =
                    getToken();

                if (!token) {

                    if (mounted) {

                        setLoading(false);

                        setError(
                            "Please login to view prediction history."
                        );

                    }

                    return;
                }

                try {

                    setLoading(true);

                    setError("");

                    const response =
                        await api.get(
                            "/prediction/history"
                        );

                    console.log(
                        "Prediction History:",
                        response.data
                    );

                    const data =
                        response.data;

                    // ====================================================
                    // GET HISTORY ARRAY
                    // ====================================================

                    let history: Prediction[] = [];

                    if (
                        Array.isArray(data)
                    ) {

                        history =
                            data;

                    } else if (
                        Array.isArray(
                            data?.history
                        )
                    ) {

                        history =
                            data.history;

                    } else if (
                        Array.isArray(
                            data?.predictions
                        )
                    ) {

                        history =
                            data.predictions;

                    } else if (
                        Array.isArray(
                            data?.data
                        )
                    ) {

                        history =
                            data.data;

                    }

                    // ====================================================
                    // NORMALIZE
                    // ====================================================

                    const normalized =
                        history.map(
                            (
                                prediction,
                                index
                            ) => {

                                const crop =
                                    String(
                                        prediction.crop ??
                                        prediction.crop_name ??
                                        "Unknown"
                                    ).trim();

                                const area =
                                    String(
                                        prediction.area ??
                                        "Unknown"
                                    );

                                const year =
                                    prediction.year ??
                                    "-";

                                // ==================================================
                                // IMPORTANT
                                //
                                // Backend predicted_yield is already
                                // TONNES / HECTARE.
                                //
                                // DO NOT divide by 1000.
                                // ==================================================

                                const yieldTons =
                                    safeNumber(
                                        prediction.yield_tonnes_per_hectare ??
                                        prediction.predicted_yield
                                    );

                                const yieldKg =
                                    safeNumber(
                                        prediction.yield_kg_per_hectare,
                                        yieldTons * 1000
                                    );

                                // ==================================================
                                // TREND
                                // ==================================================

                                const previousYieldTons =
                                    prediction
                                        .previous_yield_tonnes_per_hectare;

                                const previousYieldKg =
                                    prediction
                                        .previous_yield_kg_per_hectare;

                                const differenceTons =
                                    prediction
                                        .yield_difference_tonnes;

                                const differenceKg =
                                    prediction
                                        .yield_difference_kg;

                                const percentageChange =
                                    prediction
                                        .percentage_change;

                                const trend =
                                    prediction.trend ??
                                    (
                                        percentageChange !== undefined
                                            ? percentageChange > 0
                                                ? "improving"
                                                : percentageChange < 0
                                                    ? "declining"
                                                    : "stable"
                                            : "first"
                                    );

                                return {

                                    id:
                                        prediction.id ??
                                        prediction._id ??
                                        `prediction-${index}`,

                                    crop,

                                    area,

                                    year,

                                    yieldTons,

                                    yieldKg,

                                    previousYieldTons,

                                    previousYieldKg,

                                    differenceTons,

                                    differenceKg,

                                    percentageChange,

                                    trend,

                                    createdAt:
                                        prediction.created_at,

                                };

                            }
                        );

                    if (mounted) {

                        setPredictions(
                            normalized
                        );

                    }

                } catch (error: any) {

                    console.error(
                        "Prediction History Error:",
                        error?.response?.data ??
                        error
                    );

                    if (!mounted) {
                        return;
                    }

                    if (
                        error?.response?.status === 401
                    ) {

                        setError(
                            "Your session has expired. Please login again."
                        );

                    } else {

                        setError(
                            "Failed to load prediction history."
                        );

                    }

                } finally {

                    if (mounted) {

                        setLoading(false);

                    }

                }

            };

        fetchHistory();

        return () => {

            mounted = false;

        };

    }, []);

    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate =
        (
            date?: string
        ) => {

            if (!date) {
                return "-";
            }

            const parsed =
                new Date(date);

            if (
                Number.isNaN(
                    parsed.getTime()
                )
            ) {

                return "-";

            }

            return parsed.toLocaleDateString(
                "en-IN",
                {
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric",
                }
            );

        };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <section
                className="
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-slate-200/80
                    bg-white
                    shadow-[0_16px_50px_rgba(15,23,42,0.06)]
                "
            >

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

                <div
                    className="
                        flex
                        min-h-[260px]
                        flex-col
                        items-center
                        justify-center
                        px-6
                        py-12
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
                            bg-emerald-50
                            text-emerald-600
                        "
                    >

                        <Loader2
                            size={25}
                            className="animate-spin"
                        />

                    </div>

                    <p
                        className="
                            mt-4
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                    >
                        Loading prediction history...
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-400
                        "
                    >
                        Retrieving your latest AI predictions
                    </p>

                </div>

            </section>

        );

    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <section
                className="
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-red-100
                    bg-white
                    shadow-[0_16px_50px_rgba(15,23,42,0.05)]
                "
            >

                <div
                    className="
                        h-1
                        w-full
                        bg-red-500
                    "
                />

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        px-6
                        py-12
                        text-center
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
                            bg-red-50
                            text-red-500
                        "
                    >

                        <BarChart3
                            size={24}
                        />

                    </div>

                    <h3
                        className="
                            mt-4
                            font-bold
                            text-slate-900
                        "
                    >
                        Unable to load history
                    </h3>

                    <p
                        className="
                            mt-1
                            max-w-md
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        {error}
                    </p>

                    {error.includes(
                        "session"
                    ) && (

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/login"
                                )
                            }
                            className="
                                mt-5
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-slate-950
                                px-5
                                py-2.5
                                text-sm
                                font-bold
                                text-white
                                transition
                                hover:bg-emerald-700
                            "
                        >

                            Login again

                            <ChevronRight
                                size={16}
                            />

                        </button>

                    )}

                </div>

            </section>

        );

    }

    // ========================================================
    // EMPTY
    // ========================================================

    if (
        predictions.length === 0
    ) {

        return (

            <section
                className="
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-slate-200/80
                    bg-white
                    shadow-[0_16px_50px_rgba(15,23,42,0.06)]
                "
            >

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

                <div
                    className="
                        px-5
                        py-6
                        sm:px-7
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
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                bg-emerald-50
                                text-emerald-600
                            "
                        >

                            <BarChart3
                                size={22}
                            />

                        </div>

                        <div>

                            <h2
                                className="
                                    text-xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                "
                            >
                                Prediction History
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Your AI-generated crop yield insights
                                will appear here.
                            </p>

                        </div>

                    </div>

                </div>

                <div
                    className="
                        border-t
                        border-slate-100
                        px-6
                        py-14
                        text-center
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
                            bg-slate-50
                            text-slate-400
                        "
                    >

                        <Leaf
                            size={28}
                        />

                    </div>

                    <h3
                        className="
                            mt-5
                            text-base
                            font-bold
                            text-slate-900
                        "
                    >
                        No predictions yet
                    </h3>

                    <p
                        className="
                            mx-auto
                            mt-1.5
                            max-w-md
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        Generate your first crop yield
                        prediction to start building your
                        agricultural intelligence history.
                    </p>

                </div>

            </section>

        );

    }

    // ========================================================
    // SUMMARY
    // ========================================================

    const totalPredictions =
        predictions.length;

    const totalYieldTons =
        predictions.reduce(
            (
                total,
                prediction
            ) =>
                total +
                prediction.yieldTons,
            0
        );

    const averageYieldTons =
        totalPredictions > 0
            ? totalYieldTons /
              totalPredictions
            : 0;

    const improvingPredictions =
        predictions.filter(
            prediction =>
                prediction.trend ===
                "improving"
        ).length;

    // ========================================================
    // TREND BADGE
    // ========================================================

    const TrendBadge = ({
        prediction,
    }: {
        prediction:
            NormalizedPrediction;
    }) => {

        const percentage =
            prediction.percentageChange ??
            0;

        if (
            prediction.trend ===
            "first"
        ) {

            return (

                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-slate-100
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-bold
                        text-slate-500
                    "
                >

                    <Clock3
                        size={12}
                    />

                    First record

                </span>

            );

        }

        if (
            prediction.trend ===
            "improving"
        ) {

            return (

                <div>

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-emerald-50
                            px-2.5
                            py-1.5
                            text-[10px]
                            font-bold
                            text-emerald-700
                        "
                    >

                        <ArrowUpRight
                            size={12}
                        />

                        Improving

                    </span>

                    <p
                        className="
                            mt-1.5
                            text-xs
                            font-semibold
                            text-emerald-600
                        "
                    >

                        +
                        {Math.abs(
                            percentage
                        ).toFixed(1)}
                        %

                    </p>

                </div>

            );

        }

        if (
            prediction.trend ===
            "declining"
        ) {

            return (

                <div>

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-red-50
                            px-2.5
                            py-1.5
                            text-[10px]
                            font-bold
                            text-red-600
                        "
                    >

                        <ArrowDownRight
                            size={12}
                        />

                        Declining

                    </span>

                    <p
                        className="
                            mt-1.5
                            text-xs
                            font-semibold
                            text-red-600
                        "
                    >

                        -
                        {Math.abs(
                            percentage
                        ).toFixed(1)}
                        %

                    </p>

                </div>

            );

        }

        return (

            <div>

                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-slate-100
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-bold
                        text-slate-600
                    "
                >

                    <CheckCircle2
                        size={12}
                    />

                    Stable

                </span>

                <p
                    className="
                        mt-1.5
                        text-xs
                        font-semibold
                        text-slate-500
                    "
                >
                    0.0%
                </p>

            </div>

        );

    };

    // ========================================================
    // UI
    // ========================================================

    return (

        <section
            className="
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200/80
                bg-white
                shadow-[0_16px_50px_rgba(15,23,42,0.06)]
            "
        >

            {/* =================================================
                ACCENT
            ================================================= */}

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

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    border-b
                    border-slate-100
                    px-5
                    py-6
                    sm:px-7
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
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
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-emerald-50
                                text-emerald-600
                            "
                        >

                            <BarChart3
                                size={23}
                            />

                        </div>

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <h2
                                    className="
                                        text-xl
                                        font-bold
                                        tracking-tight
                                        text-slate-950
                                    "
                                >
                                    Prediction History
                                </h2>

                                <span
                                    className="
                                        rounded-full
                                        bg-emerald-50
                                        px-2
                                        py-1
                                        text-[10px]
                                        font-bold
                                        text-emerald-700
                                    "
                                >
                                    {totalPredictions}
                                </span>

                            </div>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Review your previous crop yield
                                predictions and performance trends.
                            </p>

                        </div>

                    </div>

                    {/* SUMMARY */}

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-2
                            sm:flex
                        "
                    >

                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-100
                                bg-slate-50
                                px-3
                                py-2.5
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
                                Avg. Yield
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-black
                                    text-slate-900
                                "
                            >

                                {averageYieldTons.toFixed(2)}

                                <span
                                    className="
                                        ml-1
                                        text-[10px]
                                        font-semibold
                                        text-slate-400
                                    "
                                >
                                    tons/ha
                                </span>

                            </p>

                        </div>

                        <div
                            className="
                                rounded-xl
                                border
                                border-emerald-100
                                bg-emerald-50/70
                                px-3
                                py-2.5
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-emerald-600
                                "
                            >
                                Improving
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-black
                                    text-emerald-700
                                "
                            >

                                {improvingPredictions}

                                <span
                                    className="
                                        ml-1
                                        text-[10px]
                                        font-semibold
                                        text-emerald-500
                                    "
                                >
                                    trends
                                </span>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div
                className="
                    hidden
                    overflow-x-auto
                    md:block
                "
            >

                <table
                    className="
                        w-full
                        min-w-[900px]
                        border-collapse
                    "
                >

                    <thead>

                        <tr
                            className="
                                border-b
                                border-slate-100
                                bg-slate-50/70
                            "
                        >

                            {[
                                "Crop",
                                "Area",
                                "Year",
                                "Estimated Yield",
                                "Previous Yield",
                                "Trend",
                                "Date",
                            ].map(
                                heading => (

                                    <th
                                        key={heading}
                                        className="
                                            px-6
                                            py-4
                                            text-left
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-slate-400
                                        "
                                    >
                                        {heading}
                                    </th>

                                )
                            )}

                        </tr>

                    </thead>

                    <tbody>

                        {predictions.map(
                            prediction => {

                                const hasPrevious =
                                    prediction.previousYieldTons !==
                                    undefined &&
                                    prediction.previousYieldTons !==
                                    null;

                                return (

                                    <tr
                                        key={
                                            prediction.id
                                        }
                                        className="
                                            border-b
                                            border-slate-100
                                            transition-colors
                                            last:border-b-0
                                            hover:bg-emerald-50/30
                                        "
                                    >

                                        {/* CROP */}

                                        <td
                                            className="
                                                px-6
                                                py-4
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
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-emerald-50
                                                        text-emerald-600
                                                    "
                                                >

                                                    <Leaf
                                                        size={17}
                                                    />

                                                </div>

                                                <div>

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-bold
                                                            text-slate-900
                                                        "
                                                    >
                                                        {prediction.crop}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-0.5
                                                            text-[11px]
                                                            text-slate-400
                                                        "
                                                    >
                                                        Crop prediction
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        {/* AREA */}

                                        <td
                                            className="
                                                px-6
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    font-medium
                                                    text-slate-600
                                                "
                                            >

                                                <MapPin
                                                    size={14}
                                                    className="text-slate-400"
                                                />

                                                {prediction.area}

                                            </div>

                                        </td>

                                        {/* YEAR */}

                                        <td
                                            className="
                                                px-6
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    font-medium
                                                    text-slate-600
                                                "
                                            >

                                                <CalendarDays
                                                    size={14}
                                                    className="text-slate-400"
                                                />

                                                {prediction.year}

                                            </div>

                                        </td>

                                        {/* CURRENT YIELD */}

                                        <td
                                            className="
                                                px-6
                                                py-4
                                            "
                                        >

                                            <p
                                                className="
                                                    text-sm
                                                    font-black
                                                    text-slate-950
                                                "
                                            >

                                                {prediction.yieldTons.toFixed(
                                                    2
                                                )}

                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[11px]
                                                    font-medium
                                                    text-slate-400
                                                "
                                            >
                                                tons/hectare
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[10px]
                                                    text-slate-400
                                                "
                                            >
                                                {prediction.yieldKg.toFixed(
                                                    0
                                                )} kg/ha
                                            </p>

                                        </td>

                                        {/* PREVIOUS YIELD */}

                                        <td
                                            className="
                                                px-6
                                                py-4
                                            "
                                        >

                                            {hasPrevious ? (

                                                <>
                                                    <p
                                                        className="
                                                            text-sm
                                                            font-bold
                                                            text-slate-700
                                                        "
                                                    >

                                                        {prediction.previousYieldTons!.toFixed(
                                                            2
                                                        )}

                                                    </p>

                                                    <p
                                                        className="
                                                            mt-0.5
                                                            text-[11px]
                                                            text-slate-400
                                                        "
                                                    >
                                                        tons/hectare
                                                    </p>

                                                </>

                                            ) : (

                                                <span
                                                    className="
                                                        text-xs
                                                        text-slate-400
                                                    "
                                                >
                                                    No previous record
                                                </span>

                                            )}

                                        </td>

                                        {/* TREND */}

                                        <td
                                            className="
                                                px-6
                                                py-4
                                            "
                                        >

                                            <TrendBadge
                                                prediction={
                                                    prediction
                                                }
                                            />

                                        </td>

                                        {/* DATE */}

                                        <td
                                            className="
                                                px-6
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >

                                                <CalendarDays
                                                    size={14}
                                                    className="text-slate-300"
                                                />

                                                {formatDate(
                                                    prediction.createdAt
                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                );

                            }
                        )}

                    </tbody>

                </table>

            </div>

            {/* =================================================
                MOBILE
            ================================================= */}

            <div
                className="
                    divide-y
                    divide-slate-100
                    md:hidden
                "
            >

                {predictions.map(
                    prediction => {

                        const hasPrevious =
                            prediction.previousYieldTons !==
                            undefined &&
                            prediction.previousYieldTons !==
                            null;

                        return (

                            <div
                                key={
                                    prediction.id
                                }
                                className="
                                    p-5
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

                                            <Leaf
                                                size={19}
                                            />

                                        </div>

                                        <div>

                                            <p
                                                className="
                                                    font-bold
                                                    text-slate-900
                                                "
                                            >
                                                {prediction.crop}
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >
                                                {prediction.area}
                                            </p>

                                        </div>

                                    </div>

                                    <div
                                        className="
                                            text-right
                                        "
                                    >

                                        <p
                                            className="
                                                text-lg
                                                font-black
                                                text-slate-950
                                            "
                                        >

                                            {prediction.yieldTons.toFixed(
                                                2
                                            )}

                                        </p>

                                        <p
                                            className="
                                                text-[10px]
                                                font-medium
                                                text-slate-400
                                            "
                                        >
                                            tons/hectare
                                        </p>

                                    </div>

                                </div>

                                <div
                                    className="
                                        mt-5
                                        grid
                                        grid-cols-2
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            rounded-xl
                                            bg-slate-50
                                            px-3
                                            py-2.5
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
                                            Year
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-bold
                                                text-slate-700
                                            "
                                        >
                                            {prediction.year}
                                        </p>

                                    </div>

                                    <div
                                        className="
                                            rounded-xl
                                            bg-slate-50
                                            px-3
                                            py-2.5
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
                                            Date
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-bold
                                                text-slate-700
                                            "
                                        >
                                            {formatDate(
                                                prediction.createdAt
                                            )}
                                        </p>

                                    </div>

                                </div>

                                {hasPrevious && (

                                    <div
                                        className="
                                            mt-3
                                            rounded-xl
                                            border
                                            border-slate-100
                                            bg-slate-50
                                            px-3
                                            py-3
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >

                                            <div>

                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-bold
                                                        uppercase
                                                        tracking-wide
                                                        text-slate-400
                                                    "
                                                >
                                                    Previous Yield
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        font-bold
                                                        text-slate-700
                                                    "
                                                >

                                                    {prediction.previousYieldTons!.toFixed(
                                                        2
                                                    )}{" "}
                                                    tons/ha

                                                </p>

                                            </div>

                                            <div
                                                className="
                                                    text-right
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
                                                    Change
                                                </p>

                                                <p
                                                    className={`
                                                        mt-1
                                                        text-sm
                                                        font-black
                                                        ${
                                                            prediction.trend ===
                                                            "improving"
                                                                ? "text-emerald-600"
                                                                : prediction.trend ===
                                                                  "declining"
                                                                    ? "text-red-600"
                                                                    : "text-slate-600"
                                                        }
                                                    `}
                                                >

                                                    {prediction.percentageChange !==
                                                    undefined
                                                        ? `${
                                                              prediction.percentageChange >
                                                              0
                                                                  ? "+"
                                                                  : ""
                                                          }${prediction.percentageChange.toFixed(
                                                              1
                                                          )}%`
                                                        : "0.0%"}

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                )}

                                <div
                                    className="
                                        mt-3
                                    "
                                >

                                    <TrendBadge
                                        prediction={
                                            prediction
                                        }
                                    />

                                </div>

                            </div>

                        );

                    }
                )}

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
                className="
                    border-t
                    border-slate-100
                    bg-slate-50/70
                    px-5
                    py-4
                    sm:px-7
                "
            >

                <div
                    className="
                        flex
                        items-start
                        gap-2.5
                    "
                >

                    <BarChart3
                        size={14}
                        className="
                            mt-0.5
                            shrink-0
                            text-slate-400
                        "
                    />

                    <p
                        className="
                            text-[11px]
                            leading-5
                            text-slate-500
                        "
                    >

                        <strong
                            className="
                                font-bold
                                text-slate-600
                            "
                        >
                            Yield Gain/Loss:
                        </strong>{" "}

                        compares each prediction with the
                        previous prediction for the same crop.

                    </p>

                </div>

            </div>

        </section>

    );

}