"use client";

import {
    FormEvent,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    Sprout,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    AlertCircle,
    ArrowRight,
    ShieldCheck,
    BrainCircuit,
    Users,
    Leaf,
} from "lucide-react";

import {
    agriculturalistLogin,
} from "@/services/agriculturalist";

import {
    saveAgriculturalistToken,
    saveAgriculturalistEmail,
    saveAgriculturalistRole,
    removeAgriculturalistToken,
} from "@/utils/auth";


export default function AgriculturalistLoginPage() {

    const router = useRouter();

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

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");


    // ========================================================
    // LOGIN
    // ========================================================

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError("");

        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        const trimmedEmail = email.trim();

        if (
            !trimmedEmail ||
            !password
        ) {

            setError(
                "Please enter your email and password."
            );

            return;
        }

        setLoading(true);

        try {

            // ------------------------------------------------
            // CALL AGRICULTURALIST LOGIN API
            // ------------------------------------------------

            const response =
                await agriculturalistLogin({
                    email: trimmedEmail,
                    password: password,
                });


            console.log(
                "AGRICULTURALIST LOGIN RESPONSE:",
                response
            );


            // ------------------------------------------------
            // CHECK RESPONSE
            // ------------------------------------------------

            if (!response) {

                setError(
                    "No response was received from the server."
                );

                return;
            }


            // ------------------------------------------------
            // CHECK SUCCESS
            // ------------------------------------------------

            if (!response.success) {

                setError(
                    response.message ||
                    "Invalid email or password."
                );

                return;
            }


            // =================================================
            // GET TOKEN
            // =================================================

            const token =
                response.token ||
                response.access_token;


            if (!token) {

                setError(
                    "Login succeeded but no authentication token was returned."
                );

                return;
            }


            // =================================================
            // CHECK ROLE
            //
            // IMPORTANT:
            //
            // DO NOT DEFAULT TO "agriculturalist".
            //
            // If the backend does not send a role, login
            // must not automatically become agriculturalist.
            // =================================================

            const role = (
                response.role ||
                response.agriculturalist?.role ||
                ""
            )
                .toString()
                .trim()
                .toLowerCase();


            console.log(
                "AGRICULTURALIST LOGIN ROLE:",
                role
            );


            // =================================================
            // AGRICULTURALIST ROLE REQUIRED
            // =================================================

            if (
                role !== "agriculturalist"
            ) {

                // Remove any previous agriculturalist session
                removeAgriculturalistToken();

                setError(
                    "This account is not registered as an agriculturalist."
                );

                return;
            }


            // =================================================
            // REMOVE OLD AGRICULTURALIST SESSION
            // =================================================

            removeAgriculturalistToken();


            // =================================================
            // SAVE AGRICULTURALIST TOKEN
            // =================================================

            saveAgriculturalistToken(
                token
            );


            // =================================================
            // SAVE ROLE
            // =================================================

            saveAgriculturalistRole(
                "agriculturalist"
            );


            // =================================================
            // SAVE EMAIL
            // =================================================

            const agriculturalistEmail =
                response.agriculturalist?.email ||
                response.email ||
                trimmedEmail;


            saveAgriculturalistEmail(
                agriculturalistEmail
            );


            // =================================================
            // VERIFY TOKEN WAS STORED
            // =================================================

            console.log(
                "AGRICULTURALIST TOKEN SAVED:",
                Boolean(token)
            );

            console.log(
                "AGRICULTURALIST EMAIL:",
                agriculturalistEmail
            );

            console.log(
                "AGRICULTURALIST ROLE:",
                role
            );


            // =================================================
            // REDIRECT
            // =================================================

            router.replace(
                "/agriculturalist/dashboard"
            );

        } catch (err: any) {

            console.error(
                "AGRICULTURALIST LOGIN ERROR:",
                err
            );


            // ------------------------------------------------
            // BACKEND ERROR
            // ------------------------------------------------

            const backendError =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.response?.data?.error;


            if (backendError) {

                setError(
                    backendError
                );

            } else if (err?.message) {

                setError(
                    err.message
                );

            } else {

                setError(
                    "Unable to login. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <main
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-slate-950
            "
        >

            {/* ==================================================
                BACKGROUND DECORATION
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-32
                    -top-32
                    h-96
                    w-96
                    rounded-full
                    bg-emerald-500/20
                    blur-3xl
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-40
                    -right-32
                    h-[28rem]
                    w-[28rem]
                    rounded-full
                    bg-green-400/10
                    blur-3xl
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-80
                    w-80
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-emerald-400/5
                    blur-3xl
                "
            />


            {/* ==================================================
                MAIN CONTAINER
            ================================================== */}

            <div
                className="
                    relative
                    z-10
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                "
            >

                <div
                    className="
                        grid
                        w-full
                        max-w-6xl
                        overflow-hidden
                        rounded-[2rem]
                        border
                        border-white/10
                        bg-white
                        shadow-2xl
                        lg:grid-cols-2
                    "
                >

                    {/* ==================================================
                        LEFT BRANDING PANEL
                    ================================================== */}

                    <section
                        className="
                            relative
                            hidden
                            overflow-hidden
                            bg-gradient-to-br
                            from-emerald-950
                            via-emerald-900
                            to-slate-950
                            p-10
                            lg:flex
                            lg:min-h-[720px]
                            lg:flex-col
                            lg:justify-between
                            xl:p-14
                        "
                    >

                        {/* Decorative circles */}

                        <div
                            className="
                                absolute
                                -right-24
                                -top-24
                                h-72
                                w-72
                                rounded-full
                                border
                                border-emerald-400/10
                            "
                        />

                        <div
                            className="
                                absolute
                                -right-10
                                -top-10
                                h-44
                                w-44
                                rounded-full
                                border
                                border-emerald-400/10
                            "
                        />

                        <div
                            className="
                                absolute
                                -bottom-32
                                -left-32
                                h-80
                                w-80
                                rounded-full
                                bg-emerald-500/10
                                blur-2xl
                            "
                        />


                        {/* TOP */}

                        <div className="relative z-10">

                            <div
                                className="
                                    mb-8
                                    flex
                                    items-center
                                    gap-3
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
                                        border
                                        border-emerald-400/20
                                        bg-emerald-400/10
                                        text-emerald-300
                                    "
                                >

                                    <Sprout
                                        size={25}
                                        strokeWidth={2}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            tracking-wide
                                            text-white
                                        "
                                    >
                                        Crop Yield Prediction AI
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-emerald-300/70
                                        "
                                    >
                                        Agricultural Intelligence
                                    </p>

                                </div>

                            </div>


                            <div className="max-w-lg">

                                <div
                                    className="
                                        mb-5
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-emerald-400/20
                                        bg-emerald-400/10
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-medium
                                        text-emerald-300
                                    "
                                >

                                    <span
                                        className="
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            bg-emerald-400
                                        "
                                    />

                                    Agriculturalist Portal

                                </div>


                                <h2
                                    className="
                                        text-4xl
                                        font-bold
                                        leading-tight
                                        tracking-tight
                                        text-white
                                        xl:text-5xl
                                    "
                                >

                                    Empower farmers
                                    <span className="block text-emerald-400">
                                        with better decisions.
                                    </span>

                                </h2>


                                <p
                                    className="
                                        mt-6
                                        max-w-md
                                        text-base
                                        leading-7
                                        text-slate-300
                                    "
                                >
                                    Connect with farmers, provide expert
                                    agricultural guidance, and help turn
                                    data into smarter farming decisions.
                                </p>

                            </div>

                        </div>


                        {/* FEATURE CARDS */}

                        <div
                            className="
                                relative
                                z-10
                                mt-12
                                space-y-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/5
                                    p-4
                                    backdrop-blur-sm
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
                                        rounded-xl
                                        bg-emerald-400/10
                                        text-emerald-300
                                    "
                                >

                                    <BrainCircuit
                                        size={21}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        AI-Powered Insights
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Data-driven agricultural support
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/5
                                    p-4
                                    backdrop-blur-sm
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
                                        rounded-xl
                                        bg-emerald-400/10
                                        text-emerald-300
                                    "
                                >

                                    <Users
                                        size={21}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Farmer Assistance
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Guide farmers with expert knowledge
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/5
                                    p-4
                                    backdrop-blur-sm
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
                                        rounded-xl
                                        bg-emerald-400/10
                                        text-emerald-300
                                    "
                                >

                                    <Leaf
                                        size={21}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Sustainable Farming
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Support smarter farming practices
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div
                            className="
                                relative
                                z-10
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-slate-500
                            "
                        >

                            <ShieldCheck
                                size={14}
                                className="text-emerald-400"
                            />

                            Secure agriculturalist workspace

                        </div>

                    </section>


                    {/* ==================================================
                        RIGHT LOGIN PANEL
                    ================================================== */}

                    <section
                        className="
                            flex
                            min-h-[680px]
                            items-center
                            justify-center
                            bg-white
                            p-6
                            sm:p-10
                            lg:p-12
                            xl:p-16
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-md
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
                                        bg-emerald-600
                                        text-white
                                        shadow-lg
                                        shadow-emerald-600/20
                                    "
                                >

                                    <Sprout
                                        size={23}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        Crop Yield Prediction AI
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        Agriculturalist Portal
                                    </p>

                                </div>

                            </div>


                            {/* HEADER */}

                            <div className="mb-8">

                                <div
                                    className="
                                        mb-5
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-emerald-50
                                        text-emerald-600
                                        ring-8
                                        ring-emerald-50/60
                                    "
                                >

                                    <Sprout
                                        size={27}
                                        strokeWidth={2}
                                    />

                                </div>


                                <h1
                                    className="
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                    "
                                >
                                    Welcome back
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    Sign in to your agriculturalist
                                    workspace and continue helping farmers.
                                </p>

                            </div>


                            {/* ERROR */}

                            {error && (

                                <div
                                    role="alert"
                                    className="
                                        mb-6
                                        flex
                                        items-start
                                        gap-3
                                        rounded-xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        px-4
                                        py-3.5
                                        text-sm
                                        text-red-700
                                    "
                                >

                                    <AlertCircle
                                        size={18}
                                        className="
                                            mt-0.5
                                            shrink-0
                                        "
                                    />

                                    <span className="leading-5">
                                        {error}
                                    </span>

                                </div>

                            )}


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
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Email address
                                    </label>


                                    <div className="relative">

                                        <Mail
                                            size={18}
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-4
                                                top-1/2
                                                -translate-y-1/2
                                                text-slate-400
                                            "
                                        />


                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(
                                                event
                                            ) =>
                                                setEmail(
                                                    event.target.value
                                                )
                                            }
                                            disabled={loading}
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            required
                                            className="
                                                w-full
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                py-3.5
                                                pl-11
                                                pr-4
                                                text-sm
                                                text-slate-900
                                                outline-none
                                                transition
                                                placeholder:text-slate-400
                                                hover:border-slate-300
                                                focus:border-emerald-500
                                                focus:bg-white
                                                focus:ring-4
                                                focus:ring-emerald-50
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
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
                                                block
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                            "
                                        >
                                            Password
                                        </label>

                                    </div>


                                    <div className="relative">

                                        <Lock
                                            size={18}
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-4
                                                top-1/2
                                                -translate-y-1/2
                                                text-slate-400
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
                                            onChange={(
                                                event
                                            ) =>
                                                setPassword(
                                                    event.target.value
                                                )
                                            }
                                            disabled={loading}
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            required
                                            className="
                                                w-full
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                py-3.5
                                                pl-11
                                                pr-12
                                                text-sm
                                                text-slate-900
                                                outline-none
                                                transition
                                                placeholder:text-slate-400
                                                hover:border-slate-300
                                                focus:border-emerald-500
                                                focus:bg-white
                                                focus:ring-4
                                                focus:ring-emerald-50
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            "
                                        />


                                        <button
                                            type="button"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            onClick={() =>
                                                setShowPassword(
                                                    previous =>
                                                        !previous
                                                )
                                            }
                                            disabled={loading}
                                            className="
                                                absolute
                                                right-3
                                                top-1/2
                                                flex
                                                h-9
                                                w-9
                                                -translate-y-1/2
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-slate-400
                                                transition
                                                hover:bg-slate-100
                                                hover:text-slate-700
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >

                                            {showPassword ? (

                                                <EyeOff
                                                    size={18}
                                                />

                                            ) : (

                                                <Eye
                                                    size={18}
                                                />

                                            )}

                                        </button>

                                    </div>

                                </div>


                                {/* SECURITY NOTE */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-emerald-100
                                        bg-emerald-50/70
                                        px-3
                                        py-2.5
                                    "
                                >

                                    <ShieldCheck
                                        size={16}
                                        className="
                                            shrink-0
                                            text-emerald-600
                                        "
                                    />

                                    <p
                                        className="
                                            text-xs
                                            leading-5
                                            text-emerald-700
                                        "
                                    >
                                        Your agriculturalist account is
                                        protected with secure authentication.
                                    </p>

                                </div>


                                {/* LOGIN BUTTON */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        group
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-emerald-600
                                        px-5
                                        py-3.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-lg
                                        shadow-emerald-600/20
                                        transition
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:bg-emerald-700
                                        hover:shadow-xl
                                        hover:shadow-emerald-600/25
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                        disabled:hover:translate-y-0
                                    "
                                >

                                    {loading ? (

                                        <>

                                            <Loader2
                                                size={19}
                                                className="
                                                    animate-spin
                                                "
                                            />

                                            Signing in...

                                        </>

                                    ) : (

                                        <>

                                            Sign in to workspace

                                            <ArrowRight
                                                size={18}
                                                className="
                                                    transition-transform
                                                    duration-200
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
                                    border-t
                                    border-slate-100
                                    pt-6
                                    text-center
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    Don't have an agriculturalist account?

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(
                                                "/agriculturalist/register"
                                            )
                                        }
                                        className="
                                            ml-1
                                            font-semibold
                                            text-emerald-600
                                            transition
                                            hover:text-emerald-700
                                            hover:underline
                                        "
                                    >
                                        Register
                                    </button>

                                </p>

                            </div>


                            {/* BOTTOM STATUS */}

                            <div
                                className="
                                    mt-6
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    text-xs
                                    text-slate-400
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

                                Agriculturalist services online

                            </div>

                        </div>

                    </section>

                </div>

            </div>

        </main>
    );
}