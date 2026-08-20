"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    BrainCircuit,
    RefreshCw,
    Search,
    Thermometer,
    CloudRain,
} from "lucide-react";

import {
    AdminPrediction,
    getAdminPredictions,
} from "@/services/admin";

import {
    clearAdminAuth,
    getAdminToken,
} from "@/utils/auth";

import {
    useRouter,
} from "next/navigation";

import AdminLoading from "../components/AdminLoading";
import AdminEmptyState from "../components/AdminEmptyState";
import AdminError from "../components/AdminError";


const getId = (
    prediction: AdminPrediction
) =>
    String(
        prediction.id ??
        prediction._id ??
        ""
    );


const getYield = (
    prediction: AdminPrediction
) => {

    const value =
        prediction.predicted_yield ??
        prediction.yield_prediction ??
        prediction.predicted_yield_value;

    if (
        value === undefined ||
        value === null
    ) {

        return "—";

    }

    return Number(value).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2,
        }
    );
};


const formatDate = (
    value?: string
) => {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};


export default function AdminPredictionsPage() {

    const router =
        useRouter();


    const [
        predictions,
        setPredictions,
    ] = useState<AdminPrediction[]>([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    const [
        search,
        setSearch,
    ] = useState("");


    const loadPredictions =
        useCallback(
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const response =
                        await getAdminPredictions();

                    if (!response.success) {

                        throw new Error(
                            response.message ||
                            "Failed to load predictions."
                        );

                    }

                    setPredictions(
                        response.predictions
                    );

                }
                catch (error: any) {

                    if (
                        error?.response?.status === 401 ||
                        error?.response?.status === 403
                    ) {

                        clearAdminAuth();

                        router.replace(
                            "/admin/login"
                        );

                        return;

                    }

                    setError(
                        error?.response?.data?.detail ||
                        error?.response?.data?.message ||
                        error?.message ||
                        "Unable to load predictions."
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [router]
        );


    useEffect(() => {

        if (!getAdminToken()) {

            router.replace(
                "/admin/login"
            );

            return;
        }

        loadPredictions();

    }, [
        loadPredictions,
        router,
    ]);


    const filtered =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return predictions;
            }

            return predictions.filter(
                prediction => {

                    const crop =
                        prediction.crop ??
                        prediction.crop_name ??
                        "";

                    return (

                        crop
                            .toLowerCase()
                            .includes(query)

                        ||

                        String(
                            prediction.year ??
                            ""
                        )
                            .includes(query)

                        ||

                        String(
                            prediction.user_id ??
                            ""
                        )
                            .toLowerCase()
                            .includes(query)

                    );

                }
            );

        }, [
            predictions,
            search,
        ]);


    return (

        <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 md:py-8">

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                <div>

                    <p className="text-sm font-medium text-emerald-600">
                        Artificial Intelligence
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                        Predictions
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Monitor AI-powered crop yield prediction activity.
                    </p>

                </div>


                <button

                    type="button"

                    onClick={loadPredictions}

                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"

                >

                    <RefreshCw
                        size={16}
                    />

                    Refresh

                </button>

            </div>


            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="relative">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input

                        value={search}

                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }

                        placeholder="Search by crop, year or user ID..."

                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"

                    />

                </div>

            </div>


            {error && (

                <div className="mt-5">

                    <AdminError
                        message={error}
                        onRetry={loadPredictions}
                    />

                </div>

            )}


            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-5 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                            <BrainCircuit
                                size={19}
                            />

                        </div>

                        <div>

                            <p className="font-semibold text-slate-900">
                                AI Prediction Activity
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {filtered.length} prediction
                                {filtered.length === 1
                                    ? ""
                                    : "s"}
                            </p>

                        </div>

                    </div>

                </div>


                {loading ? (

                    <div className="p-5">
                        <AdminLoading rows={7} />
                    </div>

                ) : filtered.length === 0 ? (

                    <div className="p-5">

                        <AdminEmptyState

                            title="No predictions found"

                            description={
                                search
                                    ? "Try another search term."
                                    : "No AI predictions have been generated yet."
                            }

                        />

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px]">

                            <thead>

                                <tr className="border-b border-slate-200 bg-slate-50">

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Crop
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Area
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Rainfall
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Temperature
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Year
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Predicted Yield
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Created
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filtered.map(
                                    prediction => {

                                        const crop =
                                            prediction.crop ??
                                            prediction.crop_name ??
                                            "Unknown Crop";

                                        return (

                                            <tr

                                                key={
                                                    getId(prediction) ||
                                                    `${crop}-${prediction.created_at}`
                                                }

                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"

                                            >

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                                                            <BrainCircuit
                                                                size={18}
                                                            />

                                                        </div>

                                                        <div>

                                                            <p className="text-sm font-semibold capitalize text-slate-800">
                                                                {crop}
                                                            </p>

                                                            <p className="max-w-[180px] truncate text-[11px] text-slate-400">
                                                                User: {prediction.user_id || "—"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td className="px-5 py-4 text-sm text-slate-600">

                                                    {prediction.area ??
                                                        "—"}

                                                </td>


                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">

                                                        <CloudRain
                                                            size={14}
                                                            className="text-blue-500"
                                                        />

                                                        {prediction.rainfall ??
                                                            "—"}

                                                    </div>

                                                </td>


                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">

                                                        <Thermometer
                                                            size={14}
                                                            className="text-orange-500"
                                                        />

                                                        {prediction.temperature ??
                                                            "—"}

                                                    </div>

                                                </td>


                                                <td className="px-5 py-4 text-sm text-slate-600">

                                                    {prediction.year ??
                                                        "—"}

                                                </td>


                                                <td className="px-5 py-4">

                                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">

                                                        {getYield(
                                                            prediction
                                                        )}

                                                    </span>

                                                </td>


                                                <td className="px-5 py-4 text-sm text-slate-500">

                                                    {formatDate(
                                                        prediction.created_at
                                                    )}

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}