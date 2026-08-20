"use client";

import Link from "next/link";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import {
    LayoutDashboard,
    Sprout,
    CloudSun,
    Leaf,
    BarChart3,
    User,
    LogOut,
    UserRoundCheck,
    MessageCircle,
} from "lucide-react";

import {
    removeToken,
} from "@/utils/auth";

import {
    useLanguage,
} from "@/context/LanguageContext";


export default function Sidebar() {

    const pathname =
        usePathname();

    const router =
        useRouter();


    const {
        t,
    } = useLanguage();


    // ========================================================
    // USER MENU
    // ========================================================

    const menuItems = [

        {
            name: t.dashboard,
            href: "/dashboard",
            icon: LayoutDashboard,
        },

        {
            name: t.yieldPrediction,
            href: "/prediction",
            icon: Sprout,
        },

        {
            name: t.weather,
            href: "/weather",
            icon: CloudSun,
        },

        {
            name: t.soilAnalysis,
            href: "/soil",
            icon: Leaf,
        },

        {
            name: t.analytics,
            href: "/analytics",
            icon: BarChart3,
        },

        {
            name: t.agriculturalist,
            href: "/agriculturalist",
            icon: UserRoundCheck,
        },

        {
            name: t.myChats,
            href: "/agriculturalist/chats",
            icon: MessageCircle,
        },

        {
            name: t.profile,
            href: "/profile",
            icon: User,
        },

    ];


    // ========================================================
    // LOGOUT
    // ========================================================

    const logout = () => {

        const confirmed =
            window.confirm(
                t.logoutConfirmation
            );

        if (!confirmed) {
            return;
        }

        removeToken();

        router.replace(
            "/login"
        );

    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <aside
            className="
                hidden
                lg:flex
                w-72
                min-h-screen
                flex-col
                bg-slate-950
                text-white
            "
        >

            {/* =================================================
                BRAND
            ================================================= */}

            <div
                className="
                    px-6
                    py-7
                    border-b
                    border-white/10
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            w-11
                            h-11
                            rounded-xl
                            bg-emerald-500
                            flex
                            items-center
                            justify-center
                            shadow-lg
                            shadow-emerald-500/20
                        "
                    >

                        <Sprout
                            size={24}
                        />

                    </div>


                    <div>

                        <h1
                            className="
                                font-bold
                                text-lg
                            "
                        >
                            {t.cropYieldAI}
                        </h1>

                        <p
                            className="
                                text-xs
                                text-slate-400
                            "
                        >
                            {t.intelligentAgriculture}
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div
                className="
                    flex-1
                    px-4
                    py-6
                "
            >

                <p
                    className="
                        px-3
                        mb-3
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                    "
                >
                    {t.mainMenu}
                </p>


                <nav
                    className="
                        space-y-1
                    "
                >

                    {menuItems.map(
                        (item) => {

                            const Icon =
                                item.icon;

                            const active =
                                pathname === item.href ||
                                pathname.startsWith(
                                    `${item.href}/`
                                );


                            return (

                                <Link
                                    key={
                                        item.href
                                    }
                                    href={
                                        item.href
                                    }
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-4
                                        py-3
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

                                    <Icon
                                        size={19}
                                    />

                                    {item.name}

                                </Link>

                            );

                        }
                    )}

                </nav>

            </div>


            {/* =================================================
                LOGOUT
            ================================================= */}

            <div
                className="
                    p-4
                    border-t
                    border-white/10
                "
            >

                <button
                    onClick={
                        logout
                    }
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-300
                        hover:bg-red-500/10
                        hover:text-red-400
                        transition
                    "
                >

                    <LogOut
                        size={19}
                    />

                    {t.signOut}

                </button>

            </div>

        </aside>

    );

}