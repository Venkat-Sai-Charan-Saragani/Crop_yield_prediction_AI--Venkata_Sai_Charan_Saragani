"use client";

import {
    Bell,
    Menu,
    Search,
    ShieldCheck,
} from "lucide-react";

import {
    getAdminEmail,
} from "@/utils/auth";

import {
    useEffect,
    useState,
} from "react";


interface AdminTopbarProps {

    onMenuClick: () => void;
}


export default function AdminTopbar({
    onMenuClick,
}: AdminTopbarProps) {

    const [
        email,
        setEmail,
    ] = useState(
        "Administrator"
    );


    useEffect(() => {

        setEmail(
            getAdminEmail() ||
            "Administrator"
        );

    }, []);


    return (

        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">

            <div className="flex items-center gap-3">

                <button

                    type="button"

                    onClick={onMenuClick}

                    className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"

                >

                    <Menu size={20} />

                </button>


                <div className="hidden md:block">

                    <div className="flex items-center gap-2 text-xs text-slate-400">

                        <ShieldCheck
                            size={14}
                            className="text-emerald-600"
                        />

                        Secure Administrator Console

                    </div>

                </div>

            </div>


            <div className="flex items-center gap-3">

                <div className="hidden md:flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">

                    <Search
                        size={16}
                        className="text-slate-400"
                    />

                    <span className="ml-2 text-xs text-slate-400">
                        Search from management pages
                    </span>

                </div>


                <button

                    type="button"

                    className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"

                    aria-label="Notifications"

                >

                    <Bell size={18} />

                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />

                </button>


                <div className="flex items-center gap-3 border-l border-slate-200 pl-3">

                    <div className="hidden text-right sm:block">

                        <p className="max-w-[180px] truncate text-xs font-semibold text-slate-800">
                            {email}
                        </p>

                        <p className="text-[10px] font-medium text-emerald-600">
                            Administrator
                        </p>

                    </div>


                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">

                        <ShieldCheck
                            size={19}
                        />

                    </div>

                </div>

            </div>

        </header>
    );
}