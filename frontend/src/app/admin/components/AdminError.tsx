"use client";

import {
    AlertTriangle,
    RefreshCw,
} from "lucide-react";


export default function AdminError({
    message,
    onRetry,
}: {
    message: string;
    onRetry?: () => void;
}) {

    return (

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">

                    <AlertTriangle
                        size={18}
                    />

                </div>


                <div className="flex-1">

                    <p className="font-semibold text-red-900">
                        Unable to load data
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                        {message}
                    </p>


                    {onRetry && (

                        <button

                            type="button"

                            onClick={onRetry}

                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm ring-1 ring-red-200 hover:bg-red-50"

                        >

                            <RefreshCw
                                size={14}
                            />

                            Try again

                        </button>

                    )}

                </div>

            </div>

        </div>
    );
}