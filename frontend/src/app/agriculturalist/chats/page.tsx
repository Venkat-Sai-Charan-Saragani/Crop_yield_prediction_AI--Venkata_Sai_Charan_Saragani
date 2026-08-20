"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Loader2,
    MessageCircle,
    Sprout,
    AlertCircle,
} from "lucide-react";

import {
    useRouter,
} from "next/navigation";

import {
    getUserConversations,
    ChatConversation,
} from "@/services/chat";


export default function AgriculturalistChatsPage() {

    const router = useRouter();

    const [
        conversations,
        setConversations,
    ] = useState<ChatConversation[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");


    // ========================================================
    // LOAD USER CHATS
    // ========================================================

    useEffect(() => {

        let active = true;

        const loadChats = async () => {

            try {

                setLoading(true);
                setError("");

                console.log(
                    "Loading user conversations..."
                );

                const response =
                    await getUserConversations();

                console.log(
                    "USER CONVERSATIONS RESPONSE:",
                    response
                );

                if (!active) {
                    return;
                }

                if (!response.success) {

                    setError(
                        response.message ||
                        "Unable to load your chats."
                    );

                    setConversations([]);

                    return;
                }

                setConversations(
                    response.conversations || []
                );

            } catch (err: any) {

                console.error(
                    "USER CHATS PAGE ERROR:",
                    err
                );

                if (!active) {
                    return;
                }

                const status =
                    err?.response?.status;

                if (status === 401) {

                    setError(
                        "Your session has expired. Please login again."
                    );

                } else if (status === 404) {

                    setError(
                        "Chat API endpoint was not found. Please check the backend chat route."
                    );

                } else {

                    setError(
                        "Unable to load your chats."
                    );
                }

                setConversations([]);

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        };

        loadChats();

        return () => {
            active = false;
        };

    }, []);


    // ========================================================
    // OPEN CHAT
    // ========================================================

    const openChat = (
        conversation: ChatConversation
    ) => {

        const agriculturalistId =
            conversation.agriculturalist_id;

        if (!agriculturalistId) {

            setError(
                "Agriculturalist information is missing from this conversation."
            );

            return;
        }

        console.log(
            "Opening agriculturalist chat:",
            agriculturalistId
        );

        router.push(
            `/agriculturalist/chat/${encodeURIComponent(
                agriculturalistId
            )}`
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
                        size={40}
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
                        Loading your chats...
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
                py-8
                md:px-8
            "
        >

            <div
                className="
                    mx-auto
                    max-w-6xl
                "
            >

                {/* HEADER */}

                <div
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-emerald-50
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-emerald-700
                            "
                        >

                            <MessageCircle
                                size={17}
                            />

                            My Chats

                        </div>


                        <h1
                            className="
                                mt-4
                                text-3xl
                                font-bold
                                text-slate-900
                                md:text-4xl
                            "
                        >
                            Your Agriculturalist Chats
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-slate-500
                                md:text-base
                            "
                        >
                            Continue your conversations
                            with agricultural experts.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/agriculturalist/choose"
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
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

                        <Sprout
                            size={17}
                        />

                        Find Agriculturalist

                    </button>

                </div>


                {/* ERROR */}

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
                            p-4
                            text-sm
                            text-red-700
                        "
                    >

                        <AlertCircle
                            size={20}
                            className="shrink-0"
                        />

                        <div>

                            <p
                                className="
                                    font-semibold
                                "
                            >
                                Unable to load chats
                            </p>

                            <p className="mt-1">
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* EMPTY STATE */}

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
                            No chats yet
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
                            You haven't started a conversation
                            with an agriculturalist yet.
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/agriculturalist/choose"
                                )
                            }
                            className="
                                mt-6
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-emerald-600
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-emerald-700
                            "
                        >

                            <Sprout
                                size={18}
                            />

                            Choose Agriculturalist

                        </button>

                    </section>

                ) : (

                    /* CHAT LIST */

                    <section
                        className="
                            space-y-4
                        "
                    >

                        {conversations.map(
                            (
                                conversation,
                                index
                            ) => {

                                const id =
                                    conversation.id ||
                                    conversation.conversation_id ||
                                    `conversation-${index}`;

                                /*
                                 * IMPORTANT:
                                 *
                                 * Some backend responses may use:
                                 *
                                 * agriculturalist_name
                                 * name
                                 * full_name
                                 *
                                 * We safely support all of them.
                                 */

                                const agriculturalistName =
                                    conversation.agriculturalist_name ||
                                    conversation.name ||
                                    conversation.full_name ||
                                    "Agricultural Expert";


                                return (

                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() =>
                                            openChat(
                                                conversation
                                            )
                                        }
                                        className="
                                            w-full
                                            rounded-3xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-5
                                            text-left
                                            shadow-sm
                                            transition
                                            hover:-translate-y-0.5
                                            hover:shadow-md
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-4
                                            "
                                        >

                                            {/* ICON */}

                                            <div
                                                className="
                                                    flex
                                                    h-14
                                                    w-14
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    bg-emerald-100
                                                    text-emerald-700
                                                "
                                            >

                                                <Sprout
                                                    size={25}
                                                />

                                            </div>


                                            {/* CONTENT */}

                                            <div
                                                className="
                                                    min-w-0
                                                    flex-1
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-1
                                                        sm:flex-row
                                                        sm:items-center
                                                        sm:justify-between
                                                    "
                                                >

                                                    <h2
                                                        className="
                                                            truncate
                                                            text-lg
                                                            font-bold
                                                            text-slate-900
                                                        "
                                                    >

                                                        {agriculturalistName}

                                                    </h2>


                                                    {conversation.last_message_at && (

                                                        <span
                                                            className="
                                                                text-xs
                                                                text-slate-400
                                                            "
                                                        >

                                                            {new Date(
                                                                conversation.last_message_at
                                                            ).toLocaleString()}

                                                        </span>

                                                    )}

                                                </div>


                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        text-emerald-600
                                                    "
                                                >
                                                    Agriculturalist
                                                </p>


                                                <p
                                                    className="
                                                        mt-2
                                                        truncate
                                                        text-sm
                                                        text-slate-500
                                                    "
                                                >

                                                    {conversation.last_message ||
                                                        "Start your conversation"}

                                                </p>

                                            </div>


                                            {/* UNREAD COUNT */}

                                            {(conversation.unread_count || 0) >
                                                0 && (

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

                                        </div>

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