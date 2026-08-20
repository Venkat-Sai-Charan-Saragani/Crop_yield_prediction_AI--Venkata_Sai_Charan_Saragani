"use client";

import {
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import {
    AlertCircle,
    Beaker,
    CheckCircle2,
    ChevronDown,
    FlaskConical,
    Info,
    Leaf,
    Microscope,
    Sprout,
    TestTube2,
} from "lucide-react";


type AnalysisMode =
    | "laboratory"
    | "ph";


interface SoilParameter {
    name: string;
    value: number;
    unit: string;
    status: string;
    level: string;
    description: string;
    recommendation: string;
}


interface Micronutrient {
    name: string;
    value: number;
    unit: string;
    status: string;
    level: string;
    description: string;
    recommendation: string;
}


interface NutrientAvailability {
    name: string;
    status: string;
    description: string;
}


interface Recommendation {
    title: string;
    priority: string;
    description: string;
}


interface SoilResult {

    success: boolean;

    analysis_type: string;

    overall_status?: string;

    soil_ph: number;

    soil_classification: string;

    summary?: string;

    soil_texture?: string | null;

    ph_analysis: {
        classification: string;
        status: string;
        description: string;
        recommendation: string;
    };

    parameters?: SoilParameter[];

    micronutrients?: Micronutrient[];

    nutrient_availability?: NutrientAvailability[];

    suitable_crops?: string[];

    recommendations: Recommendation[];

    disclaimer: string;
}


const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";


// ============================================================
// STATUS COLORS
// ============================================================

function statusClasses(
    status: string
) {

    const normalized =
        status
            .toLowerCase()
            .replaceAll("_", " ");

    switch (normalized) {

        case "good":
        case "excellent":
        case "adequate":
        case "sufficient":
        case "medium":
        case "moderate":
        case "favorable":
        case "generally favorable":
        case "low salinity concern":

            return "bg-emerald-50 text-emerald-700 border-emerald-200";


        case "low":
        case "marginal":
        case "needs attention":
        case "needs_attention":

            return "bg-amber-50 text-amber-700 border-amber-200";


        case "high":
        case "critical":
        case "attention":
        case "deficient":
        case "restricted":
        case "potential deficiency":

            return "bg-red-50 text-red-700 border-red-200";


        default:

            return "bg-slate-50 text-slate-700 border-slate-200";
    }
}


// ============================================================
// FORMAT STATUS
// ============================================================

function formatStatus(
    value: string
) {

    return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );
}


// ============================================================
// COMPONENT
// ============================================================

export default function SoilPage() {

    const [
        mode,
        setMode,
    ] = useState<AnalysisMode>(
        "laboratory"
    );


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        result,
        setResult,
    ] = useState<SoilResult | null>(
        null
    );


    // ========================================================
    // LABORATORY FORM
    // ========================================================

    const [
        labForm,
        setLabForm,
    ] = useState({

        pH: "",

        N: "",
        P: "",
        K: "",

        organic_carbon: "",

        electrical_conductivity: "",

        zinc: "",
        iron: "",
        copper: "",
        manganese: "",
        boron: "",
        sulphur: "",

        soil_texture: "",
    });


    // ========================================================
    // PH FORM
    // ========================================================

    const [
        ph,
        setPh,
    ] = useState("");


    // ========================================================
    // INPUT HANDLER
    // ========================================================

    const updateLabField = (
        field: string,
        value: string
    ) => {

        setLabForm(
            previous => ({
                ...previous,
                [field]: value,
            })
        );
    };


    // ========================================================
    // ANALYZE SOIL
    // ========================================================

    const analyzeSoil = async () => {

        setError("");
        setResult(null);


        // ----------------------------------------------------
        // PH VALIDATION
        // ----------------------------------------------------

        if (mode === "ph") {

            if (!ph.trim()) {

                setError(
                    "Please enter the soil pH."
                );

                return;
            }


            const numericPH =
                Number(ph);


            if (
                Number.isNaN(numericPH) ||
                numericPH < 3 ||
                numericPH > 10
            ) {

                setError(
                    "Please enter a valid soil pH between 3 and 10."
                );

                return;
            }
        }


        // ----------------------------------------------------
        // LAB VALIDATION
        // ----------------------------------------------------

        if (
            mode === "laboratory" &&
            !labForm.pH.trim()
        ) {

            setError(
                "Soil pH is required for laboratory analysis."
            );

            return;
        }


        try {

            setLoading(true);


            let endpoint = "";

            let payload: Record<
                string,
                unknown
            > = {};


            // =================================================
            // QUICK PH
            // =================================================

            if (mode === "ph") {

                endpoint =
                    "/soil/analyze-ph";


                payload = {

                    pH:
                        Number(ph),

                };

            }


            // =================================================
            // LABORATORY
            // =================================================

            else {

                endpoint =
                    "/soil/analyze-laboratory";


                payload = {

                    pH:
                        Number(
                            labForm.pH
                        ),


                    N:
                        labForm.N
                            ? Number(
                                labForm.N
                            )
                            : null,


                    P:
                        labForm.P
                            ? Number(
                                labForm.P
                            )
                            : null,


                    K:
                        labForm.K
                            ? Number(
                                labForm.K
                            )
                            : null,


                    organic_carbon:
                        labForm.organic_carbon
                            ? Number(
                                labForm.organic_carbon
                            )
                            : null,


                    electrical_conductivity:
                        labForm.electrical_conductivity
                            ? Number(
                                labForm.electrical_conductivity
                            )
                            : null,


                    zinc:
                        labForm.zinc
                            ? Number(
                                labForm.zinc
                            )
                            : null,


                    iron:
                        labForm.iron
                            ? Number(
                                labForm.iron
                            )
                            : null,


                    copper:
                        labForm.copper
                            ? Number(
                                labForm.copper
                            )
                            : null,


                    manganese:
                        labForm.manganese
                            ? Number(
                                labForm.manganese
                            )
                            : null,


                    boron:
                        labForm.boron
                            ? Number(
                                labForm.boron
                            )
                            : null,


                    sulphur:
                        labForm.sulphur
                            ? Number(
                                labForm.sulphur
                            )
                            : null,


                    soil_texture:
                        labForm.soil_texture ||
                        null,
                };
            }


            // =================================================
            // REQUEST
            // =================================================

            const response =
                await fetch(
                    `${API_URL}${endpoint}`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                payload
                            ),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data?.detail ||
                    "Unable to analyze soil."
                );
            }


            setResult(data);


        } catch (err) {

            console.error(
                "SOIL ANALYSIS ERROR:",
                err
            );


            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to analyze soil."
            );


        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // RESET
    // ========================================================

    const resetAnalysis = () => {

        setResult(null);

        setError("");

    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">

            <div className="mx-auto max-w-7xl">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="mb-8">

                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">

                        <Sprout size={17} />

                        AI Soil Analysis

                    </div>


                    <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">

                        Understand Your Soil

                    </h1>


                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">

                        Analyze your soil using actual laboratory
                        measurements or perform a quick assessment
                        using soil pH.

                    </p>

                </div>


                {/* ================================================= */}
                {/* MODE SELECTOR */}
                {/* ================================================= */}

                <section className="mb-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-7">

                    <div className="mb-5">

                        <h2 className="text-xl font-bold text-slate-900">

                            Choose Analysis Type

                        </h2>


                        <p className="mt-1 text-sm text-slate-500">

                            Select the type of soil information
                            you currently have.

                        </p>

                    </div>


                    <div className="grid gap-4 md:grid-cols-2">


                        {/* LABORATORY */}

                        <button
                            type="button"
                            onClick={() => {

                                setMode(
                                    "laboratory"
                                );

                                resetAnalysis();

                            }}
                            className={`rounded-2xl border p-5 text-left transition ${
                                mode === "laboratory"
                                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                                    : "border-slate-200 bg-white hover:border-emerald-300"
                            }`}
                        >

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">

                                    <FlaskConical
                                        size={24}
                                    />

                                </div>


                                <div>

                                    <h3 className="font-bold text-slate-900">

                                        Laboratory Soil Analysis

                                    </h3>


                                    <p className="mt-1 text-sm leading-5 text-slate-500">

                                        Enter actual values from
                                        your laboratory soil-test
                                        report.

                                    </p>

                                </div>

                            </div>

                        </button>


                        {/* PH */}

                        <button
                            type="button"
                            onClick={() => {

                                setMode("ph");

                                resetAnalysis();

                            }}
                            className={`rounded-2xl border p-5 text-left transition ${
                                mode === "ph"
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                    : "border-slate-200 bg-white hover:border-blue-300"
                            }`}
                        >

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">

                                    <TestTube2
                                        size={24}
                                    />

                                </div>


                                <div>

                                    <h3 className="font-bold text-slate-900">

                                        Quick pH Analysis

                                    </h3>


                                    <p className="mt-1 text-sm leading-5 text-slate-500">

                                        Enter your measured soil
                                        pH for a quick general
                                        assessment.

                                    </p>

                                </div>

                            </div>

                        </button>

                    </div>

                </section>


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (

                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">

                        <AlertCircle
                            size={21}
                            className="mt-0.5 shrink-0"
                        />

                        <div>

                            <p className="font-semibold">

                                Soil analysis unavailable

                            </p>


                            <p className="mt-1 text-sm">

                                {error}

                            </p>

                        </div>

                    </div>

                )}


                {/* ================================================= */}
                {/* LABORATORY FORM */}
                {/* ================================================= */}

                {mode === "laboratory" &&
                    !result && (

                        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">

                            <div className="mb-7 flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">

                                    <Microscope
                                        size={25}
                                    />

                                </div>


                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">

                                        Laboratory Soil Report

                                    </h2>


                                    <p className="mt-1 text-sm text-slate-500">

                                        Enter the values exactly as
                                        reported by your soil testing
                                        laboratory.

                                    </p>

                                </div>

                            </div>


                            {/* BASIC */}

                            <div className="mb-8">

                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">

                                    Basic Soil Information

                                </h3>


                                <div className="grid gap-5 md:grid-cols-2">

                                    <InputField
                                        label="Soil pH"
                                        value={
                                            labForm.pH
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "pH",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 6.5"
                                        unit="pH"
                                        required
                                    />


                                    <SelectField
                                        label="Soil Texture"
                                        value={
                                            labForm.soil_texture
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "soil_texture",
                                                    value
                                                )
                                        }
                                        options={[
                                            "Sandy",
                                            "Sandy Loam",
                                            "Loam",
                                            "Silt Loam",
                                            "Clay Loam",
                                            "Clay",
                                            "Not specified",
                                        ]}
                                    />

                                </div>

                            </div>


                            {/* NPK */}

                            <div className="mb-8">

                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">

                                    Primary Nutrients

                                </h3>


                                <div className="grid gap-5 md:grid-cols-3">

                                    <InputField
                                        label="Nitrogen (N)"
                                        value={
                                            labForm.N
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "N",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 50"
                                        unit="kg/ha"
                                    />


                                    <InputField
                                        label="Phosphorus (P)"
                                        value={
                                            labForm.P
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "P",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 30"
                                        unit="kg/ha"
                                    />


                                    <InputField
                                        label="Potassium (K)"
                                        value={
                                            labForm.K
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "K",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 40"
                                        unit="kg/ha"
                                    />

                                </div>

                            </div>


                            {/* SOIL HEALTH */}

                            <div className="mb-8">

                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">

                                    Soil Health Parameters

                                </h3>


                                <div className="grid gap-5 md:grid-cols-2">

                                    <InputField
                                        label="Organic Carbon"
                                        value={
                                            labForm.organic_carbon
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "organic_carbon",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 0.65"
                                        unit="%"
                                    />


                                    <InputField
                                        label="Electrical Conductivity"
                                        value={
                                            labForm.electrical_conductivity
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "electrical_conductivity",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 0.40"
                                        unit="dS/m"
                                    />

                                </div>

                            </div>


                            {/* MICRONUTRIENTS */}

                            <div className="mb-8">

                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">

                                    Micronutrients

                                </h3>


                                <p className="mb-5 text-sm leading-6 text-slate-500">

                                    Enter the laboratory-measured
                                    micronutrient values from your
                                    soil-test report.

                                </p>


                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                                    <InputField
                                        label="Zinc"
                                        value={
                                            labForm.zinc
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "zinc",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 1.2"
                                        unit="mg/kg"
                                    />


                                    <InputField
                                        label="Iron"
                                        value={
                                            labForm.iron
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "iron",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 8"
                                        unit="mg/kg"
                                    />


                                    <InputField
                                        label="Copper"
                                        value={
                                            labForm.copper
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "copper",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 0.6"
                                        unit="mg/kg"
                                    />


                                    <InputField
                                        label="Manganese"
                                        value={
                                            labForm.manganese
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "manganese",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 5"
                                        unit="mg/kg"
                                    />


                                    <InputField
                                        label="Boron"
                                        value={
                                            labForm.boron
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "boron",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 0.8"
                                        unit="mg/kg"
                                    />


                                    <InputField
                                        label="Sulphur"
                                        value={
                                            labForm.sulphur
                                        }
                                        onChange={
                                            value =>
                                                updateLabField(
                                                    "sulphur",
                                                    value
                                                )
                                        }
                                        placeholder="Example: 15"
                                        unit="mg/kg"
                                    />

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={analyzeSoil}
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading
                                    ? "Analyzing Soil..."
                                    : "Analyze Laboratory Soil"
                                }

                            </button>

                        </section>

                    )}


                {/* ================================================= */}
                {/* PH FORM */}
                {/* ================================================= */}

                {mode === "ph" &&
                    !result && (

                        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">

                            <div className="mx-auto max-w-2xl text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">

                                    <TestTube2
                                        size={30}
                                    />

                                </div>


                                <h2 className="mt-5 text-2xl font-bold text-slate-900">

                                    Quick Soil pH Analysis

                                </h2>


                                <p className="mt-2 text-sm leading-6 text-slate-500">

                                    Enter the pH measured from your
                                    soil sample. YieldSenseAI will
                                    explain the soil condition and
                                    how pH can influence nutrient
                                    availability.

                                </p>


                                <div className="mt-8 text-left">

                                    <InputField
                                        label="Soil pH"
                                        value={ph}
                                        onChange={
                                            setPh
                                        }
                                        placeholder="Example: 6.5"
                                        unit="pH"
                                        required
                                    />

                                </div>


                                <div className="mt-5 flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-left text-sm text-blue-800">

                                    <Info
                                        size={19}
                                        className="mt-0.5 shrink-0"
                                    />


                                    <p>

                                        pH does not measure the
                                        actual concentration of
                                        nutrients. The report below
                                        explains their general
                                        availability or behavior
                                        at the measured pH.

                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={analyzeSoil}
                                    disabled={loading}
                                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {loading
                                        ? "Analyzing..."
                                        : "Analyze Soil pH"
                                    }

                                </button>

                            </div>

                        </section>

                    )}


                {/* ================================================= */}
                {/* RESULT */}
                {/* ================================================= */}

                {result && (

                    <SoilResult
                        result={result}
                        onNewAnalysis={
                            resetAnalysis
                        }
                    />

                )}

            </div>

        </main>
    );
}


// ============================================================
// INPUT FIELD
// ============================================================

function InputField({
    label,
    value,
    onChange,
    placeholder,
    unit,
    required = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    unit: string;
    required?: boolean;
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">

                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}

            </label>


            <div className="relative">

                <input
                    type="number"
                    step="any"
                    value={value}
                    onChange={event =>
                        onChange(
                            event.target.value
                        )
                    }
                    placeholder={
                        placeholder
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                />


                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">

                    {unit}

                </span>

            </div>

        </div>
    );
}


// ============================================================
// SELECT FIELD
// ============================================================

function SelectField({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">

                {label}

            </label>


            <div className="relative">

                <select
                    value={value}
                    onChange={event =>
                        onChange(
                            event.target.value
                        )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                >

                    <option value="">
                        Select
                    </option>


                    {options.map(
                        option => (

                            <option
                                key={option}
                                value={option}
                            >

                                {option}

                            </option>

                        )
                    )}

                </select>


                <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

            </div>

        </div>
    );
}


// ============================================================
// RESULT
// ============================================================

function SoilResult({
    result,
    onNewAnalysis,
}: {
    result: SoilResult;
    onNewAnalysis: () => void;
}) {

    const isLaboratory =
        result.analysis_type ===
        "laboratory";


    return (

        <div className="space-y-6">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div>

                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                            <CheckCircle2
                                size={15}
                            />

                            Analysis Complete

                        </div>


                        <h2 className="mt-4 text-3xl font-bold text-slate-900">

                            Soil Analysis Report

                        </h2>


                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">

                            {isLaboratory
                                ? "Based on the laboratory values you entered."
                                : "Based on your measured soil pH and its general influence on nutrient availability."
                            }

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onNewAnalysis}
                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >

                        New Analysis

                    </button>

                </div>

            </section>


            {/* ================================================= */}
            {/* SUMMARY */}
            {/* ================================================= */}

            <section className="grid gap-5 md:grid-cols-3">

                <SummaryCard
                    title="Soil pH"
                    value={
                        result.soil_ph
                    }
                    subtitle={
                        result.soil_classification
                    }
                    icon={
                        <TestTube2
                            size={22}
                        />
                    }
                />


                <SummaryCard
                    title="Soil Condition"
                    value={
                        formatStatus(
                            result.overall_status ||
                            result.ph_analysis.status
                        )
                    }
                    subtitle="Overall assessment"
                    icon={
                        <Sprout
                            size={22}
                        />
                    }
                />


                <SummaryCard
                    title="Analysis Type"
                    value={
                        isLaboratory
                            ? "Laboratory"
                            : "pH Based"
                    }
                    subtitle={
                        isLaboratory
                            ? "Measured soil-test values"
                            : "General nutrient implications"
                    }
                    icon={
                        isLaboratory
                            ? <FlaskConical size={22} />
                            : <TestTube2 size={22} />
                    }
                />

            </section>


            {/* ================================================= */}
            {/* SUMMARY MESSAGE */}
            {/* ================================================= */}

            {result.summary && (

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-start gap-3">

                        <Info
                            size={20}
                            className="mt-0.5 shrink-0 text-blue-600"
                        />

                        <p className="text-sm leading-6 text-slate-600">

                            {result.summary}

                        </p>

                    </div>

                </section>

            )}


            {/* ================================================= */}
            {/* PH ANALYSIS */}
            {/* ================================================= */}

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">

                <div className="mb-6 flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                        <Beaker
                            size={22}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold text-slate-900">

                            Soil pH Analysis

                        </h2>


                        <p className="mt-1 text-sm text-slate-500">

                            Interpretation of the measured
                            soil pH.

                        </p>

                    </div>

                </div>


                <div className="grid gap-5 md:grid-cols-2">

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

                        <p className="text-sm text-slate-500">

                            Classification

                        </p>


                        <p className="mt-2 text-2xl font-bold text-slate-900">

                            {result.soil_classification}

                        </p>

                    </div>


                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

                        <p className="text-sm text-slate-500">

                            pH Status

                        </p>


                        <span
                            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusClasses(
                                result.ph_analysis.status
                            )}`}
                        >

                            {formatStatus(
                                result.ph_analysis.status
                            )}

                        </span>

                    </div>

                </div>


                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                    <p className="text-sm leading-6 text-blue-900">

                        {result.ph_analysis.description}

                    </p>

                </div>

            </section>


            {/* ================================================= */}
            {/* LABORATORY PRIMARY PARAMETERS */}
            {/* ================================================= */}

            {isLaboratory &&
                result.parameters &&
                result.parameters.length > 0 && (

                    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">

                        <div className="mb-6">

                            <h2 className="text-xl font-bold text-slate-900">

                                Laboratory Nutrient & Soil Results

                            </h2>


                            <p className="mt-1 text-sm leading-6 text-slate-500">

                                These values are the actual
                                measurements entered from your
                                laboratory soil-test report.

                            </p>

                        </div>


                        <div className="grid gap-5 md:grid-cols-2">

                            {result.parameters.map(
                                parameter => (

                                    <div
                                        key={
                                            parameter.name
                                        }
                                        className="rounded-2xl border border-slate-100 p-5"
                                    >

                                        <div className="flex items-start justify-between gap-3">

                                            <div>

                                                <h3 className="font-bold text-slate-900">

                                                    {
                                                        parameter.name
                                                    }

                                                </h3>


                                                <p className="mt-1 text-2xl font-bold text-slate-900">

                                                    {
                                                        parameter.value
                                                    }


                                                    <span className="ml-1 text-sm font-medium text-slate-400">

                                                        {
                                                            parameter.unit
                                                        }

                                                    </span>

                                                </p>

                                            </div>


                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                                                    parameter.status
                                                )}`}
                                            >

                                                {
                                                    parameter.level
                                                }

                                            </span>

                                        </div>


                                        <p className="mt-4 text-sm leading-6 text-slate-500">

                                            {
                                                parameter.description
                                            }

                                        </p>


                                        <div className="mt-4 rounded-xl bg-slate-50 p-4">

                                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">

                                                Guidance

                                            </p>


                                            <p className="mt-1 text-sm leading-5 text-slate-700">

                                                {
                                                    parameter.recommendation
                                                }

                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


            {/* ================================================= */}
            {/* MICRONUTRIENTS */}
            {/* ================================================= */}

            {isLaboratory &&
                result.micronutrients &&
                result.micronutrients.length > 0 && (

                    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">

                        <div className="mb-6">

                            <h2 className="text-xl font-bold text-slate-900">

                                Laboratory Micronutrient Results

                            </h2>


                            <p className="mt-1 text-sm leading-6 text-slate-500">

                                Interpretation of the reported
                                micronutrient concentrations using
                                indicative soil-test ranges.

                            </p>

                        </div>


                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                            {result.micronutrients.map(
                                nutrient => (

                                    <div
                                        key={
                                            nutrient.name
                                        }
                                        className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                                    >

                                        <div className="flex items-start justify-between gap-3">

                                            <p className="font-semibold text-slate-900">

                                                {
                                                    nutrient.name
                                                }

                                            </p>


                                            <span
                                                className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(
                                                    nutrient.status
                                                )}`}
                                            >

                                                {
                                                    nutrient.level
                                                }

                                            </span>

                                        </div>


                                        <p className="mt-3 text-2xl font-bold text-slate-900">

                                            {
                                                nutrient.value
                                            }


                                            <span className="ml-1 text-xs font-medium text-slate-400">

                                                {
                                                    nutrient.unit
                                                }

                                            </span>

                                        </p>


                                        <p className="mt-3 text-sm leading-6 text-slate-500">

                                            {
                                                nutrient.description
                                            }

                                        </p>


                                        <div className="mt-4 rounded-xl bg-white p-4">

                                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">

                                                Guidance

                                            </p>


                                            <p className="mt-1 text-sm leading-5 text-slate-700">

                                                {
                                                    nutrient.recommendation
                                                }

                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


            {/* ================================================= */}
            {/* PH NUTRIENT IMPLICATIONS */}
            {/* ================================================= */}

            {!isLaboratory &&
                result.nutrient_availability &&
                result.nutrient_availability.length > 0 && (

                    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">

                        <div className="mb-6">

                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                                    <Leaf
                                        size={22}
                                    />

                                </div>


                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">

                                        Nutrient Availability at This pH

                                    </h2>


                                    <p className="mt-1 text-sm leading-6 text-slate-500">

                                        Your pH value does not measure
                                        nutrient concentration. It
                                        indicates how soil pH may
                                        influence nutrient availability.

                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="grid gap-4 md:grid-cols-2">

                            {result.nutrient_availability.map(
                                nutrient => (

                                    <div
                                        key={
                                            nutrient.name
                                        }
                                        className="rounded-2xl border border-slate-100 p-5"
                                    >

                                        <div className="flex items-center justify-between gap-3">

                                            <h3 className="font-bold text-slate-900">

                                                {
                                                    nutrient.name
                                                }

                                            </h3>


                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                                                    nutrient.status
                                                )}`}
                                            >

                                                {
                                                    nutrient.status
                                                }

                                            </span>

                                        </div>


                                        <p className="mt-3 text-sm leading-6 text-slate-600">

                                            {
                                                nutrient.description
                                            }

                                        </p>

                                    </div>

                                )
                            )}

                        </div>


                        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                            <div className="flex items-start gap-3">

                                <Info
                                    size={19}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />


                                <p className="text-sm leading-6 text-blue-900">

                                    These are pH-based implications,
                                    not measured nutrient values.
                                    A laboratory soil test is required
                                    to determine the actual N, P, K,
                                    Fe and Zn concentrations.

                                </p>

                            </div>

                        </div>

                    </section>

                )}


            {/* ================================================= */}
            {/* CROP SUITABILITY */}
            {/* ================================================= */}

            {result.suitable_crops &&
                result.suitable_crops.length > 0 && (

                    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">

                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                <Leaf
                                    size={22}
                                />

                            </div>


                            <div>

                                <h2 className="text-xl font-bold text-slate-900">

                                    General Crop Suitability

                                </h2>


                                <p className="mt-1 text-sm text-slate-500">

                                    Crops that can generally be
                                    compatible with this pH range.

                                </p>

                            </div>

                        </div>


                        <div className="mt-6 flex flex-wrap gap-3">

                            {result.suitable_crops.map(
                                crop => (

                                    <span
                                        key={crop}
                                        className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
                                    >

                                        {crop}

                                    </span>

                                )
                            )}

                        </div>

                    </section>

                )}


            {/* ================================================= */}
            {/* RECOMMENDATIONS */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 md:p-8">

                <div className="mb-6 flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">

                        <Sprout
                            size={22}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold text-emerald-950">

                            Soil Management Recommendations

                        </h2>


                        <p className="mt-1 text-sm text-emerald-800">

                            Guidance generated from the soil
                            information you provided.

                        </p>

                    </div>

                </div>


                <div className="space-y-4">

                    {result.recommendations.map(
                        (
                            recommendation,
                            index
                        ) => (

                            <div
                                key={`${recommendation.title}-${index}`}
                                className="rounded-2xl bg-white p-5 shadow-sm"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <h3 className="font-bold text-slate-900">

                                        {
                                            recommendation.title
                                        }

                                    </h3>


                                    <span
                                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                                            recommendation.priority
                                        )}`}
                                    >

                                        {
                                            formatStatus(
                                                recommendation.priority
                                            )
                                        }

                                    </span>

                                </div>


                                <p className="mt-2 text-sm leading-6 text-slate-600">

                                    {
                                        recommendation.description
                                    }

                                </p>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* ================================================= */}
            {/* DISCLAIMER */}
            {/* ================================================= */}

            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

                <div className="flex items-start gap-3">

                    <Info
                        size={20}
                        className="mt-0.5 shrink-0 text-amber-600"
                    />


                    <div>

                        <p className="font-semibold text-amber-900">

                            Important

                        </p>


                        <p className="mt-1 text-sm leading-6 text-amber-800">

                            {result.disclaimer}

                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}


// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
    title,
    value,
    subtitle,
    icon,
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: ReactNode;
}) {

    return (

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                {icon}

            </div>


            <p className="mt-5 text-sm text-slate-500">

                {title}

            </p>


            <p className="mt-1 text-2xl font-bold text-slate-900">

                {value}

            </p>


            <p className="mt-1 text-sm text-slate-500">

                {subtitle}

            </p>

        </div>
    );
}