"use client";

import {
    FormEvent,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    Loader2,
    AlertCircle,
} from "lucide-react";

import api from "@/services/api";

import {
    saveToken,
    saveEmail,
    saveRole,
} from "@/utils/auth";


export default function LoginForm() {

    const router =
        useRouter();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError("");


        if (!email.trim() || !password) {

            setError(
                "Please enter your email and password."
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await api.post(
                    "/users/login",
                    {
                        email: email.trim(),
                        password,
                    }
                );


            const data =
                response.data;


            if (
                data?.success === false
            ) {

                throw new Error(
                    data.message ||
                    "Invalid email or password."
                );

            }


            const token =
                data?.access_token ||
                data?.accessToken ||
                data?.token;


            if (!token) {

                throw new Error(
                    "Login succeeded, but no authentication token was returned."
                );

            }


            saveToken(token);

            saveEmail(
                data?.email ||
                email.trim()
            );

            saveRole(
                data?.role ||
                "user"
            );


            router.replace(
                "/dashboard"
            );

        }
        catch (error: any) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            setError(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "Login failed. Please check your credentials."
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            {error && (

                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                    <AlertCircle
                        size={18}
                        className="shrink-0"
                    />

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* EMAIL */}

            <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                    Email Address

                </label>


                <div className="relative">

                    <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />


                    <input

                        type="email"

                        value={email}

                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }

                        placeholder="you@example.com"

                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"

                    />

                </div>

            </div>


            {/* PASSWORD */}

            <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                    Password

                </label>


                <div className="relative">

                    <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />


                    <input

                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }

                        value={password}

                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }

                        placeholder="Enter your password"

                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"

                    />


                    <button

                        type="button"

                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }

                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700"

                    >

                        {showPassword
                            ? <EyeOff size={18} />
                            : <Eye size={18} />
                        }

                    </button>

                </div>

            </div>


            {/* BUTTON */}

            <button

                type="submit"

                disabled={loading}

                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"

            >

                {loading ? (

                    <>

                        <Loader2
                            size={19}
                            className="animate-spin"
                        />

                        Signing in...

                    </>

                ) : (

                    "Sign In"

                )}

            </button>

        </form>

    );

}