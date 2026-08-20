"use client";

import {
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    Sprout,
    Users,
    Wheat,
} from "lucide-react";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import {
    useEffect,
} from "react";

import {
    getAdminToken,
    removeAdminToken,
} from "@/utils/auth";


// ============================================================
// NAVIGATION ITEM TYPE
// ============================================================

type NavigationItem = {
    label: string;
    href: string;
    icon: React.ElementType;
};


// ============================================================
// ADMIN SIDEBAR
// ============================================================

export default function AdminSidebar() {

    const pathname = usePathname();

    const router = useRouter();


    // ========================================================
    // AUTHENTICATION
    // ========================================================

    useEffect(() => {

        const token = getAdminToken();

        if (!token) {

            router.replace(
                "/admin/login"
            );

        }

    }, [router]);


    // ========================================================
    // NAVIGATION ITEMS
    // ========================================================

    const navigation: NavigationItem[] = [

        {
            label: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
        },

        {
            label: "Users",
            href: "/admin/users",
            icon: Users,
        },

        {
            label: "Farms",
            href: "/admin/farms",
            icon: Sprout,
        },

        {
            label: "Crops",
            href: "/admin/crops",
            icon: Wheat,
        },

        {
            label: "Predictions",
            href: "/admin/predictions",
            icon: BrainCircuit,
        },

        {
            label: "Agriculturalists",
            href: "/admin/agriculturalists",
            icon: CheckCircle2,
        },

    ];


    // ========================================================
    // NAVIGATE
    // ========================================================

    const navigate = (
        href: string
    ) => {

        router.push(href);

    };


    // ========================================================
    // LOGOUT
    // ========================================================

    const logout = () => {

        const confirmed =
            window.confirm(
                "Do you want to log out of the administrator console?"
            );

        if (!confirmed) {
            return;
        }

        removeAdminToken();

        router.replace(
            "/admin/login"
        );

    };


    // ========================================================
    // ACTIVE ITEM
    // ========================================================

    const isActive = (
        href: string
    ) => {

        if (href === "/admin") {

            return pathname === "/admin";

        }

        return (
            pathname === href ||
            pathname.startsWith(
                `${href}/`
            )
        );

    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <aside
            className="
                fixed
                left-0
                top-0
                z-40
                flex
                h-screen
                w-[300px]
                flex-col
                bg-[#020817]
                text-white
            "
        >

            {/* =================================================
                BRAND
            ================================================= */}

            <div
                className="
                    flex
                    h-24
                    shrink-0
                    items-center
                    border-b
                    border-white/10
                    px-6
                "
            >

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin")
                    }
                    className="
                        flex
                        items-center
                        gap-3
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
                            bg-emerald-500
                            shadow-lg
                            shadow-emerald-500/20
                        "
                    >

                        <Sprout
                            size={30}
                            strokeWidth={2.4}
                        />

                    </div>


                    <div
                        className="
                            text-left
                        "
                    >

                        <h1
                            className="
                                text-xl
                                font-black
                                tracking-tight
                            "
                        >
                            YieldSenseAI
                        </h1>

                        <p
                            className="
                                text-xs
                                text-slate-400
                            "
                        >
                            Admin Console
                        </p>

                    </div>

                </button>

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div
                className="
                    flex-1
                    overflow-y-auto
                    px-3
                    py-7
                "
            >

                {/* =================================================
                    OVERVIEW
                ================================================= */}

                <p
                    className="
                        mb-3
                        px-3
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                        text-slate-500
                    "
                >
                    Overview
                </p>


                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin")
                    }
                    className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3.5
                        text-left
                        text-sm
                        font-semibold
                        transition-all

                        ${
                            isActive("/admin")
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }
                    `}
                >

                    <LayoutDashboard
                        size={20}
                    />

                    <span>
                        Dashboard
                    </span>

                </button>


                {/* =================================================
                    MANAGEMENT
                ================================================= */}

                <p
                    className="
                        mb-3
                        mt-9
                        px-3
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                        text-slate-500
                    "
                >
                    Management
                </p>


                <div
                    className="
                        space-y-1
                    "
                >

                    {/* USERS */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/users")
                        }
                        className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3.5
                            text-left
                            text-sm
                            font-semibold
                            transition-all

                            ${
                                isActive("/admin/users")
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }
                        `}
                    >

                        <Users size={20} />

                        <span>
                            Users
                        </span>

                    </button>


                    {/* FARMS */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/farms")
                        }
                        className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3.5
                            text-left
                            text-sm
                            font-semibold
                            transition-all

                            ${
                                isActive("/admin/farms")
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }
                        `}
                    >

                        <Sprout size={20} />

                        <span>
                            Farms
                        </span>

                    </button>


                    {/* CROPS */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/crops")
                        }
                        className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3.5
                            text-left
                            text-sm
                            font-semibold
                            transition-all

                            ${
                                isActive("/admin/crops")
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }
                        `}
                    >

                        <Wheat size={20} />

                        <span>
                            Crops
                        </span>

                    </button>


                    {/* PREDICTIONS */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/predictions")
                        }
                        className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3.5
                            text-left
                            text-sm
                            font-semibold
                            transition-all

                            ${
                                isActive("/admin/predictions")
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }
                        `}
                    >

                        <BrainCircuit size={20} />

                        <span>
                            Predictions
                        </span>

                    </button>


                    {/* =================================================
                        AGRICULTURALISTS
                    ================================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/agriculturalists"
                            )
                        }
                        className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3.5
                            text-left
                            text-sm
                            font-semibold
                            transition-all

                            ${
                                isActive(
                                    "/admin/agriculturalists"
                                )
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }
                        `}
                    >

                        <CheckCircle2
                            size={20}
                        />

                        <span className="flex-1">
                            Agriculturalists
                        </span>

                        {isActive(
                            "/admin/agriculturalists"
                        ) && (

                            <span
                                className="
                                    rounded-full
                                    bg-white/20
                                    px-2
                                    py-1
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-wider
                                "
                            >
                                Review
                            </span>

                        )}

                    </button>

                </div>


                {/* =================================================
                    SYSTEM
                ================================================= */}

                <p
                    className="
                        mb-3
                        mt-9
                        px-3
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                        text-slate-500
                    "
                >
                    System
                </p>


                <button
                    type="button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                    className="
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3.5
                        text-left
                        text-sm
                        font-semibold
                        text-slate-300
                        transition
                        hover:bg-white/5
                        hover:text-white
                    "
                >

                    <ChevronRight
                        size={20}
                        className="
                            transition
                            group-hover:translate-x-1
                        "
                    />

                    <span>
                        User Dashboard
                    </span>

                </button>

            </div>


            {/* =================================================
                ADMIN ACCOUNT
            ================================================= */}

            <div
                className="
                    shrink-0
                    border-t
                    border-white/10
                    p-4
                "
            >

                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        bg-white/[0.04]
                        p-4
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
                            rounded-full
                            border
                            border-emerald-500/30
                            bg-emerald-500/10
                            text-emerald-400
                        "
                    >

                        <ShieldCheck
                            size={21}
                        />

                    </div>


                    <div
                        className="
                            min-w-0
                        "
                    >

                        <p
                            className="
                                truncate
                                text-sm
                                font-bold
                            "
                        >
                            Administrator
                        </p>

                        <p
                            className="
                                text-xs
                                text-emerald-400
                            "
                        >
                            Administrator
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={logout}
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-slate-300
                        transition
                        hover:bg-red-500/10
                        hover:text-red-400
                    "
                >

                    <LogOut
                        size={19}
                    />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>

    );

}