"use client";

import {
    Leaf,
    ShieldCheck,
    Sparkles,
    Sprout,
} from "lucide-react";

import RegisterForm from "@/components/auth/RegisterForm";


export default function RegisterPage() {

    return (

        <main
            className="
                min-h-screen
                bg-[#06140d]
                p-0
                sm:p-4
                lg:p-6
                flex
                items-center
                justify-center
            "
        >

            <div
                className="
                    relative
                    w-full
                    min-h-screen
                    sm:min-h-0
                    lg:min-h-[calc(100vh-48px)]
                    max-w-[1500px]
                    overflow-hidden
                    sm:rounded-[28px]
                    bg-white
                    shadow-[0_30px_100px_rgba(0,0,0,0.35)]
                    flex
                    flex-col
                    lg:flex-row
                "
            >

                {/* =================================================
                    VIDEO / BRAND SIDE
                ================================================= */}

                <section
                    className="
                        relative
                        w-full
                        lg:w-[46%]
                        min-h-[440px]
                        lg:min-h-full
                        overflow-hidden
                        bg-[#0b3d25]
                        text-white
                    "
                >

                    {/* VIDEO */}

                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                        "
                    >

                        <source
                            src="/videos/login-register.mp4"
                            type="video/mp4"
                        />

                    </video>


                    {/* DARK GREEN OVERLAY */}

                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-br
                            from-[#032b19]/95
                            via-[#07502d]/70
                            to-[#011a10]/95
                        "
                    />


                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/70
                            via-transparent
                            to-black/20
                        "
                    />


                    {/* GLOW */}

                    <div
                        className="
                            absolute
                            -top-32
                            -right-32
                            h-96
                            w-96
                            rounded-full
                            bg-emerald-400/20
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-40
                            -left-32
                            h-96
                            w-96
                            rounded-full
                            bg-green-400/10
                            blur-3xl
                        "
                    />


                    {/* CONTENT */}

                    <div
                        className="
                            relative
                            z-10
                            flex
                            h-full
                            min-h-[440px]
                            lg:min-h-[calc(100vh-48px)]
                            flex-col
                            justify-between
                            p-7
                            sm:p-10
                            lg:p-12
                            xl:p-16
                        "
                    >

                        {/* BRAND */}

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
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
                                        bg-white/95
                                        shadow-2xl
                                    "
                                >

                                    <Sprout
                                        size={31}
                                        className="text-green-700"
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-lg
                                            font-extrabold
                                            tracking-tight
                                            sm:text-xl
                                        "
                                    >
                                        Crop_Yield_Prediction-AI
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            font-medium
                                            uppercase
                                            tracking-[0.2em]
                                            text-emerald-100/80
                                        "
                                    >
                                        Intelligent Agriculture
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    mt-8
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-white/15
                                    bg-white/10
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    backdrop-blur-md
                                "
                            >

                                <Sparkles
                                    size={14}
                                    className="text-emerald-300"
                                />

                                START YOUR FARM JOURNEY

                            </div>

                        </div>


                        {/* MAIN CONTENT */}

                        <div
                            className="
                                max-w-xl
                                py-12
                                lg:py-0
                            "
                        >

                            <p
                                className="
                                    mb-4
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    text-emerald-200
                                "
                            >
                                Build smarter
                            </p>


                            <h1
                                className="
                                    text-4xl
                                    font-black
                                    leading-[1.02]
                                    tracking-tight
                                    sm:text-5xl
                                    lg:text-6xl
                                    xl:text-7xl
                                "
                            >

                                Your farm.

                                <br />

                                Your data.

                                <br />

                                <span
                                    className="
                                        text-emerald-300
                                    "
                                >
                                    Smarter decisions.
                                </span>

                            </h1>


                            <p
                                className="
                                    mt-6
                                    max-w-lg
                                    text-sm
                                    leading-7
                                    text-white/75
                                    sm:text-base
                                    lg:text-lg
                                "
                            >
                                Create your account and bring
                                intelligent crop prediction,
                                farm analytics and data-driven
                                insights into one place.
                            </p>


                            {/* STEPS */}

                            <div
                                className="
                                    mt-8
                                    grid
                                    gap-3
                                    sm:grid-cols-3
                                    lg:grid-cols-1
                                    xl:grid-cols-3
                                "
                            >

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-black/20
                                        p-4
                                        backdrop-blur-md
                                    "
                                >

                                    <div
                                        className="
                                            mb-3
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-emerald-400/15
                                            text-emerald-300
                                        "
                                    >

                                        <Sprout
                                            size={17}
                                        />

                                    </div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                        "
                                    >
                                        Build your farm
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[11px]
                                            leading-5
                                            text-white/50
                                        "
                                    >
                                        Organize your
                                        agricultural data.
                                    </p>

                                </div>


                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-black/20
                                        p-4
                                        backdrop-blur-md
                                    "
                                >

                                    <div
                                        className="
                                            mb-3
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-emerald-400/15
                                            text-emerald-300
                                        "
                                    >

                                        <Leaf
                                            size={17}
                                        />

                                    </div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                        "
                                    >
                                        Analyze crops
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[11px]
                                            leading-5
                                            text-white/50
                                        "
                                    >
                                        Understand your
                                        farm performance.
                                    </p>

                                </div>


                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-black/20
                                        p-4
                                        backdrop-blur-md
                                    "
                                >

                                    <div
                                        className="
                                            mb-3
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-emerald-400/15
                                            text-emerald-300
                                        "
                                    >

                                        <ShieldCheck
                                            size={17}
                                        />

                                    </div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                        "
                                    >
                                        Predict yield
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[11px]
                                            leading-5
                                            text-white/50
                                        "
                                    >
                                        Make informed
                                        decisions with AI.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                border-t
                                border-white/10
                                pt-5
                                text-xs
                                text-white/50
                            "
                        >

                            <span>
                                © 2026 Crop_Yield_Prediction-AI
                            </span>

                            <span className="hidden sm:block">
                                Intelligent Agriculture
                            </span>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    REGISTER PANEL
                ================================================= */}

                <section
                    className="
                        flex
                        w-full
                        lg:w-[54%]
                        items-center
                        justify-center
                        bg-[#fbfdfb]
                        px-6
                        py-10
                        sm:px-10
                        sm:py-12
                        lg:px-14
                        xl:px-20
                        2xl:px-24
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-[500px]
                        "
                    >

                        {/* MOBILE BRAND */}

                        <div
                            className="
                                mb-7
                                flex
                                items-center
                                gap-3
                                lg:hidden
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
                                    bg-green-700
                                    text-white
                                "
                            >

                                <Sprout
                                    size={24}
                                />

                            </div>

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-extrabold
                                        text-gray-950
                                    "
                                >
                                    Crop_Yield_Prediction-AI
                                </p>

                                <p
                                    className="
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-wider
                                        text-green-700
                                    "
                                >
                                    Intelligent Agriculture
                                </p>

                            </div>

                        </div>


                        {/* HEADER */}

                        <div
                            className="mb-7"
                        >

                            <div
                                className="
                                    mb-4
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-green-50
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-bold
                                    text-green-700
                                "
                            >

                                <Sparkles
                                    size={13}
                                />

                                FARMER PORTAL

                            </div>


                            <h2
                                className="
                                    text-4xl
                                    font-black
                                    tracking-tight
                                    text-gray-950
                                    sm:text-5xl
                                "
                            >
                                Create your account.
                            </h2>


                            <p
                                className="
                                    mt-3
                                    max-w-md
                                    text-sm
                                    leading-6
                                    text-gray-500
                                    sm:text-base
                                "
                            >
                                Join Crop_Yield_Prediction-AI
                                and start turning agricultural
                                data into smarter decisions.
                            </p>

                        </div>


                        <RegisterForm />

                    </div>

                </section>

            </div>

        </main>
    );
}