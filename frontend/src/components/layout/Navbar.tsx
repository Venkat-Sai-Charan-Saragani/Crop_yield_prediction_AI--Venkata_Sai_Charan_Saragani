"use client";

import Link from "next/link";

import {
    usePathname,
} from "next/navigation";

import {
    Bell,
    ChevronRight,
    Leaf,
} from "lucide-react";

import LanguageSwitcher from "./LanguageSwitcher";

import {
    useLanguage,
} from "@/context/LanguageContext";


export default function Navbar() {

    const pathname =
        usePathname();

    const {
        t,
    } = useLanguage();


    const pageNames: Record<
        string,
        string
    > = {

        "/dashboard":
            t.dashboard,

        "/prediction":
            t.yieldPrediction,

        "/weather":
            t.weather,

        "/soil":
            t.soilAnalysis,

        "/analytics":
            t.analytics,

        "/profile":
            t.profile,

    };


    const currentPage =
        pageNames[pathname] ||
        t.cropYieldAI;


    return (

        <header
            className="
                sticky
                top-0
                z-30
                border-b
                border-slate-200/80
                bg-white/95
                backdrop-blur-xl
            "
        >

            <div
                className="
                    flex
                    min-h-20
                    items-center
                    justify-between
                    gap-4
                    px-4
                    py-3
                    sm:px-6
                    lg:px-8
                "
            >

                {/* LEFT */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >

                    {/* Mobile Logo */}

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-1
                            shadow-sm
                            lg:hidden
                        "
                    >

                        <img
                            src="/images/logo.jpg"
                            alt={t.cropYieldAI}
                            className="
                                h-full
                                w-full
                                rounded-lg
                                object-contain
                            "
                        />

                    </div>


                    <div
                        className="
                            min-w-0
                        "
                    >

                        <div
                            className="
                                hidden
                                items-center
                                gap-2
                                text-xs
                                text-slate-400
                                sm:flex
                            "
                        >

                            <span>
                                {t.cropYieldAI}
                            </span>

                            <ChevronRight
                                size={13}
                                className="shrink-0"
                            />

                        </div>


                        <h2
                            className="
                                truncate
                                text-lg
                                font-bold
                                tracking-tight
                                text-slate-900
                                sm:text-xl
                            "
                        >

                            {currentPage}

                        </h2>

                    </div>

                </div>


                {/* RIGHT */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        sm:gap-3
                    "
                >

                    {/* LANGUAGE */}

                    <LanguageSwitcher />


                    {/* SYSTEM STATUS */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-emerald-100
                            bg-emerald-50
                            px-3
                            py-2
                            sm:flex
                        "
                    >

                        <span
                            className="
                                relative
                                flex
                                h-2
                                w-2
                            "
                        >

                            <span
                                className="
                                    absolute
                                    inline-flex
                                    h-full
                                    w-full
                                    animate-ping
                                    rounded-full
                                    bg-emerald-400
                                    opacity-60
                                "
                            />

                            <span
                                className="
                                    relative
                                    inline-flex
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-emerald-500
                                "
                            />

                        </span>


                        <span
                            className="
                                text-xs
                                font-semibold
                                text-emerald-700
                            "
                        >

                            {t.aiOnline}

                        </span>

                    </div>


                    {/* NOTIFICATION */}

                    <button
                        type="button"
                        aria-label={
                            t.notifications
                        }
                        className="
                            relative
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:border-emerald-200
                            hover:bg-emerald-50
                            hover:text-emerald-700
                        "
                    >

                        <Bell
                            size={18}
                        />


                        <span
                            className="
                                absolute
                                right-2
                                top-2
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-500
                                ring-2
                                ring-white
                            "
                        />

                    </button>


                    {/* PROFILE */}

                    <Link
                        href="/profile"
                        aria-label={
                            t.myAccount
                        }
                        className="
                            group
                            flex
                            h-11
                            items-center
                            gap-2.5
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-2
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:border-emerald-200
                            hover:bg-emerald-50/50
                            hover:shadow-md
                            sm:h-auto
                            sm:px-3
                            sm:py-2
                        "
                    >

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-gradient-to-br
                                from-emerald-100
                                to-green-50
                                text-emerald-700
                                ring-1
                                ring-emerald-100
                                transition
                                group-hover:from-emerald-200
                                group-hover:to-green-100
                            "
                        >

                            <Leaf
                                size={17}
                            />

                        </div>


                        <div
                            className="
                                hidden
                                min-w-0
                                text-left
                                sm:block
                            "
                        >

                            <p
                                className="
                                    whitespace-nowrap
                                    text-xs
                                    font-bold
                                    leading-4
                                    text-slate-800
                                    transition
                                    group-hover:text-emerald-700
                                "
                            >

                                {t.myAccount}

                            </p>


                            <p
                                className="
                                    whitespace-nowrap
                                    text-[11px]
                                    font-medium
                                    leading-4
                                    text-slate-400
                                "
                            >

                                {t.profile}

                            </p>

                        </div>


                        <ChevronRight
                            size={15}
                            className="
                                hidden
                                text-slate-400
                                transition
                                group-hover:translate-x-0.5
                                group-hover:text-emerald-600
                                sm:block
                            "
                        />

                    </Link>

                </div>

            </div>

        </header>
    );
}