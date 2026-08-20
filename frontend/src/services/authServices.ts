"use client";

// ============================================================
// USER AUTHENTICATION SERVICE
// frontend/src/services/authServices.ts
// ============================================================

import api from "@/services/api";

import {
    saveToken as saveStoredToken,
    getToken as getStoredToken,
    removeToken as removeStoredToken,
    saveEmail as saveStoredEmail,
    getEmail as getStoredEmail,
    saveRole as saveStoredRole,
    getRole as getStoredRole,
} from "@/utils/auth";

// ============================================================
// TYPES
// ============================================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface GoogleLoginRequest {
    code: string;
}

export interface AuthResponse {
    success: boolean;

    message?: string;

    token?: string;

    access_token?: string;

    email?: string;

    role?: string;

    user?: {
        id?: string;
        _id?: string;
        name?: string;
        email?: string;
        role?: string;
        token?: string;
        access_token?: string;
    };

    [key: string]: any;
}

// ============================================================
// BROWSER CHECK
// ============================================================

const isBrowser = (): boolean => {

    return typeof window !== "undefined";
};

// ============================================================
// SAVE USER TOKEN
// ============================================================

export const saveToken = (
    token: string
): void => {

    if (
        !isBrowser() ||
        !token
    ) {
        return;
    }

    saveStoredToken(
        token
    );
};

// ============================================================
// GET USER TOKEN
// ============================================================

export const getToken = (): string | null => {

    return getStoredToken();
};

// ============================================================
// REMOVE USER TOKEN
// ============================================================

export const removeToken = (): void => {

    removeStoredToken();
};

// ============================================================
// SAVE USER EMAIL
// ============================================================

export const saveEmail = (
    email: string
): void => {

    if (
        !isBrowser() ||
        !email
    ) {
        return;
    }

    saveStoredEmail(
        email
    );
};

// ============================================================
// GET USER EMAIL
// ============================================================

export const getEmail = (): string | null => {

    return getStoredEmail();
};

// ============================================================
// SAVE USER ROLE
// ============================================================

export const saveRole = (
    role: string
): void => {

    if (
        !isBrowser() ||
        !role
    ) {
        return;
    }

    saveStoredRole(
        role
    );
};

// ============================================================
// GET USER ROLE
// ============================================================

export const getRole = (): string | null => {

    return getStoredRole();
};

// ============================================================
// EXTRACT TOKEN
// ============================================================

const extractToken = (
    data: any
): string | null => {

    return (

        data?.token ||

        data?.access_token ||

        data?.accessToken ||

        data?.user?.token ||

        data?.user?.access_token ||

        null
    );
};

// ============================================================
// SAVE AUTH DATA
// ============================================================

const saveAuthData = (
    data: any,
    fallbackEmail?: string
): string | null => {

    const token =
        extractToken(data);

    if (!token) {
        return null;
    }

    saveToken(
        token
    );

    const email =
        data?.email ||
        data?.user?.email ||
        fallbackEmail;

    if (email) {

        saveEmail(
            email
        );
    }

    const role =
        data?.role ||
        data?.user?.role;

    if (role) {

        saveRole(
            role
        );
    }

    return token;
};

// ============================================================
// LOGIN USER
// ============================================================

export const loginUser = async (
    credentials: LoginRequest
): Promise<AuthResponse> => {

    try {

        const response =
            await api.post(
                "/users/login",
                {
                    email:
                        credentials.email.trim(),

                    password:
                        credentials.password,
                }
            );

        const data =
            response.data || {};

        const token =
            saveAuthData(
                data,
                credentials.email.trim()
            );

        return {

            ...data,

            success:
                data.success !== false &&
                Boolean(token),

            token:
                token || undefined,

            email:
                data.email ||
                data.user?.email ||
                credentials.email.trim(),

            role:
                data.role ||
                data.user?.role,
        };

    } catch (error: any) {

        console.error(
            "USER LOGIN ERROR:",
            error?.response?.data ||
            error
        );

        const backendData =
            error?.response?.data;

        return {

            success: false,

            message:
                backendData?.message ||
                backendData?.detail ||
                "Invalid email or password.",
        };
    }
};

// ============================================================
// REGISTER USER
// ============================================================

export const registerUser = async (
    data: RegisterRequest
): Promise<AuthResponse> => {

    try {

        const response =
            await api.post(
                "/users/register",
                {
                    name:
                        data.name.trim(),

                    email:
                        data.email.trim(),

                    password:
                        data.password,
                }
            );

        const responseData =
            response.data || {};

        return {

            ...responseData,

            success:
                responseData.success !== false,

            message:
                responseData.message ||
                "Account created successfully.",
        };

    } catch (error: any) {

        console.error(
            "USER REGISTER ERROR:",
            error?.response?.data ||
            error
        );

        const backendData =
            error?.response?.data;

        return {

            success: false,

            message:
                backendData?.message ||
                backendData?.detail ||
                "Unable to create account.",
        };
    }
};

// ============================================================
// GOOGLE LOGIN
// ============================================================

export const googleLoginUser = async (
    code: string
): Promise<AuthResponse> => {

    try {

        if (!code) {

            return {

                success: false,

                message:
                    "Google authorization code is missing.",
            };
        }

        console.log(
            "GOOGLE LOGIN: sending authorization code..."
        );

        const response =
            await api.post(
                "/users/google-login",
                {
                    code,
                }
            );

        const data =
            response.data || {};

        console.log(
            "GOOGLE LOGIN RESPONSE:",
            data
        );

        const token =
            saveAuthData(
                data
            );

        if (!token) {

            return {

                ...data,

                success: false,

                message:
                    data.message ||
                    data.detail ||
                    "Google login succeeded but no authentication token was returned.",
            };
        }

        return {

            ...data,

            success: true,

            token,

            email:
                data.email ||
                data.user?.email,

            role:
                data.role ||
                data.user?.role,
        };

    } catch (error: any) {

        console.error(
            "GOOGLE LOGIN ERROR:",
            error?.response?.data ||
            error
        );

        const backendData =
            error?.response?.data;

        return {

            success: false,

            message:
                backendData?.message ||
                backendData?.detail ||
                "Unable to login with Google. Please try again.",
        };
    }
};

// ============================================================
// GOOGLE REGISTER
// ============================================================

export const googleRegisterUser = async (
    code: string
): Promise<AuthResponse> => {

    try {

        if (!code) {

            return {

                success: false,

                message:
                    "Google authorization code is missing.",
            };
        }

        const response =
            await api.post(
                "/users/google-register",
                {
                    code,
                }
            );

        const data =
            response.data || {};

        const token =
            saveAuthData(
                data
            );

        return {

            ...data,

            success:
                data.success !== false &&
                Boolean(token),

            token:
                token || undefined,

            email:
                data.email ||
                data.user?.email,

            role:
                data.role ||
                data.user?.role,
        };

    } catch (error: any) {

        console.error(
            "GOOGLE REGISTER ERROR:",
            error?.response?.data ||
            error
        );

        const backendData =
            error?.response?.data;

        return {

            success: false,

            message:
                backendData?.message ||
                backendData?.detail ||
                "Unable to register with Google.",
        };
    }
};