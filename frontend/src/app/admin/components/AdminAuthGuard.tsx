"use client";

import {
    ReactNode,
    useEffect,
    useState,
} from "react";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import {
    getAdminToken,
    removeAdminToken,
} from "@/utils/auth";

interface AdminAuthGuardProps {
    children: ReactNode;
}

export default function AdminAuthGuard({
    children,
}: AdminAuthGuardProps) {

    const router = useRouter();

    const pathname = usePathname();

    const [
        checkingAuth,
        setCheckingAuth,
    ] = useState(true);

    useEffect(() => {

        // =====================================================
        // ADMIN LOGIN PAGE MUST ALWAYS BE ACCESSIBLE
        // =====================================================

        if (
            pathname === "/admin/login"
        ) {

            setCheckingAuth(false);

            return;
        }

        // =====================================================
        // CHECK ADMIN TOKEN
        // =====================================================

        const token =
            getAdminToken();

        console.log(
            "ADMIN AUTH GUARD TOKEN:",
            token
                ? "EXISTS"
                : "MISSING"
        );

        // =====================================================
        // NO ADMIN TOKEN
        // REDIRECT TO ADMIN LOGIN
        // =====================================================

        if (!token) {

            console.log(
                "ADMIN AUTH GUARD: No token. Redirecting to login."
            );

            setCheckingAuth(false);

            router.replace(
                "/admin/login"
            );

            return;
        }

        // =====================================================
        // TOKEN EXISTS
        // ALLOW ADMIN PAGE
        // =====================================================

        console.log(
            "ADMIN AUTH GUARD: Admin token found."
        );

        setCheckingAuth(false);

    }, [
        pathname,
        router,
    ]);

    // =========================================================
    // DON'T DISPLAY ADMIN PAGES WHILE CHECKING AUTH
    // =========================================================

    if (checkingAuth) {

        return (

            <main
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-slate-950
                    px-4
                "
            >

                <div
                    className="
                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-700
                            border-t-emerald-500
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-sm
                            text-slate-400
                        "
                    >
                        Checking administrator access...
                    </p>

                </div>

            </main>

        );
    }

    // =========================================================
    // LOGIN PAGE
    // =========================================================

    if (
        pathname === "/admin/login"
    ) {

        return (
            <>
                {children}
            </>
        );
    }

    // =========================================================
    // ADMIN PAGE WITH TOKEN
    // =========================================================

    const token =
        getAdminToken();

    if (!token) {

        return null;
    }

    return (
        <>
            {children}
        </>
    );
}
