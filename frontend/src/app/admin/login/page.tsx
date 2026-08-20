"use client";

import {
    FormEvent,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Leaf,
    ArrowRight,
    Loader2,
    CheckCircle2,
} from "lucide-react";

import api from "@/services/api";

import {
    saveAdminToken,
} from "@/utils/auth";


export default function AdminLoginPage() {

    const router =
        useRouter();


    // ============================================================
    // STATE
    // ============================================================

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


    // ============================================================
    // LOGIN
    // ============================================================

    const handleLogin = async (
        e: FormEvent
    ) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            // =====================================================
            // ADMIN LOGIN REQUEST
            // =====================================================

            const response =
                await api.post(
                    "/admin/login",
                    {
                        email:
                            email.trim(),

                        password:
                            password,
                    }
                );


            console.log(
                "ADMIN LOGIN RESPONSE:",
                response.data
            );


            const data =
                response.data;


            // =====================================================
            // CHECK LOGIN RESPONSE
            // =====================================================

            if (
                !data.success ||
                !data.access_token
            ) {

                setError(
                    data.message ||
                    "Admin login failed."
                );

                return;
            }


            // =====================================================
            // SAVE ADMIN JWT
            // =====================================================

            saveAdminToken(
                data.access_token
            );


            // =====================================================
            // SAVE ADMIN INFORMATION
            // =====================================================

            localStorage.setItem(
                "user_role",
                "admin"
            );


            localStorage.setItem(
                "admin_email",
                email.trim()
            );


            // =====================================================
            // VERIFY TOKEN WAS SAVED
            // =====================================================

            const savedToken =
                localStorage.getItem(
                    "admin_access_token"
                );


            console.log(
                "ADMIN TOKEN SAVED:",
                savedToken
                    ? "YES"
                    : "NO"
            );


            // =====================================================
            // IF TOKEN WAS NOT SAVED, STOP
            // =====================================================

            if (!savedToken) {

                setError(
                    "Admin token could not be saved."
                );

                return;
            }


            // =====================================================
            // REDIRECT
            // =====================================================

            router.replace(
                "/admin"
            );


        } catch (
            err: any
        ) {

            console.error(
                "ADMIN LOGIN ERROR:",
                err
            );


            if (
                err.response
            ) {

                setError(
                    err.response.data?.detail ||
                    err.response.data?.message ||
                    "Invalid admin credentials."
                );

            } else {

                setError(
                    "Unable to connect to the backend."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <main
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-slate-950
            "
        >

            {/* ====================================================
                BACKGROUND DECORATION
            ==================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-40
                    -top-40
                    h-96
                    w-96
                    rounded-full
                    bg-emerald-500/10
                    blur-3xl
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-40
                    -right-40
                    h-96
                    w-96
                    rounded-full
                    bg-blue-500/10
                    blur-3xl
                "
            />


            <div
                className="
                    relative
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

                {/* =================================================
                    MAIN CONTAINER
                ================================================= */}

                <div
                    className="
                        w-full
                        max-w-6xl
                        overflow-hidden
                        rounded-[30px]
                        border
                        border-slate-800
                        bg-slate-900/90
                        shadow-[0_30px_100px_rgba(0,0,0,0.45)]
                        backdrop-blur-xl
                        lg:grid
                        lg:grid-cols-2
                    "
                >

                    {/* =================================================
                        LEFT BRAND PANEL
                    ================================================= */}

                    <div
                        className="
                            relative
                            hidden
                            min-h-[680px]
                            overflow-hidden
                            border-r
                            border-slate-800
                            bg-gradient-to-br
                            from-emerald-950
                            via-slate-900
                            to-slate-950
                            p-10
                            lg:flex
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
                                border-emerald-500/10
                            "
                        />

                        <div
                            className="
                                absolute
                                -bottom-32
                                -left-20
                                h-80
                                w-80
                                rounded-full
                                border
                                border-emerald-500/10
                            "
                        />


                        {/* BRAND */}

                        <div
                            className="
                                relative
                                z-10
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
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-emerald-400/20
                                        bg-emerald-500/10
                                        text-emerald-400
                                    "
                                >

                                    <Leaf
                                        size={25}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-bold
                                            tracking-wide
                                            text-white
                                        "
                                    >
                                        Crop Yield
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-emerald-400
                                        "
                                    >
                                        Prediction AI
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* CENTER CONTENT */}

                        <div
                            className="
                                relative
                                z-10
                            "
                        >

                            <div
                                className="
                                    mb-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-emerald-400/20
                                    bg-emerald-500/10
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    text-emerald-300
                                "
                            >

                                <ShieldCheck
                                    size={14}
                                />

                                Secure Administrator Access

                            </div>


                            <h1
                                className="
                                    max-w-lg
                                    text-4xl
                                    font-black
                                    leading-tight
                                    tracking-tight
                                    text-white
                                    xl:text-5xl
                                "
                            >

                                Manage your

                                <span
                                    className="
                                        block
                                        text-emerald-400
                                    "
                                >
                                    AI agriculture platform.
                                </span>

                            </h1>


                            <p
                                className="
                                    mt-6
                                    max-w-md
                                    text-sm
                                    leading-7
                                    text-slate-400
                                "
                            >

                                Access your administrator console
                                to monitor users, farms, crops,
                                predictions, and platform activity
                                from one secure workspace.

                            </p>


                            {/* FEATURES */}

                            <div
                                className="
                                    mt-8
                                    space-y-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        text-sm
                                        text-slate-300
                                    "
                                >

                                    <CheckCircle2
                                        size={17}
                                        className="
                                            shrink-0
                                            text-emerald-400
                                        "
                                    />

                                    User & account management

                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        text-sm
                                        text-slate-300
                                    "
                                >

                                    <CheckCircle2
                                        size={17}
                                        className="
                                            shrink-0
                                            text-emerald-400
                                        "
                                    />

                                    Farm and crop monitoring

                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        text-sm
                                        text-slate-300
                                    "
                                >

                                    <CheckCircle2
                                        size={17}
                                        className="
                                            shrink-0
                                            text-emerald-400
                                        "
                                    />

                                    AI prediction analytics

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

                            <LockKeyhole
                                size={13}
                            />

                            Protected administrator environment

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT LOGIN PANEL
                    ================================================= */}

                    <div
                        className="
                            flex
                            min-h-[680px]
                            items-center
                            justify-center
                            p-6
                            sm:p-10
                            xl:p-14
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
                                        bg-emerald-500/10
                                        text-emerald-400
                                    "
                                >

                                    <Leaf
                                        size={22}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            font-bold
                                            text-white
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
                                        Administrator Console
                                    </p>

                                </div>

                            </div>


                            {/* LOGIN HEADER */}

                            <div
                                className="
                                    mb-8
                                "
                            >

                                <div
                                    className="
                                        mb-5
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-emerald-500/10
                                        text-emerald-400
                                        ring-1
                                        ring-emerald-500/20
                                    "
                                >

                                    <ShieldCheck
                                        size={28}
                                    />

                                </div>


                                <h2
                                    className="
                                        text-3xl
                                        font-black
                                        tracking-tight
                                        text-white
                                    "
                                >

                                    Welcome back

                                </h2>


                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-slate-400
                                    "
                                >

                                    Sign in with your administrator
                                    credentials to continue.

                                </p>


                                {/* =================================================
                                    ADMIN CREDENTIAL CONTACT INFORMATION
                                ================================================= */}

                                <div
                                    className="
                                        mt-5
                                        rounded-2xl
                                        border
                                        border-emerald-500/20
                                        bg-emerald-500/5
                                        px-4
                                        py-3.5
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-start
                                            gap-3
                                        "
                                    >

                                        <ShieldCheck
                                            size={17}
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-emerald-400
                                            "
                                        />

                                        <div>

                                            <p
                                                className="
                                                    text-xs
                                                    font-semibold
                                                    leading-5
                                                    text-slate-300
                                                "
                                            >

                                                Admin login credentials

                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    leading-5
                                                    text-slate-400
                                                "
                                            >

                                                For administrator login
                                                credentials, contact:

                                            </p>

                                            <a
                                                href="mailto:saicharanvenkata186@gmail.com"
                                                className="
                                                    mt-1
                                                    inline-block
                                                    text-sm
                                                    font-semibold
                                                    text-emerald-400
                                                    transition
                                                    hover:text-emerald-300
                                                    hover:underline
                                                "
                                            >

                                                saicharanvenkata186@gmail.com

                                            </a>

                                        </div>

                                    </div>

                                </div>

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
                                        rounded-2xl
                                        border
                                        border-red-500/20
                                        bg-red-500/10
                                        px-4
                                        py-3.5
                                        text-sm
                                        text-red-300
                                    "
                                >

                                    <div
                                        className="
                                            mt-0.5
                                            h-2
                                            w-2
                                            shrink-0
                                            rounded-full
                                            bg-red-400
                                        "
                                    />

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            )}


                            {/* FORM */}

                            <form
                                onSubmit={handleLogin}
                                className="
                                    space-y-5
                                "
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
                                            tracking-wider
                                            text-slate-400
                                        "
                                    >

                                        Admin Email

                                    </label>


                                    <div
                                        className="
                                            group
                                            relative
                                        "
                                    >

                                        <Mail
                                            size={18}
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-4
                                                top-1/2
                                                -translate-y-1/2
                                                text-slate-500
                                                transition
                                                group-focus-within:text-emerald-400
                                            "
                                        />


                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="admin@example.com"
                                            required
                                            autoComplete="email"
                                            className="
                                                h-14
                                                w-full
                                                rounded-2xl
                                                border
                                                border-slate-700
                                                bg-slate-950/70
                                                pl-12
                                                pr-4
                                                text-sm
                                                text-white
                                                placeholder:text-slate-600
                                                outline-none
                                                transition
                                                focus:border-emerald-500/60
                                                focus:bg-slate-950
                                                focus:ring-4
                                                focus:ring-emerald-500/10
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
                                                tracking-wider
                                                text-slate-400
                                            "
                                        >

                                            Password

                                        </label>

                                    </div>


                                    <div
                                        className="
                                            group
                                            relative
                                        "
                                    >

                                        <LockKeyhole
                                            size={18}
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-4
                                                top-1/2
                                                -translate-y-1/2
                                                text-slate-500
                                                transition
                                                group-focus-within:text-emerald-400
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
                                            onChange={(e) =>
                                                setPassword(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter admin password"
                                            required
                                            autoComplete="current-password"
                                            className="
                                                h-14
                                                w-full
                                                rounded-2xl
                                                border
                                                border-slate-700
                                                bg-slate-950/70
                                                pl-12
                                                pr-12
                                                text-sm
                                                text-white
                                                placeholder:text-slate-600
                                                outline-none
                                                transition
                                                focus:border-emerald-500/60
                                                focus:bg-slate-950
                                                focus:ring-4
                                                focus:ring-emerald-500/10
                                            "
                                        />


                                        <button
                                            type="button"
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
                                                right-3
                                                top-1/2
                                                flex
                                                h-9
                                                w-9
                                                -translate-y-1/2
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-slate-500
                                                transition
                                                hover:bg-slate-800
                                                hover:text-white
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
                                        border-slate-800
                                        bg-slate-950/40
                                        px-3
                                        py-2.5
                                        text-xs
                                        text-slate-500
                                    "
                                >

                                    <LockKeyhole
                                        size={14}
                                        className="
                                            shrink-0
                                            text-emerald-500
                                        "
                                    />

                                    Your administrator session is
                                    protected with secure authentication.

                                </div>


                                {/* LOGIN BUTTON */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        group
                                        flex
                                        h-14
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-2xl
                                        bg-emerald-600
                                        px-5
                                        text-sm
                                        font-bold
                                        text-white
                                        shadow-lg
                                        shadow-emerald-950/30
                                        transition
                                        hover:bg-emerald-500
                                        hover:shadow-emerald-500/10
                                        focus:outline-none
                                        focus:ring-4
                                        focus:ring-emerald-500/20
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    {loading ? (

                                        <>

                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />

                                            Signing in...

                                        </>

                                    ) : (

                                        <>

                                            Sign in as Administrator

                                            <ArrowRight
                                                size={18}
                                                className="
                                                    transition-transform
                                                    group-hover:translate-x-1
                                                "
                                            />

                                        </>

                                    )}

                                </button>

                            </form>


                            {/* BOTTOM */}

                            <div
                                className="
                                    mt-8
                                    text-center
                                "
                            >

                                <p
                                    className="
                                        text-[11px]
                                        leading-5
                                        text-slate-600
                                    "
                                >

                                    Authorized administrators only.
                                    <br />

                                    Unauthorized access is prohibited.

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>

    );

}