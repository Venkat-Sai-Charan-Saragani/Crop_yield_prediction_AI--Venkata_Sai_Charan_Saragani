"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import {
    Activity,
    ArrowRight,
    Bell,
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
    CircleUserRound,
    ClipboardList,
    Database,
    LayoutDashboard,
    LogOut,
    Menu,
    RefreshCw,
    Search,
    ShieldCheck,
    Sprout,
    Users,
    Wheat,
    X,
    Zap,
} from "lucide-react";

import {
    getAdminStats,
    AdminStats,
} from "@/services/admin";

import {
    getAdminToken,
    getAdminEmail,
    clearAdminAuth,
} from "@/utils/auth";


// ============================================================
// SEARCH ITEMS
// ============================================================

// ============================================================
// FORMAT MODEL ACCURACY
// ============================================================

function formatAccuracy(
    value: number | string | null | undefined
): string {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "0%";
    }

    const numericValue =
        Number(value);

    if (Number.isNaN(numericValue)) {
        return "0%";
    }

    if (
        numericValue >= 0 &&
        numericValue <= 1
    ) {
        return `${(numericValue * 100).toFixed(0)}%`;
    }

    return `${numericValue.toFixed(0)}%`;
}


const SEARCH_ITEMS = [
    {
        name: "Users",
        description: "Manage registered platform users",
        href: "/admin/users",
        keywords: [
            "users",
            "user",
            "accounts",
            "customers",
        ],
    },
    {
        name: "Farms",
        description: "View and manage registered farms",
        href: "/admin/farms",
        keywords: [
            "farms",
            "farm",
            "agriculture",
            "land",
        ],
    },
    {
        name: "Crops",
        description: "Review crop records",
        href: "/admin/crops",
        keywords: [
            "crops",
            "crop",
            "plants",
            "agriculture",
        ],
    },
    {
        name: "Predictions",
        description: "Review AI yield predictions",
        href: "/admin/predictions",
        keywords: [
            "predictions",
            "prediction",
            "ai",
            "yield",
            "model",
        ],
    },
    {
        name: "Agriculturalist Requests",
        description: "Approve or reject agriculturalist registrations",
        href: "/admin/agriculturalists",
        keywords: [
            "agriculturalist",
            "agriculturalists",
            "requests",
            "approval",
            "approve",
            "reject",
            "verification",
        ]
    }
];


// ============================================================
// ADMIN PAGE
// ============================================================

export default function AdminPage({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const router =
        useRouter();

    const pathname =
        usePathname();


    const [stats, setStats] =
        useState<AdminStats | null>(null);


    const [loading, setLoading] =
        useState(true);


    const [refreshing, setRefreshing] =
        useState(false);


    const [error, setError] =
        useState("");


    const [adminEmail, setAdminEmail] =
        useState("Administrator");


    const [search, setSearch] =
        useState("");


    const [searchOpen, setSearchOpen] =
        useState(false);


    const [notificationsOpen, setNotificationsOpen] =
        useState(false);


    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    // ========================================================
    // LOAD DASHBOARD
    // ========================================================

    const loadDashboard = useCallback(
        async (
            showFullLoader = true
        ) => {

            // ====================================================
            // ADMIN LOGIN PAGE
            // ====================================================
            // This file is the parent layout for the admin section.
            // Therefore it also runs when /admin/login is opened.
            //
            // NEVER load /admin/stats on the login page.
            // Otherwise the login page can trigger a 403 before the
            // administrator has even logged in.
            // ====================================================

            if (
                pathname === "/admin/login"
            ) {

                setLoading(false);
                setRefreshing(false);

                return;

            }


            // ====================================================
            // CHECK ADMIN TOKEN BEFORE DASHBOARD API
            // ====================================================

            const token =
                getAdminToken();


            if (!token) {

                clearAdminAuth();

                router.replace(
                    "/admin/login"
                );

                return;

            }


            try {

                if (showFullLoader) {

                    setLoading(true);

                }
                else {

                    setRefreshing(true);

                }


                setError("");


                const response =
                    await getAdminStats();


                if (
                    response.success !== true
                ) {

                    const responseMessage =
                        String(
                            response.message ||
                            ""
                        ).toLowerCase();


                    // =================================================
                    // BACKEND ADMIN AUTHORIZATION FAILURE
                    // =================================================
                    // If getAdminStats() converts a 401/403 into a
                    // normal response object, the original catch block
                    // cannot see the HTTP status. Check the backend
                    // message here as well.
                    // =================================================

                    if (
                        responseMessage.includes(
                            "administrator privileges"
                        ) ||
                        responseMessage.includes(
                            "administrator privilege"
                        ) ||
                        responseMessage.includes(
                            "admin privileges"
                        ) ||
                        responseMessage.includes(
                            "not authorized"
                        ) ||
                        responseMessage.includes(
                            "unauthorized"
                        ) ||
                        responseMessage.includes(
                            "forbidden"
                        )
                    ) {

                        clearAdminAuth();

                        router.replace(
                            "/admin/login"
                        );

                        return;

                    }


                    throw new Error(
                        response.message ||
                        "Unable to load administrator statistics."
                    );

                }


                if (!response.stats) {

                    throw new Error(
                        "The server returned no administrator statistics."
                    );

                }


                setStats(
                    response.stats
                );

            }
            catch (error: any) {

                console.error(
                    "ADMIN DASHBOARD ERROR:",
                    error
                );


                const status =
                    error?.response?.status;


                if (
                    status === 401 ||
                    status === 403
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
                    "Unable to load administrator dashboard."
                );

            }
            finally {

                setLoading(false);

                setRefreshing(false);

            }

        },
        [
            pathname,
            router,
        ]
    );


    // ========================================================
    // INITIALIZE
    // ========================================================

    useEffect(() => {

        // ====================================================
        // DO NOT INITIALIZE THE DASHBOARD ON ADMIN LOGIN
        // ====================================================

        if (
            pathname === "/admin/login"
        ) {

            setLoading(false);

            return;

        }


        setAdminEmail(
            getAdminEmail() ||
            "Administrator"
        );


        loadDashboard(
            true
        );

    }, [
        pathname,
        loadDashboard,
    ]);


    // ========================================================
    // SEARCH RESULTS
    // ========================================================

    const searchResults =
        useMemo(() => {

            const query =
                search.trim().toLowerCase();


            if (!query) {

                return SEARCH_ITEMS;

            }


            return SEARCH_ITEMS.filter(
                (item) => {

                    const text =
                        [
                            item.name,
                            item.description,
                            ...item.keywords,
                        ]
                            .join(" ")
                            .toLowerCase();


                    return text.includes(
                        query
                    );

                }
            );

        }, [search]);


    // ========================================================
    // SEARCH NAVIGATION
    // ========================================================

    const navigateFromSearch = (
        href: string
    ) => {

        setSearchOpen(false);

        setSearch("");

        router.push(
            href
        );

    };


    // ========================================================
    // LOGOUT
    // ========================================================

    const logout = () => {

        clearAdminAuth();

        router.replace(
            "/admin/login"
        );

    };


    // ========================================================
    // NOTIFICATIONS
    // ========================================================

    const notifications = useMemo(() => {

        return [

            {
                id: "api",
                title: "API Server",
                message: "Administrator API is responding.",
                icon: <Zap size={16} />,
            },

            {
                id: "database",
                title: "Database",
                message: "Platform data is available.",
                icon: <Database size={16} />,
            },

            {
                id: "auth",
                title: "Authentication",
                message: "JWT administrator authentication is enabled.",
                icon: <ShieldCheck size={16} />,
            },

        ];

    }, []);


    // ========================================================
    // ADMIN LOGIN CHILD PAGE
    // ========================================================
    //
    // This file is the /admin route layout. The login page is a
    // child route: /admin/login.
    //
    // The dashboard must NOT render over the login page.
    // Return the login page directly so the user can enter the
    // administrator email and password.
    // ========================================================

    if (
        pathname === "/admin/login"
    ) {

        return (
            <>
                {children}
            </>
        );

    }


    // ========================================================
    // CHILD ADMIN ROUTES
    // ========================================================
    // Render the actual child page for every admin route except
    // the main /admin dashboard. This allows /users, /farms,
    // /crops and /predictions to display their own page content.
    // ========================================================

    if (pathname !== "/admin") {

        return (
            <>
                {children}
            </>
        );

    }


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

                    <p className="mt-4 text-sm text-slate-500">

                        Loading administrator console...

                    </p>

                </div>

            </div>

        );

    }


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <div className="min-h-screen w-full bg-slate-50">


            {/* ================================================== */}
            {/* MOBILE OVERLAY */}
            {/* ================================================== */}

            {mobileMenuOpen && (

                <button
                    aria-label="Close menu"
                    onClick={() =>
                        setMobileMenuOpen(false)
                    }
                    className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
                />

            )}


            {/* ================================================== */}
            {/* SIDEBAR */}
            {/* ================================================== */}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    w-[260px]
                    flex-col
                    bg-slate-950
                    text-white
                    transition-transform
                    duration-300
                    lg:translate-x-0
                    ${
                        mobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* BRAND */}

                <div className="flex h-[82px] shrink-0 items-center border-b border-white/10 px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500">

                            <Sprout
                                size={27}
                                strokeWidth={2}
                            />

                        </div>


                        <div>

                            <p className="text-[17px] font-bold">

                                YieldSenseAI

                            </p>

                            <p className="text-xs text-slate-400">

                                Admin Console

                            </p>

                        </div>

                    </div>


                    <button
                        onClick={() =>
                            setMobileMenuOpen(false)
                        }
                        className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* NAVIGATION */}

                <nav className="flex-1 overflow-y-auto px-4 py-7">

                    <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">

                        Overview

                    </p>


                    <SidebarItem
                        active
                        icon={
                            <LayoutDashboard size={20} />
                        }
                        label="Dashboard"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/admin");
                        }}
                    />


                    <p className="mt-8 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">

                        Management

                    </p>


                    <SidebarItem
                        icon={
                            <Users size={20} />
                        }
                        label="Users"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/admin/users");
                        }}
                    />


                    <SidebarItem
                        icon={
                            <Sprout size={20} />
                        }
                        label="Farms"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/admin/farms");
                        }}
                    />


                    <SidebarItem
                        icon={
                            <Wheat size={20} />
                        }
                        label="Crops"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/admin/crops");
                        }}
                    />


                    <SidebarItem
                        icon={
                            <BrainCircuit size={20} />
                        }
                        label="Predictions"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/admin/predictions");
                        }}
                    />

                    <SidebarItem
                        icon={
                            <ClipboardList size={20} />
                        }
                        label="Agriculturalist Request"
                        onClick={() =>{
                            setMobileMenuOpen(false);
                            router.push("/admin/agriculturalists");
                        }

                        }
                    />



                    <p className="mt-8 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">

                        System

                    </p>


                    <SidebarItem
                        icon={
                            <ArrowRight size={20} />
                        }
                        label="User Dashboard"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/dashboard");
                        }}
                    />

                </nav>


                {/* ADMIN ACCOUNT */}

                <div className="shrink-0 border-t border-white/10 p-4">

                    <div className="rounded-2xl bg-white/5 p-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">

                                <CircleUserRound
                                    size={21}
                                />

                            </div>


                            <div className="min-w-0">

                                <p className="truncate text-sm font-semibold text-white">

                                    {adminEmail}

                                </p>

                                <p className="mt-0.5 text-xs text-emerald-400">

                                    Administrator

                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        onClick={logout}
                        className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                    >

                        <LogOut size={18} />

                        Logout

                    </button>

                </div>

            </aside>


            {/* ================================================== */}
            {/* MAIN APPLICATION */}
            {/* ================================================== */}

            <div className="min-h-screen lg:pl-[260px]">


                {/* ================================================== */}
                {/* TOP HEADER */}
                {/* ================================================== */}

                <header className="sticky top-0 z-30 h-[82px] border-b border-slate-200 bg-white/95 backdrop-blur">

                    <div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-8">


                        {/* MOBILE MENU */}

                        <button
                            onClick={() =>
                                setMobileMenuOpen(true)
                            }
                            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
                        >

                            <Menu size={20} />

                        </button>


                        {/* SECURITY STATUS */}

                        <div className="hidden items-center gap-2 text-sm text-slate-500 xl:flex">

                            <ShieldCheck
                                size={18}
                                className="text-emerald-600"
                            />

                            Secure Administrator Console

                        </div>


                        {/* SEARCH */}

                        <div className="relative ml-auto w-full max-w-[430px]">

                            <div className="relative">

                                <Search
                                    size={19}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />


                                <input
                                    value={search}
                                    onChange={(event) => {

                                        setSearch(
                                            event.target.value
                                        );

                                        setSearchOpen(
                                            true
                                        );

                                    }}
                                    onFocus={() =>
                                        setSearchOpen(
                                            true
                                        )
                                    }
                                    onKeyDown={(event) => {

                                        if (
                                            event.key === "Enter" &&
                                            searchResults.length > 0
                                        ) {

                                            navigateFromSearch(
                                                searchResults[0].href
                                            );

                                        }

                                        if (
                                            event.key === "Escape"
                                        ) {

                                            setSearchOpen(
                                                false
                                            );

                                        }

                                    }}
                                    placeholder="Search management pages"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                />

                            </div>


                            {/* SEARCH DROPDOWN */}

                            {searchOpen && (

                                <>

                                    <button
                                        aria-label="Close search"
                                        onClick={() =>
                                            setSearchOpen(false)
                                        }
                                        className="fixed inset-0 cursor-default"
                                    />


                                    <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                                        <div className="border-b border-slate-100 px-4 py-3">

                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                                Management

                                            </p>

                                        </div>


                                        {searchResults.length > 0 ? (

                                            searchResults.map(
                                                (item) => (

                                                    <button
                                                        key={item.href}
                                                        onClick={() =>
                                                            navigateFromSearch(
                                                                item.href
                                                            )
                                                        }
                                                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                                                    >

                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">

                                                            {item.name === "Users" && (
                                                                <Users size={17} />
                                                            )}

                                                            {item.name === "Farms" && (
                                                                <Sprout size={17} />
                                                            )}

                                                            {item.name === "Crops" && (
                                                                <Wheat size={17} />
                                                            )}

                                                            {item.name === "Predictions" && (
                                                                <BrainCircuit size={17} />
                                                            )}

                                                        </div>


                                                        <div className="min-w-0 flex-1">

                                                            <p className="text-sm font-semibold text-slate-800">

                                                                {item.name}

                                                            </p>

                                                            <p className="truncate text-xs text-slate-500">

                                                                {item.description}

                                                            </p>

                                                        </div>


                                                        <ChevronRight
                                                            size={16}
                                                            className="text-slate-300"
                                                        />

                                                    </button>

                                                )
                                            )

                                        ) : (

                                            <div className="px-4 py-7 text-center">

                                                <Search
                                                    size={22}
                                                    className="mx-auto text-slate-300"
                                                />

                                                <p className="mt-2 text-sm font-medium text-slate-700">

                                                    No management page found

                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">

                                                    Try Users, Farms, Crops or Predictions.

                                                </p>

                                            </div>

                                        )}

                                    </div>

                                </>

                            )}

                        </div>


                        {/* NOTIFICATIONS */}

                        <div className="relative">

                            <button
                                onClick={() =>
                                    setNotificationsOpen(
                                        !notificationsOpen
                                    )
                                }
                                aria-label="Notifications"
                                className={`
                                    relative
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    transition
                                    ${
                                        notificationsOpen
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    }
                                `}
                            >

                                <Bell size={19} />


                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />

                            </button>


                            {notificationsOpen && (

                                <div className="absolute right-0 top-14 z-50 w-[330px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                                        <div>

                                            <p className="font-bold text-slate-900">

                                                Notifications

                                            </p>

                                            <p className="text-xs text-slate-500">

                                                System status

                                            </p>

                                        </div>


                                        <button
                                            onClick={() =>
                                                setNotificationsOpen(
                                                    false
                                                )
                                            }
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                                        >

                                            <X size={17} />

                                        </button>

                                    </div>


                                    {notifications.map(
                                        (notification) => (

                                            <div
                                                key={notification.id}
                                                className="flex gap-3 border-b border-slate-100 px-5 py-4 last:border-0"
                                            >

                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">

                                                    {notification.icon}

                                                </div>


                                                <div>

                                                    <p className="text-sm font-semibold text-slate-800">

                                                        {notification.title}

                                                    </p>

                                                    <p className="mt-0.5 text-xs leading-5 text-slate-500">

                                                        {notification.message}

                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {/* PROFILE */}

                        <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 md:flex">

                            <div className="text-right">

                                <p className="max-w-[190px] truncate text-sm font-semibold text-slate-800">

                                    {adminEmail}

                                </p>

                                <p className="text-xs font-medium text-emerald-600">

                                    Administrator

                                </p>

                            </div>


                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                <ShieldCheck
                                    size={21}
                                />

                            </div>

                        </div>

                    </div>

                </header>


                {/* ================================================== */}
                {/* CONTENT */}
                {/* ================================================== */}

                <main className="w-full px-4 py-6 sm:px-6 lg:px-8">


                    {/* BREADCRUMB */}

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                        <LayoutDashboard
                            size={16}
                        />

                        <span>
                            Administration
                        </span>

                        <ChevronRight
                            size={15}
                        />

                        <span className="font-semibold text-slate-800">

                            Overview

                        </span>

                    </div>


                    {/* TITLE ROW */}

                    <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

                        <div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">

                                Administrator Dashboard

                            </h1>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">

                                Monitor and manage your YieldSenseAI platform from one central console.

                            </p>

                        </div>


                        <div className="flex items-center gap-3">

                            <button
                                onClick={() =>
                                    loadDashboard(false)
                                }
                                disabled={refreshing}
                                className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <RefreshCw
                                    size={17}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh

                            </button>


                            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">

                                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                SYSTEM OPERATIONAL

                            </div>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

                            <div className="mt-0.5 text-red-600">

                                <Activity size={19} />

                            </div>


                            <div className="flex-1">

                                <p className="font-semibold text-red-800">

                                    Dashboard error

                                </p>

                                <p className="mt-1 text-sm text-red-600">

                                    {error}

                                </p>

                                <button
                                    onClick={() =>
                                        loadDashboard(
                                            false
                                        )
                                    }
                                    className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                                >

                                    Try Again

                                </button>

                            </div>

                        </div>

                    )}


                    {/* ================================================== */}
                    {/* STATS */}
                    {/* ================================================== */}

                    <section className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                        <StatCard
                            title="Total Users"
                            value={
                                stats?.total_users ??
                                0
                            }
                            description="Registered platform accounts"
                            icon={
                                <Users size={22} />
                            }
                            iconClass="bg-blue-50 text-blue-600"
                        />


                        <StatCard
                            title="Total Farms"
                            value={
                                stats?.total_farms ??
                                0
                            }
                            description="Farms registered on platform"
                            icon={
                                <Sprout size={22} />
                            }
                            iconClass="bg-emerald-50 text-emerald-600"
                        />


                        <StatCard
                            title="Total Crops"
                            value={
                                stats?.total_crops ??
                                0
                            }
                            description="Crop records being tracked"
                            icon={
                                <Wheat size={22} />
                            }
                            iconClass="bg-amber-50 text-amber-600"
                        />


                        <StatCard
                            title="AI Predictions"
                            value={
                                stats?.total_predictions ??
                                0
                            }
                            description="Yield predictions generated"
                            icon={
                                <BrainCircuit size={22} />
                            }
                            iconClass="bg-purple-50 text-purple-600"
                        />

                    </section>


                    {/* ================================================== */}
                    {/* SECONDARY PANELS */}
                    {/* ================================================== */}

                    <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">


                        {/* SYSTEM HEALTH */}

                        <div className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <h2 className="font-bold text-slate-900">

                                        System Health

                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">

                                        Current platform status

                                    </p>

                                </div>


                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                    <Activity size={21} />

                                </div>

                            </div>


                            <div className="mt-6 space-y-4">

                                <HealthRow
                                    name="API Server"
                                />

                                <HealthRow
                                    name="Database"
                                />

                                <HealthRow
                                    name="Authentication"
                                />

                                <HealthRow
                                    name="AI Prediction Service"
                                />

                            </div>

                        </div>


                        {/* MODEL PERFORMANCE */}

                        <div className="xl:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <h2 className="font-bold text-slate-900">

                                        Model Performance

                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">

                                        Current reported prediction accuracy

                                    </p>

                                </div>


                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                                    <BrainCircuit size={21} />

                                </div>

                            </div>


                            <div className="mt-7">

                                <div className="flex items-end justify-between">

                                    <p className="text-4xl font-bold tracking-tight text-slate-950">

                                        {formatAccuracy(
                                            stats?.model_accuracy
                                        )}

                                    </p>

                                    <p className="text-sm text-slate-500">

                                        Accuracy

                                    </p>

                                </div>


                                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className="h-full rounded-full bg-purple-500 transition-all"
                                        style={{
                                            width: `${Math.min(
                                                Math.max(
                                                    Number(
                                                        stats?.model_accuracy ??
                                                        0
                                                    ),
                                                    0
                                                ),
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>


                                <div className="mt-5 flex items-center gap-2 text-sm text-emerald-600">

                                    <CheckCircle2
                                        size={17}
                                    />

                                    Prediction engine available

                                </div>

                            </div>

                        </div>


                        {/* DATA OVERVIEW */}

                        <div className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <h2 className="font-bold text-slate-900">

                                        Data Overview

                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">

                                        Platform data records

                                    </p>

                                </div>


                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                    <Database size={21} />

                                </div>

                            </div>


                            <div className="mt-5 space-y-3">

                                <DataRow
                                    label="Users"
                                    value={
                                        stats?.total_users ??
                                        0
                                    }
                                />

                                <DataRow
                                    label="Farms"
                                    value={
                                        stats?.total_farms ??
                                        0
                                    }
                                />

                                <DataRow
                                    label="Crops"
                                    value={
                                        stats?.total_crops ??
                                        0
                                    }
                                />

                                <DataRow
                                    label="Predictions"
                                    value={
                                        stats?.total_predictions ??
                                        0
                                    }
                                />

                            </div>

                        </div>

                    </section>


                    {/* ================================================== */}
                    {/* MANAGEMENT */}
                    {/* ================================================== */}

                    <section className="mt-7">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-slate-950">

                                    Management

                                </h2>

                                <p className="mt-1 text-sm text-slate-500">

                                    Access platform administration modules.

                                </p>

                            </div>

                        </div>


                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                            <ManagementCard
                                title="Users"
                                description="View registered users and account information."
                                icon={
                                    <Users size={22} />
                                }
                                href="/admin/users"
                                router={router}
                            />


                            <ManagementCard
                                title="Farms"
                                description="Monitor farms registered across the platform."
                                icon={
                                    <Sprout size={22} />
                                }
                                href="/admin/farms"
                                router={router}
                            />


                            <ManagementCard
                                title="Crops"
                                description="Review crop records and agricultural data."
                                icon={
                                    <Wheat size={22} />
                                }
                                href="/admin/crops"
                                router={router}
                            />


                            <ManagementCard
                                title="Predictions"
                                description="Review AI yield prediction activity."
                                icon={
                                    <BrainCircuit size={22} />
                                }
                                href="/admin/predictions"
                                router={router}
                            />

                        </div>

                    </section>


                    {/* ================================================== */}
                    {/* FOOTER */}
                    {/* ================================================== */}

                    <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                    <ShieldCheck
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <p className="text-sm font-semibold text-slate-800">

                                        Administrator session active

                                    </p>

                                    <p className="text-xs text-slate-500">

                                        Secure JWT authentication is enabled.

                                    </p>

                                </div>

                            </div>


                            <button
                                onClick={() =>
                                    router.push(
                                        "/dashboard"
                                    )
                                }
                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >

                                Open User Dashboard

                                <ArrowRight
                                    size={16}
                                />

                            </button>

                        </div>

                    </section>

                </main>

            </div>

        </div>

    );
}


// ============================================================
// SIDEBAR ITEM
// ============================================================

function SidebarItem({

    icon,

    label,

    active = false,

    onClick,

}: {

    icon: React.ReactNode;

    label: string;

    active?: boolean;

    onClick: () => void;

}) {

    return (

        <button
            onClick={onClick}
            className={`
                mt-2
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-left
                text-sm
                font-medium
                transition
                ${
                    active
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                }
            `}
        >

            {icon}

            {label}

        </button>

    );

}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({

    title,

    value,

    description,

    icon,

    iconClass,

}: {

    title: string;

    value: number;

    description: string;

    icon: React.ReactNode;

    iconClass: string;

}) {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <p className="text-sm font-medium text-slate-500">

                        {title}

                    </p>


                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">

                        {value.toLocaleString()}

                    </p>

                </div>


                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >

                    {icon}

                </div>

            </div>


            <p className="mt-4 text-sm leading-5 text-slate-500">

                {description}

            </p>

        </div>

    );

}


// ============================================================
// HEALTH ROW
// ============================================================

function HealthRow({

    name,

}: {

    name: string;

}) {

    return (

        <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                <span className="text-sm text-slate-700">

                    {name}

                </span>

            </div>


            <span className="text-sm font-semibold text-emerald-600">

                Operational

            </span>

        </div>

    );

}


// ============================================================
// DATA ROW
// ============================================================

function DataRow({

    label,

    value,

}: {

    label: string;

    value: number;

}) {

    return (

        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

            <span className="text-sm text-slate-600">

                {label}

            </span>


            <span className="text-sm font-bold text-slate-900">

                {value.toLocaleString()}

            </span>

        </div>

    );

}


// ============================================================
// MANAGEMENT CARD
// ============================================================

function ManagementCard({

    title,

    description,

    icon,

    href,

    router,

}: {

    title: string;

    description: string;

    icon: React.ReactNode;

    href: string;

    router: ReturnType<typeof useRouter>;

}) {

    return (

        <button
            type="button"
            onClick={() =>
                router.push(href)
            }
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
        >

            <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">

                    {icon}

                </div>

                <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                />

            </div>

            <h3 className="mt-5 font-bold text-slate-900">

                {title}

            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">

                {description}

            </p>

        </button>

    );

}