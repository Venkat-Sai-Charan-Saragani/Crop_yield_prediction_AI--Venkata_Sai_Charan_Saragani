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
    MessageCircle,
    Sprout,
    UserRoundCheck,
    MapPin,
    GraduationCap,
    BriefcaseBusiness,
} from "lucide-react";

import {
    AgriculturalistPublic,
    getAvailableAgriculturalists,
} from "@/services/agriculturalist";

import {
    getToken,
} from "@/utils/auth";

export default function AgriculturalistPage() {

    const router =
        useRouter();

    const [
        agriculturalists,
        setAgriculturalists,
    ] = useState<AgriculturalistPublic[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    // ========================================================
    // LOAD AGRICULTURALISTS
    // ========================================================

    useEffect(() => {

        let active = true;

        const loadAgriculturalists =
            async () => {

                // ------------------------------------------------
                // USER MUST BE LOGGED IN
                // ------------------------------------------------

                const token =
                    getToken();

                if (!token) {

                    router.replace(
                        "/login?redirect=/agriculturalist"
                    );

                    return;
                }

                try {

                    setLoading(true);

                    setError("");

                    const response =
                        await getAvailableAgriculturalists();

                    if (!active) {
                        return;
                    }

                    if (!response.success) {

                        setError(
                            response.message ||
                            "Unable to load agriculturalists."
                        );

                        setAgriculturalists([]);

                        return;
                    }

                    setAgriculturalists(
                        response.agriculturalists || []
                    );

                } catch (err) {

                    console.error(
                        "AGRICULTURALIST PAGE ERROR:",
                        err
                    );

                    if (!active) {
                        return;
                    }

                    setError(
                        "Unable to connect to the agriculturalist service."
                    );

                    setAgriculturalists([]);

                } finally {

                    if (active) {
                        setLoading(false);
                    }

                }

            };

        loadAgriculturalists();

        return () => {
            active = false;
        };

    }, [router]);

    // ========================================================
    // OPEN CHAT
    // ========================================================

    const openChat = (
        agriculturalist: AgriculturalistPublic
    ) => {

        const id =
            agriculturalist.id ||
            agriculturalist._id;

        if (!id) {

            setError(
                "This agriculturalist does not have a valid ID."
            );

            return;
        }

        router.push(
            `/agriculturalist/chat/${encodeURIComponent(id)}`
        );
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <main
                className="
                    min-h-screen
                    bg-slate-50
                    px-4
                    py-10
                    md:px-8
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        min-h-[70vh]
                        max-w-7xl
                        flex-col
                        items-center
                        justify-center
                    "
                >

                    <Loader2
                        size={40}
                        className="
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
                        Loading agriculturalists...
                    </p>

                </div>

            </main>

        );
    }

    // ========================================================
    // PAGE
    // ========================================================

    return (

        <main
            className="
                min-h-screen
                bg-slate-50
                px-4
                py-10
                md:px-8
            "
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        mb-10
                    "
                >

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-emerald-700
                        "
                    >

                        <Sprout
                            size={18}
                        />

                        Expert Agricultural Support

                    </div>

                    <h1
                        className="
                            mt-6
                            text-4xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            md:text-5xl
                        "
                    >
                        Talk to an Agriculturalist
                    </h1>

                    <p
                        className="
                            mt-4
                            max-w-3xl
                            text-base
                            leading-7
                            text-slate-500
                            md:text-lg
                        "
                    >
                        Select an agricultural expert and
                        start a conversation about your crops,
                        farming problems, yield predictions,
                        soil conditions, and other agricultural
                        questions.
                    </p>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div
                        className="
                            mb-8
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            text-sm
                            text-red-700
                        "
                    >

                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>

                            <p
                                className="
                                    font-semibold
                                "
                            >
                                Unable to load agriculturalists
                            </p>

                            <p
                                className="mt-1"
                            >
                                {error}
                            </p>

                        </div>

                    </div>

                )}

                {/* =================================================
                    NO AGRICULTURALISTS
                ================================================= */}

                {agriculturalists.length === 0 ? (

                    <section
                        className="
                            flex
                            min-h-[430px]
                            flex-col
                            items-center
                            justify-center
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            px-6
                            py-16
                            text-center
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                flex
                                h-20
                                w-20
                                items-center
                                justify-center
                                rounded-2xl
                                bg-emerald-100
                                text-emerald-700
                            "
                        >

                            <UserRoundCheck
                                size={36}
                            />

                        </div>

                        <h2
                            className="
                                mt-6
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            No agriculturalists available
                        </h2>

                        <p
                            className="
                                mt-2
                                max-w-lg
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            {error
                                ? error
                                : "There are currently no agricultural experts available for consultation."
                            }
                        </p>

                    </section>

                ) : (

                    /* =================================================
                       AGRICULTURALIST CARDS
                    ================================================= */

                    <section
                        className="
                            grid
                            gap-6
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        {agriculturalists.map(
                            (
                                agriculturalist,
                                index
                            ) => {

                                const id =
                                    agriculturalist.id ||
                                    agriculturalist._id ||
                                    `agriculturalist-${index}`;

                                const available =
                                    agriculturalist.is_available !== false;

                                return (

                                    <article
                                        key={id}
                                        className="
                                            rounded-3xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-6
                                            shadow-sm
                                            transition
                                            hover:-translate-y-1
                                            hover:shadow-lg
                                        "
                                    >

                                        {/* =================================================
                                            PROFILE ICON
                                        ================================================= */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    h-16
                                                    w-16
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    bg-emerald-100
                                                    text-emerald-700
                                                "
                                            >

                                                <UserRoundCheck
                                                    size={30}
                                                />

                                            </div>

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    rounded-full
                                                    bg-slate-50
                                                    px-3
                                                    py-1.5
                                                "
                                            >

                                                <span
                                                    className={`
                                                        h-2.5
                                                        w-2.5
                                                        rounded-full
                                                        ${
                                                            available
                                                                ? "bg-emerald-500"
                                                                : "bg-slate-400"
                                                        }
                                                    `}
                                                />

                                                <span
                                                    className="
                                                        text-xs
                                                        font-medium
                                                        text-slate-600
                                                    "
                                                >
                                                    {available
                                                        ? "Available"
                                                        : "Unavailable"
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                        {/* =================================================
                                            NAME
                                        ================================================= */}

                                        <h2
                                            className="
                                                mt-6
                                                text-xl
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            {
                                                agriculturalist.name ||
                                                "Agricultural Expert"
                                            }
                                        </h2>

                                        {/* =================================================
                                            SPECIALIZATION
                                        ================================================= */}

                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                font-semibold
                                                text-emerald-600
                                            "
                                        >
                                            {
                                                agriculturalist.specialization ||
                                                "Agriculturalist"
                                            }
                                        </p>

                                        {/* =================================================
                                            DETAILS
                                        ================================================= */}

                                        <div
                                            className="
                                                mt-5
                                                space-y-3
                                                text-sm
                                                text-slate-500
                                            "
                                        >

                                            {agriculturalist.qualification && (

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                    "
                                                >

                                                    <GraduationCap
                                                        size={18}
                                                        className="
                                                            mt-0.5
                                                            shrink-0
                                                            text-slate-400
                                                        "
                                                    />

                                                    <span>
                                                        {
                                                            agriculturalist.qualification
                                                        }
                                                    </span>

                                                </div>

                                            )}

                                            {agriculturalist.experience !==
                                                undefined && (

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                    "
                                                >

                                                    <BriefcaseBusiness
                                                        size={18}
                                                        className="
                                                            mt-0.5
                                                            shrink-0
                                                            text-slate-400
                                                        "
                                                    />

                                                    <span>
                                                        {
                                                            agriculturalist.experience
                                                        }{" "}
                                                        years experience
                                                    </span>

                                                </div>

                                            )}

                                            {agriculturalist.location && (

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                    "
                                                >

                                                    <MapPin
                                                        size={18}
                                                        className="
                                                            mt-0.5
                                                            shrink-0
                                                            text-slate-400
                                                        "
                                                    />

                                                    <span>
                                                        {
                                                            agriculturalist.location
                                                        }
                                                    </span>

                                                </div>

                                            )}

                                        </div>

                                        {/* =================================================
                                            CHAT BUTTON
                                        ================================================= */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openChat(
                                                    agriculturalist
                                                )
                                            }
                                            disabled={!available}
                                            className="
                                                mt-7
                                                flex
                                                w-full
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-2xl
                                                bg-emerald-600
                                                px-4
                                                py-3
                                                text-sm
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-emerald-700
                                                disabled:cursor-not-allowed
                                                disabled:bg-slate-300
                                            "
                                        >

                                            <MessageCircle
                                                size={18}
                                            />

                                            {available
                                                ? "Start Conversation"
                                                : "Currently Unavailable"
                                            }

                                        </button>

                                    </article>

                                );

                            }
                        )}

                    </section>

                )}

            </div>

        </main>

    );
}