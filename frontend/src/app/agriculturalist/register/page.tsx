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
    UserRound,
    BriefcaseBusiness,
    IdCard,
    Eye,
    EyeOff,
    Loader2,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

import {
    agriculturalistRegister,
} from "@/services/agriculturalist";


export default function AgriculturalistRegisterPage() {

    const router = useRouter();

    // ========================================================
    // FORM STATE
    // ========================================================

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [specialization, setSpecialization] =
        useState("");

    const [governmentId, setGovernmentId] =
        useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    // ========================================================
    // UI STATE
    // ========================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ========================================================
    // REGISTER
    // ========================================================

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        // Clear previous messages

        setError("");
        setSuccess("");


        // ====================================================
        // CLEAN INPUTS
        // ====================================================

        const cleanFullName =
            fullName.trim();

        const cleanEmail =
            email.trim().toLowerCase();

        const cleanSpecialization =
            specialization.trim();

        const cleanGovernmentId =
            governmentId.trim();


        // ====================================================
        // FRONTEND VALIDATION
        // ====================================================

        if (!cleanFullName) {

            setError(
                "Please enter your full name."
            );

            return;
        }


        if (cleanFullName.length < 3) {

            setError(
                "Full name must be at least 3 characters long."
            );

            return;
        }


        if (!cleanEmail) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        if (!cleanSpecialization) {

            setError(
                "Please enter your specialization."
            );

            return;
        }


        // ====================================================
        // GOVERNMENT ID VALIDATION
        // ====================================================

        if (!cleanGovernmentId) {

            setError(
                "Please enter your Government ID number."
            );

            return;
        }


        if (cleanGovernmentId.length < 4) {

            setError(
                "Please enter a valid Government ID number."
            );

            return;
        }


        if (!password) {

            setError(
                "Please enter a password."
            );

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters long."
            );

            return;
        }


        // ====================================================
        // START LOADING
        // ====================================================

        setLoading(true);


        try {

            console.log(
                "========================================"
            );

            console.log(
                "AGRICULTURALIST REGISTRATION"
            );

            console.log(
                "Email:",
                cleanEmail
            );

            console.log(
                "Specialization:",
                cleanSpecialization
            );

            console.log(
                "Government ID submitted: YES"
            );

            console.log(
                "========================================"
            );


            // =================================================
            // CALL BACKEND
            // =================================================

            const response =
                await agriculturalistRegister({

                    full_name:
                        cleanFullName,

                    email:
                        cleanEmail,

                    password:
                        password,

                    specialization:
                        cleanSpecialization,

                    government_id:
                        cleanGovernmentId,

                });


            console.log(
                "AGRICULTURALIST REGISTER RESPONSE:",
                response
            );


            // =================================================
            // CHECK RESPONSE
            // =================================================

            if (
                !response ||
                response.success !== true
            ) {

                setError(
                    response?.message ||
                    "Unable to create agriculturalist account."
                );

                return;
            }


            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                response.message ||
                "Registration submitted successfully. Your account is now awaiting admin approval."
            );


            // =================================================
            // CLEAR FORM
            // =================================================

            setFullName("");

            setEmail("");

            setSpecialization("");

            setGovernmentId("");

            setPassword("");


            // =================================================
            // REDIRECT TO LOGIN
            // =================================================

            setTimeout(() => {

                router.push(
                    "/agriculturalist/login"
                );

            }, 2500);


        } catch (error: any) {

            console.error(
                "AGRICULTURALIST REGISTER PAGE ERROR:",
                error
            );


            // =================================================
            // GET BACKEND ERROR
            // =================================================

            const backendMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message;


            setError(
                backendMessage ||
                "Unable to create agriculturalist account. Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // LOGIN NAVIGATION
    // ========================================================

    const goToLogin = () => {

        router.push(
            "/agriculturalist/login"
        );

    };


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <main
            className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-slate-50
                px-4
                py-10
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-8
                    shadow-xl
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        mb-7
                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            mb-4
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-emerald-600
                            text-white
                        "
                    >

                        <Sprout size={30} />

                    </div>


                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        Agriculturalist Registration
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-500
                        "
                    >
                        Create an account to support farmers.
                    </p>

                </div>


                {/* ==================================================
                    APPROVAL INFORMATION
                ================================================== */}

                <div
                    className="
                        mb-5
                        rounded-xl
                        border
                        border-amber-200
                        bg-amber-50
                        p-4
                        text-sm
                        text-amber-800
                    "
                >

                    <p className="font-semibold">
                        Verification required
                    </p>

                    <p className="mt-1 leading-5">
                        Your Government ID will be reviewed by an
                        administrator. You will be able to log in
                        after your agriculturalist account is approved.
                    </p>

                </div>


                {/* ==================================================
                    ERROR MESSAGE
                ================================================== */}

                {error && (

                    <div
                        className="
                            mb-4
                            flex
                            items-start
                            gap-2
                            rounded-xl
                            bg-red-50
                            p-3
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

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* ==================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {success && (

                    <div
                        className="
                            mb-4
                            flex
                            items-start
                            gap-2
                            rounded-xl
                            bg-emerald-50
                            p-3
                            text-sm
                            text-emerald-700
                        "
                    >

                        <CheckCircle2
                            size={18}
                            className="
                                mt-0.5
                                shrink-0
                            "
                        />

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* ==================================================
                        FULL NAME
                    ================================================== */}

                    <div className="relative">

                        <UserRound
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />


                        <input
                            type="text"
                            value={fullName}
                            onChange={(event) => {

                                setFullName(
                                    event.target.value
                                );

                                if (error) {
                                    setError("");
                                }

                            }}
                            placeholder="Full name"
                            autoComplete="name"
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                py-3
                                pl-11
                                pr-4
                                text-slate-900
                                outline-none
                                transition
                                focus:border-emerald-500
                                focus:ring-2
                                focus:ring-emerald-100
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                            "
                        />

                    </div>


                    {/* ==================================================
                        EMAIL
                    ================================================== */}

                    <div className="relative">

                        <Mail
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />


                        <input
                            type="email"
                            value={email}
                            onChange={(event) => {

                                setEmail(
                                    event.target.value
                                );

                                if (error) {
                                    setError("");
                                }

                            }}
                            placeholder="Email address"
                            autoComplete="email"
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                py-3
                                pl-11
                                pr-4
                                text-slate-900
                                outline-none
                                transition
                                focus:border-emerald-500
                                focus:ring-2
                                focus:ring-emerald-100
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                            "
                        />

                    </div>


                    {/* ==================================================
                        SPECIALIZATION
                    ================================================== */}

                    <div className="relative">

                        <BriefcaseBusiness
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />


                        <input
                            type="text"
                            value={specialization}
                            onChange={(event) => {

                                setSpecialization(
                                    event.target.value
                                );

                                if (error) {
                                    setError("");
                                }

                            }}
                            placeholder="Specialization (e.g. Crop Science)"
                            autoComplete="organization-title"
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                py-3
                                pl-11
                                pr-4
                                text-slate-900
                                outline-none
                                transition
                                focus:border-emerald-500
                                focus:ring-2
                                focus:ring-emerald-100
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                            "
                        />

                    </div>


                    {/* ==================================================
                        GOVERNMENT ID
                    ================================================== */}

                    <div>

                        <div className="relative">

                            <IdCard
                                size={18}
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />


                            <input
                                type="text"
                                value={governmentId}
                                onChange={(event) => {

                                    setGovernmentId(
                                        event.target.value
                                    );

                                    if (error) {
                                        setError("");
                                    }

                                }}
                                placeholder="Government ID number"
                                autoComplete="off"
                                disabled={loading}
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    py-3
                                    pl-11
                                    pr-4
                                    text-slate-900
                                    outline-none
                                    transition
                                    focus:border-emerald-500
                                    focus:ring-2
                                    focus:ring-emerald-100
                                    disabled:cursor-not-allowed
                                    disabled:bg-slate-100
                                "
                            />

                        </div>


                        <p
                            className="
                                mt-1
                                px-1
                                text-xs
                                text-slate-500
                            "
                        >
                            Enter the Government ID that can be
                            verified by the administrator.
                        </p>

                    </div>


                    {/* ==================================================
                        PASSWORD
                    ================================================== */}

                    <div className="relative">

                        <Lock
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />


                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={password}
                            onChange={(event) => {

                                setPassword(
                                    event.target.value
                                );

                                if (error) {
                                    setError("");
                                }

                            }}
                            placeholder="Password"
                            autoComplete="new-password"
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                py-3
                                pl-11
                                pr-12
                                text-slate-900
                                outline-none
                                transition
                                focus:border-emerald-500
                                focus:ring-2
                                focus:ring-emerald-100
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                            "
                        />


                        <button
                            type="button"
                            onClick={() => {

                                setShowPassword(
                                    (current) =>
                                        !current
                                );

                            }}
                            disabled={loading}
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
                                text-slate-400
                                transition
                                hover:text-slate-600
                                disabled:cursor-not-allowed
                            "
                        >

                            {showPassword ? (

                                <EyeOff size={18} />

                            ) : (

                                <Eye size={18} />

                            )}

                        </button>

                    </div>


                    {/* ==================================================
                        PASSWORD NOTE
                    ================================================== */}

                    <p
                        className="
                            -mt-1
                            px-1
                            text-xs
                            text-slate-500
                        "
                    >
                        Password must contain at least 6 characters.
                    </p>


                    {/* ==================================================
                        REGISTER BUTTON
                    ================================================== */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-emerald-600
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-emerald-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-emerald-500
                            focus:ring-offset-2
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        {loading ? (

                            <>

                                <Loader2
                                    size={19}
                                    className="animate-spin"
                                />

                                Submitting for review...

                            </>

                        ) : (

                            "Submit Registration"

                        )}

                    </button>

                </form>


                {/* ==================================================
                    LOGIN LINK
                ================================================== */}

                <div
                    className="
                        mt-6
                        text-center
                        text-sm
                        text-slate-500
                    "
                >

                    <span>
                        Already have an account?
                    </span>


                    <button
                        type="button"
                        onClick={goToLogin}
                        disabled={loading}
                        className="
                            ml-1
                            font-semibold
                            text-emerald-600
                            hover:text-emerald-700
                            disabled:cursor-not-allowed
                        "
                    >
                        Login
                    </button>

                </div>

            </div>

        </main>

    );
}