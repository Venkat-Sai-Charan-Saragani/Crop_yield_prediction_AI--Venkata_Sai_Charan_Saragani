"use client";

import { useEffect, useState } from "react";

import { getProfile } from "@/services/profile";

import ProfileCard from "@/components/profile/ProfileCard";

import EditProfile from "@/components/profile/EditProfile";


// ============================================================
// PROFILE PAGE
// frontend/src/app/profile/page.tsx
// ============================================================

export default function ProfilePage() {

    const [profile, setProfile] =
        useState<any>(null);

    const [showEdit, setShowEdit] =
        useState(false);


    // ========================================================
    // LOAD PROFILE
    // ========================================================

    const loadProfile = async () => {

        try {

            const data =
                await getProfile();

            setProfile(
                data.profile
            );

        }
        catch (error) {

            console.log(
                "Profile loading error:",
                error
            );

        }

    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadProfile();

    }, []);


    // ========================================================
    // LOADING
    // ========================================================

    if (!profile) {

        return (

            <div
                className="
                    min-h-screen
                    bg-slate-50
                    p-6
                    sm:p-8
                "
            >

                <div
                    className="
                        flex
                        min-h-[400px]
                        items-center
                        justify-center
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
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-emerald-50
                                text-emerald-600
                            "
                        >

                            <span
                                className="
                                    text-2xl
                                "
                            >
                                👤
                            </span>

                        </div>


                        <p
                            className="
                                mt-4
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >

                            Loading profile...

                        </p>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-400
                            "
                        >

                            Retrieving your account information

                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <div
            className="
                min-h-screen
                bg-slate-50
                px-4
                py-6
                sm:px-6
                sm:py-8
                lg:px-8
            "
        >


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div
                className="
                    mx-auto
                    mb-6
                    max-w-7xl
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-100
                            text-emerald-700
                        "
                    >

                        <span
                            className="
                                text-xl
                            "
                        >
                            👤
                        </span>

                    </div>


                    <div>

                        <h1
                            className="
                                text-2xl
                                font-black
                                tracking-tight
                                text-slate-950
                                sm:text-3xl
                            "
                        >

                            Profile

                        </h1>


                        <p
                            className="
                                mt-0.5
                                text-sm
                                text-slate-500
                            "
                        >

                            Manage your account and
                            agricultural profile

                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <div
                className="
                    mx-auto
                    max-w-7xl
                "
            >

                <ProfileCard

                    profile={profile}

                    onEdit={() =>
                        setShowEdit(true)
                    }

                />

            </div>


            {/* =================================================
                FARM STATISTICS
            ================================================= */}

            <div
                className="
                    mx-auto
                    mt-6
                    max-w-7xl
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-[0_16px_50px_rgba(15,23,42,0.06)]
                "
            >

                {/* TOP ACCENT */}

                <div
                    className="
                        h-1
                        w-full
                        bg-gradient-to-r
                        from-emerald-500
                        via-green-500
                        to-lime-400
                    "
                />


                {/* HEADER */}

                <div
                    className="
                        border-b
                        border-slate-100
                        px-5
                        py-6
                        sm:px-7
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-black
                                tracking-tight
                                text-slate-950
                            "
                        >

                            Farm Statistics

                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >

                            Overview of your farms, crops,
                            and AI predictions

                        </p>

                    </div>

                </div>


                {/* STATISTICS */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        p-5
                        sm:grid-cols-2
                        sm:p-7
                        lg:grid-cols-3
                    "
                >


                    {/* =================================================
                        FARMS
                    ================================================= */}

                    <div
                        className="
                            group
                            rounded-2xl
                            border
                            border-emerald-100
                            bg-emerald-50
                            p-5
                            transition
                            duration-200
                            hover:-translate-y-0.5
                            hover:shadow-md
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-2xl
                                    shadow-sm
                                "
                            >

                                🚜

                            </div>


                            <span
                                className="
                                    rounded-full
                                    bg-white
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-emerald-700
                                "
                            >

                                Farms

                            </span>

                        </div>


                        <div
                            className="
                                mt-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                "
                            >

                                Total Farms

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-3xl
                                    font-black
                                    text-slate-950
                                "
                            >

                                {
                                    profile.stats?.farms || 0
                                }

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    font-medium
                                    text-slate-500
                                "
                            >

                                Registered agricultural farms

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        CROPS
                    ================================================= */}

                    <div
                        className="
                            group
                            rounded-2xl
                            border
                            border-emerald-100
                            bg-emerald-50
                            p-5
                            transition
                            duration-200
                            hover:-translate-y-0.5
                            hover:shadow-md
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-2xl
                                    shadow-sm
                                "
                            >

                                🌾

                            </div>


                            <span
                                className="
                                    rounded-full
                                    bg-white
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-emerald-700
                                "
                            >

                                Crops

                            </span>

                        </div>


                        <div
                            className="
                                mt-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                "
                            >

                                Total Crops

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-3xl
                                    font-black
                                    text-slate-950
                                "
                            >

                                {
                                    profile.stats?.crops || 0
                                }

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    font-medium
                                    text-slate-500
                                "
                            >

                                Crops currently tracked

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        PREDICTIONS
                    ================================================= */}

                    <div
                        className="
                            group
                            rounded-2xl
                            border
                            border-emerald-100
                            bg-emerald-50
                            p-5
                            transition
                            duration-200
                            hover:-translate-y-0.5
                            hover:shadow-md
                            sm:col-span-2
                            lg:col-span-1
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-2xl
                                    shadow-sm
                                "
                            >

                                🤖

                            </div>


                            <span
                                className="
                                    rounded-full
                                    bg-white
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-emerald-700
                                "
                            >

                                AI

                            </span>

                        </div>


                        <div
                            className="
                                mt-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                "
                            >

                                Predictions

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-3xl
                                    font-black
                                    text-slate-950
                                "
                            >

                                {
                                    profile.stats?.predictions || 0
                                }

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    font-medium
                                    text-slate-500
                                "
                            >

                                AI-generated yield predictions

                            </p>

                        </div>

                    </div>


                </div>

            </div>


            {/* =================================================
                EDIT PROFILE
            ================================================= */}

            {
                showEdit && (

                    <EditProfile

                        profile={profile}

                        onClose={() =>
                            setShowEdit(false)
                        }

                        onUpdated={() => {

                            setShowEdit(false);

                            loadProfile();

                        }}

                    />

                )
            }


        </div>

    );

}