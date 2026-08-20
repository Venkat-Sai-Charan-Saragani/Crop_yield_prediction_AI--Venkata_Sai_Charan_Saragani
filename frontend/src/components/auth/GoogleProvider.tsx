"use client";

import {
    GoogleOAuthProvider
} from "@react-oauth/google";


interface GoogleProviderProps {

    children: React.ReactNode;

}


export default function GoogleProvider({
    children
}: GoogleProviderProps) {

    const clientId =
        process.env
            .NEXT_PUBLIC_GOOGLE_CLIENT_ID;


    if (!clientId) {

        console.error(
            "NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing"
        );

    }


    return (

        <GoogleOAuthProvider
            clientId={clientId || ""}
        >

            {children}

        </GoogleOAuthProvider>

    );

}