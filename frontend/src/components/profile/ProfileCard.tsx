"use client";

import {
    Camera,
    Edit3,
    Mail,
    MapPin,
    Phone,
    Sprout,
    User,
} from "lucide-react";


// ============================================================
// PROFILE CARD
// ============================================================

export default function ProfileCard(
    { profile, onEdit }: any
) {


    // ========================================================
    // LOCATION
    // ========================================================

    const location =

        typeof profile?.location === "object"

            ?

            [
                profile.location?.village,
                profile.location?.district,
                profile.location?.state,
            ]
                .filter(Boolean)
                .join(", ")

            :

            profile?.location || "";



    // ========================================================
    // PROFILE NAME
    // ========================================================

    const userName =
        profile?.name ||
        profile?.full_name ||
        profile?.username ||
        "User";



    // ========================================================
    // INITIALS
    // ========================================================

    const initials =
        userName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (word: string) =>
                    word.charAt(0).toUpperCase()
            )
            .join("") || "U";



    // ========================================================
    // PROFILE IMAGE
    // ========================================================

    const rawProfileImage =
        profile?.profile_image ||
        profile?.profileImage ||
        "";



    const imageUrl =
        rawProfileImage

            ?

            rawProfileImage.startsWith("/uploads")

                ?

                `http://localhost:8000${rawProfileImage}`

                :

                rawProfileImage

            :

            "";



    return (

        <div
            className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-[0_18px_50px_rgba(15,23,42,0.07)]
            "
        >

            {/* =================================================
                TOP ACCENT
            ================================================= */}

            <div
                className="
                    h-1.5
                    w-full
                    bg-gradient-to-r
                    from-emerald-500
                    via-green-500
                    to-lime-400
                "
            />


            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div
                className="
                    bg-gradient-to-br
                    from-emerald-50
                    via-white
                    to-green-50
                    px-6
                    py-7
                    sm:px-8
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-6
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* =================================================
                        USER INFORMATION
                    ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            gap-5
                        "
                    >

                        {/* PROFILE IMAGE */}

                        <div
                            className="
                                relative
                                h-24
                                w-24
                                shrink-0
                            "
                        >

                            {imageUrl ? (

                                <img
                                    src={imageUrl}
                                    alt={`${userName} profile`}
                                    className="
                                        h-24
                                        w-24
                                        rounded-2xl
                                        border-4
                                        border-white
                                        object-cover
                                        shadow-lg
                                    "
                                    onError={(event) => {

                                        event.currentTarget.style.display =
                                            "none";

                                        const fallback =
                                            event.currentTarget
                                                .nextElementSibling as HTMLElement | null;

                                        if (fallback) {

                                            fallback.style.display =
                                                "flex";

                                        }

                                    }}
                                />

                            ) : null}


                            {/* INITIAL FALLBACK */}

                            <div
                                className={`
                                    h-24
                                    w-24
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border-4
                                    border-white
                                    bg-gradient-to-br
                                    from-emerald-500
                                    to-green-700
                                    text-2xl
                                    font-black
                                    text-white
                                    shadow-lg
                                    ${imageUrl ? "hidden" : "flex"}
                                `}
                            >

                                {initials}

                            </div>


                            {/* CAMERA BADGE */}

                            <button
                                type="button"
                                onClick={onEdit}
                                aria-label="Change profile picture"
                                className="
                                    absolute
                                    -bottom-1
                                    -right-1
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-2
                                    border-white
                                    bg-slate-900
                                    text-white
                                    shadow-md
                                    transition
                                    hover:bg-emerald-700
                                "
                            >

                                <Camera
                                    size={14}
                                />

                            </button>

                        </div>


                        {/* NAME */}

                        <div
                            className="
                                min-w-0
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                "
                            >

                                <h2
                                    className="
                                        text-2xl
                                        font-black
                                        tracking-tight
                                        text-slate-950
                                    "
                                >

                                    {userName}

                                </h2>


                                <span
                                    className="
                                        rounded-full
                                        bg-emerald-100
                                        px-2.5
                                        py-1
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-emerald-700
                                    "
                                >

                                    {profile?.role || "AI User"}

                                </span>

                            </div>


                            <div
                                className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-slate-500
                                "
                            >

                                <Mail
                                    size={14}
                                    className="
                                        shrink-0
                                        text-slate-400
                                    "
                                />

                                <span
                                    className="
                                        truncate
                                    "
                                >

                                    {profile?.email || "No email added"}

                                </span>

                            </div>

                        </div>

                    </div>


                    {/* EDIT BUTTON */}

                    <button
                        type="button"
                        onClick={onEdit}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-slate-950
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-emerald-700
                        "
                    >

                        <Edit3
                            size={16}
                        />

                        Edit Profile

                    </button>

                </div>

            </div>


            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div
                className="
                    border-t
                    border-slate-100
                    px-6
                    py-7
                    sm:px-8
                "
            >

                <div
                    className="
                        mb-5
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-50
                            text-emerald-600
                        "
                    >

                        <User
                            size={19}
                        />

                    </div>


                    <div>

                        <h3
                            className="
                                text-lg
                                font-black
                                text-slate-950
                            "
                        >

                            Personal Information

                        </h3>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-slate-400
                            "
                        >

                            Your personal and farming details

                        </p>

                    </div>

                </div>


                <div
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >

                    {/* PHONE */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-100
                            bg-slate-50/70
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <Phone
                                size={15}
                                className="text-emerald-600"
                            />

                            <span
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-400
                                "
                            >

                                Phone

                            </span>

                        </div>


                        <p
                            className="
                                mt-2
                                break-words
                                text-sm
                                font-bold
                                text-slate-800
                            "
                        >

                            {profile?.phone || "Not added"}

                        </p>

                    </div>


                    {/* LOCATION */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-100
                            bg-slate-50/70
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <MapPin
                                size={15}
                                className="text-emerald-600"
                            />

                            <span
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-400
                                "
                            >

                                Location

                            </span>

                        </div>


                        <p
                            className="
                                mt-2
                                break-words
                                text-sm
                                font-bold
                                text-slate-800
                            "
                        >

                            {location || "Not added"}

                        </p>

                    </div>


                    {/* FARM */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-100
                            bg-slate-50/70
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <Sprout
                                size={15}
                                className="text-emerald-600"
                            />

                            <span
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-400
                                "
                            >

                                Farm Name

                            </span>

                        </div>


                        <p
                            className="
                                mt-2
                                break-words
                                text-sm
                                font-bold
                                text-slate-800
                            "
                        >

                            {profile?.farm_name || "Not added"}

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}