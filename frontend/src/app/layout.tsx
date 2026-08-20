import type {
    Metadata,
} from "next";

import {
    Geist,
    Geist_Mono,
} from "next/font/google";

import "./globals.css";

import GoogleProvider
    from "@/components/auth/GoogleProvider";

import {
    LanguageProvider,
} from "@/context/LanguageContext";


const geistSans =
    Geist({

        variable:
            "--font-geist-sans",

        subsets:
            ["latin"],

    });


const geistMono =
    Geist_Mono({

        variable:
            "--font-geist-mono",

        subsets:
            ["latin"],

    });


export const metadata: Metadata = {

    title:
        "Crop Yield Prediction AI",

    description:
        "AI Crop Yield Prediction & Agricultural Productivity Forecasting System",

};


export default function RootLayout({

    children,

}: Readonly<{

    children:
        React.ReactNode;

}>) {

    return (

        <html
            lang="en"
            className={`
                ${geistSans.variable}
                ${geistMono.variable}
                h-full
                antialiased
            `}
        >

            <body
                className="
                    min-h-full
                    flex
                    flex-col
                "
            >

                <LanguageProvider>

                    <GoogleProvider>

                        {children}

                    </GoogleProvider>

                </LanguageProvider>

            </body>

        </html>

    );

}