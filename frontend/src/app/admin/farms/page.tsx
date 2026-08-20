"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    MapPin,
    RefreshCw,
    Search,
    Sprout,
    Trash2,
} from "lucide-react";

import {
    AdminFarm,
    deleteAdminFarm,
    getAdminFarms,
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
// GET FARM ID
// ============================================================

const getId = (
    item: AdminFarm
) =>
    String(
        item.id ??
        item._id ??
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

export default function AdminFarmsPage() {

    const router =
        useRouter();


    // ========================================================
    // STATE
    // ========================================================

    const [
        farms,
        setFarms,
    ] = useState<AdminFarm[]>([]);


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
    // LOAD FARMS
    // ========================================================

    const loadFarms =
        useCallback(
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const response =
                        await getAdminFarms();


                    if (!response.success) {

                        throw new Error(
                            response.message ||
                            "Failed to load farms."
                        );

                    }


                    setFarms(
                        response.farms
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
                        "Unable to load farms."
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


        loadFarms();

    }, [
        loadFarms,
        router,
    ]);


    // ========================================================
    // DELETE FARM
    // ========================================================

    const handleDeleteFarm = async (
        farm: AdminFarm
    ) => {

        const farmId =
            getId(farm);


        if (!farmId) {

            alert(
                "Unable to delete this farm because its ID is missing."
            );

            return;

        }


        const farmName =
            farm.name ??
            farm.farm_name ??
            "this farm";


        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${farmName}"?\n\nThis action cannot be undone.`
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(
                farmId
            );

            setError("");


            const response =
                await deleteAdminFarm(
                    farmId
                );


            if (
                response?.success === false
            ) {

                throw new Error(
                    response.message ||
                    "Failed to delete farm."
                );

            }


            // Remove from UI immediately
            setFarms(
                previous =>
                    previous.filter(
                        item =>
                            getId(item) !==
                            farmId
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
                "Unable to delete farm."
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
                return farms;
            }


            return farms.filter(
                farm => {

                    const name =
                        farm.name ??
                        farm.farm_name ??
                        "";


                    return (

                        name
                            .toLowerCase()
                            .includes(query)

                        ||

                        (
                            farm.location ??
                            ""
                        )
                            .toLowerCase()
                            .includes(query)

                    );

                }
            );

        }, [
            farms,
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
                        Farms
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Monitor and manage farms registered across the platform.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={loadFarms}
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
                        placeholder="Search by farm name or location..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="mt-5">

                    <AdminError
                        message={error}
                        onRetry={loadFarms}
                    />

                </div>

            )}


            {/* TABLE */}

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-5 py-4">

                    <p className="font-semibold text-slate-900">
                        Registered Farms
                    </p>

                    <p className="mt-1 text-xs text-slate-500">

                        {filtered.length} farm
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
                            title="No farms found"
                            description={
                                search
                                    ? "Try another search term."
                                    : "There are no farms available."
                            }
                        />

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1000px]">

                            <thead>

                                <tr className="border-b border-slate-200 bg-slate-50">

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Farm
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Location
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Area
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Owner ID
                                    </th>

                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Created
                                    </th>

                                    <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filtered.map(
                                    farm => {

                                        const id =
                                            getId(farm);


                                        const name =
                                            farm.name ??
                                            farm.farm_name ??
                                            "Unnamed Farm";


                                        const isDeleting =
                                            deletingId === id;


                                        return (

                                            <tr
                                                key={
                                                    id ||
                                                    `${name}-${farm.created_at}`
                                                }
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                            >

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                                            <Sprout
                                                                size={18}
                                                            />

                                                        </div>

                                                        <p className="text-sm font-semibold text-slate-800">

                                                            {name}

                                                        </p>

                                                    </div>

                                                </td>


                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">

                                                        <MapPin
                                                            size={14}
                                                            className="text-slate-400"
                                                        />

                                                        {farm.location ||
                                                            "Not specified"}

                                                    </div>

                                                </td>


                                                <td className="px-5 py-4 text-sm text-slate-600">

                                                    {farm.area ??
                                                        farm.area_size ??
                                                        "—"}

                                                    {" "}

                                                    {farm.area_unit ||
                                                        ""}

                                                </td>


                                                <td className="max-w-[180px] truncate px-5 py-4 text-xs text-slate-500">

                                                    {farm.owner_id ??
                                                        farm.user_id ??
                                                        "—"}

                                                </td>


                                                <td className="px-5 py-4 text-sm text-slate-500">

                                                    {formatDate(
                                                        farm.created_at
                                                    )}

                                                </td>


                                                <td className="px-5 py-4">

                                                    <div className="flex justify-end">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteFarm(
                                                                    farm
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