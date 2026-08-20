"use client";

import {
    AlertTriangle,
    Loader2,
    X,
} from "lucide-react";


interface ConfirmDialogProps {

    open: boolean;

    title: string;

    description: string;

    confirmText?: string;

    loading?: boolean;

    onConfirm: () => void;

    onCancel: () => void;
}


export default function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Confirm",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {

    if (!open) {
        return null;
    }


    return (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

                <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">

                        <AlertTriangle
                            size={21}
                        />

                    </div>


                    <button

                        type="button"

                        onClick={onCancel}

                        disabled={loading}

                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"

                    >

                        <X size={19} />

                    </button>

                </div>


                <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    {description}
                </p>


                <div className="mt-6 flex justify-end gap-3">

                    <button

                        type="button"

                        onClick={onCancel}

                        disabled={loading}

                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"

                    >
                        Cancel
                    </button>


                    <button

                        type="button"

                        onClick={onConfirm}

                        disabled={loading}

                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"

                    >

                        {loading && (

                            <Loader2
                                size={16}
                                className="animate-spin"
                            />

                        )}

                        {loading
                            ? "Deleting..."
                            : confirmText}

                    </button>

                </div>

            </div>

        </div>
    );
}