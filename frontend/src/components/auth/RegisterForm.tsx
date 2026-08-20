"use client";

import {
    useState,
} from "react";

import {
    useGoogleLogin,
} from "@react-oauth/google";

import {
    useRouter,
} from "next/navigation";

import {
    ShieldCheck,
} from "lucide-react";

import Link from "next/link";

import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Leaf,
    Loader2,
    Mail,
    UserRound,
} from "lucide-react";

import api from "@/services/api";


export default function RegisterForm() {

    const router =
        useRouter();


    // ========================================================
    // FORM STATES
    // ========================================================

    const [
        fullName,
        setFullName,
    ] = useState("");

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
    // PASSWORD STRENGTH
    // ========================================================

    const passwordStrength =
        password.length === 0
            ? 0
            : password.length < 6
                ? 1
                : password.length < 8
                    ? 2
                    : password.length < 10
                        ? 3
                        : 4;


    const passwordStrengthLabel =
        passwordStrength === 0
            ? ""
            : passwordStrength === 1
                ? "Too short"
                : passwordStrength === 2
                    ? "Fair"
                    : passwordStrength === 3
                        ? "Good"
                        : "Strong";


    // ========================================================
    // NORMAL REGISTER
    // ========================================================

    const handleRegister =
        async (
            e: React.FormEvent<HTMLFormElement>
        ) => {

            e.preventDefault();


            if (
                loading ||
                googleLoading
            ) {

                return;

            }


            setError("");
            setSuccess("");


            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

            if (!fullName.trim()) {

                setError(
                    "Please enter your full name."
                );

                return;

            }


            if (fullName.trim().length < 2) {

                setError(
                    "Please enter a valid full name."
                );

                return;

            }


            if (!email.trim()) {

                setError(
                    "Please enter your email address."
                );

                return;

            }


            if (!password) {

                setError(
                    "Please create a password."
                );

                return;

            }


            if (password.length < 6) {

                setError(
                    "Password must contain at least 6 characters."
                );

                return;

            }


            setLoading(true);


            try {

                const response =
                    await api.post(
                        "/users/register",
                        {
                            full_name:
                                fullName.trim(),

                            email:
                                email.trim(),

                            password:
                                password,
                        }
                    );


                console.log(
                    "REGISTER RESPONSE:",
                    response.data
                );


                if (
                    response.data.success === false
                ) {

                    throw new Error(
                        response.data.message ||
                        "Registration failed."
                    );

                }


                setSuccess(
                    "Account created successfully. Redirecting you to login..."
                );


                setTimeout(() => {

                    router.push(
                        "/login?registered=true"
                    );

                }, 900);

            }
            catch (
                error: any
            ) {

                console.error(
                    "REGISTER ERROR:",
                    error?.response?.data ||
                    error
                );


                const backendError =
                    error?.response?.data;


                setError(

                    backendError?.detail ||

                    backendError?.message ||

                    error?.message ||

                    "Registration failed. Please try again."

                );

            }
            finally {

                setLoading(false);

            }

        };


    // ========================================================
    // GOOGLE REGISTER
    // ========================================================

    const googleRegister =
        useGoogleLogin({

            flow:
                "auth-code",

            ux_mode:
                "popup",

            select_account:
                true,

            onSuccess:
                async (
                    response
                ) => {

                    if (
                        !response.code
                    ) {

                        setError(
                            "Google authorization code was not received."
                        );

                        return;

                    }


                    setError("");
                    setSuccess("");
                    setGoogleLoading(true);


                    try {

                        const backendResponse =
                            await api.post(
                                "/users/google-register",
                                {
                                    code:
                                        response.code,
                                }
                            );


                        console.log(
                            "GOOGLE REGISTER RESPONSE:",
                            backendResponse.data
                        );


                        const data =
                            backendResponse.data;


                        if (
                            data.success === false
                        ) {

                            throw new Error(
                                data.message ||
                                "Google registration failed."
                            );

                        }


                        setSuccess(
                            "Google account created successfully. Redirecting you to login..."
                        );


                        setTimeout(() => {

                            router.push(
                                "/login?registered=true"
                            );

                        }, 900);

                    }
                    catch (
                        error: any
                    ) {

                        console.error(
                            "GOOGLE REGISTER ERROR:",
                            error?.response?.data ||
                            error
                        );


                        const backendError =
                            error?.response?.data;


                        setError(

                            backendError?.detail ||

                            backendError?.message ||

                            error?.message ||

                            "Google registration failed. Please try again."

                        );

                    }
                    finally {

                        setGoogleLoading(false);

                    }

                },


            onError:
                () => {

                    console.error(
                        "Google registration failed."
                    );


                    setGoogleLoading(
                        false
                    );


                    setError(
                        "Google registration was cancelled or failed."
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

        <div
            className="
                w-full
            "
        >

            {/* =================================================
                SUCCESS
            ================================================= */}

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
                            Account created
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


            {/* =================================================
                ERROR
            ================================================= */}

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
                            Registration failed
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


            {/* =================================================
                GOOGLE
            ================================================= */}

            <button
                type="button"
                onClick={() => {

                    setError("");
                    setSuccess("");

                    googleRegister();

                }}
                disabled={isLoading}
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
                            d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.39Z"
                        />

                        <path
                            fill="#34A853"
                            d="M12 21.7c2.63 0 4.84-.87 6.45-2.34l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.75 9.75 0 0 0 12 21.7Z"
                        />

                        <path
                            fill="#FBBC05"
                            d="M6.54 13.82A5.86 5.86 0 0 1 6.23 12c0-.63.11-1.24.31-1.82v-2.5H3.3A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.32l3.24-2.5Z"
                        />

                        <path
                            fill="#EA4335"
                            d="M12 6.15c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.25 14.63 2.3 12 2.3a9.75 9.75 0 0 0-8.7 5.38l3.24 2.5C7.31 7.87 9.46 6.15 12 6.15Z"
                        />

                    </svg>

                )}

                <span>
                    {googleLoading
                        ? "Creating account..."
                        : "Continue with Google"}
                </span>

            </button>


            {/* =================================================
                DIVIDER
            ================================================= */}

            <div
                className="
                    my-6
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
                    Or use email
                </span>

                <div
                    className="
                        h-px
                        flex-1
                        bg-gray-200
                    "
                />

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={
                    handleRegister
                }
                className="
                    space-y-4
                "
            >

                {/* FULL NAME */}

                <div>

                    <label
                        htmlFor="fullName"
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
                        Full name
                    </label>


                    <div
                        className="
                            relative
                        "
                    >

                        <UserRound
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
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(
                                    e.target.value
                                )
                            }
                            autoComplete="name"
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
                        className="
                            relative
                        "
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
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
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

                    <label
                        htmlFor="password"
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
                        Password
                    </label>


                    <div
                        className="
                            relative
                        "
                    >

                        <KeyRound
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
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            autoComplete="new-password"
                            disabled={isLoading}
                            minLength={6}
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


                    {/* PASSWORD STRENGTH */}

                    {password.length > 0 && (

                        <div
                            className="
                                mt-3
                            "
                        >

                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <span
                                    className="
                                        text-[11px]
                                        font-medium
                                        text-gray-400
                                    "
                                >
                                    Password strength
                                </span>

                                <span
                                    className={`
                                        text-[11px]
                                        font-bold
                                        ${
                                            passwordStrength <= 1
                                                ? "text-red-500"
                                                : passwordStrength === 2
                                                    ? "text-amber-500"
                                                    : passwordStrength === 3
                                                        ? "text-blue-600"
                                                        : "text-green-600"
                                        }
                                    `}
                                >
                                    {passwordStrengthLabel}
                                </span>

                            </div>


                            <div
                                className="
                                    flex
                                    gap-1.5
                                "
                            >

                                {[1, 2, 3, 4].map(
                                    (level) => (

                                        <div
                                            key={level}
                                            className={`
                                                h-1.5
                                                flex-1
                                                rounded-full
                                                transition-all
                                                duration-300
                                                ${
                                                    level <=
                                                    passwordStrength
                                                        ? passwordStrength <= 1
                                                            ? "bg-red-400"
                                                            : passwordStrength === 2
                                                                ? "bg-amber-400"
                                                                : passwordStrength === 3
                                                                    ? "bg-blue-500"
                                                                    : "bg-green-500"
                                                        : "bg-gray-200"
                                                }
                                            `}
                                        />

                                    )
                                )}

                            </div>

                            <p
                                className="
                                    mt-2
                                    text-[11px]
                                    text-gray-400
                                "
                            >
                                Use at least 6 characters.
                            </p>

                        </div>

                    )}

                </div>


                {/* REGISTER BUTTON */}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="
                        group
                        mt-3
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

                            Creating your account...
                        </>

                    ) : (

                        <>
                            Create your account

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


            {/* LOGIN */}

            <div
                className="
                    mt-7
                    text-center
                "
            >

                <p
                    className="
                        text-sm
                        text-gray-500
                    "
                >

                    Already have an account?{" "}

                    <Link
                        href="/login"
                        className="
                            font-extrabold
                            text-green-700
                            transition
                            hover:text-green-800
                        "
                    >
                        Sign in
                    </Link>

                </p>

            </div>


            {/* SECURITY NOTE */}

            <div
                className="
                    mt-6
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-[10px]
                    font-medium
                    text-gray-400
                "
            >

                <ShieldCheck
                    size={13}
                    className="text-green-600"
                />

                Your account is protected with secure authentication.

            </div>

        </div>
    );
}