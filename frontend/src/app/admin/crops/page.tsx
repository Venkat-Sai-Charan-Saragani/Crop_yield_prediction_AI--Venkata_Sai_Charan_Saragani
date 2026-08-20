"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    CalendarDays,
    RefreshCw,
    Search,
    Trash2,
    Wheat,
} from "lucide-react";

import {
    AdminCrop,
    deleteAdminCrop,
    getAdminCrops,
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


// ============================================================
// GET CROP ID
// ============================================================

const getId = (
    crop: AdminCrop
) =>
    String(
        crop.id ??
        crop._id ??
        ""
    );


// ============================================================
// FORMAT DATE
// ============================================================

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


// ============================================================
// PAGE
// ============================================================

export default function AdminCropsPage() {

    const router =
        useRouter();


    // ========================================================
    // STATE
    // ========================================================

    const [
        crops,
        setCrops,
    ] = useState<AdminCrop[]>([]);


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


    const [
        deletingId,
        setDeletingId,
    ] = useState<string | null>(null);


    // ========================================================
    // LOAD CROPS
    // ========================================================

    const loadCrops =
        useCallback(
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const response =
                        await getAdminCrops();


                    if (!response.success) {

                        throw new Error(
                            response.message ||
                            "Failed to load crops."
                        );

                    }


                    setCrops(
                        response.crops
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
                        "Unable to load crops."
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [router]
        );


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        if (!getAdminToken()) {

            router.replace(
                "/admin/login"
            );

            return;

        }


        loadCrops();

    }, [
        loadCrops,
        router,
    ]);


    // ========================================================
    // DELETE CROP
    // ========================================================

    const handleDeleteCrop = async (
        crop: AdminCrop
    ) => {

        const cropId =
            getId(crop);


        if (!cropId) {

            alert(
                "Unable to delete this crop because its ID is missing."
            );

            return;

        }


        const cropName =
            crop.name ??
            crop.crop_name ??
            "this crop";


        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${cropName}"?\n\nThis action cannot be undone.`
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(
                cropId
            );

            setError("");


            const response =
                await deleteAdminCrop(
                    cropId
                );


            if (
                response?.success === false
            ) {

                throw new Error(
                    response.message ||
                    "Failed to delete crop."
                );

            }


            // Remove from UI immediately
            setCrops(
                previous =>
                    previous.filter(
                        item =>
                            getId(item) !==
                            cropId
                    )
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
                "Unable to delete crop."
            );

        }
        finally {

            setDeletingId(null);

        }

    };


    // ========================================================
    // FILTER
    // ========================================================

    const filtered =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            if (!query) {
                return crops;
            }


            return crops.filter(
                crop => {

                    const name =
                        crop.name ??
                        crop.crop_name ??
                        "";


                    return (

                        name
                            .toLowerCase()
                            .includes(query)

                        ||

                        (
                            crop.crop_type ??
                            ""
                        )
                            .toLowerCase()
                            .includes(query)

                        ||

                        (
                            crop.variety ??
                            ""
                        )
                            .toLowerCase()
                            .includes(query)

                    );

                }
            );

        }, [
            crops,
            search,
        ]);


    // ========================================================
    // UI
    // ========================================================

    return (

        <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 md:py-8">

            {/* HEADER */}

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                <div>

                    <p className="text-sm font-medium text-emerald-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                        Crops
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Review and manage crop records and agricultural data.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={loadCrops}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <RefreshCw
                        size={16}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* SEARCH */}

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
                        placeholder="Search by crop, type or variety..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="mt-5">

                    <AdminError
                        message={error}
                        onRetry={loadCrops}
                    />

                </div>

            )}


            {/* TABLE */}

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-5 py-4">

                    <p className="font-semibold text-slate-900">
                        Crop Records
                    </p>

                    <p className="mt-1 text-xs text-slate-500">

                        {filtered.length} crop
                        {filtered.length === 1
                            ? ""
                            : "s"}

                    </p>

                </div>


                {loading ? (

                    <div className="p-5">

                        <AdminLoading
                            rows={7}
                        />

                    </div>

                ) : filtered.length === 0 ? (

                    <div className="p-5">

                        <AdminEmptyState
                            title="No crops found"
                            description={
                                search
                                    ? "Try another search term."
                                    : "There are no crop records available."
                            }
                        />

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1050px]">

                            <thead>

                                <tr className="border-b border-slate-200 bg-slate-50">

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Crop
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Variety
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Farm ID
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Sowing
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Harvest
                                    </th>

                                    <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filtered.map(
                                    crop => {

                                        const id =
                                            getId(crop);


                                        const name =
                                            crop.name ??
                                            crop.crop_name ??
                                            "Unnamed Crop";


                                        const isDeleting =
                                            deletingId === id;


                                        return (

                                            <tr
                                                key={
                                                    id ||
                                                    `${name}-${crop.created_at}`
                                                }
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                            >

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                                                            <Wheat
                                                                size={18}
                                                            />

                                                        </div>

                                                        <p className="text-sm font-semibold text-slate-800">

                                                            {name}

                                                        </p>

                                                    </div>

                                                </td>


                                                <td className="px-5 py-4">

                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">

                                                        {crop.crop_type ||
                                                            "—"}

                                                    </span>

                                                </td>


                                                <td className="px-5 py-4 text-sm text-slate-600">

                                                    {crop.variety ||
                                                        "—"}

                                                </td>


                                                <td className="max-w-[180px] truncate px-5 py-4 text-xs text-slate-500">

                                                    {crop.farm_id ||
                                                        "—"}

                                                </td>


                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">

                                                        <CalendarDays
                                                            size={14}
                                                            className="text-slate-400"
                                                        />

                                                        {formatDate(
                                                            crop.sowing_date
                                                        )}

                                                    </div>

                                                </td>


                                                <td className="px-5 py-4 text-sm text-slate-600">

                                                    {formatDate(
                                                        crop.harvest_date
                                                    )}

                                                </td>


                                                <td className="px-5 py-4">

                                                    <div className="flex justify-end">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteCrop(
                                                                    crop
                                                                )
                                                            }
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            <Trash2
                                                                size={15}
                                                            />

                                                            {isDeleting
                                                                ? "Deleting..."
                                                                : "Delete"}

                                                        </button>

                                                    </div>

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