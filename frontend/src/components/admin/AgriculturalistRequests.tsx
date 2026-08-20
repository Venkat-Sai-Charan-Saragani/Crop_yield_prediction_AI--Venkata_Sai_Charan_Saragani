"use client";

// ============================================================
// AGRICULTURALIST REQUESTS
// frontend/src/components/admin/AgriculturalistRequests.tsx
// ============================================================

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    AgriculturalistRequest,
    getPendingAgriculturalists,
    approveAgriculturalist,
    rejectAgriculturalist,
} from "@/services/admin";

import {
    CircleCheck,
    CircleX,
    RefreshCw,
    Clock,
    User,
    Mail,
    MapPin,
    Briefcase,
    FileText,
    ShieldCheck,
} from "lucide-react";

// ============================================================
// PROPS
// ============================================================

interface AgriculturalistRequestsProps {
    onCountChange?: (count: number) => void;
}

// ============================================================
// COMPONENT
// ============================================================

export default function AgriculturalistRequests({
    onCountChange,
}: AgriculturalistRequestsProps) {

    // ========================================================
    // STATE
    // ========================================================

    const [
        agriculturalists,
        setAgriculturalists,
    ] = useState<AgriculturalistRequest[]>([]);

    const [
        loading,
        setLoading,
    ] = useState<boolean>(true);

    const [
        error,
        setError,
    ] = useState<string>("");

    const [
        processingId,
        setProcessingId,
    ] = useState<string | null>(null);

    const [
        rejectId,
        setRejectId,
    ] = useState<string | null>(null);

    const [
        rejectionReason,
        setRejectionReason,
    ] = useState<string>("");

    // ========================================================
    // GET AGRICULTURALIST ID
    // ========================================================

    const getAgriculturalistId = (
        agriculturalist: AgriculturalistRequest
    ): string => {

        return (
            agriculturalist.id ||
            agriculturalist._id ||
            ""
        );

    };

    // ========================================================
    // LOAD PENDING REQUESTS
    // ========================================================

    const loadRequests = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getPendingAgriculturalists();

                const list =
                    Array.isArray(
                        response.agriculturalists
                    )
                        ? response.agriculturalists
                        : [];

                setAgriculturalists(list);

                onCountChange?.(
                    list.length
                );

            } catch (err: unknown) {

                console.error(
                    "AGRICULTURALIST REQUEST ERROR:",
                    err
                );

                let message =
                    "Unable to load agriculturalist requests.";

                if (err instanceof Error) {
                    message = err.message;
                }

                setError(message);

                setAgriculturalists([]);

                onCountChange?.(0);

            } finally {

                setLoading(false);

            }

        },
        [onCountChange]
    );

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        void loadRequests();

    }, [loadRequests]);

    // ========================================================
    // APPROVE AGRICULTURALIST
    // ========================================================

    const handleApprove = async (
        agriculturalist: AgriculturalistRequest
    ): Promise<void> => {

        const id =
            getAgriculturalistId(
                agriculturalist
            );

        if (!id) {

            setError(
                "Agriculturalist ID is missing."
            );

            return;

        }

        const name =
            agriculturalist.full_name ||
            agriculturalist.name ||
            "this agriculturalist";

        const confirmed =
            window.confirm(
                `Are you sure you want to approve ${name}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setProcessingId(id);
            setError("");

            const response =
                await approveAgriculturalist(id);

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Unable to approve agriculturalist."
                );

            }

            // Remove approved request from UI
            setAgriculturalists(
                current => {

                    const updated =
                        current.filter(
                            item =>
                                getAgriculturalistId(
                                    item
                                ) !== id
                        );

                    onCountChange?.(
                        updated.length
                    );

                    return updated;

                }
            );

        } catch (err: unknown) {

            console.error(
                "APPROVE AGRICULTURALIST ERROR:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to approve agriculturalist."
            );

        } finally {

            setProcessingId(null);

        }

    };

    // ========================================================
    // OPEN REJECT FORM
    // ========================================================

    const openReject = (
        agriculturalist: AgriculturalistRequest
    ): void => {

        const id =
            getAgriculturalistId(
                agriculturalist
            );

        if (!id) {

            setError(
                "Agriculturalist ID is missing."
            );

            return;

        }

        setError("");
        setRejectId(id);
        setRejectionReason("");

    };

    // ========================================================
    // CANCEL REJECTION
    // ========================================================

    const cancelReject = (): void => {

        setRejectId(null);
        setRejectionReason("");
        setError("");

    };

    // ========================================================
    // REJECT AGRICULTURALIST
    // ========================================================

    const handleReject = async (): Promise<void> => {

        if (!rejectId) {

            setError(
                "Agriculturalist ID is missing."
            );

            return;

        }

        const reason =
            rejectionReason.trim();

        if (!reason) {

            setError(
                "Please enter a rejection reason."
            );

            return;

        }

        try {

            setProcessingId(rejectId);
            setError("");

            const response =
                await rejectAgriculturalist(
                    rejectId,
                    reason
                );

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Unable to reject agriculturalist."
                );

            }

            // Remove rejected request from UI
            setAgriculturalists(
                current => {

                    const updated =
                        current.filter(
                            item =>
                                getAgriculturalistId(
                                    item
                                ) !== rejectId
                        );

                    onCountChange?.(
                        updated.length
                    );

                    return updated;

                }
            );

            setRejectId(null);
            setRejectionReason("");

        } catch (err: unknown) {

            console.error(
                "REJECT AGRICULTURALIST ERROR:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to reject agriculturalist."
            );

        } finally {

            setProcessingId(null);

        }

    };

    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (
        value?: string
    ): string => {

        if (!value) {
            return "—";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };

    // ========================================================
    // LOADING UI
    // ========================================================

    if (loading) {

        return (

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Agriculturalist Verification
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Review agriculturalist registration requests.
                        </p>

                    </div>

                </div>

                <div className="mt-8 flex items-center justify-center py-12">

                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

                    <span className="ml-3 text-sm text-slate-500">
                        Loading requests...
                    </span>

                </div>

            </section>

        );

    }

    // ========================================================
    // MAIN UI
    // ========================================================

    return (

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <div className="flex flex-wrap items-center gap-3">

                        <div className="flex items-center gap-2">

                            <ShieldCheck
                                size={22}
                                className="text-emerald-600"
                            />

                            <h2 className="text-xl font-bold text-slate-900">
                                Agriculturalist Verification
                            </h2>

                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">

                            <Clock size={13} />

                            {agriculturalists.length} Pending

                        </span>

                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        Review submitted agriculturalist credentials and approve or reject applications.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => void loadRequests()}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    <RefreshCw
                        size={16}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <div className="font-semibold">
                        Something went wrong
                    </div>

                    <div className="mt-1">
                        {error}
                    </div>

                </div>

            )}

            {/* ==================================================
                EMPTY
            ================================================== */}

            {agriculturalists.length === 0 && (

                <div className="p-10 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">

                        <CircleCheck
                            size={30}
                            className="text-emerald-600"
                        />

                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                        No pending requests
                    </h3>

                    <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                        There are currently no agriculturalist applications waiting for verification.
                    </p>

                </div>

            )}

            {/* ==================================================
                REQUEST LIST
            ================================================== */}

            {agriculturalists.length > 0 && (

                <div className="divide-y divide-slate-200">

                    {agriculturalists.map(
                        agriculturalist => {

                            const id =
                                getAgriculturalistId(
                                    agriculturalist
                                );

                            const isProcessing =
                                processingId === id;

                            const isRejecting =
                                rejectId === id;

                            const fullName =
                                agriculturalist.full_name ||
                                agriculturalist.name ||
                                "Unnamed Agriculturalist";

                            const initial =
                                fullName
                                    .charAt(0)
                                    .toUpperCase();

                            return (

                                <article
                                    key={
                                        id ||
                                        `${fullName}-${agriculturalist.email || "unknown"}`
                                    }
                                    className="p-6 transition hover:bg-slate-50/50"
                                >

                                    {/* ==========================================
                                        TOP INFORMATION
                                    ========================================== */}

                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                        <div className="flex items-start gap-4">

                                            {/* AVATAR */}

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">

                                                {initial}

                                            </div>

                                            {/* NAME */}

                                            <div>

                                                <h3 className="text-lg font-bold text-slate-900">
                                                    {fullName}
                                                </h3>

                                                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                                                    <Mail size={14} />

                                                    <span>
                                                        {agriculturalist.email || "No email"}
                                                    </span>

                                                </div>

                                                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">

                                                    <Clock size={13} />

                                                    Pending Verification

                                                </span>

                                            </div>

                                        </div>

                                        {/* SUBMITTED DATE */}

                                        <div className="flex items-center gap-2 text-sm text-slate-500">

                                            <Clock size={15} />

                                            <span>
                                                Submitted:
                                            </span>

                                            <span className="font-semibold text-slate-700">
                                                {formatDate(
                                                    agriculturalist.verification_submitted_at ||
                                                    agriculturalist.created_at
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    {/* ==========================================
                                        DETAILS
                                    ========================================== */}

                                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                                        {/* SPECIALIZATION */}

                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                                            <div className="flex items-center gap-2">

                                                <Briefcase
                                                    size={15}
                                                    className="text-slate-400"
                                                />

                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Specialization
                                                </p>

                                            </div>

                                            <p className="mt-2 font-semibold text-slate-800">
                                                {agriculturalist.specialization ||
                                                    "Not provided"}
                                            </p>

                                        </div>

                                        {/* EXPERIENCE */}

                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                                            <div className="flex items-center gap-2">

                                                <User
                                                    size={15}
                                                    className="text-slate-400"
                                                />

                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Experience
                                                </p>

                                            </div>

                                            <p className="mt-2 font-semibold text-slate-800">
                                                {agriculturalist.experience_years ?? 0} years
                                            </p>

                                        </div>

                                        {/* GOVERNMENT ID */}

                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                                            <div className="flex items-center gap-2">

                                                <FileText
                                                    size={15}
                                                    className="text-slate-400"
                                                />

                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Government ID
                                                </p>

                                            </div>

                                            <p className="mt-2 break-all font-semibold text-slate-800">
                                                {agriculturalist.government_id ||
                                                    "Not provided"}
                                            </p>

                                        </div>

                                        {/* LOCATION */}

                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                                            <div className="flex items-center gap-2">

                                                <MapPin
                                                    size={15}
                                                    className="text-slate-400"
                                                />

                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Location
                                                </p>

                                            </div>

                                            <p className="mt-2 font-semibold text-slate-800">

                                                {agriculturalist.district &&
                                                agriculturalist.state
                                                    ? `${agriculturalist.district}, ${agriculturalist.state}`
                                                    : agriculturalist.district ||
                                                      agriculturalist.state ||
                                                      "Not provided"}

                                            </p>

                                        </div>

                                    </div>

                                    {/* ==========================================
                                        VERIFICATION DOCUMENT
                                    ========================================== */}

                                    {(
                                        agriculturalist.verification_document_name ||
                                        agriculturalist.issuing_authority ||
                                        agriculturalist.verification_document
                                    ) && (

                                        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

                                            <div className="flex items-center gap-2">

                                                <FileText
                                                    size={17}
                                                    className="text-blue-600"
                                                />

                                                <p className="text-sm font-bold text-blue-800">
                                                    Verification Details
                                                </p>

                                            </div>

                                            {agriculturalist.verification_document_name && (

                                                <p className="mt-3 text-sm text-slate-700">

                                                    Document:{" "}

                                                    <span className="font-semibold">
                                                        {
                                                            agriculturalist.verification_document_name
                                                        }
                                                    </span>

                                                </p>

                                            )}

                                            {agriculturalist.issuing_authority && (

                                                <p className="mt-1 text-sm text-slate-700">

                                                    Issuing Authority:{" "}

                                                    <span className="font-semibold">
                                                        {
                                                            agriculturalist.issuing_authority
                                                        }
                                                    </span>

                                                </p>

                                            )}

                                            {agriculturalist.verification_document && (

                                                <p className="mt-1 break-all text-sm text-slate-700">

                                                    Verification Document:{" "}

                                                    <span className="font-semibold">
                                                        {
                                                            agriculturalist.verification_document
                                                        }
                                                    </span>

                                                </p>

                                            )}

                                        </div>

                                    )}

                                    {/* ==========================================
                                        REJECTION FORM
                                    ========================================== */}

                                    {isRejecting && (

                                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5">

                                            <div className="flex items-start gap-3">

                                                <CircleX
                                                    size={20}
                                                    className="mt-0.5 shrink-0 text-red-600"
                                                />

                                                <div className="w-full">

                                                    <label
                                                        htmlFor={`rejection-${id}`}
                                                        className="text-sm font-semibold text-red-800"
                                                    >
                                                        Rejection reason
                                                    </label>

                                                    <p className="mt-1 text-xs text-red-600">
                                                        A reason is required before rejecting this application.
                                                    </p>

                                                    <textarea
                                                        id={`rejection-${id}`}
                                                        value={
                                                            rejectionReason
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setRejectionReason(
                                                                event.target.value
                                                            )
                                                        }
                                                        rows={4}
                                                        placeholder="Explain why this agriculturalist application is being rejected..."
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        className="mt-3 w-full resize-none rounded-xl border border-red-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                                    />

                                                    <div className="mt-3 flex flex-wrap gap-2">

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isProcessing ||
                                                                !rejectionReason.trim()
                                                            }
                                                            onClick={() =>
                                                                void handleReject()
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            <CircleX
                                                                size={16}
                                                            />

                                                            {isProcessing
                                                                ? "Rejecting..."
                                                                : "Confirm Rejection"}

                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isProcessing
                                                            }
                                                            onClick={
                                                                cancelReject
                                                            }
                                                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    )}

                                    {/* ==========================================
                                        ACTION BUTTONS
                                    ========================================== */}

                                    {!isRejecting && (

                                        <div className="mt-6 flex flex-wrap gap-3">

                                            {/* APPROVE */}

                                            <button
                                                type="button"
                                                disabled={
                                                    isProcessing ||
                                                    !id
                                                }
                                                onClick={() =>
                                                    void handleApprove(
                                                        agriculturalist
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                <CircleCheck
                                                    size={17}
                                                />

                                                {isProcessing
                                                    ? "Processing..."
                                                    : "Approve"}

                                            </button>

                                            {/* REJECT */}

                                            <button
                                                type="button"
                                                disabled={
                                                    isProcessing ||
                                                    !id
                                                }
                                                onClick={() =>
                                                    openReject(
                                                        agriculturalist
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                <CircleX
                                                    size={17}
                                                />

                                                Reject

                                            </button>

                                        </div>

                                    )}

                                </article>

                            );

                        }
                    )}

                </div>

            )}

        </section>

    );

}