"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Bell,
    Sprout,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";

import {
    getNotifications,
    markNotificationRead,
    AgriculturalistNotification,
} from "@/services/agriculturalist";

import {
    useRouter,
} from "next/navigation";


export default function NotificationsPage() {

    const router =
        useRouter();

    const [
        notifications,
        setNotifications
    ] = useState<
        AgriculturalistNotification[]
    >([]);

    const [
        loading,
        setLoading
    ] = useState(true);


    const loadNotifications =
        async () => {

            try {

                const response =
                    await getNotifications();

                setNotifications(
                    response.notifications || []
                );

            } catch (error) {

                console.error(
                    "NOTIFICATIONS ERROR:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };


    useEffect(() => {

        loadNotifications();

        const interval =
            window.setInterval(
                loadNotifications,
                10000
            );

        return () =>
            window.clearInterval(
                interval
            );

    }, []);


    const markRead =
        async (
            notification:
                AgriculturalistNotification
        ) => {

            if (
                notification.is_read
            ) {
                return;
            }

            try {

                await markNotificationRead(
                    notification.id
                );

                setNotifications(
                    current =>
                        current.map(
                            item =>
                                item.id ===
                                notification.id
                                    ? {
                                        ...item,
                                        is_read: true
                                    }
                                    : item
                        )
                );

            } catch (error) {

                console.error(
                    error
                );

            }
        };


    return (

        <main className="
            min-h-screen
            bg-slate-50
            px-4
            py-8
            md:px-8
        ">

            <div className="
                mx-auto
                max-w-4xl
            ">

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

                        <Bell
                            size={26}
                        />

                    </div>

                    <div>

                        <h1 className="
                            text-2xl
                            font-bold
                            text-slate-900
                        ">
                            Notifications
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-slate-500
                        ">
                            Updates from your agricultural
                            support team.
                        </p>

                    </div>

                </div>


                <div className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                ">

                    {loading ? (

                        <div className="
                            p-12
                            text-center
                            text-sm
                            text-slate-500
                        ">
                            Loading notifications...
                        </div>

                    ) : notifications.length === 0 ? (

                        <div className="
                            p-12
                            text-center
                        ">

                            <Bell
                                size={40}
                                className="
                                    mx-auto
                                    text-slate-300
                                "
                            />

                            <h2 className="
                                mt-4
                                font-semibold
                                text-slate-900
                            ">
                                No notifications yet
                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">
                                Your agricultural support updates
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        notifications.map(
                            notification => (

                                <button
                                    key={
                                        notification.id
                                    }
                                    onClick={
                                        async () => {

                                            await markRead(
                                                notification
                                            );

                                            router.push(
                                                "/agriculturalist"
                                            );

                                        }
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-start
                                        gap-4
                                        border-b
                                        border-slate-100
                                        p-5
                                        text-left
                                        transition
                                        hover:bg-slate-50
                                    "
                                >

                                    <div className={`
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        ${
                                            notification.is_read
                                                ? "bg-slate-100 text-slate-500"
                                                : "bg-emerald-100 text-emerald-700"
                                        }
                                    `}>

                                        {notification.is_read
                                            ? (
                                                <CheckCircle2
                                                    size={20}
                                                />
                                            )
                                            : (
                                                <Sprout
                                                    size={20}
                                                />
                                            )}

                                    </div>

                                    <div className="
                                        min-w-0
                                        flex-1
                                    ">

                                        <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-4
                                        ">

                                            <h3 className="
                                                font-semibold
                                                text-slate-900
                                            ">
                                                {
                                                    notification.title
                                                }
                                            </h3>

                                            {!notification.is_read && (

                                                <span className="
                                                    h-2
                                                    w-2
                                                    shrink-0
                                                    rounded-full
                                                    bg-emerald-500
                                                " />

                                            )}

                                        </div>

                                        <p className="
                                            mt-1
                                            text-sm
                                            leading-6
                                            text-slate-500
                                        ">
                                            {
                                                notification.message
                                            }
                                        </p>

                                        <p className="
                                            mt-2
                                            text-xs
                                            text-slate-400
                                        ">
                                            {notification.created_at
                                                ? new Date(
                                                    notification.created_at
                                                ).toLocaleString()
                                                : "Date unavailable"}
                                        </p>

                                    </div>

                                    <ArrowRight
                                        size={18}
                                        className="
                                            mt-2
                                            shrink-0
                                            text-slate-300
                                        "
                                    />

                                </button>

                            )
                        )

                    )}

                </div>

            </div>

        </main>
    );
}