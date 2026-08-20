"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    AlertCircle,
    BarChart3,
    BrainCircuit,
    ChevronRight,
    Database,
    Leaf,
    LogOut,
    Menu,
    RefreshCw,
    Search,
    ShieldCheck,
    Sprout,
    Trash2,
    Users,
    Wheat,
    X,
} from "lucide-react";

import {
    getAdminStats,
    getAdminUsers,
    getAdminFarms,
    getAdminCrops,
    getAdminPredictions,
    deleteAdminUser,
} from "@/services/admin";

import {
    getAdminToken,
    removeAdminToken,
} from "@/utils/auth";


// ============================================================
// TYPES
// ============================================================

type Section =
    | "dashboard"
    | "users"
    | "farms"
    | "crops"
    | "predictions"
    | "agriculturalists";


type Stats = {
    total_users: number;
    total_farms: number;
    total_crops: number;
    total_predictions: number;
    model_accuracy: number;
};


type User = {
    id?: string;
    _id?: string;

    full_name?: string;
    name?: string;

    email?: string;

    auth_provider?: string | null;

    role?: string;

    phone_number?: string | null;
    phone?: string | null;

    status?: string;

    created_at?: string;
};


type Farm = {
    _id?: string;
    id?: string;

    user_id?: string;

    farm_name?: string;
    name?: string;

    area?: number;
    area_unit?: string;

    soil_type?: string;

    latitude?: number;
    longitude?: number;

    created_at?: string;
};


type Crop = {
    _id?: string;
    id?: string;

    user_id?: string;
    farm_id?: string;

    crop_name?: string;
    crop_type?: string;
    crop?: string;

    sowing_date?: string;
    harvest_date?: string;

    created_at?: string;
};


type Prediction = {
    _id?: string;
    id?: string;

    user_id?: string;

    crop?: string;
    crop_name?: string;

    predicted_yield?: number;
    yield?: number;
    prediction?: number;

    created_at?: string;
};


// ============================================================
// NAVIGATION
// ============================================================

const navigation: {
    id: Section;
    label: string;
    icon: React.ElementType;
}[] = [

    {
        id: "dashboard",
        label: "Dashboard",
        icon: BarChart3,
    },

    {
        id: "users",
        label: "Users",
        icon: Users,
    },

    {
        id: "farms",
        label: "Farms",
        icon: Sprout,
    },

    {
        id: "crops",
        label: "Crops",
        icon: Wheat,
    },

    {
        id: "predictions",
        label: "AI Predictions",
        icon: BrainCircuit,
    },

 ];


// ============================================================
// HELPERS
// ============================================================

function getId(
    item: User
) {
    return (
        item.id ||
        item._id ||
        ""
    );
}


function getCropName(
    crop: Crop
) {
    return (
        crop.crop_name ||
        crop.crop_type ||
        crop.crop ||
        "Unknown Crop"
    );
}


function getPredictionValue(
    prediction: Prediction
) {
    return (
        prediction.predicted_yield ??
        prediction.yield ??
        prediction.prediction ??
        0
    );
}


function formatDate(
    value?: string
) {

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
}


// ============================================================
// MAIN ADMIN DASHBOARD
// ============================================================

export default function AdminDashboard() {

    const router =
        useRouter();


    // ========================================================
    // STATE
    // ========================================================

    const [
        activeSection,
        setActiveSection,
    ] = useState<Section>(
        "dashboard"
    );


    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        refreshing,
        setRefreshing,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState<User | null>(
        null
    );


    const [
        deleting,
        setDeleting,
    ] = useState(false);


    const [
        lastUpdated,
        setLastUpdated,
    ] = useState<Date | null>(
        null
    );


    // ========================================================
    // DATA
    // ========================================================

    const [
        stats,
        setStats,
    ] = useState<Stats>({
        total_users: 0,
        total_farms: 0,
        total_crops: 0,
        total_predictions: 0,
        model_accuracy: 0,
    });


    const [
        users,
        setUsers,
    ] = useState<User[]>(
        []
    );


    const [
        farms,
        setFarms,
    ] = useState<Farm[]>(
        []
    );


    const [
        crops,
        setCrops,
    ] = useState<Crop[]>(
        []
    );


    const [
        predictions,
        setPredictions,
    ] = useState<Prediction[]>(
        []
    );


    // ========================================================
    // LOAD DASHBOARD
    // ========================================================

    const loadDashboard =
        useCallback(
            async (
                isRefresh = false
            ) => {

                const token =
                    getAdminToken();


                if (!token) {

                    router.replace(
                        "/admin/login"
                    );

                    return;

                }


                try {

                    if (isRefresh) {

                        setRefreshing(
                            true
                        );

                    } else {

                        setLoading(
                            true
                        );

                    }


                    setError("");


                    /*
                     * IMPORTANT:
                     *
                     * Agriculturalists are NOT loaded here.
                     *
                     * They have their own page:
                     *
                     * /admin/agriculturalists
                     *
                     * This keeps the dashboard clean and prevents
                     * agriculturalist-specific TypeScript errors here.
                     */

                    const [
                        statsResponse,
                        usersResponse,
                        farmsResponse,
                        cropsResponse,
                        predictionsResponse,
                    ] =
                        await Promise.all([

                            getAdminStats(),

                            getAdminUsers(),

                            getAdminFarms(),

                            getAdminCrops(),

                            getAdminPredictions(),

                        ]);


                    // ====================================================
                    // STATS
                    // ====================================================

                    if (
                        statsResponse &&
                        statsResponse.success
                    ) {

                        const adminStats =
                            statsResponse.stats;


                        setStats({

                            total_users:
                                Number(
                                    adminStats
                                        ?.total_users ??
                                    0
                                ),

                            total_farms:
                                Number(
                                    adminStats
                                        ?.total_farms ??
                                    0
                                ),

                            total_crops:
                                Number(
                                    adminStats
                                        ?.total_crops ??
                                    0
                                ),

                            total_predictions:
                                Number(
                                    adminStats
                                        ?.total_predictions ??
                                    0
                                ),

                            model_accuracy:
                                Number(
                                    adminStats
                                        ?.model_accuracy ??
                                    0
                                ),

                        });

                    }


                    // ====================================================
                    // USERS
                    // ====================================================

                    if (
                        usersResponse &&
                        usersResponse.success
                    ) {

                        /*
                         * Explicitly create a safe array.
                         *
                         * This avoids:
                         *
                         * usersResponse.users
                         *
                         * becoming a TypeScript problem when the API
                         * response is changed.
                         */

                        const userList =
                            Array.isArray(
                                usersResponse.users
                            )
                                ? usersResponse.users
                                : [];


                        setUsers(
                            userList as User[]
                        );

                    }


                    // ====================================================
                    // FARMS
                    // ====================================================

                    if (
                        farmsResponse &&
                        farmsResponse.success
                    ) {

                        const farmList =
                            Array.isArray(
                                farmsResponse.farms
                            )
                                ? farmsResponse.farms
                                : [];


                        setFarms(
                            farmList as Farm[]
                        );

                    }


                    // ====================================================
                    // CROPS
                    // ====================================================

                    if (
                        cropsResponse &&
                        cropsResponse.success
                    ) {

                        const cropList =
                            Array.isArray(
                                cropsResponse.crops
                            )
                                ? cropsResponse.crops
                                : [];


                        setCrops(
                            cropList as Crop[]
                        );

                    }


                    // ====================================================
                    // PREDICTIONS
                    // ====================================================

                    if (
                        predictionsResponse &&
                        predictionsResponse.success
                    ) {

                        const predictionList =
                            Array.isArray(
                                predictionsResponse.predictions
                            )
                                ? predictionsResponse.predictions
                                : [];


                        setPredictions(
                            predictionList as Prediction[]
                        );

                    }


                    setLastUpdated(
                        new Date()
                    );

                }
                catch (err: any) {

                    console.error(
                        "ADMIN DASHBOARD ERROR:",
                        err
                    );


                    const status =
                        err?.response?.status;


                    if (
                        status === 401 ||
                        status === 403
                    ) {

                        removeAdminToken();


                        localStorage.removeItem(
                            "admin_access_token"
                        );

                        localStorage.removeItem(
                            "access_token"
                        );

                        localStorage.removeItem(
                            "user_role"
                        );

                        localStorage.removeItem(
                            "admin_email"
                        );


                        router.replace(
                            "/admin/login"
                        );

                        return;

                    }


                    setError(
                        err?.response?.data?.detail ||
                        err?.response?.data?.message ||
                        "Unable to load administrator dashboard."
                    );

                }
                finally {

                    setLoading(
                        false
                    );

                    setRefreshing(
                        false
                    );

                }

            },
            [router]
        );


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(
        () => {

            loadDashboard(
                false
            );

        },
        [loadDashboard]
    );


    // ========================================================
    // AUTO REFRESH
    // ========================================================

    useEffect(
        () => {

            const interval =
                window.setInterval(
                    () => {

                        loadDashboard(
                            true
                        );

                    },
                    60000
                );


            return () => {

                window.clearInterval(
                    interval
                );

            };

        },
        [loadDashboard]
    );


    // ========================================================
    // SEARCH
    // ========================================================

    const normalizedSearch =
        search
            .trim()
            .toLowerCase();


    // ========================================================
    // FILTER USERS
    // ========================================================

    const filteredUsers =
        useMemo(
            () => {

                if (
                    !normalizedSearch
                ) {

                    return users;

                }


                return users.filter(
                    (
                        user
                    ) => {

                        return [

                            user.full_name,

                            user.name,

                            user.email,

                            user.role,

                            user.auth_provider,

                            user.phone_number,

                        ]
                            .filter(
                                Boolean
                            )
                            .some(
                                (
                                    value
                                ) =>
                                    String(
                                        value
                                    )
                                        .toLowerCase()
                                        .includes(
                                            normalizedSearch
                                        )
                            );

                    }
                );

            },
            [
                users,
                normalizedSearch,
            ]
        );


    // ========================================================
    // FILTER FARMS
    // ========================================================

    const filteredFarms =
        useMemo(
            () => {

                if (
                    !normalizedSearch
                ) {

                    return farms;

                }


                return farms.filter(
                    (
                        farm
                    ) => {

                        return [

                            farm.farm_name,

                            farm.name,

                            farm.soil_type,

                            farm.area_unit,

                            farm.user_id,

                        ]
                            .filter(
                                Boolean
                            )
                            .some(
                                (
                                    value
                                ) =>
                                    String(
                                        value
                                    )
                                        .toLowerCase()
                                        .includes(
                                            normalizedSearch
                                        )
                            );

                    }
                );

            },
            [
                farms,
                normalizedSearch,
            ]
        );


    // ========================================================
    // FILTER CROPS
    // ========================================================

    const filteredCrops =
        useMemo(
            () => {

                if (
                    !normalizedSearch
                ) {

                    return crops;

                }


                return crops.filter(
                    (
                        crop
                    ) => {

                        return [

                            getCropName(
                                crop
                            ),

                            crop.user_id,

                            crop.farm_id,

                        ]
                            .filter(
                                Boolean
                            )
                            .some(
                                (
                                    value
                                ) =>
                                    String(
                                        value
                                    )
                                        .toLowerCase()
                                        .includes(
                                            normalizedSearch
                                        )
                            );

                    }
                );

            },
            [
                crops,
                normalizedSearch,
            ]
        );


    // ========================================================
    // FILTER PREDICTIONS
    // ========================================================

    const filteredPredictions =
        useMemo(
            () => {

                if (
                    !normalizedSearch
                ) {

                    return predictions;

                }


                return predictions.filter(
                    (
                        prediction
                    ) => {

                        return [

                            prediction.crop_name,

                            prediction.crop,

                            prediction.user_id,

                            getPredictionValue(
                                prediction
                            ),

                        ]
                            .filter(
                                (
                                    value
                                ) =>
                                    value !==
                                        undefined &&
                                    value !==
                                        null
                            )
                            .some(
                                (
                                    value
                                ) =>
                                    String(
                                        value
                                    )
                                        .toLowerCase()
                                        .includes(
                                            normalizedSearch
                                        )
                            );

                    }
                );

            },
            [
                predictions,
                normalizedSearch,
            ]
        );


    // ========================================================
    // DELETE USER
    // ========================================================

    const handleDeleteUser =
        async () => {

            if (
                !deleteTarget
            ) {

                return;

            }


            const userId =
                getId(
                    deleteTarget
                );


            if (!userId) {

                setError(
                    "Unable to identify the selected user."
                );

                setDeleteTarget(
                    null
                );

                return;

            }


            try {

                setDeleting(
                    true
                );

                setError("");


                await deleteAdminUser(
                    userId
                );


                setUsers(
                    (
                        current
                    ) =>
                        current.filter(
                            (
                                user
                            ) =>
                                getId(
                                    user
                                ) !==
                                userId
                        )
                );


                setStats(
                    (
                        current
                    ) => ({

                        ...current,

                        total_users:
                            Math.max(
                                0,
                                current.total_users -
                                1
                            ),

                    })
                );


                setDeleteTarget(
                    null
                );

            }
            catch (err: any) {

                console.error(
                    "DELETE USER ERROR:",
                    err
                );


                const status =
                    err?.response?.status;


                if (
                    status === 401 ||
                    status === 403
                ) {

                    removeAdminToken();

                    router.replace(
                        "/admin/login"
                    );

                    return;

                }


                setError(
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    "Unable to delete this user."
                );

            }
            finally {

                setDeleting(
                    false
                );

            }

        };


    // ========================================================
    // CHANGE SECTION
    // ========================================================

    const changeSection =(
        section: Section
    ) => {
        if (
            section === "agriculturalists"
        ){
            setMobileOpen(false);

            router.push(
                "/admin/agriculturalists"
            );

            return;
        }

        setActiveSection(section);
        setMobileOpen(false);
    };
        

   

    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout =
        () => {

            removeAdminToken();

            localStorage.removeItem(
                "admin_access_token"
            );

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "user_role"
            );

            localStorage.removeItem(
                "admin_email"
            );

            router.replace(
                "/admin/login"
            );

        };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

                <div className="text-center">

                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">

                        <Leaf
                            size={30}
                            className="animate-pulse text-emerald-400"
                        />

                    </div>


                    <div className="mx-auto mb-4 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">

                        <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-500" />

                    </div>


                    <p className="text-sm text-slate-400">
                        Loading administrator dashboard...
                    </p>

                </div>

            </main>

        );

    }


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <main className="min-h-screen bg-slate-100 text-slate-900">

            {/* ==================================================
                MOBILE OVERLAY
            ================================================== */}

            {mobileOpen && (

                <div
                    className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden"
                    onClick={() =>
                        setMobileOpen(
                            false
                        )
                    }
                />

            )}


            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    flex
                    h-screen
                    w-[280px]
                    flex-col
                    bg-slate-950
                    text-white
                    shadow-2xl
                    transition-transform
                    duration-300
                    lg:translate-x-0
                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* BRAND */}

                <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500">

                            <Leaf
                                size={23}
                                className="text-white"
                            />

                        </div>


                        <div>

                            <h1 className="font-bold tracking-tight">
                                YieldSense AI
                            </h1>

                            <p className="text-[11px] text-slate-500">
                                Administrator Console
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            setMobileOpen(
                                false
                            )
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
                    >

                        <X
                            size={20}
                        />

                    </button>

                </div>


                {/* NAVIGATION */}

                <div className="flex-1 overflow-y-auto px-4 py-6">

                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                        Main Menu
                    </p>


                    <nav className="space-y-1">

                        {navigation.map(
                            (
                                item
                            ) => {

                                const Icon =
                                    item.icon;


                                const active =
                                    activeSection ===
                                    item.id;


                                return (

                                    <button
                                        key={
                                            item.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            changeSection(
                                                item.id
                                            )
                                        }
                                        className={`
                                            group
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-left
                                            text-sm
                                            font-medium
                                            transition
                                            ${
                                                active
                                                    ? "bg-emerald-500 text-white"
                                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                            }
                                        `}
                                    >

                                        <Icon
                                            size={19}
                                            className={
                                                active
                                                    ? "text-white"
                                                    : "text-slate-500 group-hover:text-white"
                                            }
                                        />


                                        <span>
                                            {
                                                item.label
                                            }
                                        </span>


                                        <ChevronRight
                                            size={15}
                                            className="ml-auto opacity-40"
                                        />

                                    </button>

                                );

                            }
                        )}


                        {/* ==================================================
                            AGRICULTURALIST REQUESTS
                            DEDICATED ADMIN SIDEBAR BUTTON
                        ================================================== */}

                        <button
                            type="button"
                            onClick={() =>
                                changeSection(
                                    "agriculturalists"
                                )
                            }
                            className="
                                mt-3
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-emerald-500/20
                                bg-emerald-500/10
                                px-4
                                py-3
                                text-left
                                text-sm
                                font-semibold
                                text-emerald-400
                                transition
                                hover:border-emerald-500/40
                                hover:bg-emerald-500/20
                                hover:text-emerald-300
                            "
                        >

                            <span
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-emerald-500
                                    text-white
                                "
                            >
                                <ShieldCheck
                                    size={18}
                                />
                            </span>

                            <span className="flex-1">
                                Agriculturalist Requests
                            </span>

                            <ChevronRight
                                size={16}
                                className="opacity-60"
                            />

                        </button>

                    </nav>

                </div>


                {/* SIGN OUT */}

                <div className="border-t border-white/10 p-4">

                    <button
                        type="button"
                        onClick={
                            handleLogout
                        }
                        className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-slate-400
                            transition
                            hover:bg-red-500/10
                            hover:text-red-400
                        "
                    >

                        <LogOut
                            size={19}
                        />

                        Sign Out

                    </button>

                </div>

            </aside>


            {/* ==================================================
                MAIN AREA
            ================================================== */}

            <div className="lg:pl-[280px]">

                {/* HEADER */}

                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

                    <div className="flex h-20 items-center justify-between px-4 md:px-8">

                        <div className="flex items-center gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileOpen(
                                        true
                                    )
                                }
                                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                            >

                                <Menu
                                    size={22}
                                />

                            </button>


                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                    Administration
                                </p>

                                <h1 className="text-xl font-bold text-slate-900">
                                    {activeSection ===
                                    "dashboard"
                                        ? "Dashboard"
                                        : activeSection ===
                                          "users"
                                        ? "Users"
                                        : activeSection ===
                                          "farms"
                                        ? "Farms"
                                        : activeSection ===
                                          "crops"
                                        ? "Crops"
                                        : "AI Predictions"}
                                </h1>

                            </div>

                        </div>


                        <div className="flex items-center gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    loadDashboard(
                                        true
                                    )
                                }
                                disabled={
                                    refreshing
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    shadow-sm
                                    hover:bg-slate-50
                                    disabled:opacity-50
                                "
                            >

                                <RefreshCw
                                    size={16}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                <span className="hidden sm:inline">
                                    Refresh
                                </span>

                            </button>


                            <div className="hidden h-8 w-px bg-slate-200 sm:block" />


                            <div className="hidden items-center gap-3 sm:flex">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">

                                    <ShieldCheck
                                        size={20}
                                        className="text-emerald-600"
                                    />

                                </div>


                                <div>

                                    <p className="text-sm font-semibold">
                                        Administrator
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        System Admin
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* SEARCH */}

                    {activeSection !==
                        "dashboard" && (

                        <div className="border-t border-slate-100 px-4 py-3 md:px-8">

                            <div className="flex max-w-xl items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5">

                                <Search
                                    size={17}
                                    className="text-slate-400"
                                />


                                <input
                                    value={
                                        search
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder={
                                        `Search ${activeSection}...`
                                    }
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                />

                            </div>

                        </div>

                    )}

                </header>


                {/* CONTENT */}

                <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">

                    {/* ERROR */}

                    {error && (

                        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

                            <AlertCircle
                                size={20}
                            />

                            <div className="flex-1">

                                <p className="font-semibold">
                                    Something went wrong
                                </p>

                                <p className="mt-1 text-sm">
                                    {error}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setError(
                                        ""
                                    )
                                }
                            >

                                <X
                                    size={18}
                                />

                            </button>

                        </div>

                    )}


                    {/* ==================================================
                        DASHBOARD
                    ================================================== */}

                    {activeSection ===
                        "dashboard" && (

                        <DashboardView
                            stats={
                                stats
                            }
                            users={
                                users
                            }
                            farms={
                                farms
                            }
                            crops={
                                crops
                            }
                            predictions={
                                predictions
                            }
                            lastUpdated={
                                lastUpdated
                            }
                            onNavigate={
                                changeSection
                            }
                        />

                    )}


                    {/* ==================================================
                        USERS
                    ================================================== */}

                    {activeSection ===
                        "users" && (

                        <UsersView
                            users={
                                filteredUsers
                            }
                            total={
                                users.length
                            }
                            onDelete={
                                setDeleteTarget
                            }
                        />

                    )}


                    {/* ==================================================
                        FARMS
                    ================================================== */}

                    {activeSection ===
                        "farms" && (

                        <FarmsView
                            farms={
                                filteredFarms
                            }
                            total={
                                farms.length
                            }
                        />

                    )}


                    {/* ==================================================
                        CROPS
                    ================================================== */}

                    {activeSection ===
                        "crops" && (

                        <CropsView
                            crops={
                                filteredCrops
                            }
                            total={
                                crops.length
                            }
                        />

                    )}


                    {/* ==================================================
                        PREDICTIONS
                    ================================================== */}

                    {activeSection ===
                        "predictions" && (

                        <PredictionsView
                            predictions={
                                filteredPredictions
                            }
                            total={
                                predictions.length
                            }
                        />

                    )}

                </div>

            </div>


            {/* ========================================================
                DELETE USER MODAL
            ======================================================== */}

            {deleteTarget && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

                        <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">

                                <Trash2
                                    size={22}
                                />

                            </div>


                            <div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Delete User
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    This action cannot be undone.
                                </p>

                            </div>

                        </div>


                        <div className="mt-5 rounded-2xl bg-slate-50 p-4">

                            <p className="text-sm font-semibold text-slate-900">
                                {deleteTarget.full_name ||
                                    deleteTarget.name ||
                                    "Unknown User"}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                {deleteTarget.email ||
                                    "No email"}
                            </p>

                        </div>


                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                disabled={
                                    deleting
                                }
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleDeleteUser
                                }
                                disabled={
                                    deleting
                                }
                                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                            >

                                {deleting
                                    ? "Deleting..."
                                    : "Delete User"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </main>

    );

}


// ============================================================
// AGRICULTURALIST CLIPBOARD ICON
// ============================================================

function ClipboardIcon() {

    return (

        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <rect
                width="8"
                height="4"
                x="8"
                y="2"
                rx="1"
            />

            <path
                d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
            />

            <path
                d="m9 14 2 2 4-4"
            />

        </svg>

    );

}


// ============================================================
// DASHBOARD VIEW
// ============================================================

function DashboardView({
    stats,
    users,
    farms,
    crops,
    predictions,
    lastUpdated,
    onNavigate,
    
}: {
    stats: Stats;
    users: User[];
    farms: Farm[];
    crops: Crop[];
    predictions: Prediction[];
    lastUpdated: Date | null;
    onNavigate: (
        section: Section
    ) => void;
}) {

    return (

        <div>

            {/* HEADER */}

            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

                <div>

                    <p className="text-sm font-semibold text-emerald-600">
                        Overview
                    </p>

                    <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                        Admin Dashboard
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Monitor your YieldSense AI platform.
                    </p>

                </div>


                {lastUpdated && (

                    <p className="text-xs text-slate-400">
                        Last updated{" "}
                        {lastUpdated.toLocaleTimeString(
                            "en-IN"
                        )}
                    </p>

                )}

            </div>


            {/* STATS */}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total Users"
                    value={
                        stats.total_users
                    }
                    description="Registered platform users"
                    icon={
                        Users
                    }
                    onClick={() =>
                        onNavigate(
                            "users"
                        )
                    }
                />


                <StatCard
                    title="Total Farms"
                    value={
                        stats.total_farms
                    }
                    description="Farms registered"
                    icon={
                        Sprout
                    }
                    onClick={() =>
                        onNavigate(
                            "farms"
                        )
                    }
                />


                <StatCard
                    title="Total Crops"
                    value={
                        stats.total_crops
                    }
                    description="Crops being tracked"
                    icon={
                        Wheat
                    }
                    onClick={() =>
                        onNavigate(
                            "crops"
                        )
                    }
                />


                <StatCard
                    title="Predictions"
                    value={
                        stats.total_predictions
                    }
                    description="AI yield predictions"
                    icon={
                        BrainCircuit
                    }
                    onClick={() =>
                        onNavigate(
                            "predictions"
                        )
                    }
                />

            </div>


            {/* QUICK ACTIONS */}

            <div className="mt-8">

                <h3 className="text-lg font-bold text-slate-900">
                    Quick Actions
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Manage the most important areas of your platform.
                </p>


                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">

                    <QuickAction
                        title="Manage Users"
                        description="View and manage registered users."
                        icon={
                            Users
                        }
                        onClick={() =>
                            onNavigate(
                                "users"
                            )
                        }
                    />


                    <QuickAction
                        title="Manage Farms"
                        description="View registered agricultural farms."
                        icon={
                            Sprout
                        }
                        onClick={() =>
                            onNavigate(
                                "farms"
                            )
                        }
                    />


                    <QuickAction
                        title="Manage Crops"
                        description="View crop records."
                        icon={
                            Wheat
                        }
                        onClick={() =>
                            onNavigate(
                                "crops"
                            )
                        }
                    />


                    <QuickAction
                        title="AI Predictions"
                        description="Review yield predictions."
                        icon={
                            BrainCircuit
                        }
                        onClick={() =>
                            onNavigate(
                                "predictions"
                            )
                        }
                    />


                    {/* ==================================================
                        AGRICULTURALIST REQUESTS
                    ================================================== */}

                    
                </div>

            </div>


            {/* OVERVIEW */}

            <div className="mt-8 grid gap-6 xl:grid-cols-2">

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <h3 className="font-bold text-slate-900">
                                Platform Overview
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Current database totals
                            </p>

                        </div>


                        <Database
                            size={20}
                            className="text-slate-400"
                        />

                    </div>


                    <div className="mt-6 space-y-5">

                        <OverviewRow
                            label="Users"
                            value={
                                stats.total_users
                            }
                            max={
                                Math.max(
                                    stats.total_users,
                                    1
                                )
                            }
                        />

                        <OverviewRow
                            label="Farms"
                            value={
                                stats.total_farms
                            }
                            max={
                                Math.max(
                                    stats.total_users,
                                    stats.total_farms,
                                    1
                                )
                            }
                        />

                        <OverviewRow
                            label="Crops"
                            value={
                                stats.total_crops
                            }
                            max={
                                Math.max(
                                    stats.total_users,
                                    stats.total_crops,
                                    1
                                )
                            }
                        />

                        <OverviewRow
                            label="Predictions"
                            value={
                                stats.total_predictions
                            }
                            max={
                                Math.max(
                                    stats.total_users,
                                    stats.total_predictions,
                                    1
                                )
                            }
                        />

                    </div>

                </div>


                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                    <h3 className="font-bold text-slate-900">
                        Model Performance
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                        Current AI model accuracy
                    </p>


                    <div className="mt-8 flex items-center justify-center">

                        <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full border-[14px] border-emerald-100">

                            <span className="text-4xl font-black text-slate-900">
                                {stats.model_accuracy}
                                %
                            </span>

                            <span className="mt-1 text-xs font-semibold text-slate-400">
                                Accuracy
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    onClick,
}: {
    title: string;
    value: number;
    description: string;
    icon: React.ElementType;
    onClick: () => void;
}) {

    return (

        <button
            type="button"
            onClick={
                onClick
            }
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >

            <div className="absolute left-0 top-0 h-1 w-full bg-emerald-500" />


            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-semibold text-slate-500">
                        {title}
                    </p>


                    <p className="mt-3 text-3xl font-black text-slate-900">
                        {value.toLocaleString()}
                    </p>


                    <p className="mt-2 text-xs text-slate-500">
                        {description}
                    </p>

                </div>


                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">

                    <Icon
                        size={23}
                        className="text-emerald-600"
                    />

                </div>

            </div>


            <div className="mt-5 flex items-center text-xs font-semibold text-slate-400 group-hover:text-emerald-600">

                View details

                <ChevronRight
                    size={14}
                    className="ml-1"
                />

            </div>

        </button>

    );

}


// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
    icon: Icon,
    title,
    description,
    onClick,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    onClick: () => void;
}) {

    return (

        <button
            type="button"
            onClick={
                onClick
            }
            className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
        >

            <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">

                    <Icon
                        size={19}
                        className="text-emerald-600"
                    />

                </div>


                <ChevronRight
                    size={17}
                    className="text-slate-300 group-hover:text-emerald-500"
                />

            </div>


            <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-emerald-600">
                {title}
            </h3>


            <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
            </p>

        </button>

    );

}


// ============================================================
// OVERVIEW ROW
// ============================================================

function OverviewRow({
    label,
    value,
    max,
}: {
    label: string;
    value: number;
    max: number;
}) {

    const percentage =
        Math.min(
            100,
            Math.round(
                (value / max) *
                    100
            )
        );


    return (

        <div>

            <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-700">
                    {label}
                </span>


                <span className="text-sm font-bold text-slate-900">
                    {value.toLocaleString()}
                </span>

            </div>


            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

        </div>

    );

}


// ============================================================
// USERS VIEW
// ============================================================

function UsersView({
    users,
    total,
    onDelete,
}: {
    users: User[];
    total: number;
    onDelete: (
        user: User
    ) => void;
}) {

    return (

        <div>

            <PageHeader
                title="Users"
                description="Manage registered platform users."
                count={total}
            />


            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                {users.length === 0 ? (

                    <EmptyState
                        title="No users found"
                        description="There are no users matching your search."
                    />

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[850px]">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        User
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Email
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Role
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Auth
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Created
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {users.map(
                                    (
                                        user,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                getId(
                                                    user
                                                ) ||
                                                `user-${index}`
                                            }
                                            className="hover:bg-slate-50"
                                        >

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600">

                                                        {(
                                                            user.full_name ||
                                                            user.name ||
                                                            "U"
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}

                                                    </div>


                                                    <div>

                                                        <p className="font-semibold text-slate-800">
                                                            {
                                                                user.full_name ||
                                                                user.name ||
                                                                "Unknown User"
                                                            }
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            {
                                                                user.phone_number ||
                                                                "No phone"
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            <td className="px-5 py-4">

                                                <span className="text-sm text-slate-600">
                                                    {
                                                        user.email ||
                                                        "—"
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-5 py-4">

                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                                    {
                                                        user.role ||
                                                        "user"
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-5 py-4">

                                                <span className="text-sm capitalize text-slate-600">
                                                    {
                                                        user.auth_provider ||
                                                        "Local"
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-5 py-4">

                                                <span className="text-sm text-slate-500">
                                                    {formatDate(
                                                        user.created_at
                                                    )}
                                                </span>

                                            </td>


                                            <td className="px-5 py-4 text-right">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDelete(
                                                            user
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                                                >

                                                    <Trash2
                                                        size={14}
                                                    />

                                                    Delete

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}


// ============================================================
// FARMS VIEW
// ============================================================

function FarmsView({
    farms,
    total,
}: {
    farms: Farm[];
    total: number;
}) {

    return (

        <div>

            <PageHeader
                title="Farms"
                description="View farms registered on the platform."
                count={total}
            />


            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {farms.length === 0 ? (

                    <div className="md:col-span-2 xl:col-span-3">

                        <EmptyState
                            title="No farms found"
                            description="There are no farms matching your search."
                        />

                    </div>

                ) : (

                    farms.map(
                        (
                            farm,
                            index
                        ) => (

                            <div
                                key={
                                    farm.id ||
                                    farm._id ||
                                    `farm-${index}`
                                }
                                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                            >

                                <div className="flex items-start justify-between">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">

                                        <Sprout
                                            size={20}
                                            className="text-emerald-600"
                                        />

                                    </div>


                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                                        Farm
                                    </span>

                                </div>


                                <h3 className="mt-5 font-bold text-slate-900">
                                    {
                                        farm.farm_name ||
                                        farm.name ||
                                        "Unnamed Farm"
                                    }
                                </h3>


                                <div className="mt-4 space-y-2 text-sm text-slate-500">

                                    <p>
                                        Area:{" "}
                                        <strong className="text-slate-700">
                                            {
                                                farm.area ??
                                                "—"
                                            }{" "}
                                            {
                                                farm.area_unit ||
                                                ""
                                            }
                                        </strong>
                                    </p>


                                    <p>
                                        Soil:{" "}
                                        <strong className="text-slate-700">
                                            {
                                                farm.soil_type ||
                                                "—"
                                            }
                                        </strong>
                                    </p>


                                    <p>
                                        User ID:{" "}
                                        <strong className="text-slate-700">
                                            {
                                                farm.user_id ||
                                                "—"
                                            }
                                        </strong>
                                    </p>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>

        </div>

    );

}


// ============================================================
// CROPS VIEW
// ============================================================

function CropsView({
    crops,
    total,
}: {
    crops: Crop[];
    total: number;
}) {

    return (

        <div>

            <PageHeader
                title="Crops"
                description="View crop records stored in the platform."
                count={total}
            />


            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                {crops.length === 0 ? (

                    <EmptyState
                        title="No crops found"
                        description="There are no crops matching your search."
                    />

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[750px]">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Crop
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        User ID
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Farm ID
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Sowing
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Harvest
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {crops.map(
                                    (
                                        crop,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                crop.id ||
                                                crop._id ||
                                                `crop-${index}`
                                            }
                                            className="hover:bg-slate-50"
                                        >

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">

                                                        <Wheat
                                                            size={18}
                                                            className="text-amber-600"
                                                        />

                                                    </div>


                                                    <span className="font-semibold text-slate-800">
                                                        {
                                                            getCropName(
                                                                crop
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            <td className="px-5 py-4 text-sm text-slate-500">
                                                {
                                                    crop.user_id ||
                                                    "—"
                                                }
                                            </td>


                                            <td className="px-5 py-4 text-sm text-slate-500">
                                                {
                                                    crop.farm_id ||
                                                    "—"
                                                }
                                            </td>


                                            <td className="px-5 py-4 text-sm text-slate-500">
                                                {formatDate(
                                                    crop.sowing_date
                                                )}
                                            </td>


                                            <td className="px-5 py-4 text-sm text-slate-500">
                                                {formatDate(
                                                    crop.harvest_date
                                                )}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}


// ============================================================
// PREDICTIONS VIEW
// ============================================================

function PredictionsView({
    predictions,
    total,
}: {
    predictions: Prediction[];
    total: number;
}) {

    return (

        <div>

            <PageHeader
                title="AI Predictions"
                description="Review AI-generated crop yield predictions."
                count={total}
            />


            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                {predictions.length === 0 ? (

                    <EmptyState
                        title="No predictions found"
                        description="There are no predictions matching your search."
                    />

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[750px]">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Crop
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Predicted Yield
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        User ID
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Date
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {predictions.map(
                                    (
                                        prediction,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                prediction.id ||
                                                prediction._id ||
                                                `prediction-${index}`
                                            }
                                            className="hover:bg-slate-50"
                                        >

                                            <td className="px-5 py-4">

                                                <span className="font-semibold text-slate-800">
                                                    {
                                                        prediction.crop_name ||
                                                        prediction.crop ||
                                                        "Unknown Crop"
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-5 py-4">

                                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">

                                                    {
                                                        getPredictionValue(
                                                            prediction
                                                        )
                                                    }

                                                </span>

                                            </td>


                                            <td className="px-5 py-4 text-sm text-slate-500">
                                                {
                                                    prediction.user_id ||
                                                    "—"
                                                }
                                            </td>


                                            <td className="px-5 py-4 text-sm text-slate-500">
                                                {formatDate(
                                                    prediction.created_at
                                                )}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}


// ============================================================
// PAGE HEADER
// ============================================================

function PageHeader({
    title,
    description,
    count,
}: {
    title: string;
    description: string;
    count: number;
}) {

    return (

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

                <p className="text-sm font-semibold text-emerald-600">
                    Administration
                </p>

                <h2 className="mt-1 text-3xl font-black text-slate-950">
                    {title}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    {description}
                </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total
                </p>

                <p className="mt-1 text-xl font-black text-slate-900">
                    {count.toLocaleString()}
                </p>

            </div>

        </div>

    );

}


// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {

    return (

        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-16 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

                <Database
                    size={24}
                    className="text-slate-400"
                />

            </div>


            <h3 className="mt-4 font-semibold text-slate-800">
                {title}
            </h3>


            <p className="mt-1 max-w-sm text-sm text-slate-500">
                {description}
            </p>

        </div>

    );

}