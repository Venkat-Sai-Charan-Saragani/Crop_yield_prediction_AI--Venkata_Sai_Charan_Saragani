"use client";

import {
    ReactNode,
} from "react";

import {
    ArrowDownRight,
    ArrowUpRight,
} from "lucide-react";


interface AdminStatCardProps {

    title: string;

    value: string | number;

    description: string;

    icon: ReactNode;

    iconClassName?: string;

    trend?: string;
}


export default function AdminStatCard({
    title,
    value,
    description,
    icon,
    iconClassName = "bg-emerald-50 text-emerald-600",
    trend,
}: AdminStatCardProps) {

    return (

        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                        {value}
                    </p>

                </div>


                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}>

                    {icon}

                </div>

            </div>


            <div className="mt-4 flex items-center justify-between gap-2">

                <p className="text-xs text-slate-500">
                    {description}
                </p>

                {trend && (

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">

                        <ArrowUpRight
                            size={11}
                        />

                        {trend}

                    </span>

                )}

            </div>

        </div>
    );
}