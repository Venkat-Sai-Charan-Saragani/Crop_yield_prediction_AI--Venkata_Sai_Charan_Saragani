"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    User,
    Mail,
    MapPin,
    BriefcaseBusiness,
    GraduationCap,
    Phone,
    Save,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Sprout,
    LogOut,
} from "lucide-react";

import {
    getAgriculturalistProfile,
    updateAgriculturalistProfile,
    agriculturalistLogout,
    AgriculturalistPublic,
} from "@/services/agriculturalist";


export default function AgriculturalistProfilePage() {

    const router = useRouter();


    // ========================================================
    // STATE
    // ========================================================

    const [
        agriculturalist,
        setAgriculturalist,
    ] = useState<AgriculturalistPublic | null>(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        saving,
        setSaving,
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
    // FORM STATE
    // ========================================================

    const [
        fullName,
        setFullName,
    ] = useState("");


    const [
        email,
        setEmail,
    ] = useState("");


    const [
        specialization,
        setSpecialization,
    ] = useState("");


    const [
        experienceYears,
        setExperienceYears,
    ] = useState("");


    const [
        state,
        setState,
    ] = useState("");


    const [
        district,
        setDistrict,
    ] = useState("");


    const [
        qualification,
        setQualification,
    ] = useState("");


    const [
        phone,
        setPhone,
    ] = useState("");


    const [
        availability,
        setAvailability,
    ] = useState(true);


    // ========================================================
    // LOAD PROFILE
    // ========================================================

    useEffect(() => {

        let active = true;


        const loadProfile = async () => {

            try {

                setLoading(true);
                setError("");
                setSuccess("");


                const response =
                    await getAgriculturalistProfile();


                console.log(
                    "AGRICULTURALIST PROFILE RESPONSE:",
                    response
                );


                if (!active) {
                    return;
                }


                if (!response.success) {

                    setError(
                        response.message ||
                        "Unable to load your profile."
                    );

                    return;
                }


                const profile =
                    response.agriculturalist;


                if (!profile) {

                    setError(
                        "Agriculturalist profile was not found."
                    );

                    return;
                }


                setAgriculturalist(profile);


                // ==================================================
                // FILL FORM
                // ==================================================

                setFullName(
                    profile.full_name ||
                    profile.name ||
                    profile.display_name ||
                    ""
                );


                setEmail(
                    profile.email ||
                    ""
                );


                setSpecialization(
                    profile.specialization ||
                    ""
                );


                setExperienceYears(
                    String(
                        profile.experience_years ??
                        profile.experience ??
                        ""
                    )
                );


                setState(
                    profile.state ||
                    ""
                );


                setDistrict(
                    profile.district ||
                    ""
                );


                setQualification(
                    profile.qualification ||
                    ""
                );


                setPhone(
                    profile.phone ||
                    ""
                );


                setAvailability(
                    profile.is_available ??
                    profile.availability ??
                    true
                );


            } catch (err: any) {

                console.error(
                    "AGRICULTURALIST PROFILE PAGE ERROR:",
                    err
                );


                const status =
                    err?.response?.status;


                if (status === 401) {

                    setError(
                        "Your session has expired. Please login again."
                    );

                } else {

                    setError(
                        "Unable to load your profile."
                    );

                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        };


        loadProfile();


        return () => {
            active = false;
        };

    }, []);


    // ========================================================
    // UPDATE PROFILE
    // ========================================================

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        setError("");
        setSuccess("");


        if (!fullName.trim()) {

            setError(
                "Full name is required."
            );

            return;
        }


        const parsedExperience =
            experienceYears.trim() === ""
                ? 0
                : Number(experienceYears);


        if (
            Number.isNaN(parsedExperience) ||
            parsedExperience < 0
        ) {

            setError(
                "Please enter a valid number of experience years."
            );

            return;
        }


        try {

            setSaving(true);


            const response =
                await updateAgriculturalistProfile({

                    full_name:
                        fullName.trim(),

                    specialization:
                        specialization.trim(),

                    experience_years:
                        parsedExperience,

                    state:
                        state.trim(),

                    district:
                        district.trim(),

                    availability:
                        availability,

                });


            console.log(
                "AGRICULTURALIST PROFILE UPDATE RESPONSE:",
                response
            );


            if (!response.success) {

                setError(
                    response.message ||
                    "Unable to update your profile."
                );

                return;
            }


            if (response.agriculturalist) {

                setAgriculturalist(
                    response.agriculturalist
                );

            }


            setSuccess(
                response.message ||
                "Profile updated successfully."
            );


            // Remove success message after a few seconds

            setTimeout(() => {

                setSuccess("");

            }, 4000);


        } catch (err: any) {

            console.error(
                "AGRICULTURALIST PROFILE UPDATE PAGE ERROR:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                "Unable to update your profile."
            );

        } finally {

            setSaving(false);

        }

    };


    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {

        agriculturalistLogout();

        router.replace(
            "/agriculturalist/login"
        );

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                "
            >

                <div className="text-center">

                    <Loader2
                        size={42}
                        className="
                            mx-auto
                            animate-spin
                            text-emerald-600
                        "
                    />


                    <p
                        className="
                            mt-4
                            text-sm
                            font-medium
                            text-slate-500
                        "
                    >
                        Loading your profile...
                    </p>

                </div>

            </main>

        );

    }


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <main
            className="
                min-h-screen
                bg-slate-50
                px-4
                py-8
                md:px-8
            "
        >

            <div
                className="
                    mx-auto
                    max-w-5xl
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-emerald-50
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-emerald-700
                            "
                        >

                            <Sprout
                                size={17}
                            />

                            Agriculturalist Profile

                        </div>


                        <h1
                            className="
                                mt-4
                                text-3xl
                                font-bold
                                text-slate-900
                                md:text-4xl
                            "
                        >
                            My Profile
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-slate-500
                                md:text-base
                            "
                        >
                            Manage your agriculturalist information
                            and availability.
                        </p>

                    </div>


                    <div
                        className="
                            flex
                            flex-wrap
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/agriculturalist/dashboard"
                                )
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                shadow-sm
                                transition
                                hover:bg-slate-50
                            "
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Dashboard

                        </button>


                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-red-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-red-600
                                shadow-sm
                                transition
                                hover:bg-red-50
                            "
                        >

                            <LogOut
                                size={17}
                            />

                            Logout

                        </button>

                    </div>

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div
                        className="
                            mb-6
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            p-4
                            text-sm
                            text-red-700
                        "
                    >

                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>

                            <p
                                className="
                                    font-semibold
                                "
                            >
                                Something went wrong
                            </p>


                            <p className="mt-1">
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {success && (

                    <div
                        className="
                            mb-6
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-emerald-200
                            bg-emerald-50
                            p-4
                            text-sm
                            text-emerald-700
                        "
                    >

                        <CheckCircle2
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>

                            <p
                                className="
                                    font-semibold
                                "
                            >
                                Success
                            </p>


                            <p className="mt-1">
                                {success}
                            </p>

                        </div>

                    </div>

                )}


                {/* ==================================================
                    PROFILE CARD
                ================================================== */}

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

                    {/* PROFILE HEADER */}

                    <div
                        className="
                            border-b
                            border-slate-200
                            bg-gradient-to-r
                            from-emerald-50
                            to-slate-50
                            px-6
                            py-8
                            md:px-8
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-center
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-20
                                    w-20
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-emerald-600
                                    text-white
                                    shadow-sm
                                "
                            >

                                <User
                                    size={38}
                                />

                            </div>


                            <div>

                                <h2
                                    className="
                                        text-2xl
                                        font-bold
                                        text-slate-900
                                    "
                                >

                                    {fullName ||
                                        "Agricultural Expert"}

                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    {specialization ||
                                        "Agriculturalist"}

                                </p>


                                {email && (

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
                                            size={15}
                                        />

                                        {email}

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="p-6 md:p-8"
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-6
                                md:grid-cols-2
                            "
                        >

                            {/* FULL NAME */}

                            <div>

                                <label
                                    htmlFor="fullName"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Full Name
                                </label>


                                <div className="relative">

                                    <User
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />


                                    <input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(event) =>
                                            setFullName(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your full name"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-sm
                                            text-slate-900
                                            outline-none
                                            transition
                                            focus:border-emerald-500
                                            focus:ring-2
                                            focus:ring-emerald-100
                                        "
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Email
                                </label>


                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />


                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        disabled
                                        className="
                                            w-full
                                            cursor-not-allowed
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-100
                                            py-3
                                            pl-10
                                            pr-4
                                            text-sm
                                            text-slate-500
                                            outline-none
                                        "
                                    />

                                </div>


                                <p
                                    className="
                                        mt-1.5
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    Email cannot be changed here.
                                </p>

                            </div>


                            {/* SPECIALIZATION */}

                            <div>

                                <label
                                    htmlFor="specialization"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Specialization
                                </label>


                                <div className="relative">

                                    <BriefcaseBusiness
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />


                                    <input
                                        id="specialization"
                                        type="text"
                                        value={specialization}
                                        onChange={(event) =>
                                            setSpecialization(
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. Crop Science"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-sm
                                            text-slate-900
                                            outline-none
                                            transition
                                            focus:border-emerald-500
                                            focus:ring-2
                                            focus:ring-emerald-100
                                        "
                                    />

                                </div>

                            </div>


                            {/* EXPERIENCE */}

                            <div>

                                <label
                                    htmlFor="experience"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Experience (Years)
                                </label>


                                <div className="relative">

                                    <BriefcaseBusiness
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />


                                    <input
                                        id="experience"
                                        type="number"
                                        min="0"
                                        value={experienceYears}
                                        onChange={(event) =>
                                            setExperienceYears(
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. 5"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-sm
                                            text-slate-900
                                            outline-none
                                            transition
                                            focus:border-emerald-500
                                            focus:ring-2
                                            focus:ring-emerald-100
                                        "
                                    />

                                </div>

                            </div>


                            {/* STATE */}

                            <div>

                                <label
                                    htmlFor="state"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    State
                                </label>


                                <div className="relative">

                                    <MapPin
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />


                                    <input
                                        id="state"
                                        type="text"
                                        value={state}
                                        onChange={(event) =>
                                            setState(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your state"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-sm
                                            text-slate-900
                                            outline-none
                                            transition
                                            focus:border-emerald-500
                                            focus:ring-2
                                            focus:ring-emerald-100
                                        "
                                    />

                                </div>

                            </div>


                            {/* DISTRICT */}

                            <div>

                                <label
                                    htmlFor="district"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    District
                                </label>


                                <div className="relative">

                                    <MapPin
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />


                                    <input
                                        id="district"
                                        type="text"
                                        value={district}
                                        onChange={(event) =>
                                            setDistrict(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your district"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-sm
                                            text-slate-900
                                            outline-none
                                            transition
                                            focus:border-emerald-500
                                            focus:ring-2
                                            focus:ring-emerald-100
                                        "
                                    />

                                </div>

                            </div>


                            {/* QUALIFICATION */}

                            <div>

                                <label
                                    htmlFor="qualification"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Qualification
                                </label>


                                <div className="relative">

                                    <GraduationCap
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />


                                    <input
                                        id="qualification"
                                        type="text"
                                        value={qualification}
                                        onChange={(event) =>
                                            setQualification(
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. B.Sc Agriculture"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-sm
                                            text-slate-900
                                            outline-none
                                            transition
                                            focus:border-emerald-500
                                            focus:ring-2
                                            focus:ring-emerald-100
                                        "
                                    />

                                </div>

                            </div>


                            {/* PHONE */}

                            <div>

                                <label
                                    htmlFor="phone"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Phone
                                </label>


                                <div className="relative">

                                    <Phone
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />


                                    <input
                                        id="phone"
                                        type="text"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter phone number"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-sm
                                            text-slate-900
                                            outline-none
                                            transition
                                            focus:border-emerald-500
                                            focus:ring-2
                                            focus:ring-emerald-100
                                        "
                                    />

                                </div>

                                <p
                                    className="
                                        mt-1.5
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    Phone is displayed from your profile.
                                </p>

                            </div>

                        </div>


                        {/* ==================================================
                            AVAILABILITY
                        ================================================== */}

                        <div
                            className="
                                mt-8
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <h3
                                        className="
                                            text-sm
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        Available for consultations
                                    </h3>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        When enabled, users can see you
                                        as an available agriculturalist.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setAvailability(
                                            !availability
                                        )
                                    }
                                    aria-pressed={
                                        availability
                                    }
                                    className={`
                                        relative
                                        h-7
                                        w-12
                                        shrink-0
                                        rounded-full
                                        transition
                                        ${
                                            availability
                                                ? "bg-emerald-600"
                                                : "bg-slate-300"
                                        }
                                    `}
                                >

                                    <span
                                        className={`
                                            absolute
                                            top-1
                                            h-5
                                            w-5
                                            rounded-full
                                            bg-white
                                            shadow
                                            transition
                                            ${
                                                availability
                                                    ? "left-6"
                                                    : "left-1"
                                            }
                                        `}
                                    />

                                </button>

                            </div>


                            <div
                                className="
                                    mt-3
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-medium
                                "
                            >

                                <span
                                    className={`
                                        h-2
                                        w-2
                                        rounded-full
                                        ${
                                            availability
                                                ? "bg-emerald-500"
                                                : "bg-slate-400"
                                        }
                                    `}
                                />

                                <span
                                    className={
                                        availability
                                            ? "text-emerald-700"
                                            : "text-slate-500"
                                    }
                                >
                                    {availability
                                        ? "Currently available"
                                        : "Currently unavailable"}
                                </span>

                            </div>

                        </div>


                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-col-reverse
                                gap-3
                                sm:flex-row
                                sm:justify-end
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/agriculturalist/dashboard"
                                    )
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={saving}
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
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-emerald-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >

                                {saving ? (

                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Saving...
                                    </>

                                ) : (

                                    <>
                                        <Save
                                            size={18}
                                        />

                                        Save Changes
                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </section>


                {/* ==================================================
                    PROFILE INFORMATION
                ================================================== */}

                {agriculturalist && (

                    <div
                        className="
                            mt-6
                            text-center
                            text-xs
                            text-slate-400
                        "
                    >

                        Agriculturalist account
                        {agriculturalist.id
                            ? ` • ID: ${agriculturalist.id}`
                            : ""}

                    </div>

                )}

            </div>

        </main>

    );

}