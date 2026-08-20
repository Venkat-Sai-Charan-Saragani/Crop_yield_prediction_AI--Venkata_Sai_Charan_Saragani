// ============================================================
// AXIOS API CLIENT
// frontend/src/services/api.ts
// ============================================================

import axios from "axios";

import {
    getToken,
    getAdminToken,
    getAgriculturalistToken,
} from "@/utils/auth";


// ============================================================
// API URL
// ============================================================

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";


// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({

    baseURL: API_URL,

    timeout: 15000,

    headers: {
        "Content-Type": "application/json",
    },

});


// ============================================================
// HELPER
// ============================================================

const setAuthorizationHeader = (
    config: any,
    token: string
) => {

    config.headers =
        config.headers || {};

    config.headers.Authorization =
        `Bearer ${token}`;

    return config;

};


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(

    (config) => {

        const url =
            config.url || "";


        console.log(
            "===================================="
        );

        console.log(
            "API REQUEST:",
            `${API_URL}${url}`
        );


        // ====================================================
        // ADMIN REQUESTS
        // ====================================================

        if (
            url === "/admin" ||
            url.startsWith("/admin/")
        ) {

            const adminToken =
                getAdminToken();


            console.log(
                "ADMIN REQUEST:"
            );

            console.log(
                "ADMIN TOKEN EXISTS:",
                Boolean(adminToken)
            );


            if (adminToken) {

                setAuthorizationHeader(
                    config,
                    adminToken
                );

            } else {

                console.warn(
                    "NO ADMIN TOKEN FOUND:",
                    url
                );

            }


            return config;
        }


        // ====================================================
        // AGRICULTURALIST PROTECTED ROUTES
        // ====================================================

        const agriculturalistProtectedRoutes = [

            "/agriculturalist/me",

            "/agriculturalist/dashboard",

            "/agriculturalist/predictions",

            "/agriculturalist/conversations",

            "/chat/agriculturalist",

            "/notifications/agriculturalist",

        ];


        const isAgriculturalistProtectedRoute =
            agriculturalistProtectedRoutes.some(

                (route) =>

                    url === route ||

                    url.startsWith(
                        `${route}/`
                    ) ||

                    url.startsWith(
                        `${route}?`
                    )

            );


        if (
            isAgriculturalistProtectedRoute
        ) {

            const agriculturalistToken =
                getAgriculturalistToken();


            console.log(
                "AGRICULTURALIST REQUEST:"
            );

            console.log(
                "AGRICULTURALIST TOKEN EXISTS:",
                Boolean(
                    agriculturalistToken
                )
            );


            if (
                agriculturalistToken
            ) {

                setAuthorizationHeader(
                    config,
                    agriculturalistToken
                );

            } else {

                console.warn(
                    "NO AGRICULTURALIST TOKEN FOUND:",
                    url
                );

            }


            return config;
        }


        // ====================================================
        // AGRICULTURALIST LOGIN
        // ====================================================

        if (
            url === "/agriculturalist/login"
        ) {

            console.log(
                "PUBLIC AGRICULTURALIST LOGIN REQUEST"
            );

            return config;
        }


        // ====================================================
        // AGRICULTURALIST REGISTER
        // ====================================================

        if (
            url === "/agriculturalist/register"
        ) {

            console.log(
                "PUBLIC AGRICULTURALIST REGISTER REQUEST"
            );

            return config;
        }


        // ====================================================
        // NORMAL USER REQUESTS
        // ====================================================

        const userToken =
            getToken();


        console.log(
            "USER REQUEST:"
        );

        console.log(
            "USER TOKEN EXISTS:",
            Boolean(userToken)
        );


        if (userToken) {

            setAuthorizationHeader(
                config,
                userToken
            );

        }


        return config;

    },

    (error) => {

        console.warn(
            "API REQUEST SETUP ERROR:",
            error
        );

        return Promise.reject(
            error
        );

    }

);


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(

    (response) => {

        console.log(
            "API RESPONSE:",
            response.config.url,
            response.status
        );

        return response;

    },

    (error) => {

        // ====================================================
        // NETWORK ERROR
        // ====================================================

        if (
            error?.response === undefined
        ) {

            console.warn(
                "===================================="
            );

            console.warn(
                "API NETWORK ERROR"
            );

            console.warn(
                "URL:",
                `${API_URL}${error?.config?.url || ""}`
            );

            console.warn(
                "MESSAGE:",
                error?.message
            );

            console.warn(
                "Make sure FastAPI is running on:",
                API_URL
            );

            console.warn(
                "===================================="
            );

        }

        // ====================================================
        // HTTP ERROR
        // ====================================================

        else {

            console.warn(
                "===================================="
            );

            console.warn(
                "API RESPONSE ERROR"
            );

            console.warn(
                "URL:",
                error?.config?.url
            );

            console.warn(
                "STATUS:",
                error?.response?.status
            );

            console.warn(
                "DATA:",
                error?.response?.data
            );


            // ------------------------------------------------
            // ADMIN AUTHENTICATION ERROR
            // ------------------------------------------------

            if (
                error?.config?.url?.startsWith(
                    "/admin/"
                )
            ) {

                if (
                    error?.response?.status === 401
                ) {

                    console.warn(
                        "ADMIN AUTHENTICATION FAILED."
                    );

                    console.warn(
                        "The admin token is missing, invalid, or expired."
                    );

                }


                if (
                    error?.response?.status === 403
                ) {

                    console.warn(
                        "ADMIN AUTHORIZATION FAILED."
                    );

                    console.warn(
                        "The authenticated user does not have admin privileges."
                    );

                }

            }


            console.warn(
                "===================================="
            );

        }


        return Promise.reject(
            error
        );

    }

);


// ============================================================
// EXPORT
// ============================================================

export default api;