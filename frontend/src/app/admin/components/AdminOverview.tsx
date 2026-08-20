"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Activity,
    BrainCircuit,
    Sprout,
    Users,
    Wheat,
} from "lucide-react";

import {
    getAdminStats,
    AdminStats,
} from "@/services/admin";


interface AdminOverviewProps {

    onStatsLoaded?: (
        stats: AdminStats
    ) => void;

}


export default function AdminOverview({

    onStatsLoaded,

}: AdminOverviewProps) {

    const [
        stats,
        setStats,
    ] = useState<AdminStats | null>(
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


    const loadStats = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getAdminStats();


            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Unable to load administrator statistics."
                );

            }


            const loadedStats =
                response.stats;


            setStats(
                loadedStats
            );


            if (onStatsLoaded) {

                onStatsLoaded(
                    loadedStats
                );

            }

        }
        catch (error: any) {

            console.error(
                "ADMIN STATS ERROR:",
                error
            );


            setError(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load administrator statistics."
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadStats();

    }, []);


    if (loading) {

        return (

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {[1, 2, 3, 4].map(
                    (item) => (

                        <div
                            key={item}
                            className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
                        />

                    )
                )}

            </div>

        );

    }


    if (error) {

        return (

            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

                <p className="font-semibold text-red-800">

                    Dashboard statistics unavailable

                </p>

                <p className="mt-1 text-sm text-red-600">

                    {error}

                </p>

                <button

                    type="button"

                    onClick={
                        loadStats
                    }

                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"

                >

                    Try Again

                </button>

            </div>

        );

    }


    const cards = [

        {

            title: "Total Users",

            value:
                stats?.total_users ?? 0,

            description:
                "Registered platform accounts",

            icon: Users,

            iconClass:
                "bg-blue-50 text-blue-600",

        },

        {

            title: "Total Farms",

            value:
                stats?.total_farms ?? 0,

            description:
                "Farms registered on platform",

            icon: Sprout,

            iconClass:
                "bg-emerald-50 text-emerald-600",

        },

        {

            title: "Total Crops",

            value:
                stats?.total_crops ?? 0,

            description:
                "Crop records being tracked",

            icon: Wheat,

            iconClass:
                "bg-amber-50 text-amber-600",

        },

        {

            title: "AI Predictions",

            value:
                stats?.total_predictions ?? 0,

            description:
                "Yield predictions generated",

            icon: BrainCircuit,

            iconClass:
                "bg-purple-50 text-purple-600",

        },

    ];


    return (

        <section>

            <div className="mb-5">

                <div className="flex items-center gap-2">

                    <Activity
                        size={18}
                        className="text-emerald-600"
                    />

                    <h2 className="text-lg font-bold text-slate-900">

                        Platform Overview

                    </h2>

                </div>

                <p className="mt-1 text-sm text-slate-500">

                    Monitor the current state of the YieldSenseAI platform.

                </p>

            </div>


            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {cards.map(
                    (card) => {

                        const Icon =
                            card.icon;


                        return (

                            <div

                                key={
                                    card.title
                                }

                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"

                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-slate-500">

                                            {
                                                card.title
                                            }

                                        </p>


                                        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">

                                            {
                                                card.value
                                            }

                                        </p>

                                    </div>


                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconClass}`}>

                                        <Icon
                                            size={23}
                                        />

                                    </div>

                                </div>


                                <p className="mt-4 text-xs text-slate-500">

                                    {
                                        card.description
                                    }

                                </p>

                            </div>

                        );

                    }
                )}

            </div>


            {/* MODEL ACCURACY */}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <p className="text-sm font-semibold text-slate-800">

                            AI Model Accuracy

                        </p>

                        <p className="mt-1 text-xs text-slate-500">

                            Current prediction model performance

                        </p>

                    </div>


                    <p className="text-2xl font-bold text-emerald-600">

                        {stats?.model_accuracy ?? 0}%

                    </p>

                </div>


                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

                    <div

                        className="h-full rounded-full bg-emerald-500 transition-all"

                        style={{
                            width: `${Math.min(
                                Math.max(
                                    stats?.model_accuracy ?? 0,
                                    0
                                ),
                                100
                            )}%`,
                        }}

                    />

                </div>

            </div>

        </section>

    );

}