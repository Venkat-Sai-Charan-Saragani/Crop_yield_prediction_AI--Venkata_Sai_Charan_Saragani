"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Loader2,
    MessageCircle,
    UserRound,
} from "lucide-react";

import {
    useRouter,
} from "next/navigation";

import {
    getAgriculturalistConversations,
    AgriculturalistConversation,
} from "@/services/agriculturalist";

export default function AgriculturalistConversationsPage() {

    const router = useRouter();

    const [
        conversations,
        setConversations,
    ] = useState<AgriculturalistConversation[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");


    // ========================================================
    // LOAD CONVERSATIONS
    // ========================================================

    useEffect(() => {

        let active = true;

        const loadConversations = async () => {

            try {

                setLoading(true);
                setError("");

                console.log(
                    "Loading agriculturalist conversations..."
                );

                const response =
                    await getAgriculturalistConversations();

                console.log(
                    "AGRICULTURALIST CONVERSATIONS RESPONSE:",
                    response
                );

                if (!active) {
                    return;
                }

                if (!response.success) {

                    setError(
                        response.message ||
                        "Unable to load conversations."
                    );

                    setConversations([]);

                    return;
                }

                setConversations(
                    response.conversations || []
                );

            } catch (err) {

                console.error(
                    "AGRICULTURALIST CONVERSATIONS PAGE ERROR:",
                    err
                );

                if (!active) {
                    return;
                }

                setError(
                    "Unable to load conversations."
                );

                setConversations([]);

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        };

        loadConversations();

        return () => {
            active = false;
        };

    }, []);


    // ========================================================
    // GET FARMER NAME
    // ========================================================

    const getFarmerName = (
        conversation: AgriculturalistConversation
    ): string => {

        const farmerName =
            conversation.user_name ||
            conversation.farmer_name ||
            conversation.full_name ||
            conversation.name ||
            conversation.username ||
            conversation.user?.full_name ||
            conversation.user?.name ||
            conversation.user?.username ||
            conversation.user_email ||
            "Farmer";

        return String(farmerName).trim() || "Farmer";
    };


    // ========================================================
    // OPEN CONVERSATION
    // ========================================================

    const openConversation = (
        userId: string
    ) => {

        if (!userId) {

            setError(
                "This conversation does not contain a valid farmer ID."
            );

            return;
        }

        console.log(
            "Opening farmer conversation:",
            userId
        );

        router.push(
            `/agriculturalist/conversations/${encodeURIComponent(
                userId
            )}`
        );
    };


    // ========================================================
    // BACK TO DASHBOARD
    // ========================================================

    const goBack = () => {

        router.push(
            "/agriculturalist/dashboard"
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
                        flex
                        min-h-[70vh]
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
                        Loading conversations...
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
                    max-w-5xl
                "
            >

                {/* ==================================================
                    BACK BUTTON
                ================================================== */}

                <button
                    type="button"
                    onClick={goBack}
                    className="
                        mb-6
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-slate-700
                        shadow-sm
                        transition
                        hover:bg-slate-50
                    "
                >

                    <ArrowLeft
                        size={17}
                    />

                    Dashboard

                </button>


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        mb-8
                    "
                >

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
                                bg-emerald-100
                                text-emerald-700
                            "
                        >

                            <MessageCircle
                                size={28}
                            />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-3xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Farmer Conversations
                            </h1>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                View and respond to messages
                                from farmers.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div
                        className="
                            mb-6
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
                            className="
                                mt-0.5
                                shrink-0
                            "
                        />

                        <div>

                            <p
                                className="
                                    font-semibold
                                "
                            >
                                Unable to load conversations
                            </p>

                            <p
                                className="
                                    mt-1
                                "
                            >
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* ==================================================
                    EMPTY STATE
                ================================================== */}

                {conversations.length === 0 ? (

                    <section
                        className="
                            flex
                            min-h-[420px]
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

                            <MessageCircle
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
                            No conversations yet
                        </h2>


                        <p
                            className="
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            When a farmer sends you a message,
                            the conversation will appear here.
                        </p>

                    </section>

                ) : (

                    /* ==================================================
                       CONVERSATION LIST
                    ================================================== */

                    <section
                        className="
                            overflow-hidden
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >

                        {conversations.map(
                            (
                                conversation,
                                index
                            ) => {

                                const conversationId =
                                    conversation.id ||
                                    conversation._id ||
                                    conversation.conversation_id ||
                                    `conversation-${index}`;

                                const farmerName =
                                    getFarmerName(
                                        conversation
                                    );

                                const farmerId =
                                    conversation.user_id ||
                                    conversation.user?._id ||
                                    conversation.user?.id ||
                                    "";

                                return (

                                    <button
                                        key={conversationId}
                                        type="button"
                                        onClick={() =>
                                            openConversation(
                                                farmerId
                                            )
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-4
                                            border-b
                                            border-slate-100
                                            px-6
                                            py-5
                                            text-left
                                            transition
                                            hover:bg-slate-50
                                            last:border-b-0
                                        "
                                    >

                                        {/* ==================================================
                                            USER ICON
                                        ================================================== */}

                                        <div
                                            className="
                                                flex
                                                h-12
                                                w-12
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-emerald-100
                                                text-emerald-700
                                            "
                                        >

                                            <UserRound
                                                size={22}
                                            />

                                        </div>


                                        {/* ==================================================
                                            FARMER DETAILS
                                        ================================================== */}

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >

                                                <h2
                                                    className="
                                                        truncate
                                                        font-semibold
                                                        text-slate-900
                                                    "
                                                >
                                                    {farmerName}
                                                </h2>


                                                {conversation.last_message_at && (

                                                    <span
                                                        className="
                                                            shrink-0
                                                            text-xs
                                                            text-slate-400
                                                        "
                                                    >

                                                        {new Date(
                                                            conversation.last_message_at
                                                        ).toLocaleString(
                                                            [],
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}

                                                    </span>

                                                )}

                                            </div>


                                            {/* Farmer label */}

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    font-medium
                                                    text-emerald-600
                                                "
                                            >
                                                Farmer
                                            </p>


                                            {/* Last message */}

                                            <p
                                                className="
                                                    mt-1
                                                    truncate
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >

                                                {conversation.last_message ||
                                                    "No message"}

                                            </p>

                                        </div>


                                        {/* ==================================================
                                            UNREAD COUNT
                                        ================================================== */}

                                        {(conversation.unread_count || 0) > 0 && (

                                            <div
                                                className="
                                                    flex
                                                    h-7
                                                    min-w-7
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-emerald-600
                                                    px-2
                                                    text-xs
                                                    font-bold
                                                    text-white
                                                "
                                            >

                                                {conversation.unread_count}

                                            </div>

                                        )}


                                        {/* ==================================================
                                            ARROW
                                        ================================================== */}

                                        <ArrowRight
                                            size={20}
                                            className="
                                                shrink-0
                                                text-slate-400
                                            "
                                        />

                                    </button>

                                );

                            }
                        )}

                    </section>

                )}

            </div>

        </main>

    );
}