"use client";

import Link from "next/link";

import {
    ArrowRight,
    BrainCircuit,
    Plus,
    Tractor,
    Wheat,
} from "lucide-react";

export default function QuickActions() {

    return (

        <section
            className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200/80
                bg-white
                p-5
                shadow-[0_12px_40px_rgba(15,23,42,0.06)]
                sm:p-6
            "
        >

            {/* =================================================
                DECORATIVE BACKGROUND
            ================================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-48
                    w-48
                    rounded-full
                    bg-emerald-50
                    blur-3xl
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    left-1/3
                    h-40
                    w-40
                    rounded-full
                    bg-lime-50
                    blur-3xl
                "
            />

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    relative
                    z-10
                    mb-6
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                "
            >

                <div>

                    <div
                        className="
                            mb-2
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-emerald-100
                            bg-emerald-50
                            px-3
                            py-1.5
                        "
                    >

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-500
                            "
                        />

                        <span
                            className="
                                text-[11px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-emerald-700
                            "
                        >

                            Productivity Hub

                        </span>

                    </div>

                    <h2
                        className="
                            text-xl
                            font-bold
                            tracking-tight
                            text-slate-950
                            sm:text-2xl
                        "
                    >

                        Quick Actions

                    </h2>

                    <p
                        className="
                            mt-1.5
                            max-w-xl
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >

                        Manage your farm and prediction
                        workflow from one place.

                    </p>

                </div>

                <div
                    className="
                        hidden
                        items-center
                        gap-2
                        text-xs
                        font-medium
                        text-slate-400
                        sm:flex
                    "
                >

                    <span
                        className="
                            h-2
                            w-2
                            rounded-full
                            bg-emerald-500
                        "
                    />

                    AI tools ready

                </div>

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div
                className="
                    relative
                    z-10
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-3
                "
            >

                {/* =================================================
                    FARM
                ================================================= */}

                <Link
                    href="/farms"
                    className="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50/80
                        p-5
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-emerald-200
                        hover:bg-emerald-50/70
                        hover:shadow-[0_16px_35px_rgba(16,185,129,0.10)]
                    "
                >

                    <div
                        className="
                            absolute
                            -right-8
                            -top-8
                            h-24
                            w-24
                            rounded-full
                            bg-emerald-100/60
                            transition-transform
                            duration-500
                            group-hover:scale-150
                        "
                    />

                    <div
                        className="
                            relative
                            z-10
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                bg-emerald-100
                                text-emerald-700
                                transition-all
                                duration-300
                                group-hover:bg-emerald-600
                                group-hover:text-white
                                group-hover:shadow-lg
                                group-hover:shadow-emerald-600/20
                            "
                        >

                            <Tractor
                                size={22}
                            />

                        </div>

                        <ArrowRight
                            size={19}
                            className="
                                text-slate-300
                                transition-all
                                duration-300
                                group-hover:translate-x-1
                                group-hover:text-emerald-600
                            "
                        />

                    </div>


                    <div
                        className="
                            relative
                            z-10
                            mt-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <h3
                                className="
                                    font-bold
                                    text-slate-900
                                "
                            >

                                Manage Farms

                            </h3>

                            <span
                                className="
                                    rounded-full
                                    bg-emerald-100
                                    px-2
                                    py-0.5
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-emerald-700
                                "
                            >

                                Farm

                            </span>

                        </div>

                        <p
                            className="
                                mt-1.5
                                text-xs
                                leading-5
                                text-slate-500
                            "
                        >

                            Add and manage your farms,
                            land and agricultural data.

                        </p>

                    </div>

                </Link>


                {/* =================================================
                    CROP
                ================================================= */}

                <Link
                    href="/crops"
                    className="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50/80
                        p-5
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-lime-200
                        hover:bg-lime-50/70
                        hover:shadow-[0_16px_35px_rgba(132,204,22,0.10)]
                    "
                >

                    <div
                        className="
                            absolute
                            -right-8
                            -top-8
                            h-24
                            w-24
                            rounded-full
                            bg-lime-100/60
                            transition-transform
                            duration-500
                            group-hover:scale-150
                        "
                    />

                    <div
                        className="
                            relative
                            z-10
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                bg-lime-100
                                text-lime-700
                                transition-all
                                duration-300
                                group-hover:bg-lime-600
                                group-hover:text-white
                                group-hover:shadow-lg
                                group-hover:shadow-lime-600/20
                            "
                        >

                            <Wheat
                                size={22}
                            />

                        </div>

                        <ArrowRight
                            size={19}
                            className="
                                text-slate-300
                                transition-all
                                duration-300
                                group-hover:translate-x-1
                                group-hover:text-lime-600
                            "
                        />

                    </div>


                    <div
                        className="
                            relative
                            z-10
                            mt-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <h3
                                className="
                                    font-bold
                                    text-slate-900
                                "
                            >

                                Add Crop

                            </h3>

                            <span
                                className="
                                    rounded-full
                                    bg-lime-100
                                    px-2
                                    py-0.5
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-lime-700
                                "
                            >

                                Crops

                            </span>

                        </div>

                        <p
                            className="
                                mt-1.5
                                text-xs
                                leading-5
                                text-slate-500
                            "
                        >

                            Add crops and track their
                            agricultural information.

                        </p>

                    </div>

                </Link>


                {/* =================================================
                    PREDICTION
                ================================================= */}

                <Link
                    href="/prediction"
                    className="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-violet-200/80
                        bg-gradient-to-br
                        from-violet-50
                        via-white
                        to-indigo-50
                        p-5
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-[0_18px_40px_rgba(124,58,237,0.13)]
                    "
                >

                    <div
                        className="
                            absolute
                            -right-8
                            -top-8
                            h-24
                            w-24
                            rounded-full
                            bg-violet-100/70
                            transition-transform
                            duration-500
                            group-hover:scale-150
                        "
                    />

                    <div
                        className="
                            relative
                            z-10
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                bg-violet-100
                                text-violet-700
                                transition-all
                                duration-300
                                group-hover:bg-violet-600
                                group-hover:text-white
                                group-hover:shadow-lg
                                group-hover:shadow-violet-600/20
                            "
                        >

                            <BrainCircuit
                                size={22}
                            />

                        </div>

                        <ArrowRight
                            size={19}
                            className="
                                text-slate-300
                                transition-all
                                duration-300
                                group-hover:translate-x-1
                                group-hover:text-violet-600
                            "
                        />

                    </div>


                    <div
                        className="
                            relative
                            z-10
                            mt-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <h3
                                className="
                                    font-bold
                                    text-slate-900
                                "
                            >

                                Predict Yield

                            </h3>

                            <span
                                className="
                                    rounded-full
                                    bg-violet-100
                                    px-2
                                    py-0.5
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-violet-700
                                "
                            >

                                AI

                            </span>

                        </div>

                        <p
                            className="
                                mt-1.5
                                text-xs
                                leading-5
                                text-slate-500
                            "
                        >

                            Use the AI model to estimate
                            expected crop yield.

                        </p>

                    </div>

                </Link>

            </div>

        </section>

    );

}