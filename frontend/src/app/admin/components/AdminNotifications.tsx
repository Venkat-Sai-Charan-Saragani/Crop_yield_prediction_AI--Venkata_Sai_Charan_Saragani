"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Bell,
    Users,
    Sprout,
    Wheat,
    BrainCircuit,
    CheckCircle2,
    AlertCircle,
    X,
} from "lucide-react";

import type {
    AdminUser,
    AdminFarm,
    AdminCrop,
    AdminPrediction,
} from "@/services/admin";


interface AdminNotificationsProps {
    users: AdminUser[];
    farms: AdminFarm[];
    crops: AdminCrop[];
    predictions: AdminPrediction[];
}


interface NotificationItem {
    id: string;

    title: string;

    message: string;

    type:
        | "users"
        | "farms"
        | "crops"
        | "predictions"
        | "system";

    time: string;
}


export default function AdminNotifications({

    users,

    farms,

    crops,

    predictions,

}: AdminNotificationsProps) {

    const [
        open,
        setOpen,
    ] = useState(false);


    const [
        notifications,
        setNotifications,
    ] = useState<NotificationItem[]>([]);


    const containerRef =
        useRef<HTMLDivElement | null>(
            null
        );


    // ========================================================
    // GENERATE NOTIFICATIONS
    // ========================================================

    useEffect(() => {

        const generated: NotificationItem[] = [];


        if (users.length > 0) {

            generated.push({

                id: "users",

                title: "User activity",

                message:
                    `${users.length} registered user${users.length === 1 ? "" : "s"} found on the platform.`,

                type: "users",

                time: "Current",

            });

        }


        if (farms.length > 0) {

            generated.push({

                id: "farms",

                title: "Farm activity",

                message:
                    `${farms.length} farm${farms.length === 1 ? "" : "s"} currently registered.`,

                type: "farms",

                time: "Current",

            });

        }


        if (crops.length > 0) {

            generated.push({

                id: "crops",

                title: "Crop activity",

                message:
                    `${crops.length} crop record${crops.length === 1 ? "" : "s"} currently tracked.`,

                type: "crops",

                time: "Current",

            });

        }


        if (predictions.length > 0) {

            generated.push({

                id: "predictions",

                title: "AI prediction activity",

                message:
                    `${predictions.length} prediction${predictions.length === 1 ? "" : "s"} generated.`,

                type: "predictions",

                time: "Current",

            });

        }


        if (
            users.length === 0 &&
            farms.length === 0 &&
            crops.length === 0 &&
            predictions.length === 0
        ) {

            generated.push({

                id: "system",

                title: "System status",

                message:
                    "No management records are currently available.",

                type: "system",

                time: "Current",

            });

        }


        setNotifications(
            generated
        );

    }, [
        users,
        farms,
        crops,
        predictions,
    ]);


    // ========================================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ========================================================

    useEffect(() => {

        const handleOutsideClick = (
            event: MouseEvent
        ) => {

            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {

                setOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    const getIcon = (
        type: NotificationItem["type"]
    ) => {

        if (type === "users") {

            return (
                <Users
                    size={18}
                />
            );

        }


        if (type === "farms") {

            return (
                <Sprout
                    size={18}
                />
            );

        }


        if (type === "crops") {

            return (
                <Wheat
                    size={18}
                />
            );

        }


        if (type === "predictions") {

            return (
                <BrainCircuit
                    size={18}
                />
            );

        }


        return (
            <CheckCircle2
                size={18}
            />
        );

    };


    return (

        <div
            ref={containerRef}
            className="relative"
        >

            {/* ================================================= */}
            {/* BELL */}
            {/* ================================================= */}

            <button

                type="button"

                onClick={() =>
                    setOpen(
                        !open
                    )
                }

                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"

                aria-label="Notifications"

            >

                <Bell
                    size={19}
                />


                {notifications.length > 0 && (

                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">

                        {notifications.length > 9
                            ? "9+"
                            : notifications.length
                        }

                    </span>

                )}

            </button>


            {/* ================================================= */}
            {/* DROPDOWN */}
            {/* ================================================= */}

            {open && (

                <div className="absolute right-0 top-14 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                    {/* HEADER */}

                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                        <div>

                            <h3 className="font-bold text-slate-900">

                                Notifications

                            </h3>

                            <p className="mt-0.5 text-xs text-slate-500">

                                Current platform activity

                            </p>

                        </div>


                        <button

                            type="button"

                            onClick={() =>
                                setOpen(false)
                            }

                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"

                        >

                            <X
                                size={17}
                            />

                        </button>

                    </div>


                    {/* CONTENT */}

                    <div className="max-h-[420px] overflow-y-auto">

                        {notifications.length === 0 ? (

                            <div className="px-6 py-10 text-center">

                                <Bell
                                    size={28}
                                    className="mx-auto text-slate-300"
                                />

                                <p className="mt-3 text-sm font-medium text-slate-700">

                                    No notifications

                                </p>

                                <p className="mt-1 text-xs text-slate-400">

                                    Everything looks quiet right now.

                                </p>

                            </div>

                        ) : (

                            notifications.map(
                                (
                                    notification
                                ) => (

                                    <div

                                        key={
                                            notification.id
                                        }

                                        className="flex gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 hover:bg-slate-50"

                                    >

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                            {getIcon(
                                                notification.type
                                            )}

                                        </div>


                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-start justify-between gap-3">

                                                <p className="text-sm font-semibold text-slate-800">

                                                    {
                                                        notification.title
                                                    }

                                                </p>


                                                <span className="shrink-0 text-[10px] text-slate-400">

                                                    {
                                                        notification.time
                                                    }

                                                </span>

                                            </div>


                                            <p className="mt-1 text-xs leading-5 text-slate-500">

                                                {
                                                    notification.message
                                                }

                                            </p>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>


                    {/* FOOTER */}

                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">

                        <div className="flex items-center gap-2 text-xs text-slate-500">

                            <AlertCircle
                                size={14}
                            />

                            Notifications are generated from current admin data.

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}