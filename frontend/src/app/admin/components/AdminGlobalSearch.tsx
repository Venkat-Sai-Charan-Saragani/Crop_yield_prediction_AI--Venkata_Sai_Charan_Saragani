"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Search,
    X,
    Users,
    Sprout,
    Wheat,
    BrainCircuit,
} from "lucide-react";


export type AdminSearchSection =
    | "overview"
    | "users"
    | "farms"
    | "crops"
    | "predictions";


interface AdminGlobalSearchProps {

    value: string;

    onChange: (
        value: string
    ) => void;

    onNavigate: (
        section: AdminSearchSection
    ) => void;

}


const sections = [

    {
        id: "users" as const,

        label: "Users",

        description:
            "Search registered accounts",

        icon: Users,

    },

    {
        id: "farms" as const,

        label: "Farms",

        description:
            "Search farm records",

        icon: Sprout,

    },

    {
        id: "crops" as const,

        label: "Crops",

        description:
            "Search crop records",

        icon: Wheat,

    },

    {
        id: "predictions" as const,

        label: "Predictions",

        description:
            "Search AI predictions",

        icon: BrainCircuit,

    },

];


export default function AdminGlobalSearch({

    value,

    onChange,

    onNavigate,

}: AdminGlobalSearchProps) {

    const [
        focused,
        setFocused,
    ] = useState(false);


    const containerRef =
        useRef<HTMLDivElement | null>(
            null
        );


    useEffect(() => {

        const handleOutside = (
            event: MouseEvent
        ) => {

            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {

                setFocused(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutside
            );

        };

    }, []);


    const clearSearch = () => {

        onChange("");

    };


    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {

        if (
            event.key === "Escape"
        ) {

            clearSearch();

            setFocused(false);

        }

    };


    return (

        <div
            ref={containerRef}
            className="relative w-full max-w-xl"
        >

            {/* SEARCH INPUT */}

            <div className={`flex items-center rounded-xl border bg-slate-50 transition ${
                focused
                    ? "border-emerald-400 bg-white ring-4 ring-emerald-500/10"
                    : "border-slate-200"
            }`}>

                <Search
                    size={18}
                    className="ml-4 shrink-0 text-slate-400"
                />


                <input

                    type="text"

                    value={value}

                    onChange={(
                        event
                    ) =>
                        onChange(
                            event.target.value
                        )
                    }

                    onFocus={() =>
                        setFocused(true)
                    }

                    onKeyDown={
                        handleKeyDown
                    }

                    placeholder="Search management..."

                    className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"

                />


                {value && (

                    <button

                        type="button"

                        onClick={
                            clearSearch
                        }

                        className="mr-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"

                        aria-label="Clear search"

                    >

                        <X
                            size={16}
                        />

                    </button>

                )}

            </div>


            {/* QUICK SEARCH */}

            {focused && !value && (

                <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">

                    <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">

                        Search management

                    </p>


                    <div className="grid grid-cols-2 gap-2">

                        {sections.map(
                            (section) => {

                                const Icon =
                                    section.icon;


                                return (

                                    <button

                                        key={
                                            section.id
                                        }

                                        type="button"

                                        onClick={() => {

                                            onNavigate(
                                                section.id
                                            );

                                            setFocused(
                                                false
                                            );

                                        }}

                                        className="flex items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"

                                    >

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">

                                            <Icon
                                                size={17}
                                            />

                                        </div>


                                        <div>

                                            <p className="text-sm font-semibold text-slate-800">

                                                {
                                                    section.label
                                                }

                                            </p>

                                            <p className="text-[11px] text-slate-400">

                                                {
                                                    section.description
                                                }

                                            </p>

                                        </div>

                                    </button>

                                );

                            }
                        )}

                    </div>

                </div>

            )}


            {/* SEARCHING */}

            {focused && value && (

                <div className="absolute left-0 right-0 top-14 z-50 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">

                    <p className="text-xs text-slate-500">

                        Searching management records for

                        <span className="ml-1 font-semibold text-slate-800">

                            "{value}"

                        </span>

                    </p>


                    <div className="mt-3 grid grid-cols-2 gap-2">

                        {sections.map(
                            (section) => {

                                const Icon =
                                    section.icon;


                                return (

                                    <button

                                        key={
                                            section.id
                                        }

                                        type="button"

                                        onClick={() => {

                                            onNavigate(
                                                section.id
                                            );

                                            setFocused(
                                                false
                                            );

                                        }}

                                        className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-left text-xs font-medium text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"

                                    >

                                        <Icon
                                            size={15}
                                        />

                                        Search {
                                            section.label
                                        }

                                    </button>

                                );

                            }
                        )}

                    </div>

                </div>

            )}

        </div>

    );

}