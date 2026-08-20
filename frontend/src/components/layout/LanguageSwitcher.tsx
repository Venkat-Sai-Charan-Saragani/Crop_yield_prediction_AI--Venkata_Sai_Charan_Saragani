"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    ChevronDown,
    Languages,
} from "lucide-react";

import {
    useLanguage,
} from "@/context/LanguageContext";


// ============================================================
// TYPES
// ============================================================

type Language =
    | "en"
    | "te"
    | "hi";


// ============================================================
// LANGUAGE INFORMATION
// ============================================================

const languages = {
    en: {
        native: "English",
        label: "English",
    },

    te: {
        native: "తెలుగు",
        label: "Telugu",
    },

    hi: {
        native: "हिन्दी",
        label: "Hindi",
    },
};


// ============================================================
// COMPONENT
// ============================================================

export default function LanguageSwitcher() {

    const {
        language,
        setLanguage,
    } = useLanguage();


    // ========================================================
    // HYDRATION SAFETY
    // ========================================================

    const [
        hydrated,
        setHydrated,
    ] = useState(false);


    useEffect(() => {

        setHydrated(true);

    }, []);


    // ========================================================
    // DROPDOWN STATE
    // ========================================================

    const [
        open,
        setOpen,
    ] = useState(false);


    // ========================================================
    // IMPORTANT
    //
    // During SSR and the first client render we always use
    // English.
    //
    // After hydration, the LanguageContext supplies the
    // user's saved language.
    // ========================================================

    const currentLanguage: Language =
        hydrated
            ? language
            : "en";


    const current =
        languages[currentLanguage];


    // ========================================================
    // CHANGE LANGUAGE
    // ========================================================

    const handleLanguageChange = (
        newLanguage: Language
    ) => {

        setLanguage(
            newLanguage
        );

        setOpen(false);
    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <div
            className="
                relative
            "
        >

            {/* ================================================= */}
            {/* MAIN BUTTON */}
            {/* ================================================= */}

            <button
                type="button"
                onClick={() =>
                    setOpen(
                        !open
                    )
                }
                aria-label="Change language"
                aria-expanded={open}
                className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/15
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-800
                    shadow-lg
                    transition
                    hover:bg-slate-50
                "
            >

                <Languages
                    size={17}
                    strokeWidth={1.8}
                />


                <span>
                    {current.native}
                </span>


                <ChevronDown
                    size={16}
                    className={`
                        transition-transform
                        duration-200
                        ${
                            open
                                ? "rotate-180"
                                : ""
                        }
                    `}
                />

            </button>


            {/* ================================================= */}
            {/* DROPDOWN */}
            {/* ================================================= */}

            {open && (

                <>

                    {/* Click outside */}

                    <button
                        type="button"
                        aria-label="Close language menu"
                        onClick={() =>
                            setOpen(false)
                        }
                        className="
                            fixed
                            inset-0
                            z-40
                            cursor-default
                        "
                    />


                    {/* Menu */}

                    <div
                        className="
                            absolute
                            right-0
                            z-50
                            mt-2
                            min-w-[160px]
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-1.5
                            shadow-2xl
                        "
                    >

                        {/* English */}

                        <button
                            type="button"
                            onClick={() =>
                                handleLanguageChange(
                                    "en"
                                )
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                transition
                                ${
                                    currentLanguage === "en"
                                        ? "bg-emerald-50 font-semibold text-emerald-700"
                                        : "text-slate-700 hover:bg-slate-50"
                                }
                            `}
                        >

                            <span>
                                English
                            </span>


                            {currentLanguage === "en" && (

                                <span
                                    className="
                                        text-emerald-600
                                    "
                                >
                                    ✓
                                </span>

                            )}

                        </button>


                        {/* Telugu */}

                        <button
                            type="button"
                            onClick={() =>
                                handleLanguageChange(
                                    "te"
                                )
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                transition
                                ${
                                    currentLanguage === "te"
                                        ? "bg-emerald-50 font-semibold text-emerald-700"
                                        : "text-slate-700 hover:bg-slate-50"
                                }
                            `}
                        >

                            <span>
                                తెలుగు
                            </span>


                            {currentLanguage === "te" && (

                                <span
                                    className="
                                        text-emerald-600
                                    "
                                >
                                    ✓
                                </span>

                            )}

                        </button>


                        {/* Hindi */}

                        <button
                            type="button"
                            onClick={() =>
                                handleLanguageChange(
                                    "hi"
                                )
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                transition
                                ${
                                    currentLanguage === "hi"
                                        ? "bg-emerald-50 font-semibold text-emerald-700"
                                        : "text-slate-700 hover:bg-slate-50"
                                }
                            `}
                        >

                            <span>
                                हिन्दी
                            </span>


                            {currentLanguage === "hi" && (

                                <span
                                    className="
                                        text-emerald-600
                                    "
                                >
                                    ✓
                                </span>

                            )}

                        </button>

                    </div>

                </>

            )}

        </div>
    );
}