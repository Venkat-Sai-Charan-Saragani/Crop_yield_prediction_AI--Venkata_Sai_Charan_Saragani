"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    MessageCircle,
    Send,
    Sprout,
    UserRound,
    Clock,
    Loader2,
} from "lucide-react";

import {
    getAgriculturalists,
    getConversation,
    sendChatMessage,
    Agriculturalist,
    ChatMessage,
} from "@/services/agriculturalist";

export default function HelpDeskPage() {

    const [
        agriculturalists,
        setAgriculturalists
    ] = useState<Agriculturalist[]>([]);

    const [
        selected,
        setSelected
    ] = useState<Agriculturalist | null>(
        null
    );

    const [
        messages,
        setMessages
    ] = useState<ChatMessage[]>([]);

    const [
        message,
        setMessage
    ] = useState("");

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        sending,
        setSending
    ] = useState(false);

    // ========================================================
    // LOAD AGRICULTURALISTS
    // ========================================================

    useEffect(() => {

        const load =
            async () => {

                try {

                    const response =
                        await getAgriculturalists();

                    setAgriculturalists(
                        response.agriculturalists || []
                    );

                } catch (error) {

                    console.error(
                        "AGRICULTURALIST LOAD ERROR:",
                        error
                    );

                } finally {

                    setLoading(false);

                }

            };

        load();

    }, []);

    // ========================================================
    // LOAD CHAT
    // ========================================================

    useEffect(() => {

        if (!selected) {
            return;
        }

        const loadChat =
            async () => {

                try {

                    const agriculturalistId =
                            selected.id ||
                            selected._id;

                    if (!agriculturalistId){
                        "Agriculturalist ID is missing."
                    }
                        

                    setMessages([]);

                    return;

                } catch (error) {

                    console.error(
                        "CHAT LOAD ERROR:",
                        error
                    );

                }

            };

        loadChat();

        const interval =
            window.setInterval(
                loadChat,
                5000
            );

        return () =>
            window.clearInterval(
                interval
            );

    }, [selected]);

    // ========================================================
    // SEND
    // ========================================================

    const handleSend =
        async () => {

            if (
                !selected ||
                !message.trim() ||
                sending
            ) {
                return;
            }

            setSending(true);

            try {

                const agriculturalistId = 
                    selected.id ||
                    selected._id;

                if (!agriculturalistId) {

                    alert(
                        "Agriculturalist ID is missing."
                    );

                    return;
                }
                

                setMessage("");

                const response =
                    await getConversation(
                        agriculturalistId
                    );

                setMessages(
                    response.messages || []
                );

            } catch (error) {

                console.error(
                    "SEND MESSAGE ERROR:",
                    error
                );

            } finally {

                setSending(false);

            }

        };

    return (

        <main className="
            min-h-screen
            bg-slate-50
            px-4
            py-6
            md:px-8
        ">

            <div className="
                mx-auto
                max-w-7xl
            ">

                {/* HEADER */}

                <div className="
                    mb-8
                    flex
                    items-center
                    gap-4
                ">

                    <div className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-emerald-600
                        text-white
                    ">

                        <Sprout size={28} />

                    </div>

                    <div>

                        <h1 className="
                            text-2xl
                            font-bold
                            text-slate-900
                        ">
                            Agricultural Help Desk
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-slate-500
                        ">
                            Get help directly from an agricultural expert.
                        </p>

                    </div>

                </div>

                <div className="
                    grid
                    gap-6
                    lg:grid-cols-[340px_1fr]
                ">

                    {/* EXPERT LIST */}

                    <section className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    ">

                        <div className="
                            border-b
                            border-slate-100
                            p-5
                        ">

                            <h2 className="
                                font-semibold
                                text-slate-900
                            ">
                                Agricultural Experts
                            </h2>

                            <p className="
                                mt-1
                                text-xs
                                text-slate-500
                            ">
                                Choose an expert for support.
                            </p>

                        </div>

                        <div className="p-3">

                            {loading ? (

                                <div className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    p-8
                                    text-sm
                                    text-slate-500
                                ">

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Loading experts...

                                </div>

                            ) : agriculturalists.length === 0 ? (

                                <div className="
                                    p-8
                                    text-center
                                    text-sm
                                    text-slate-500
                                ">
                                    No agricultural experts are available.
                                </div>

                            ) : (

                                agriculturalists.map(
                                    (expert) => (

                                        <button
                                            key={expert.id}
                                            onClick={() =>
                                                setSelected(
                                                    expert
                                                )
                                            }
                                            className={`
                                                mb-2
                                                flex
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                p-4
                                                text-left
                                                ${
                                                    selected?.id ===
                                                    expert.id
                                                        ? "bg-emerald-50 ring-1 ring-emerald-200"
                                                        : "hover:bg-slate-50"
                                                }
                                            `}
                                        >

                                            <div className="
                                                flex
                                                h-11
                                                w-11
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-emerald-100
                                                text-emerald-700
                                            ">

                                                <UserRound size={20} />

                                            </div>

                                            <div className="
                                                min-w-0
                                                flex-1
                                            ">

                                                <p className="
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                    text-slate-900
                                                ">
                                                    {
                                                        expert.full_name
                                                    }
                                                </p>

                                                <p className="
                                                    mt-1
                                                    truncate
                                                    text-xs
                                                    text-slate-500
                                                ">
                                                    {
                                                        expert.specialization
                                                    }
                                                </p>

                                            </div>

                                        </button>

                                    )
                                )

                            )}

                        </div>

                    </section>

                    {/* CHAT */}

                    <section className="
                        flex
                        min-h-[650px]
                        flex-col
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    ">

                        {!selected ? (

                            <div className="
                                flex
                                flex-1
                                flex-col
                                items-center
                                justify-center
                                p-8
                                text-center
                            ">

                                <div className="
                                    mb-4
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-emerald-100
                                    text-emerald-700
                                ">

                                    <MessageCircle size={28} />

                                </div>

                                <h2 className="
                                    font-semibold
                                    text-slate-900
                                ">
                                    Choose an agricultural expert
                                </h2>

                                <p className="
                                    mt-2
                                    max-w-md
                                    text-sm
                                    text-slate-500
                                ">
                                    Select an agriculturalist from the left
                                    to start a conversation.
                                </p>

                            </div>

                        ) : (

                            <>

                                {/* HEADER */}

                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                    border-b
                                    border-slate-100
                                    p-5
                                ">

                                    <div className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-emerald-100
                                        text-emerald-700
                                    ">

                                        <Sprout size={21} />

                                    </div>

                                    <div>

                                        <h2 className="
                                            font-semibold
                                            text-slate-900
                                        ">
                                            {
                                                selected.full_name
                                            }
                                        </h2>

                                        <p className="
                                            text-xs
                                            text-emerald-600
                                        ">
                                            {
                                                selected.specialization
                                            }
                                        </p>

                                    </div>

                                </div>

                                {/* MESSAGES */}

                                <div className="
                                    flex-1
                                    space-y-4
                                    overflow-y-auto
                                    bg-slate-50/60
                                    p-5
                                ">

                                    {messages.length === 0 ? (

                                        <div className="
                                            flex
                                            h-full
                                            flex-col
                                            items-center
                                            justify-center
                                            text-center
                                        ">

                                            <MessageCircle
                                                size={28}
                                                className="
                                                    mb-3
                                                    text-emerald-600
                                                "
                                            />

                                            <h3 className="
                                                font-semibold
                                                text-slate-900
                                            ">
                                                Start a conversation
                                            </h3>

                                            <p className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                            ">
                                                Ask about your crops,
                                                soil, weather, or prediction.
                                            </p>

                                        </div>

                                    ) : (

                                        messages.map(
                                            (item) => (

                                                <div
                                                    key={item.id}
                                                    className="
                                                        flex
                                                        justify-start
                                                    "
                                                >

                                                    <div className="
                                                        max-w-[80%]
                                                        rounded-2xl
                                                        rounded-tl-sm
                                                        bg-white
                                                        px-4
                                                        py-3
                                                        shadow-sm
                                                        ring-1
                                                        ring-slate-100
                                                    ">

                                                        <p className="
                                                            text-sm
                                                            leading-6
                                                            text-slate-700
                                                        ">
                                                            {
                                                                item.message
                                                            }
                                                        </p>

                                                        <div className="
                                                            mt-2
                                                            flex
                                                            items-center
                                                            gap-1
                                                            text-[10px]
                                                            text-slate-400
                                                        ">

                                                            <Clock size={11} />

                                                            {
                                                                new Date(
                                                                    item.created_at
                                                                ).toLocaleString()
                                                            }

                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        )

                                    )}

                                </div>

                                {/* COMPOSER */}

                                <div className="
                                    border-t
                                    border-slate-100
                                    p-4
                                ">

                                    <div className="
                                        flex
                                        items-end
                                        gap-3
                                    ">

                                        <textarea
                                            value={message}
                                            onChange={(event) =>
                                                setMessage(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={(event) => {

                                                if (
                                                    event.key ===
                                                    "Enter" &&
                                                    !event.shiftKey
                                                ) {

                                                    event.preventDefault();

                                                    handleSend();

                                                }

                                            }}
                                            placeholder="
                                                Ask your agriculturalist...
                                            "
                                            rows={2}
                                            className="
                                                min-h-[56px]
                                                flex-1
                                                resize-none
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                px-4
                                                py-3
                                                text-sm
                                                outline-none
                                                focus:border-emerald-400
                                            "
                                        />

                                        <button
                                            onClick={
                                                handleSend
                                            }
                                            disabled={
                                                !message.trim() ||
                                                sending
                                            }
                                            className="
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-2xl
                                                bg-emerald-600
                                                text-white
                                                disabled:opacity-50
                                            "
                                        >

                                            {sending ? (

                                                <Loader2
                                                    size={19}
                                                    className="animate-spin"
                                                />

                                            ) : (

                                                <Send size={19} />

                                            )}

                                        </button>

                                    </div>

                                </div>

                            </>

                        )}

                    </section>

                </div>

            </div>

        </main>

    );

}