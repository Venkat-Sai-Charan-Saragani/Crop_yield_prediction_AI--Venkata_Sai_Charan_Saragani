"use client";

import Link from "next/link";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import {
    LayoutDashboard,
    Users,
    UserRoundCheck,
    Sprout,
    Wheat,
    BarChart3,
    LogOut,
    ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
    getAdminStats,
} from "@/services/admin";

import {
    removeToken,
} from "@/utils/auth";


export default function AdminSidebar() {

    const pathname =
        usePathname();

    const router =
        useRouter();


    const [
        pendingCount,
        setPendingCount,
    ] = useState(0);


    // ========================================================
    // LOAD PENDING AGRICULTURALIST COUNT
    // ========================================================

    useEffect(() => {

        const loadPendingCount =
            async () => {

                try {

                    const response =
                        await getAdminStats();

                    setPendingCount(
                        response.stats
                            .pending_agriculturalists ?? 0
                    );

                } catch (error) {

                    console.error(
                        "ADMIN SIDEBAR STATS ERROR:",
                        error
                    );

                }

            };


        loadPendingCount();

    }, []);


    // ========================================================
    // LOGOUT
    // ========================================================

    const logout = () => {

        const confirmed =
            window.confirm(
                "Do you want to log out?"
            );

        if (!confirmed) {
            return;
        }

        removeToken();

        router.replace("/login");

    };


    // ========================================================
    // ACTIVE HELPER
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
                hidden
                lg:flex
                w-72
                min-h-screen
                shrink-0
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
                    border-b
                    border-white/10
                    px-6
                    py-7
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
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-500
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
                                text-lg
                                font-bold
                            "
                        >
                            Crop Yield AI
                        </h1>

                        <p
                            className="
                                text-xs
                                text-slate-400
                            "
                        >
                            Administration Panel
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
                    overflow-y-auto
                    px-4
                    py-6
                "
            >

                <p
                    className="
                        mb-3
                        px-3
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                    "
                >
                    Admin Menu
                </p>


                <nav
                    className="space-y-1"
                >

                    {/* DASHBOARD */}

                    <AdminNavItem
                        href="/admin"
                        name="Dashboard"
                        icon={LayoutDashboard}
                        active={isActive("/admin")}
                    />


                    {/* USERS */}

                    <AdminNavItem
                        href="/admin/users"
                        name="Users"
                        icon={Users}
                        active={isActive("/admin/users")}
                    />


                    {/* AGRICULTURALISTS */}

                    <Link
                        href="/admin/agriculturalists"
                        className={`
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-medium
                            transition

                            ${
                                isActive(
                                    "/admin/agriculturalists"
                                )
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }
                        `}
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <UserRoundCheck
                                size={19}
                            />

                            Agriculturalists

                        </div>


                        {pendingCount > 0 && (

                            <span
                                className="
                                    flex
                                    min-w-6
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-amber-500
                                    px-2
                                    py-0.5
                                    text-[11px]
                                    font-bold
                                    text-white
                                "
                            >

                                {pendingCount}

                            </span>

                        )}

                    </Link>


                    {/* FARMS */}

                    <AdminNavItem
                        href="/admin/farms"
                        name="Farms"
                        icon={Sprout}
                        active={isActive("/admin/farms")}
                    />


                    {/* CROPS */}

                    <AdminNavItem
                        href="/admin/crops"
                        name="Crops"
                        icon={Wheat}
                        active={isActive("/admin/crops")}
                    />


                    {/* PREDICTIONS */}

                    <AdminNavItem
                        href="/admin/predictions"
                        name="Predictions"
                        icon={BarChart3}
                        active={isActive("/admin/predictions")}
                    />

                </nav>

            </div>


            {/* =================================================
                ADMIN STATUS
            ================================================= */}

            <div
                className="
                    mx-4
                    mb-4
                    rounded-2xl
                    border
                    border-emerald-500/10
                    bg-emerald-500/5
                    p-4
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
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-emerald-500
                            shadow-[0_0_12px_rgba(16,185,129,0.8)]
                        "
                    />

                    <div>

                        <p
                            className="
                                text-xs
                                font-semibold
                                text-slate-300
                            "
                        >
                            Admin Mode
                        </p>

                        <p
                            className="
                                text-[11px]
                                text-slate-500
                            "
                        >
                            System administrator
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                LOGOUT
            ================================================= */}

            <div
                className="
                    border-t
                    border-white/10
                    p-4
                "
            >

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
                        font-medium
                        text-slate-300
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

    );
}


// ============================================================
// NAV ITEM
// ============================================================

function AdminNavItem({
    href,
    name,
    icon: Icon,
    active,
}: {
    href: string;
    name: string;
    icon: React.ElementType;
    active: boolean;
}) {

    return (

        <Link
            href={href}
            className={`
                flex
                items-center
                justify-between
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

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <Icon
                    size={19}
                />

                {name}

            </div>


            {active && (

                <ChevronRight
                    size={15}
                    className="opacity-70"
                />

            )}

        </Link>

    );
}