"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Check,
    CheckCircle2,
    Clock,
    FileText,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Search,
    ShieldCheck,
    User,
    X,
    XCircle,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";


import {
    AgriculturalistRequest,
    getAdminAgriculturalists,
    approveAgriculturalist,
    rejectAgriculturalist,
} from "@/services/admin";
import AdminNavbar from "../components/AdminNavbar";


// ============================================================
// HELPERS
// ============================================================

function formatDate(value?: string | null) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}


function getName(
    agriculturalist: AgriculturalistRequest
) {
    return (
        agriculturalist.full_name ||
        agriculturalist.name ||
        "Unknown Applicant"
    );
}


function getPhone(
    agriculturalist: AgriculturalistRequest
) {
    return (
        agriculturalist.phone_number ||
        agriculturalist.phone ||
        "Not available"
    );
}


function getLocation(
    agriculturalist: AgriculturalistRequest
) {
    if (
        typeof agriculturalist.location ===
        "string"
    ) {
        return agriculturalist.location;
    }

    if (
        agriculturalist.location &&
        typeof agriculturalist.location ===
            "object"
    ) {
        const parts = [
            agriculturalist.location.village,
            agriculturalist.location.district,
            agriculturalist.location.state,
        ].filter(Boolean);

        if (parts.length) {
            return parts.join(", ");
        }
    }

    const parts = [
        agriculturalist.district,
        agriculturalist.state,
    ].filter(Boolean);

    return parts.length
        ? parts.join(", ")
        : "Not available";
}


// ============================================================
// PAGE
// ============================================================

export default function AgriculturalistApprovalPage() {

    const [
        agriculturalists,
        setAgriculturalists,
    ] = useState<AgriculturalistRequest[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        filter,
        setFilter,
    ] = useState<
        "all" | "pending" | "active" | "rejected"
    >("pending");

    const [
        selected,
        setSelected,
    ] = useState<AgriculturalistRequest | null>(
        null
    );

    const [
        rejectionReason,
        setRejectionReason,
    ] = useState("");

    const [
        showRejectBox,
        setShowRejectBox,
    ] = useState(false);

    const [
        actionLoading,
        setActionLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");


    // ========================================================
    // LOAD
    // ========================================================

    async function loadData(
        refresh = false
    ) {

        try {

            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response =
                await getAdminAgriculturalists();

            setAgriculturalists(
                response.agriculturalists
            );

        } catch (error) {

            console.error(
                "AGRICULTURALIST ADMIN LOAD ERROR:",
                error
            );

            setError(
                "Unable to load agriculturalist applications."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    }


    useEffect(() => {

        loadData();

    }, []);


    // ========================================================
    // COUNTS
    // ========================================================

    const counts = useMemo(() => {

        return {

            all: agriculturalists.length,

            pending:
                agriculturalists.filter(
                    item =>
                        item.status?.toLowerCase() ===
                        "pending"
                ).length,

            active:
                agriculturalists.filter(
                    item =>
                        item.status?.toLowerCase() ===
                        "active"
                ).length,

            rejected:
                agriculturalists.filter(
                    item =>
                        item.status?.toLowerCase() ===
                        "rejected"
                ).length,

        };

    }, [agriculturalists]);


    // ========================================================
    // FILTER
    // ========================================================

    const filtered = useMemo(() => {

        const value =
            search.trim().toLowerCase();

        return agriculturalists.filter(
            item => {

                const status =
                    item.status?.toLowerCase();

                if (
                    filter !== "all" &&
                    status !== filter
                ) {
                    return false;
                }

                if (!value) {
                    return true;
                }

                return (
                    getName(item)
                        .toLowerCase()
                        .includes(value) ||

                    item.email
                        ?.toLowerCase()
                        .includes(value) ||

                    item.specialization
                        ?.toLowerCase()
                        .includes(value) ||

                    item.district
                        ?.toLowerCase()
                        .includes(value)
                );

            }
        );

    }, [
        agriculturalists,
        filter,
        search,
    ]);


    // ========================================================
    // APPROVE
    // ========================================================

    async function handleApprove() {

        if (!selected) {
            return;
        }

        const confirmed =
            window.confirm(
                `Approve ${getName(selected)}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            setError("");
            setSuccess("");

            const response =
                await approveAgriculturalist(
                    selected.id
                );

            setSuccess(
                response.message ||
                "Agriculturalist approved successfully."
            );

            setSelected(null);

            await loadData(true);

        } catch (error) {

            console.error(
                "AGRICULTURALIST APPROVE ERROR:",
                error
            );

            setError(
                "Unable to approve agriculturalist."
            );

        } finally {

            setActionLoading(false);

        }
    }


    // ========================================================
    // REJECT
    // ========================================================

    async function handleReject() {

        if (!selected) {
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

            setActionLoading(true);

            setError("");
            setSuccess("");

            const response =
                await rejectAgriculturalist(
                    selected.id,
                    reason
                );

            setSuccess(
                response.message ||
                "Agriculturalist rejected successfully."
            );

            setSelected(null);

            setShowRejectBox(false);

            setRejectionReason("");

            await loadData(true);

        } catch (error) {

            console.error(
                "AGRICULTURALIST REJECT ERROR:",
                error
            );

            setError(
                "Unable to reject agriculturalist."
            );

        } finally {

            setActionLoading(false);

        }
    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <div
            className="
                min-h-screen
                bg-slate-50
            "
        >

            <div className="flex min-h-screen">

                {/* SIDEBAR */}

                <AdminSidebar />


                {/* CONTENT */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >


                    <main
                        className="
                            ml-[320px]
                            min-h-screen
                            w-[calc(100%-32)]
                        "
                    >

                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div
                            className="
                                mb-6
                                rounded-3xl
                                bg-gradient-to-r
                                from-emerald-700
                                to-emerald-900
                                p-6
                                text-white
                                shadow-xl
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-5
                                    md:flex-row
                                    md:items-center
                                    md:justify-between
                                "
                            >

                                <div>

                                    <div
                                        className="
                                            mb-2
                                            flex
                                            items-center
                                            gap-2
                                            text-emerald-200
                                        "
                                    >

                                        <ShieldCheck
                                            size={20}
                                        />

                                        <span
                                            className="
                                                text-sm
                                                font-semibold
                                            "
                                        >
                                            ADMINISTRATION
                                        </span>

                                    </div>


                                    <h1
                                        className="
                                            text-3xl
                                            font-black
                                        "
                                    >
                                        Agriculturalist Approvals
                                    </h1>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-emerald-100
                                        "
                                    >
                                        Review and manage agriculturalist
                                        registration applications.
                                    </p>

                                </div>


                                <button
                                    onClick={() =>
                                        loadData(true)
                                    }
                                    disabled={refreshing}
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-white
                                        px-5
                                        py-3
                                        text-sm
                                        font-bold
                                        text-emerald-800
                                        transition
                                        hover:bg-emerald-50
                                        disabled:opacity-50
                                    "
                                >

                                    <Loader2
                                        size={17}
                                        className={
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    Refresh

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            MESSAGES
                        ================================================= */}

                        {error && (

                            <div
                                className="
                                    mb-5
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-red-700
                                "
                            >
                                {error}
                            </div>

                        )}


                        {success && (

                            <div
                                className="
                                    mb-5
                                    rounded-xl
                                    border
                                    border-emerald-200
                                    bg-emerald-50
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-emerald-700
                                "
                            >
                                {success}
                            </div>

                        )}


                        {/* =================================================
                            STATS
                        ================================================= */}

                        <div
                            className="
                                mb-6
                                grid
                                grid-cols-2
                                gap-4
                                lg:grid-cols-4
                            "
                        >

                            <Stat
                                title="Total"
                                value={counts.all}
                                icon={FileText}
                            />

                            <Stat
                                title="Pending"
                                value={counts.pending}
                                icon={Clock}
                            />

                            <Stat
                                title="Approved"
                                value={counts.active}
                                icon={CheckCircle2}
                            />

                            <Stat
                                title="Rejected"
                                value={counts.rejected}
                                icon={XCircle}
                            />

                        </div>


                        {/* =================================================
                            MAIN CARD
                        ================================================= */}

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

                            {/* TOOLBAR */}

                            <div
                                className="
                                    border-b
                                    border-slate-100
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-4
                                        lg:flex-row
                                        lg:items-center
                                        lg:justify-between
                                    "
                                >

                                    {/* FILTERS */}

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >

                                        <Filter
                                            label="All"
                                            count={counts.all}
                                            active={
                                                filter === "all"
                                            }
                                            onClick={() =>
                                                setFilter("all")
                                            }
                                        />

                                        <Filter
                                            label="Pending"
                                            count={counts.pending}
                                            active={
                                                filter === "pending"
                                            }
                                            onClick={() =>
                                                setFilter("pending")
                                            }
                                        />

                                        <Filter
                                            label="Approved"
                                            count={counts.active}
                                            active={
                                                filter === "active"
                                            }
                                            onClick={() =>
                                                setFilter("active")
                                            }
                                        />

                                        <Filter
                                            label="Rejected"
                                            count={counts.rejected}
                                            active={
                                                filter === "rejected"
                                            }
                                            onClick={() =>
                                                setFilter("rejected")
                                            }
                                        />

                                    </div>


                                    {/* SEARCH */}

                                    <div
                                        className="
                                            relative
                                            w-full
                                            lg:max-w-sm
                                        "
                                    >

                                        <Search
                                            size={18}
                                            className="
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-slate-400
                                            "
                                        />

                                        <input
                                            value={search}
                                            onChange={e =>
                                                setSearch(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="
                                                Search agriculturalists...
                                            "
                                            className="
                                                h-11
                                                w-full
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                pl-10
                                                pr-4
                                                text-sm
                                                outline-none
                                                focus:border-emerald-400
                                                focus:ring-4
                                                focus:ring-emerald-500/10
                                            "
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* CONTENT */}

                            {loading ? (

                                <div
                                    className="
                                        flex
                                        min-h-[400px]
                                        items-center
                                        justify-center
                                    "
                                >

                                    <Loader2
                                        size={30}
                                        className="
                                            animate-spin
                                            text-emerald-600
                                        "
                                    />

                                </div>

                            ) : filtered.length === 0 ? (

                                <div
                                    className="
                                        flex
                                        min-h-[400px]
                                        flex-col
                                        items-center
                                        justify-center
                                        px-6
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
                                            bg-emerald-50
                                            text-emerald-600
                                        "
                                    >

                                        <CheckCircle2
                                            size={30}
                                        />

                                    </div>


                                    <h3
                                        className="
                                            mt-4
                                            text-lg
                                            font-bold
                                        "
                                    >
                                        No applications found
                                    </h3>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-slate-500
                                        "
                                    >
                                        There are no applications
                                        matching your filter.
                                    </p>

                                </div>

                            ) : (

                                <div
                                    className="
                                        divide-y
                                        divide-slate-100
                                    "
                                >

                                    {filtered.map(
                                        agriculturalist => (

                                            <ApplicationRow
                                                key={
                                                    agriculturalist.id
                                                }
                                                agriculturalist={
                                                    agriculturalist
                                                }
                                                onReview={() =>
                                                    setSelected(
                                                        agriculturalist
                                                    )
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            )}

                        </section>

                    </main>

                </div>

            </div>


            {/* =========================================================
                DETAILS MODAL
            ========================================================= */}

            {selected && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-slate-950/60
                        p-4
                        backdrop-blur-sm
                    "
                >

                    <div
                        className="
                            flex
                            max-h-[92vh]
                            w-full
                            max-w-3xl
                            flex-col
                            overflow-hidden
                            rounded-3xl
                            bg-white
                            shadow-2xl
                        "
                    >

                        {/* HEADER */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-slate-100
                                px-6
                                py-5
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-widest
                                        text-emerald-600
                                    "
                                >
                                    Application Review
                                </p>

                                <h2
                                    className="
                                        mt-1
                                        text-xl
                                        font-black
                                        text-slate-950
                                    "
                                >
                                    {getName(selected)}
                                </h2>

                            </div>


                            <button
                                onClick={() =>
                                    setSelected(null)
                                }
                                disabled={actionLoading}
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-slate-100
                                    text-slate-500
                                    hover:bg-slate-200
                                "
                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        {/* DETAILS */}

                        <div
                            className="
                                overflow-y-auto
                                p-6
                            "
                        >

                            <div
                                className="
                                    mb-6
                                    rounded-2xl
                                    bg-emerald-50
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-4
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
                                            bg-emerald-600
                                            text-2xl
                                            font-black
                                            text-white
                                        "
                                    >
                                        {getName(selected)
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>


                                    <div>

                                        <h3
                                            className="
                                                text-xl
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            {getName(selected)}
                                        </h3>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                            "
                                        >
                                            {selected.email}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div
                                className="
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                "
                            >

                                <Info
                                    icon={User}
                                    label="Full Name"
                                    value={getName(selected)}
                                />

                                <Info
                                    icon={Mail}
                                    label="Email"
                                    value={
                                        selected.email ||
                                        "Not available"
                                    }
                                />

                                <Info
                                    icon={Phone}
                                    label="Phone"
                                    value={getPhone(selected)}
                                />

                                <Info
                                    icon={MapPin}
                                    label="Location"
                                    value={getLocation(selected)}
                                />

                                <Info
                                    icon={ShieldCheck}
                                    label="Specialization"
                                    value={
                                        selected.specialization ||
                                        "Not available"
                                    }
                                />

                                <Info
                                    icon={Clock}
                                    label="Experience"
                                    value={
                                        selected.experience_years !==
                                        undefined
                                            ? `${selected.experience_years} years`
                                            : "Not available"
                                    }
                                />

                                <Info
                                    icon={FileText}
                                    label="Government ID"
                                    value={
                                        selected.government_id ||
                                        "Not available"
                                    }
                                />

                                <Info
                                    icon={ShieldCheck}
                                    label="Issuing Authority"
                                    value={
                                        selected.issuing_authority ||
                                        "Not available"
                                    }
                                />

                            </div>


                            {/* DOCUMENT */}

                            <div
                                className="
                                    mt-6
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    p-5
                                "
                            >

                                <h3
                                    className="
                                        mb-3
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Verification Document
                                </h3>


                                <p
                                    className="
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    {
                                        selected.verification_document_name ||
                                        "No document name available"
                                    }
                                </p>


                                {selected.verification_document && (

                                    <a
                                        href={
                                            selected.verification_document
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            mt-4
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            bg-emerald-600
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-bold
                                            text-white
                                            hover:bg-emerald-700
                                        "
                                    >

                                        <FileText
                                            size={16}
                                        />

                                        Open Document

                                    </a>

                                )}

                            </div>


                            {/* REJECTION REASON */}

                            {showRejectBox && (

                                <div
                                    className="
                                        mt-6
                                        rounded-2xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        p-5
                                    "
                                >

                                    <label
                                        className="
                                            text-sm
                                            font-bold
                                            text-red-800
                                        "
                                    >
                                        Rejection Reason
                                    </label>


                                    <textarea
                                        value={
                                            rejectionReason
                                        }
                                        onChange={e =>
                                            setRejectionReason(
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                        placeholder="
                                            Enter the reason for rejection...
                                        "
                                        className="
                                            mt-3
                                            w-full
                                            resize-none
                                            rounded-xl
                                            border
                                            border-red-200
                                            bg-white
                                            p-3
                                            text-sm
                                            outline-none
                                            focus:ring-4
                                            focus:ring-red-500/10
                                        "
                                    />


                                    <div
                                        className="
                                            mt-3
                                            flex
                                            justify-end
                                            gap-2
                                        "
                                    >

                                        <button
                                            onClick={() =>
                                                setShowRejectBox(
                                                    false
                                                )
                                            }
                                            className="
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-white
                                                px-4
                                                py-2
                                                text-sm
                                                font-semibold
                                            "
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            onClick={
                                                handleReject
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-xl
                                                bg-red-600
                                                px-4
                                                py-2
                                                text-sm
                                                font-bold
                                                text-white
                                                hover:bg-red-700
                                                disabled:opacity-50
                                            "
                                        >

                                            {actionLoading && (
                                                <Loader2
                                                    size={15}
                                                    className="animate-spin"
                                                />
                                            )}

                                            Confirm Reject

                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* ACTIONS */}

                        {selected.status
                            ?.toLowerCase() ===
                            "pending" &&
                            !showRejectBox && (

                            <div
                                className="
                                    flex
                                    flex-col-reverse
                                    gap-3
                                    border-t
                                    border-slate-100
                                    p-5
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >

                                <button
                                    onClick={() =>
                                        setShowRejectBox(
                                            true
                                        )
                                    }
                                    disabled={actionLoading}
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        px-5
                                        py-3
                                        text-sm
                                        font-bold
                                        text-red-700
                                        hover:bg-red-100
                                    "
                                >

                                    <XCircle
                                        size={17}
                                    />

                                    Reject

                                </button>


                                <button
                                    onClick={
                                        handleApprove
                                    }
                                    disabled={
                                        actionLoading
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
                                        font-bold
                                        text-white
                                        hover:bg-emerald-700
                                        disabled:opacity-50
                                    "
                                >

                                    {actionLoading ? (
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Check
                                            size={17}
                                        />
                                    )}

                                    Approve Agriculturalist

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}


// ============================================================
// APPLICATION ROW
// ============================================================

function ApplicationRow({
    agriculturalist,
    onReview,
}: {
    agriculturalist: AgriculturalistRequest;
    onReview: () => void;
}) {

    const status =
        agriculturalist.status?.toLowerCase();


    return (

        <div
            className="
                flex
                flex-col
                gap-4
                p-5
                transition
                hover:bg-emerald-50/30
                lg:flex-row
                lg:items-center
                lg:justify-between
            "
        >

            <div
                className="
                    flex
                    min-w-0
                    items-center
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-emerald-100
                        text-lg
                        font-black
                        text-emerald-700
                    "
                >
                    {getName(agriculturalist)
                        .charAt(0)
                        .toUpperCase()}
                </div>


                <div className="min-w-0">

                    <h3
                        className="
                            truncate
                            font-bold
                            text-slate-900
                        "
                    >
                        {getName(agriculturalist)}
                    </h3>


                    <p
                        className="
                            mt-1
                            truncate
                            text-sm
                            text-slate-500
                        "
                    >
                        {agriculturalist.email}
                    </p>


                    <div
                        className="
                            mt-2
                            flex
                            flex-wrap
                            gap-2
                        "
                    >

                        <span
                            className="
                                rounded-lg
                                bg-slate-100
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                text-slate-600
                            "
                        >
                            {
                                agriculturalist.specialization ||
                                "Agriculturalist"
                            }
                        </span>


                        <span
                            className="
                                rounded-lg
                                bg-slate-100
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                text-slate-600
                            "
                        >
                            {
                                agriculturalist.experience_years ??
                                0
                            }{" "}
                            years
                        </span>

                    </div>

                </div>

            </div>


            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    lg:justify-end
                "
            >

                <div>

                    {status === "active" ? (

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-emerald-50
                                px-3
                                py-1.5
                                text-xs
                                font-bold
                                text-emerald-700
                            "
                        >

                            <CheckCircle2
                                size={14}
                            />

                            Approved

                        </span>

                    ) : status === "rejected" ? (

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-red-50
                                px-3
                                py-1.5
                                text-xs
                                font-bold
                                text-red-700
                            "
                        >

                            <XCircle
                                size={14}
                            />

                            Rejected

                        </span>

                    ) : (

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-amber-50
                                px-3
                                py-1.5
                                text-xs
                                font-bold
                                text-amber-700
                            "
                        >

                            <Clock
                                size={14}
                            />

                            Pending

                        </span>

                    )}

                </div>


                <button
                    onClick={onReview}
                    className="
                        rounded-xl
                        bg-slate-900
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-emerald-700
                    "
                >
                    Review
                </button>

            </div>

        </div>

    );
}


// ============================================================
// STAT
// ============================================================

function Stat({
    title,
    value,
    icon: Icon,
}: {
    title: string;
    value: number;
    icon: React.ElementType;
}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-400
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            mt-2
                            text-3xl
                            font-black
                            text-slate-950
                        "
                    >
                        {value}
                    </p>

                </div>


                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-emerald-50
                        text-emerald-600
                    "
                >

                    <Icon
                        size={20}
                    />

                </div>

            </div>

        </div>

    );
}


// ============================================================
// FILTER
// ============================================================

function Filter({
    label,
    count,
    active,
    onClick,
}: {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
}) {

    return (

        <button
            onClick={onClick}
            className={`
                rounded-xl
                px-4
                py-2
                text-sm
                font-bold
                transition

                ${
                    active
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
            `}
        >

            {label}

            <span
                className={`
                    ml-2
                    rounded-full
                    px-2
                    py-0.5
                    text-xs

                    ${
                        active
                            ? "bg-white/20"
                            : "bg-white"
                    }
                `}
            >
                {count}
            </span>

        </button>

    );
}


// ============================================================
// INFO
// ============================================================

function Info({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {

    return (

        <div
            className="
                rounded-xl
                bg-slate-50
                p-4
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                "
            >

                <Icon
                    size={14}
                />

                {label}

            </div>


            <p
                className="
                    mt-2
                    break-words
                    text-sm
                    font-semibold
                    text-slate-800
                "
            >
                {value}
            </p>

        </div>

    );
}