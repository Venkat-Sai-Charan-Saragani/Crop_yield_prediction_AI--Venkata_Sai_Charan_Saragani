// ============================================================
// AGRICULTURALIST SERVICE
//
// frontend/src/services/agriculturalist.ts
// ============================================================

import api from "@/services/api";

import {
    getAuthHeaders,
    getAgriculturalistAuthHeaders,
    removeAgriculturalistToken,
} from "@/utils/auth";


// ============================================================
// COMMON API RESPONSE
// ============================================================

export interface ApiMessageResponse {
    success: boolean;
    message?: string;
}


// ============================================================
// REGISTER REQUEST
// ============================================================

export interface AgriculturalistRegisterRequest {

    full_name: string;

    email: string;

    password: string;

    specialization?: string;

    government_id: string;

    experience_years?: number;

    state?: string;

    district?: string;
}


// ============================================================
// LOGIN REQUEST
// ============================================================

export interface AgriculturalistLoginRequest {

    email: string;

    password: string;
}


// ============================================================
// AGRICULTURALIST OBJECT
// ============================================================

export interface AgriculturalistPublic {

    id?: string;

    _id?: string;

    full_name?: string;

    name?: string;

    username?: string;

    display_name?: string;

    email?: string;

    profile_image?: string | null;

    specialization?: string;

    government_id?: string;

    issuing_authority?: string;

    verification_document?: string | null;

    verification_document_name?: string | null;

    verification_submitted_at?: string | null;

    reviewed_at?: string | null;

    reviewed_by?: string | null;

    rejection_reason?: string;

    experience_years?: number;

    experience?: number | string;

    state?: string;

    district?: string;

    qualification?: string;

    phone?: string;

    location?: string;

    availability?: boolean;

    is_available?: boolean;

    status?: string;

    role?: string;

    created_at?: string;

    updated_at?: string;

    [key: string]: unknown;
}


// ============================================================
// COMPATIBILITY TYPE
//
// Some existing pages import "Agriculturalist".
// Keep Agriculturalist as an alias so existing pages continue
// to work without changing their core functionality.
// ============================================================

export type Agriculturalist =
    AgriculturalistPublic;


// ============================================================
// LOGIN RESPONSE
// ============================================================

export interface AgriculturalistLoginResponse {

    success: boolean;

    message?: string;

    token?: string;

    access_token?: string;

    email?: string;

    role?: string;

    agriculturalist?: AgriculturalistPublic;

    [key: string]: unknown;
}


// ============================================================
// REGISTER RESPONSE
// ============================================================

export interface AgriculturalistRegisterResponse {

    success: boolean;

    message?: string;

    token?: string;

    access_token?: string;

    role?: string;

    agriculturalist?: AgriculturalistPublic;

    [key: string]: unknown;
}


// ============================================================
// PROFILE UPDATE
// ============================================================

export interface AgriculturalistProfileUpdateRequest {

    full_name?: string;

    specialization?: string;

    experience_years?: number;

    state?: string;

    district?: string;

    availability?: boolean;

    profile_image?: string;
}


// ============================================================
// PREDICTION
// ============================================================

export interface AgriculturalistPrediction {

    id: string;

    _id?: string;

    user_id?: string;

    user_name?: string;

    user_email?: string;

    crop?: string;

    crop_name?: string;

    area?: string | number;

    rainfall?: number;

    pesticides?: number;

    temperature?: number;

    year?: number;

    predicted_yield?: number | string;

    yield?: number | string;

    created_at?: string;

    [key: string]: unknown;
}


// ============================================================
// NOTIFICATION
// ============================================================

export interface AgriculturalistNotification {

    id: string;

    _id?: string;

    agriculturalist_id?: string;

    title?: string;

    message?: string;

    notification_type?: string;

    type?: string;

    consultation_id?: string;

    prediction_id?: string;

    is_read: boolean;

    created_at?: string;

    [key: string]: unknown;
}


// ============================================================
// USER / FARMER OBJECT
// ============================================================

export interface ConversationUser {

    id?: string;

    _id?: string;

    full_name?: string;

    name?: string;

    username?: string;

    display_name?: string;

    email?: string;

    profile_image?: string | null;

    [key: string]: unknown;
}


// ============================================================
// CONVERSATION
// ============================================================

export interface AgriculturalistConversation {

    id?: string;

    _id?: string;

    conversation_id?: string;

    user_id: string;

    agriculturalist_id?: string;

    agriculturalist_name?: string;

    agriculturalist_email?: string;

    user_name?: string;

    user_email?: string;

    farmer_name?: string;

    farmer_email?: string;

    full_name?: string;

    name?: string;

    username?: string;

    display_name?: string;

    user?: ConversationUser;

    farmer?: ConversationUser;

    last_message?: string;

    last_message_at?: string | null;

    unread_count?: number;

    [key: string]: unknown;
}


// ============================================================
// CHAT MESSAGE
// ============================================================

export interface ChatMessage {

    id: string;

    _id?: string;

    conversation_id: string;

    sender_id: string;

    receiver_id: string;

    message: string;

    is_read: boolean;

    created_at: string;

    [key: string]: unknown;
}


// ============================================================
// AGRICULTURALIST REGISTER
//
// POST /agriculturalist/register
// ============================================================

export const agriculturalistRegister = async (
    data: AgriculturalistRegisterRequest
): Promise<AgriculturalistRegisterResponse> => {

    try {

        const response = await api.post(
            "/agriculturalist/register",
            {
                full_name:
                    data.full_name.trim(),

                email:
                    data.email
                        .trim()
                        .toLowerCase(),

                password:
                    data.password,

                specialization:
                    data.specialization?.trim() || "",

                government_id:
                    data.government_id.trim(),

                experience_years:
                    data.experience_years ?? 0,

                state:
                    data.state?.trim() || "",

                district:
                    data.district?.trim() || "",
            }
        );

        const responseData =
            response.data || {};

        console.log(
            "AGRICULTURALIST REGISTER RESPONSE:",
            responseData
        );

        const token =
            responseData.token ||
            responseData.access_token ||
            responseData.agriculturalist?.token ||
            responseData.agriculturalist?.access_token;

        return {

            ...responseData,

            success:
                responseData.success !== false,

            message:
                responseData.message ||
                "Agriculturalist account created successfully.",

            token,

            access_token:
                responseData.access_token ||
                token,

            role:
                responseData.role ||
                "agriculturalist",

            agriculturalist:
                responseData.agriculturalist,
        };

    } catch (error: any) {

        console.error(
            "AGRICULTURALIST REGISTER ERROR:",
            error?.response?.data || error
        );

        const backendData =
            error?.response?.data;

        return {

            success: false,

            message:
                backendData?.message ||
                backendData?.detail ||
                "Unable to create agriculturalist account.",
        };
    }
};


// ============================================================
// AGRICULTURALIST LOGIN
//
// POST /agriculturalist/login
// ============================================================

export const agriculturalistLogin = async (
    credentials: AgriculturalistLoginRequest
): Promise<AgriculturalistLoginResponse> => {

    try {

        const response = await api.post(
            "/agriculturalist/login",
            {
                email:
                    credentials.email
                        .trim()
                        .toLowerCase(),

                password:
                    credentials.password,
            }
        );

        const data =
            response.data || {};

        console.log(
            "AGRICULTURALIST LOGIN RESPONSE:",
            data
        );

        const token =
            data.token ||
            data.access_token ||
            data.agriculturalist?.token ||
            data.agriculturalist?.access_token;

        const email =
            data.email ||
            data.agriculturalist?.email ||
            credentials.email
                .trim()
                .toLowerCase();

        const role =
            data.role ||
            data.agriculturalist?.role ||
            "agriculturalist";

        return {

            ...data,

            success:
                data.success !== false,

            message:
                data.message ||
                "Login successful.",

            token,

            access_token:
                data.access_token ||
                token,

            email,

            role,

            agriculturalist:
                data.agriculturalist,
        };

    } catch (error: any) {

        console.error(
            "AGRICULTURALIST LOGIN ERROR:",
            error?.response?.data || error
        );

        const backendData =
            error?.response?.data;

        return {

            success: false,

            message:
                backendData?.message ||
                backendData?.detail ||
                "Invalid agriculturalist email or password.",
        };
    }
};


// ============================================================
// GET AGRICULTURALIST PROFILE
//
// GET /agriculturalist/me
// ============================================================

export const getAgriculturalistProfile =
    async (): Promise<{
        success: boolean;
        message?: string;
        agriculturalist?: AgriculturalistPublic;
    }> => {

        try {

            const response =
                await api.get(
                    "/agriculturalist/me",
                    {
                        headers:
                            getAgriculturalistAuthHeaders(),
                    }
                );

            const data =
                response.data || {};

            return {

                success:
                    data.success !== false,

                message:
                    data.message,

                agriculturalist:
                    data.agriculturalist ||
                    data.user ||
                    data,
            };

        } catch (error: any) {

            console.error(
                "AGRICULTURALIST PROFILE ERROR:",
                error?.response?.data || error
            );

            return {

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Unable to load agriculturalist profile.",
            };
        }
    };


// ============================================================
// UPDATE AGRICULTURALIST PROFILE
//
// PUT /agriculturalist/me
// ============================================================

export const updateAgriculturalistProfile =
    async (
        data: AgriculturalistProfileUpdateRequest
    ): Promise<{
        success: boolean;
        message?: string;
        agriculturalist?: AgriculturalistPublic;
    }> => {

        try {

            const response =
                await api.put(
                    "/agriculturalist/me",
                    data,
                    {
                        headers:
                            getAgriculturalistAuthHeaders(),
                    }
                );

            const responseData =
                response.data || {};

            return {

                success:
                    responseData.success !== false,

                message:
                    responseData.message ||
                    "Profile updated successfully.",

                agriculturalist:
                    responseData.agriculturalist ||
                    responseData.user ||
                    responseData,
            };

        } catch (error: any) {

            console.error(
                "AGRICULTURALIST PROFILE UPDATE ERROR:",
                error?.response?.data || error
            );

            return {

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Unable to update agriculturalist profile.",
            };
        }
    };


// ============================================================
// GET AVAILABLE AGRICULTURALISTS
//
// GET /agriculturalist/available
// ============================================================

export const getAvailableAgriculturalists =
    async (): Promise<{
        success: boolean;
        message?: string;
        agriculturalists: AgriculturalistPublic[];
    }> => {

        try {

            const response =
                await api.get(
                    "/agriculturalist/available"
                );

            const data =
                response.data || {};

            const rawAgriculturalists =
                Array.isArray(
                    data.agriculturalists
                )
                    ? data.agriculturalists
                    : Array.isArray(data.data)
                        ? data.data
                        : [];

            const agriculturalists =
                rawAgriculturalists.map(
                    (agriculturalist: any) => {

                        const fullName =
                            agriculturalist.full_name ||
                            agriculturalist.name ||
                            agriculturalist.display_name ||
                            agriculturalist.username ||
                            "";

                        const experienceYears =
                            agriculturalist.experience_years ??
                            agriculturalist.experience ??
                            0;

                        const available =
                            agriculturalist.is_available ??
                            agriculturalist.availability ??
                            true;

                        return {

                            ...agriculturalist,

                            full_name:
                                fullName,

                            name:
                                fullName,

                            experience_years:
                                experienceYears,

                            experience:
                                experienceYears,

                            is_available:
                                available,

                            availability:
                                available,

                        } as AgriculturalistPublic;
                    }
                );

            return {

                success:
                    data.success !== false,

                message:
                    data.message,

                agriculturalists,
            };

        } catch (error: any) {

            console.error(
                "AVAILABLE AGRICULTURALISTS ERROR:",
                error?.response?.data || error
            );

            return {

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Unable to load agriculturalists.",

                agriculturalists: [],
            };
        }
    };


// ============================================================
// COMPATIBILITY ALIAS
//
// Existing Help Desk page expects:
// getAgriculturalists()
// ============================================================

export const getAgriculturalists =
    getAvailableAgriculturalists;


// ============================================================
// GET AGRICULTURALIST PREDICTIONS
//
// GET /agriculturalist/predictions
// ============================================================

export const getAgriculturalistPredictions =
    async (): Promise<{
        success: boolean;
        message?: string;
        predictions: AgriculturalistPrediction[];
    }> => {

        try {

            const response =
                await api.get(
                    "/agriculturalist/predictions",
                    {
                        headers:
                            getAgriculturalistAuthHeaders(),
                    }
                );

            const data =
                response.data || {};

            return {

                success:
                    data.success !== false,

                message:
                    data.message,

                predictions:
                    data.predictions || [],
            };

        } catch (error: any) {

            console.error(
                "AGRICULTURALIST PREDICTIONS ERROR:",
                error?.response?.data || error
            );

            return {

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Unable to load predictions.",

                predictions: [],
            };
        }
    };


// ============================================================
// GET NOTIFICATIONS
//
// GET /notifications/agriculturalist
// ============================================================

export const getNotifications =
    async (): Promise<{
        success: boolean;
        message?: string;
        notifications: AgriculturalistNotification[];
    }> => {

        try {

            const response =
                await api.get(
                    "/notifications/agriculturalist",
                    {
                        headers:
                            getAgriculturalistAuthHeaders(),
                    }
                );

            const data =
                response.data || {};

            return {

                success:
                    data.success !== false,

                message:
                    data.message,

                notifications:
                    Array.isArray(data.notifications)
                        ? data.notifications
                        : [],
            };

        } catch (error: any) {

            console.error(
                "AGRICULTURALIST NOTIFICATIONS ERROR:",
                error?.response?.data || error
            );

            return {

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Unable to load notifications.",

                notifications: [],
            };
        }
    };


// ============================================================
// MARK NOTIFICATION AS READ
//
// Existing Notifications page expects:
// markNotificationRead(notificationId)
//
// NOTE:
// This uses the agriculturalist notification endpoint.
// ============================================================

export const markNotificationRead =
    async (
        notificationId: string
    ): Promise<ApiMessageResponse> => {

        if (!notificationId) {

            return {

                success: false,

                message:
                    "Notification ID is missing.",
            };
        }

        try {

            const response =
                await api.patch(
                    `/notifications/agriculturalist/${encodeURIComponent(
                        notificationId
                    )}/read`,
                    {},
                    {
                        headers:
                            getAgriculturalistAuthHeaders(),
                    }
                );

            const data =
                response.data || {};

            return {

                success:
                    data.success !== false,

                message:
                    data.message ||
                    "Notification marked as read.",
            };

        } catch (error: any) {

            console.error(
                "MARK NOTIFICATION READ ERROR:",
                error?.response?.data || error
            );

            return {

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Unable to mark notification as read.",
            };
        }
    };


// ============================================================
// GET AGRICULTURALIST CONVERSATIONS
//
// GET /chat/agriculturalist/conversations
// ============================================================

export const getAgriculturalistConversations =
    async (): Promise<{
        success: boolean;
        message?: string;
        conversations: AgriculturalistConversation[];
    }> => {

        try {

            const response =
                await api.get(
                    "/chat/agriculturalist/conversations",
                    {
                        headers:
                            getAgriculturalistAuthHeaders(),
                    }
                );

            const data =
                response.data || {};

            console.log(
                "RAW AGRICULTURALIST CONVERSATIONS:",
                data
            );

            const rawConversations =
                Array.isArray(data.conversations)
                    ? data.conversations
                    : Array.isArray(data.data)
                        ? data.data
                        : [];

            const conversations =
                rawConversations.map(
                    (conversation: any) => {

                        const nestedUser =
                            conversation.user ||
                            conversation.farmer ||
                            {};

                        const farmerName =
                            conversation.user_name ||
                            conversation.farmer_name ||
                            conversation.full_name ||
                            conversation.name ||
                            conversation.username ||
                            conversation.display_name ||
                            nestedUser.full_name ||
                            nestedUser.name ||
                            nestedUser.username ||
                            "";

                        const farmerEmail =
                            conversation.user_email ||
                            conversation.farmer_email ||
                            nestedUser.email ||
                            "";

                        const farmerId =
                            conversation.user_id ||
                            nestedUser.id ||
                            nestedUser._id ||
                            "";

                        return {

                            ...conversation,

                            user_id:
                                farmerId,

                            user_name:
                                farmerName,

                            farmer_name:
                                farmerName,

                            user_email:
                                farmerEmail,

                            farmer_email:
                                farmerEmail,

                        } as AgriculturalistConversation;
                    }
                );

            return {

                success:
                    data.success !== false,

                message:
                    data.message,

                conversations,
            };

        } catch (error: any) {

            console.error(
                "AGRICULTURALIST CONVERSATIONS ERROR:",
                error?.response?.data || error
            );

            return {

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Unable to load conversations.",

                conversations: [],
            };
        }
    };


// ============================================================
// GET USER'S AGRICULTURALIST CONVERSATIONS
//
// GET /chat/user/conversations
// ============================================================

export const getUserAgriculturalistConversations =
    async (): Promise<{
        success: boolean;
        message?: string;
        conversations: AgriculturalistConversation[];
    }> => {

        try {

            const response =
                await api.get(
                    "/chat/user/conversations",
                    {
                        headers:
                            getAuthHeaders(),
                    }
                );

            const data =
                response.data || {};

            return {

                success:
                    data.success !== false,

                message:
                    data.message,

                conversations:
                    data.conversations || [],
            };

        } catch (error: any) {

            console.error(
                "USER AGRICULTURALIST CONVERSATIONS ERROR:",
                error?.response?.data || error
            );

            return {

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Unable to load conversations.",

                conversations: [],
            };
        }
    };


// ============================================================
// GET USER → AGRICULTURALIST CHAT
//
// GET /chat/user/{agriculturalist_id}
// ============================================================

export const getUserAgriculturalistConversation =
    async (
        agriculturalistId: string
    ): Promise<{
        success: boolean;
        message?: string;
        conversation?: AgriculturalistConversation | null;
        messages: ChatMessage[];
    }> => {

        try {

            if (!agriculturalistId) {

                return {

                    success: false,

                    message:
                        "Agriculturalist ID is missing.",

                    messages: [],
                };
            }

            const response =
                await api.get(
                    `/chat/user/${encodeURIComponent(
                        agriculturalistId
                    )}`,
                    {
                        headers:
                            getAuthHeaders(),
                    }
                );

            const data =
                response.data || {};

            return {

                success:
                    data.success !== false,

                message:
                    data.message,

                conversation:
                    data.conversation || null,

                messages:
                    Array.isArray(data.messages)
                        ? data.messages
                        : [],
            };

        } catch (error: any) {

            console.error(
                "USER AGRICULTURALIST CHAT ERROR:",
                error?.response?.data || error
            );

            return {

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Unable to load conversation.",

                messages: [],
            };
        }
    };


// ============================================================
// COMPATIBILITY ALIAS
//
// Existing Help Desk page expects:
// getConversation(agriculturalistId)
// ============================================================

export const getConversation =
    getUserAgriculturalistConversation;


// ============================================================
// SEND USER → AGRICULTURALIST MESSAGE
//
// POST /chat/message
// ============================================================

export const sendUserAgriculturalistMessage =
    async (
        agriculturalistId: string,
        message: string
    ): Promise<{
        success: boolean;
        message?: string;
        chat_message?: ChatMessage;
    }> => {

        const cleanMessage =
            message.trim();

        if (!agriculturalistId) {

            return {

                success: false,

                message:
                    "Agriculturalist ID is missing.",
            };
        }

        if (!cleanMessage) {

            return {

                success: false,

                message:
                    "Message cannot be empty.",
            };
        }

        try {

            const response =
                await api.post(
                    "/chat/message",
                    {
                        receiver_id:
                            agriculturalistId,

                        message:
                            cleanMessage,
                    },
                    {
                        headers:
                            getAuthHeaders(),
                    }
                );

            const data =
                response.data || {};

            return {

                success:
                    data.success !== false,

                message:
                    data.message,

                chat_message:
                    data.chat_message ||
                    data.data,
            };

        } catch (error: any) {

            console.error(
                "SEND USER AGRICULTURALIST MESSAGE ERROR:",
                error?.response?.data || error
            );

            return {

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Unable to send message.",
            };
        }
    };


// ============================================================
// COMPATIBILITY ALIAS
//
// Existing Help Desk page expects:
// sendChatMessage(agriculturalistId, message)
// ============================================================

export const sendChatMessage =
    sendUserAgriculturalistMessage;


// ============================================================
// AGRICULTURALIST LOGOUT
// ============================================================

export const agriculturalistLogout =
    (): void => {

        removeAgriculturalistToken();

    };



