"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import {
    AlertCircle,
    ArrowLeft,
    Loader2,
    MessageCircle,
    Send,
    UserRound,
} from "lucide-react";

import {
    getAgriculturalistConversation,
    sendAgriculturalistMessage,
    markAgriculturalistConversationAsRead,
    UserChatMessage,
} from "@/services/chat";


export default function AgriculturalistConversationPage() {

    const router = useRouter();

    const params = useParams();

    const userId = String(
        params?.userId || ""
    );


    const [
        messages,
        setMessages,
    ] = useState<UserChatMessage[]>([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        sending,
        setSending,
    ] = useState(false);


    const [
        message,
        setMessage,
    ] = useState("");


    const [
        error,
        setError,
    ] = useState("");


    // ========================================================
    // LOAD CHAT
    // ========================================================

    useEffect(() => {

        if (!userId) {
            return;
        }


        let active = true;


        const loadChat = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await getAgriculturalistConversation(
                        userId
                    );


                if (!active) {
                    return;
                }


                if (!response.success) {

                    setError(
                        response.message ||
                        "Unable to load conversation."
                    );

                    return;
                }


                setMessages(
                    response.messages || []
                );


                // Mark farmer's messages as read.

                await markAgriculturalistConversationAsRead(
                    userId
                );


            } catch (err) {

                console.error(
                    "AGRICULTURALIST CHAT ERROR:",
                    err
                );


                if (!active) {
                    return;
                }


                setError(
                    "Unable to load conversation."
                );

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        };


        loadChat();


        return () => {
            active = false;
        };

    }, [userId]);


    // ========================================================
    // SEND MESSAGE
    // ========================================================

    const handleSendMessage = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        const trimmedMessage =
            message.trim();


        if (!trimmedMessage) {
            return;
        }


        if (!userId) {

            setError(
                "Invalid farmer ID."
            );

            return;
        }


        try {

            setSending(true);

            setError("");


            const response =
                await sendAgriculturalistMessage(
                    userId,
                    trimmedMessage
                );


            if (!response.success) {

                setError(
                    response.message ||
                    "Unable to send message."
                );

                return;
            }


            setMessages(
                (previous) => [
                    ...previous,
                    response.chat_message,
                ]
            );


            setMessage("");


        } catch (err) {

            console.error(
                "SEND AGRICULTURALIST MESSAGE ERROR:",
                err
            );


            setError(
                "Unable to send message."
            );

        } finally {

            setSending(false);
        }
    };


    // ========================================================
    // BACK
    // ========================================================

    const goBack = () => {

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

                <div
                    className="
                        text-center
                    "
                >

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
                        Loading conversation...
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
                    max-w-4xl
                "
            >

                {/* BACK */}

                <button
                    type="button"
                    onClick={goBack}
                    className="
                        mb-5
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
                        hover:bg-slate-50
                    "
                >

                    <ArrowLeft
                        size={17}
                    />

                    Conversations

                </button>


                {/* CHAT CONTAINER */}

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

                    {/* HEADER */}

                    <header
                        className="
                            flex
                            items-center
                            gap-4
                            border-b
                            border-slate-200
                            px-6
                            py-5
                        "
                    >

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                bg-emerald-100
                                text-emerald-700
                            "
                        >

                            <UserRound
                                size={23}
                            />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Farmer
                            </h1>


                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Agricultural consultation
                            </p>

                        </div>

                    </header>


                    {/* ERROR */}

                    {error && (

                        <div
                            className="
                                m-5
                                flex
                                items-start
                                gap-3
                                rounded-2xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-700
                            "
                        >

                            <AlertCircle
                                size={19}
                                className="
                                    mt-0.5
                                    shrink-0
                                "
                            />

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* MESSAGES */}

                    <div
                        className="
                            min-h-[500px]
                            max-h-[600px]
                            space-y-4
                            overflow-y-auto
                            bg-slate-50
                            px-5
                            py-6
                        "
                    >

                        {messages.length === 0 ? (

                            <div
                                className="
                                    flex
                                    min-h-[450px]
                                    flex-col
                                    items-center
                                    justify-center
                                    text-center
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

                                    <MessageCircle
                                        size={30}
                                    />

                                </div>


                                <h2
                                    className="
                                        mt-5
                                        text-lg
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    No messages yet
                                </h2>


                                <p
                                    className="
                                        mt-2
                                        max-w-sm
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Send a message to start
                                    the conversation.
                                </p>

                            </div>

                        ) : (

                            messages.map(
                                (item) => {

                                    const isAgriculturalist =
                                        item.sender_id !== userId;


                                    return (

                                        <div
                                            key={
                                                item.id
                                            }
                                            className={`
                                                flex
                                                ${
                                                    isAgriculturalist
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }
                                            `}
                                        >

                                            <div
                                                className={`
                                                    max-w-[80%]
                                                    rounded-2xl
                                                    px-4
                                                    py-3
                                                    ${
                                                        isAgriculturalist
                                                            ? "bg-emerald-600 text-white"
                                                            : "bg-white text-slate-800 border border-slate-200"
                                                    }
                                                `}
                                            >

                                                <p
                                                    className="
                                                        whitespace-pre-wrap
                                                        text-sm
                                                        leading-6
                                                    "
                                                >
                                                    {
                                                        item.message
                                                    }
                                                </p>


                                                <p
                                                    className={`
                                                        mt-1
                                                        text-[10px]
                                                        ${
                                                            isAgriculturalist
                                                                ? "text-emerald-100"
                                                                : "text-slate-400"
                                                        }
                                                    `}
                                                >

                                                    {item.created_at
                                                        ? new Date(
                                                            item.created_at
                                                        ).toLocaleString(
                                                            [],
                                                            {
                                                                day:
                                                                    "2-digit",

                                                                month:
                                                                    "short",

                                                                hour:
                                                                    "2-digit",

                                                                minute:
                                                                    "2-digit",
                                                            }
                                                        )
                                                        : ""
                                                    }

                                                </p>

                                            </div>

                                        </div>

                                    );
                                }
                            )

                        )}

                    </div>


                    {/* SEND BOX */}

                    <form
                        onSubmit={
                            handleSendMessage
                        }
                        className="
                            flex
                            gap-3
                            border-t
                            border-slate-200
                            bg-white
                            p-4
                        "
                    >

                        <input
                            type="text"
                            value={message}
                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }
                            placeholder="Type your reply..."
                            disabled={sending}
                            className="
                                min-w-0
                                flex-1
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                text-sm
                                text-slate-900
                                outline-none
                                focus:border-emerald-500
                                focus:ring-2
                                focus:ring-emerald-100
                                disabled:bg-slate-100
                            "
                        />


                        <button
                            type="submit"
                            disabled={
                                sending ||
                                !message.trim()
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-emerald-600
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-emerald-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {sending ? (

                                <Loader2
                                    size={18}
                                    className="
                                        animate-spin
                                    "
                                />

                            ) : (

                                <Send
                                    size={18}
                                />

                            )}

                            Send

                        </button>

                    </form>

                </section>

            </div>

        </main>
    );
}