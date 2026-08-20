"use client";

import {
    Bell,
    Menu,
    Search,
} from "lucide-react";


interface AdminNavbarProps {

    onMenuClick: () => void;

    search: string;

    setSearch: (
        value: string
    ) => void;
}


export default function AdminNavbar({
    onMenuClick,
    search,
    setSearch,
}: AdminNavbarProps) {

    return (

        <header className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur border-b border-gray-200">

            <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

                {/* ==================================================
                    LEFT
                ================================================== */}

                <div className="flex items-center gap-4">

                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    >

                        <Menu size={22} />

                    </button>


                    <div className="hidden md:block">

                        <p className="text-xs text-gray-400">
                            Administration
                        </p>

                        <p className="font-semibold text-gray-900">
                            YieldSenseAI Control Center
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div className="flex-1 max-w-md">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />


                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search dashboard..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                        />

                    </div>

                </div>


                {/* ==================================================
                    RIGHT
                ================================================== */}

                <div className="flex items-center gap-3">

                    <button
                        className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600"
                    >

                        <Bell size={20} />

                        <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />

                    </button>


                    <div className="hidden sm:flex items-center gap-3 pl-3 border-l">

                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">

                            A

                        </div>


                        <div>

                            <p className="text-sm font-semibold text-gray-900">
                                Administrator
                            </p>

                            <p className="text-xs text-gray-400">
                                Admin
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </header>

    );

}