"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    Search,
    ArrowLeft,
    Users,
    ShieldCheck,
    User,
    Mail,
    CalendarDays,
    Trash2,
    Eye,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    X,
    Loader2,
    MoreVertical,
} from "lucide-react";

import {
    getAdminUsers,
    deleteAdminUser,
    AdminUser,
} from "@/services/admin";

import {
    getAdminToken,
    clearAdminAuth,
} from "@/utils/auth";


// ============================================================
// PAGE
// ============================================================

export default function AdminUsersPage() {

    const router = useRouter();


    // ========================================================
    // STATE
    // ========================================================

    const [users, setUsers] =
        useState<AdminUser[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [roleFilter, setRoleFilter] =
        useState("all");

    const [statusFilter, setStatusFilter] =
        useState("all");


    const [selectedUser, setSelectedUser] =
        useState<AdminUser | null>(null);

    const [deleteUser, setDeleteUser] =
        useState<AdminUser | null>(null);

    const [deleting, setDeleting] =
        useState(false);


    const [successMessage, setSuccessMessage] =
        useState("");


    // ========================================================
    // LOAD USERS
    // ========================================================

    const loadUsers = async (
        showRefreshLoader = false
    ) => {

        try {

            if (showRefreshLoader) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const token =
                getAdminToken();


            if (!token) {

                clearAdminAuth();

                router.replace(
                    "/admin/login"
                );

                return;

            }


            const response =
                await getAdminUsers();


            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Unable to load users."
                );

            }


            setUsers(
                Array.isArray(response.users)
                    ? response.users
                    : []
            );

        }
        catch (error: any) {

            console.error(
                "ADMIN USERS ERROR:",
                error
            );


            if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
            ) {

                clearAdminAuth();

                router.replace(
                    "/admin/login"
                );

                return;

            }


            setError(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load users."
            );

        }
        finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadUsers();

    }, []);


    // ========================================================
    // AUTO CLEAR SUCCESS
    // ========================================================

    useEffect(() => {

        if (!successMessage) {
            return;
        }


        const timer =
            setTimeout(() => {

                setSuccessMessage("");

            }, 4000);


        return () => {
            clearTimeout(timer);
        };

    }, [successMessage]);


    // ========================================================
    // DELETE USER
    // ========================================================

    const handleDeleteUser = async () => {

        if (!deleteUser) {
            return;
        }


        const userId =
            deleteUser.id ||
            deleteUser._id;


        if (!userId) {

            setError(
                "Unable to identify this user."
            );

            return;

        }


        try {

            setDeleting(true);

            setError("");


            await deleteAdminUser(
                userId
            );


            setUsers(
                previousUsers =>
                    previousUsers.filter(
                        user => {

                            const currentId =
                                user.id ||
                                user._id;

                            return currentId !== userId;

                        }
                    )
            );


            setDeleteUser(null);

            setSelectedUser(null);


            setSuccessMessage(
                "User deleted successfully."
            );

        }
        catch (error: any) {

            console.error(
                "DELETE USER ERROR:",
                error
            );


            if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
            ) {

                clearAdminAuth();

                router.replace(
                    "/admin/login"
                );

                return;

            }


            setError(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "Unable to delete user."
            );

        }
        finally {

            setDeleting(false);

        }

    };


    // ========================================================
    // FILTER USERS
    // ========================================================

    const filteredUsers =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            return users.filter(
                user => {

                    const name =
                        user.full_name ||
                        "";

                    const email =
                        user.email ||
                        "";

                    const role =
                        user.role ||
                        "user";


                    const matchesSearch =
                        !query ||
                        name.toLowerCase().includes(query) ||
                        email.toLowerCase().includes(query);


                    const matchesRole =
                        roleFilter === "all" ||
                        role.toLowerCase() ===
                            roleFilter.toLowerCase();


                    const matchesStatus =
                        statusFilter === "all" ||
                        (
                            statusFilter === "active" &&
                            user.is_active === true
                        ) ||
                        (
                            statusFilter === "inactive" &&
                            user.is_active === false
                        );


                    return (
                        matchesSearch &&
                        matchesRole &&
                        matchesStatus
                    );

                }
            );

        }, [
            users,
            search,
            roleFilter,
            statusFilter,
        ]);


    // ========================================================
    // STATISTICS
    // ========================================================

    const totalUsers =
        users.length;


    const activeUsers =
        users.filter(
            user =>
                user.is_active === true
        ).length;


    const inactiveUsers =
        users.filter(
            user =>
                user.is_active === false
        ).length;


    const adminUsers =
        users.filter(
            user =>
                (
                    user.role ||
                    ""
                ).toLowerCase() ===
                "admin"
        ).length;


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (
        date?: string
    ) => {

        if (!date) {
            return "—";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "—";

        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // ========================================================
    // USER NAME
    // ========================================================

    const getUserName = (
        user: AdminUser
    ) => {

        return (
            user.full_name ||
            "Unnamed User"
        );

    };


    // ========================================================
    // USER ROLE
    // ========================================================

    const getUserRole = (
        user: AdminUser
    ) => {

        return (
            user.role ||
            "user"
        );

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

                    <p className="mt-4 text-sm font-medium text-slate-500">

                        Loading users...

                    </p>

                </div>

            </div>

        );

    }


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <div className="min-h-screen bg-slate-50">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">


                    <div className="flex items-center gap-3">

                        <button

                            onClick={() =>
                                router.push(
                                    "/admin"
                                )
                            }

                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"

                        >

                            <ArrowLeft
                                size={19}
                            />

                        </button>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">

                            <Users
                                size={22}
                            />

                        </div>


                        <div>

                            <h1 className="font-bold text-slate-900">

                                User Management

                            </h1>

                            <p className="text-xs text-slate-500">

                                Manage platform accounts

                            </p>

                        </div>

                    </div>


                    <button

                        onClick={() =>
                            loadUsers(true)
                        }

                        disabled={refreshing}

                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"

                    >

                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        <span className="hidden sm:block">

                            Refresh

                        </span>

                    </button>

                </div>

            </header>


            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">


                {/* ================================================= */}
                {/* TITLE */}
                {/* ================================================= */}

                <div className="mb-7">

                    <p className="text-sm font-semibold text-emerald-600">

                        Administration

                    </p>

                    <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">

                        Users

                    </h2>

                    <p className="mt-2 text-sm text-slate-500">

                        View, monitor and manage registered YieldSenseAI users.

                    </p>

                </div>


                {/* ================================================= */}
                {/* SUCCESS */}
                {/* ================================================= */}

                {successMessage && (

                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">

                        <CheckCircle2
                            size={19}
                        />

                        <span>
                            {successMessage}
                        </span>

                    </div>

                )}


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (

                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                        <AlertCircle
                            size={19}
                            className="mt-0.5 shrink-0"
                        />

                        <div>

                            <p className="font-semibold">

                                Something went wrong

                            </p>

                            <p className="mt-1">

                                {error}

                            </p>

                        </div>

                    </div>

                )}


                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">


                    <StatCard

                        title="Total Users"

                        value={totalUsers}

                        icon={
                            <Users
                                size={22}
                            />
                        }

                        description="Registered accounts"

                    />


                    <StatCard

                        title="Active Users"

                        value={activeUsers}

                        icon={
                            <CheckCircle2
                                size={22}
                            />
                        }

                        description="Currently active"

                    />


                    <StatCard

                        title="Inactive Users"

                        value={inactiveUsers}

                        icon={
                            <AlertCircle
                                size={22}
                            />
                        }

                        description="Inactive accounts"

                    />


                    <StatCard

                        title="Administrators"

                        value={adminUsers}

                        icon={
                            <ShieldCheck
                                size={22}
                            />
                        }

                        description="Admin accounts"

                    />

                </section>


                {/* ================================================= */}
                {/* FILTERS */}
                {/* ================================================= */}

                <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                        {/* SEARCH */}

                        <div className="relative w-full lg:max-w-md">

                            <Search

                                size={18}

                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"

                            />


                            <input

                                type="text"

                                value={search}

                                onChange={
                                    event =>
                                        setSearch(
                                            event.target.value
                                        )
                                }

                                placeholder="Search by name or email..."

                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"

                            />

                        </div>


                        {/* FILTERS */}

                        <div className="flex flex-col gap-3 sm:flex-row">


                            <select

                                value={roleFilter}

                                onChange={
                                    event =>
                                        setRoleFilter(
                                            event.target.value
                                        )
                                }

                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"

                            >

                                <option value="all">
                                    All Roles
                                </option>

                                <option value="user">
                                    Users
                                </option>

                                <option value="admin">
                                    Administrators
                                </option>

                            </select>


                            <select

                                value={statusFilter}

                                onChange={
                                    event =>
                                        setStatusFilter(
                                            event.target.value
                                        )
                                }

                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"

                            >

                                <option value="all">
                                    All Status
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* TABLE */}
                {/* ================================================= */}

                <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


                    <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h3 className="font-bold text-slate-900">

                                Registered Users

                            </h3>

                            <p className="mt-1 text-xs text-slate-500">

                                Showing {filteredUsers.length} of {users.length} users

                            </p>

                        </div>

                    </div>


                    {/* DESKTOP TABLE */}

                    <div className="hidden overflow-x-auto md:block">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b border-slate-200 bg-slate-50">

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                        User

                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                        Role

                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                        Status

                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                        Auth

                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                        Joined

                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">

                                        Actions

                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredUsers.map(
                                    user => (

                                        <UserRow

                                            key={
                                                user.id ||
                                                user._id ||
                                                user.email
                                            }

                                            user={user}

                                            onView={() =>
                                                setSelectedUser(
                                                    user
                                                )
                                            }

                                            onDelete={() =>
                                                setDeleteUser(
                                                    user
                                                )
                                            }

                                            formatDate={
                                                formatDate
                                            }

                                        />

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* MOBILE */}

                    <div className="divide-y divide-slate-200 md:hidden">

                        {filteredUsers.map(
                            user => (

                                <MobileUserCard

                                    key={
                                        user.id ||
                                        user._id ||
                                        user.email
                                    }

                                    user={user}

                                    onView={() =>
                                        setSelectedUser(
                                            user
                                        )
                                    }

                                    onDelete={() =>
                                        setDeleteUser(
                                            user
                                        )
                                    }

                                    formatDate={
                                        formatDate
                                    }

                                />

                            )
                        )}

                    </div>


                    {/* EMPTY */}

                    {filteredUsers.length === 0 && (

                        <div className="px-6 py-16 text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                                <Users
                                    size={25}
                                />

                            </div>

                            <h3 className="mt-4 font-semibold text-slate-900">

                                No users found

                            </h3>

                            <p className="mt-1 text-sm text-slate-500">

                                Try changing your search or filters.

                            </p>

                        </div>

                    )}

                </section>

            </main>


            {/* ================================================= */}
            {/* VIEW USER MODAL */}
            {/* ================================================= */}

            {selectedUser && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm">

                    <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">


                        <div className="flex items-center justify-between border-b border-slate-200 p-6">

                            <div>

                                <h3 className="text-lg font-bold text-slate-900">

                                    User Details

                                </h3>

                                <p className="mt-1 text-sm text-slate-500">

                                    Account information

                                </p>

                            </div>


                            <button

                                onClick={() =>
                                    setSelectedUser(
                                        null
                                    )
                                }

                                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"

                            >

                                <X
                                    size={19}
                                />

                            </button>

                        </div>


                        <div className="space-y-5 p-6">


                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">

                                    <User
                                        size={25}
                                    />

                                </div>


                                <div>

                                    <h4 className="font-bold text-slate-900">

                                        {getUserName(
                                            selectedUser
                                        )}

                                    </h4>

                                    <p className="text-sm text-slate-500">

                                        {selectedUser.email ||
                                            "No email"}

                                    </p>

                                </div>

                            </div>


                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


                                <DetailItem

                                    icon={
                                        <Mail
                                            size={17}
                                        />
                                    }

                                    label="Email"

                                    value={
                                        selectedUser.email ||
                                        "—"
                                    }

                                />


                                <DetailItem

                                    icon={
                                        <ShieldCheck
                                            size={17}
                                        />
                                    }

                                    label="Role"

                                    value={
                                        getUserRole(
                                            selectedUser
                                        )
                                    }

                                />


                                <DetailItem

                                    icon={
                                        <CalendarDays
                                            size={17}
                                        />
                                    }

                                    label="Joined"

                                    value={
                                        formatDate(
                                            selectedUser.created_at
                                        )
                                    }

                                />


                                <DetailItem

                                    icon={
                                        <CheckCircle2
                                            size={17}
                                        />
                                    }

                                    label="Status"

                                    value={
                                        selectedUser.is_active
                                            ? "Active"
                                            : "Inactive"
                                    }

                                />

                            </div>


                            <button

                                onClick={() => {

                                    setSelectedUser(
                                        null
                                    );

                                    setDeleteUser(
                                        selectedUser
                                    );

                                }}

                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"

                            >

                                <Trash2
                                    size={17}
                                />

                                Delete User

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* DELETE MODAL */}
            {/* ================================================= */}

            {deleteUser && (

                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-5 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">


                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">

                            <Trash2
                                size={25}
                            />

                        </div>


                        <div className="mt-5 text-center">

                            <h3 className="text-xl font-bold text-slate-900">

                                Delete this user?

                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">

                                You are about to permanently delete{" "}

                                <span className="font-semibold text-slate-800">

                                    {getUserName(
                                        deleteUser
                                    )}

                                </span>

                                . This action cannot be undone.

                            </p>

                        </div>


                        <div className="mt-7 grid grid-cols-2 gap-3">

                            <button

                                onClick={() =>
                                    setDeleteUser(
                                        null
                                    )
                                }

                                disabled={deleting}

                                className="rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"

                            >

                                Cancel

                            </button>


                            <button

                                onClick={
                                    handleDeleteUser
                                }

                                disabled={deleting}

                                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"

                            >

                                {deleting ? (

                                    <>

                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                        Deleting...

                                    </>

                                ) : (

                                    <>

                                        <Trash2
                                            size={17}
                                        />

                                        Delete

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({

    title,

    value,

    icon,

    description,

}: {

    title: string;

    value: number;

    icon: React.ReactNode;

    description: string;

}) {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">

                        {title}

                    </p>

                    <p className="mt-3 text-3xl font-bold text-slate-900">

                        {value}

                    </p>

                </div>


                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                    {icon}

                </div>

            </div>


            <p className="mt-4 text-xs text-slate-500">

                {description}

            </p>

        </div>

    );

}


// ============================================================
// DESKTOP USER ROW
// ============================================================

function UserRow({

    user,

    onView,

    onDelete,

    formatDate,

}: {

    user: AdminUser;

    onView: () => void;

    onDelete: () => void;

    formatDate: (
        date?: string
    ) => string;

}) {

    const role =
        user.role ||
        "user";


    return (

        <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">


            <td className="px-5 py-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                        <User
                            size={18}
                        />

                    </div>


                    <div className="min-w-0">

                        <p className="truncate font-semibold text-slate-900">

                            {user.full_name ||
                                "Unnamed User"}

                        </p>

                        <p className="truncate text-xs text-slate-500">

                            {user.email ||
                                "No email"}

                        </p>

                    </div>

                </div>

            </td>


            <td className="px-5 py-4">

                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">

                    {role}

                </span>

            </td>


            <td className="px-5 py-4">

                {user.is_active ? (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        Active

                    </span>

                ) : (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">

                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                        Inactive

                    </span>

                )}

            </td>


            <td className="px-5 py-4">

                <span className="text-sm capitalize text-slate-600">

                    {user.auth_provider ||
                        "Local"}

                </span>

            </td>


            <td className="px-5 py-4 text-sm text-slate-500">

                {formatDate(
                    user.created_at
                )}

            </td>


            <td className="px-5 py-4">

                <div className="flex justify-end gap-2">

                    <button

                        onClick={onView}

                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"

                        title="View user"

                    >

                        <Eye
                            size={16}
                        />

                    </button>


                    <button

                        onClick={onDelete}

                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"

                        title="Delete user"

                    >

                        <Trash2
                            size={16}
                        />

                    </button>

                </div>

            </td>

        </tr>

    );

}


// ============================================================
// MOBILE USER CARD
// ============================================================

function MobileUserCard({

    user,

    onView,

    onDelete,

    formatDate,

}: {

    user: AdminUser;

    onView: () => void;

    onDelete: () => void;

    formatDate: (
        date?: string
    ) => string;

}) {

    return (

        <div className="p-5">

            <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                        <User
                            size={19}
                        />

                    </div>


                    <div className="min-w-0">

                        <p className="truncate font-semibold text-slate-900">

                            {user.full_name ||
                                "Unnamed User"}

                        </p>

                        <p className="truncate text-xs text-slate-500">

                            {user.email ||
                                "No email"}

                        </p>

                    </div>

                </div>


                <MoreVertical
                    size={18}
                    className="text-slate-400"
                />

            </div>


            <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3">

                    <p className="text-[11px] font-semibold uppercase text-slate-400">

                        Role

                    </p>

                    <p className="mt-1 text-sm font-semibold capitalize text-slate-700">

                        {user.role ||
                            "user"}

                    </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-3">

                    <p className="text-[11px] font-semibold uppercase text-slate-400">

                        Status

                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">

                        {user.is_active
                            ? "Active"
                            : "Inactive"}

                    </p>

                </div>

            </div>


            <p className="mt-3 text-xs text-slate-500">

                Joined{" "}

                {formatDate(
                    user.created_at
                )}

            </p>


            <div className="mt-4 grid grid-cols-2 gap-3">

                <button

                    onClick={onView}

                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700"

                >

                    <Eye
                        size={16}
                    />

                    View

                </button>


                <button

                    onClick={onDelete}

                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600"

                >

                    <Trash2
                        size={16}
                    />

                    Delete

                </button>

            </div>

        </div>

    );

}


// ============================================================
// DETAIL ITEM
// ============================================================

function DetailItem({

    icon,

    label,

    value,

}: {

    icon: React.ReactNode;

    label: string;

    value: string;

}) {

    return (

        <div className="rounded-xl bg-slate-50 p-4">

            <div className="flex items-center gap-2 text-slate-400">

                {icon}

                <span className="text-xs font-semibold uppercase">

                    {label}

                </span>

            </div>


            <p className="mt-2 break-words text-sm font-semibold capitalize text-slate-800">

                {value}

            </p>

        </div>

    );

}