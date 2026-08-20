"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import Link from "next/link";

import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Leaf,
    Loader2,
    Lock,
    Mail,
    ShieldCheck,
    Sparkles,
    Sprout,
} from "lucide-react";

import {
    useGoogleLogin,
} from "@react-oauth/google";

import {
    googleLoginUser,
    loginUser,
} from "@/services/authServices";

import {
    getToken,
} from "@/utils/auth";


export default function LoginPage() {

    const router =
        useRouter();

    const searchParams =
        useSearchParams();


    // ========================================================
    // FORM STATES
    // ========================================================

    const [
        email,
        setEmail,
    ] = useState("");

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);


    // ========================================================
    // UI STATES
    // ========================================================

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        googleLoading,
        setGoogleLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");


    // ========================================================
    // CHECK EXISTING LOGIN
    // ========================================================

    useEffect(() => {

        const token =
            getToken();

        if (token) {

            router.replace(
                "/dashboard"
            );

        }

    }, [router]);


    // ========================================================
    // REGISTER SUCCESS
    // ========================================================

    useEffect(() => {

        const registered =
            searchParams.get(
                "registered"
            );

        if (
            registered === "true"
        ) {

            setSuccess(
                "Account created successfully. Please sign in to continue."
            );

        }

    }, [searchParams]);


    // ========================================================
    // NORMAL LOGIN
    // ========================================================

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;

        }


        if (!password) {

            setError(
                "Please enter your password."
            );

            return;

        }


        setLoading(true);


        try {

            const response =
                await loginUser({

                    email:
                        email.trim(),

                    password,

                });


            if (
                !response.success ||
                !response.token
            ) {

                setError(
                    response.message ||
                    "Invalid email or password."
                );

                return;

            }


            router.replace(
                "/dashboard"
            );

        }
        catch (loginError) {

            console.error(
                "LOGIN ERROR:",
                loginError
            );

            setError(
                "Unable to login right now. Please check your connection and try again."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ========================================================
    // GOOGLE LOGIN
    // ========================================================

    const googleLogin =
        useGoogleLogin({

            flow:
                "auth-code",

            ux_mode:
                "popup",

            select_account:
                true,

            onSuccess:
                async (response) => {

                    setError("");
                    setSuccess("");
                    setGoogleLoading(true);


                    try {

                        if (
                            !response.code
                        ) {

                            setError(
                                "Google authorization failed. Please try again."
                            );

                            return;

                        }


                        const result =
                            await googleLoginUser(
                                response.code
                            );


                        if (
                            !result.success ||
                            !result.token
                        ) {

                            setError(
                                result.message ||
                                "Unable to login with Google."
                            );

                            return;

                        }


                        router.replace(
                            "/dashboard"
                        );

                    }
                    catch (googleError) {

                        console.error(
                            "GOOGLE LOGIN ERROR:",
                            googleError
                        );

                        setError(
                            "Unable to login with Google. Please try again."
                        );

                    }
                    finally {

                        setGoogleLoading(false);

                    }

                },

            onError:
                () => {

                    setGoogleLoading(
                        false
                    );

                    setError(
                        "Google login was cancelled or failed. Please try again."
                    );

                },

        });


    const isLoading =
        loading ||
        googleLoading;


    // ========================================================
    // UI
    // ========================================================

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
                    VIDEO SIDE
                ================================================= */}

                <section
                    className="
                        relative
                        w-full
                        lg:w-[48%]
                        min-h-[430px]
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


                    {/* DARK OVERLAY */}

                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-br
                            from-[#032b19]/95
                            via-[#07502d]/70
                            to-[#011a10]/90
                        "
                    />


                    {/* IMAGE COLOR DEPTH */}

                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/60
                            via-transparent
                            to-black/20
                        "
                    />


                    {/* DECORATIVE GLOW */}

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
                            min-h-[430px]
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
                                        backdrop-blur
                                    "
                                >

                                    <Sprout
                                        size={31}
                                        strokeWidth={2}
                                        className="
                                            text-green-700
                                        "
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


                            {/* AI BADGE */}

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

                                AI-POWERED FARM INTELLIGENCE

                            </div>

                        </div>


                        {/* CENTER MESSAGE */}

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
                                Welcome back
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

                                Grow smarter.

                                <br />

                                Predict better.

                                <br />

                                <span
                                    className="
                                        text-emerald-300
                                    "
                                >
                                    Farm better.
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
                                Turn agricultural data into
                                meaningful insights and make
                                better crop decisions with
                                intelligent AI-powered prediction.
                            </p>


                            {/* FEATURE PILLS */}

                            <div
                                className="
                                    mt-8
                                    flex
                                    flex-wrap
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-white/10
                                        bg-black/20
                                        px-4
                                        py-2.5
                                        text-xs
                                        font-medium
                                        text-white/90
                                        backdrop-blur-md
                                    "
                                >

                                    <Leaf
                                        size={14}
                                        className="text-emerald-300"
                                    />

                                    Yield Prediction

                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-white/10
                                        bg-black/20
                                        px-4
                                        py-2.5
                                        text-xs
                                        font-medium
                                        text-white/90
                                        backdrop-blur-md
                                    "
                                >

                                    <ShieldCheck
                                        size={14}
                                        className="text-emerald-300"
                                    />

                                    Data Driven

                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-white/10
                                        bg-black/20
                                        px-4
                                        py-2.5
                                        text-xs
                                        font-medium
                                        text-white/90
                                        backdrop-blur-md
                                    "
                                >

                                    <Sprout
                                        size={14}
                                        className="text-emerald-300"
                                    />

                                    Smart Farming

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
                    LOGIN PANEL
                ================================================= */}

                <section
                    className="
                        flex
                        w-full
                        lg:w-[52%]
                        items-center
                        justify-center
                        bg-[#fbfdfb]
                        px-6
                        py-12
                        sm:px-10
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
                                mb-8
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
                            className="mb-8"
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
                                Welcome back.
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
                                Sign in to access your farm,
                                predictions, analytics and
                                agricultural insights.
                            </p>

                        </div>


                        {/* SUCCESS */}

                        {success && (

                            <div
                                className="
                                    mb-5
                                    flex
                                    items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-green-200
                                    bg-green-50
                                    p-4
                                    text-green-800
                                "
                            >

                                <CheckCircle2
                                    size={20}
                                    className="
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-bold
                                        "
                                    >
                                        Success
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            leading-5
                                            text-green-700
                                        "
                                    >
                                        {success}
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* ERROR */}

                        {error && (

                            <div
                                className="
                                    mb-5
                                    flex
                                    items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    p-4
                                    text-red-800
                                "
                            >

                                <AlertCircle
                                    size={20}
                                    className="
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-bold
                                        "
                                    >
                                        Login failed
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            leading-5
                                            text-red-700
                                        "
                                    >
                                        {error}
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* GOOGLE */}

                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => {

                                setError("");
                                setSuccess("");

                                googleLogin();

                            }}
                            className="
                                group
                                flex
                                h-14
                                w-full
                                items-center
                                justify-center
                                gap-3
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                text-sm
                                font-bold
                                text-gray-800
                                shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                                transition
                                duration-200
                                hover:-translate-y-0.5
                                hover:border-gray-300
                                hover:shadow-lg
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {googleLoading ? (

                                <Loader2
                                    size={20}
                                    className="
                                        animate-spin
                                        text-green-700
                                    "
                                />

                            ) : (

                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >

                                    <path
                                        fill="#4285F4"
                                        d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.22a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.93-4.18 2.93-7.42Z"
                                    />

                                    <path
                                        fill="#34A853"
                                        d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6Z"
                                    />

                                    <path
                                        fill="#FBBC05"
                                        d="M6.54 13.69A5.86 5.86 0 0 1 6.23 12c0-.59.11-1.16.31-1.69V7.78H3.3A9.73 9.73 0 0 0 2.27 12c0 1.57.38 3.05 1.03 4.22l3.24-2.53Z"
                                    />

                                    <path
                                        fill="#EA4335"
                                        d="M12 6.28c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.38 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8 9.46 6.28 12 6.28Z"
                                    />

                                </svg>

                            )}

                            <span>
                                {googleLoading
                                    ? "Connecting to Google..."
                                    : "Continue with Google"}
                            </span>

                        </button>


                        {/* DIVIDER */}

                        <div
                            className="
                                my-7
                                flex
                                items-center
                                gap-4
                            "
                        >

                            <div
                                className="
                                    h-px
                                    flex-1
                                    bg-gray-200
                                "
                            />

                            <span
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-gray-400
                                "
                            >
                                Or email
                            </span>

                            <div
                                className="
                                    h-px
                                    flex-1
                                    bg-gray-200
                                "
                            />

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* EMAIL */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="
                                        mb-2
                                        block
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-gray-600
                                    "
                                >
                                    Email address
                                </label>

                                <div
                                    className="relative"
                                >

                                    <Mail
                                        size={19}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        disabled={isLoading}
                                        className="
                                            h-14
                                            w-full
                                            rounded-2xl
                                            border
                                            border-gray-200
                                            bg-white
                                            pl-12
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-gray-900
                                            shadow-sm
                                            outline-none
                                            transition
                                            placeholder:text-gray-400
                                            focus:border-green-600
                                            focus:ring-4
                                            focus:ring-green-100
                                            disabled:bg-gray-100
                                        "
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >

                                    <label
                                        htmlFor="password"
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-gray-600
                                        "
                                    >
                                        Password
                                    </label>

                                </div>


                                <div
                                    className="relative"
                                >

                                    <Lock
                                        size={19}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        className="
                                            h-14
                                            w-full
                                            rounded-2xl
                                            border
                                            border-gray-200
                                            bg-white
                                            pl-12
                                            pr-12
                                            text-sm
                                            font-medium
                                            text-gray-900
                                            shadow-sm
                                            outline-none
                                            transition
                                            placeholder:text-gray-400
                                            focus:border-green-600
                                            focus:ring-4
                                            focus:ring-green-100
                                            disabled:bg-gray-100
                                        "
                                    />


                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                            transition
                                            hover:text-green-700
                                        "
                                    >

                                        {showPassword ? (

                                            <EyeOff
                                                size={19}
                                            />

                                        ) : (

                                            <Eye
                                                size={19}
                                            />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* LOGIN */}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="
                                    group
                                    mt-2
                                    flex
                                    h-14
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    bg-green-700
                                    text-sm
                                    font-extrabold
                                    text-white
                                    shadow-[0_12px_30px_rgba(21,128,61,0.22)]
                                    transition
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:bg-green-800
                                    hover:shadow-[0_16px_35px_rgba(21,128,61,0.28)]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    disabled:hover:translate-y-0
                                "
                            >

                                {loading ? (

                                    <>
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />

                                        Signing you in...
                                    </>

                                ) : (

                                    <>
                                        Sign in to dashboard

                                        <ArrowRight
                                            size={18}
                                            className="
                                                transition
                                                group-hover:translate-x-1
                                            "
                                        />
                                    </>

                                )}

                            </button>

                        </form>


                        {/* REGISTER */}

                        <div
                            className="
                                mt-8
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >

                                New to Crop_Yield_Prediction-AI?{" "}

                                <Link
                                    href="/register"
                                    className="
                                        font-extrabold
                                        text-green-700
                                        transition
                                        hover:text-green-800
                                    "
                                >
                                    Create an account
                                </Link>

                            </p>

                        </div>


                        {/* ADMIN */}

                        <div
                            className="
                                mt-6
                                text-center
                            "
                        >

                            <Link
                                href="/agriculturalist/login"
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-[11px]
                                    font-medium
                                    text-gray-400
                                    transition
                                    hover:text-gray-600
                                "
                            >

                                <ShieldCheck
                                    size={20}
                                />

                                Agriculturalist Login

                            </Link>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}