"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    AlertCircle,
    Loader2,
    LogOut,
    Mail,
    MapPin,
    MessageCircle,
    Sprout,
    UserRound,
} from "lucide-react";

import {
    getAgriculturalistProfile,
    agriculturalistLogout,
    AgriculturalistPublic,
} from "@/services/agriculturalist";

import {
    getAgriculturalistToken,
} from "@/utils/auth";


export default function AgriculturalistDashboardPage() {

    const router = useRouter();


    const [
        agriculturalist,
        setAgriculturalist,
    ] = useState<AgriculturalistPublic | null>(
        null
    );


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ========================================================
    // LOAD AGRICULTURALIST
    // ========================================================

    useEffect(() => {

        let active = true;


        const loadProfile = async () => {

            const token =
                getAgriculturalistToken();


            if (!token) {

                router.replace(
                    "/agriculturalist/login"
                );

                return;
            }


            try {

                setLoading(true);

                setError("");


                const response =
                    await getAgriculturalistProfile();


                if (!active) {
                    return;
                }


                if (!response.success) {

                    setError(
                        response.message ||
                        "Unable to load your agriculturalist profile."
                    );

                    return;
                }


                if (
                    response.agriculturalist
                ) {

                    setAgriculturalist(
                        response.agriculturalist
                    );

                } else {

                    setError(
                        "Agriculturalist profile was not returned."
                    );
                }


            } catch (err) {

                console.error(
                    "AGRICULTURALIST DASHBOARD ERROR:",
                    err
                );


                if (!active) {
                    return;
                }


                setError(
                    "Unable to load your agriculturalist account."
                );


            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        };


        loadProfile();


        return () => {
            active = false;
        };

    }, [router]);


    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {

        agriculturalistLogout();

        router.replace(
            "/agriculturalist/login"
        );
    };


    // ========================================================
    // OPEN CONVERSATIONS
    // ========================================================

    const openConversations = () => {

        router.push(
            "/agriculturalist/conversations"
        );
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                "
            >

                <div className="text-center">

                    <Loader2
                        size={42}
                        className="
                            mx-auto
                            animate-spin
                            text-emerald-600
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-sm
                            text-slate-500
                        "
                    >
                        Loading agriculturalist dashboard...
                    </p>

                </div>

            </main>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                    px-4
                "
            >

                <div
                    className="
                        w-full
                        max-w-lg
                        rounded-3xl
                        border
                        border-red-200
                        bg-white
                        p-8
                        text-center
                        shadow-sm
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-red-50
                            text-red-600
                        "
                    >

                        <AlertCircle size={30} />

                    </div>


                    <h1
                        className="
                            mt-5
                            text-xl
                            font-bold
                            text-slate-900
                        "
                    >
                        Unable to load dashboard
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-500
                        "
                    >
                        {error}
                    </p>


                    <div
                        className="
                            mt-6
                            flex
                            justify-center
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                window.location.reload()
                            }
                            className="
                                rounded-xl
                                bg-emerald-600
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-emerald-700
                            "
                        >
                            Try Again
                        </button>


                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-slate-700
                                hover:bg-slate-50
                            "
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </main>
        );
    }


    // ========================================================
    // DASHBOARD
    // ========================================================

    return (

        <main
            className="
                min-h-screen
                bg-slate-50
                px-4
                py-8
                md:px-8
            "
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <header
                    className="
                        flex
                        flex-col
                        gap-5
                        rounded-3xl
                        bg-emerald-700
                        p-7
                        text-white
                        shadow-lg
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >

                    <div>

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
                                    bg-white/15
                                "
                            >

                                <Sprout size={26} />

                            </div>


                            <div>

                                <p
                                    className="
                                        text-sm
                                        text-emerald-100
                                    "
                                >
                                    Agriculturalist Portal
                                </p>


                                <h1
                                    className="
                                        text-2xl
                                        font-bold
                                    "
                                >
                                    Welcome back
                                </h1>

                            </div>

                        </div>


                        <p
                            className="
                                mt-4
                                max-w-2xl
                                text-sm
                                leading-6
                                text-emerald-50
                            "
                        >
                            Manage your agriculturalist profile
                            and help farmers with their
                            agricultural questions.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-white
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-emerald-700
                            hover:bg-emerald-50
                        "
                    >

                        <LogOut size={18} />

                        Logout

                    </button>

                </header>


                {/* ==================================================
                    PROFILE
                ================================================== */}

                <section
                    className="
                        mt-8
                        grid
                        gap-6
                        lg:grid-cols-3
                    "
                >

                    {/* PROFILE CARD */}

                    <div
                        className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-7
                            shadow-sm
                            lg:col-span-2
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                gap-6
                                sm:flex-row
                                sm:items-center
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-24
                                    w-24
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-3xl
                                    bg-emerald-100
                                    text-emerald-700
                                "
                            >

                                <UserRound size={42} />

                            </div>


                            <div>

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-3
                                    "
                                >

                                    <h2
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        {
                                            agriculturalist?.name ||
                                            "Agriculturalist"
                                        }
                                    </h2>


                                    <span
                                        className="
                                            rounded-full
                                            bg-emerald-100
                                            px-3
                                            py-1
                                            text-xs
                                            font-semibold
                                            text-emerald-700
                                        "
                                    >
                                        Agriculturalist
                                    </span>

                                </div>


                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        font-medium
                                        text-emerald-600
                                    "
                                >
                                    {
                                        agriculturalist?.specialization ||
                                        "Agricultural Expert"
                                    }
                                </p>

                            </div>

                        </div>


                        <div
                            className="
                                mt-7
                                grid
                                gap-4
                                sm:grid-cols-2
                            "
                        >

                            <div
                                className="
                                    rounded-2xl
                                    bg-slate-50
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

                                    <Mail
                                        size={18}
                                        className="text-slate-400"
                                    />

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Email
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                break-all
                                                text-sm
                                                font-medium
                                                text-slate-700
                                            "
                                        >
                                            {
                                                agriculturalist?.email ||
                                                "Not available"
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div
                                className="
                                    rounded-2xl
                                    bg-slate-50
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

                                    <MapPin
                                        size={18}
                                        className="text-slate-400"
                                    />

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Location
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-slate-700
                                            "
                                        >
                                            {
                                                agriculturalist?.location ||
                                                "Not specified"
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* STATUS CARD */}

                    <div
                        className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-7
                            shadow-sm
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-medium
                                text-slate-500
                            "
                        >
                            Account Status
                        </p>


                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <span
                                className="
                                    h-3
                                    w-3
                                    rounded-full
                                    bg-emerald-500
                                "
                            />


                            <span
                                className="
                                    text-lg
                                    font-bold
                                    text-emerald-700
                                "
                            >
                                {
                                    agriculturalist?.status ||
                                    "active"
                                }
                            </span>

                        </div>


                        <p
                            className="
                                mt-4
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            Your agriculturalist account is
                            currently active.
                        </p>


                        <div
                            className="
                                mt-7
                                rounded-2xl
                                bg-emerald-50
                                p-4
                                text-sm
                                text-emerald-700
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    font-semibold
                                "
                            >

                                <MessageCircle size={18} />

                                Farmer consultations

                            </div>


                            <p
                                className="
                                    mt-2
                                    text-emerald-600
                                "
                            >
                                Your portal is ready to receive
                                farmer questions.
                            </p>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    QUICK ACTIONS
                ================================================== */}

                <section
                    className="
                        mt-8
                        grid
                        gap-6
                        md:grid-cols-2
                    "
                >

                    {/* ==============================================
                        FARMER CONVERSATIONS
                    ============================================== */}

                    <button
                        type="button"
                        onClick={
                            openConversations
                        }
                        className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-7
                            text-left
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
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
                            "
                        >

                            <MessageCircle size={24} />

                        </div>


                        <h3
                            className="
                                mt-5
                                text-lg
                                font-bold
                                text-slate-900
                            "
                        >
                            Farmer Conversations
                        </h3>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            View and respond to conversations
                            from farmers who need agricultural
                            assistance.
                        </p>

                    </button>


                    {/* ==============================================
                        PROFILE
                    ============================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/agriculturalist/profile"
                            )
                        }
                        className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-7
                            text-left
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
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
                                bg-slate-100
                                text-slate-700
                            "
                        >

                            <UserRound size={24} />

                        </div>


                        <h3
                            className="
                                mt-5
                                text-lg
                                font-bold
                                text-slate-900
                            "
                        >
                            My Profile
                        </h3>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            View and manage your agriculturalist
                            profile information.
                        </p>

                    </button>

                </section>

            </div>

        </main>
    );
}