import api from "@/services/api";

// ============================================================
// TYPES
// ============================================================

export interface UserChatMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export interface ChatConversation {
    id: string;
    _id?: string;
    conversation_id?: string;
    user_id: string;
    agriculturalist_id: string;
    agriculturalist_name?: string;
    agriculturalist_email?: string;
    name?: string;
    full_name?: string;
    user_name?: string;
    last_message: string;
    user_email?: string;
    last_message_at: string | null;
    unread_count?: number;
    [key: string]: unknown;
}

export interface SendMessageResponse {
    success: boolean;
    message: string;
    chat_message: UserChatMessage;
}

export interface GetConversationResponse {
    success: boolean;
    message?: string;
    conversation?: ChatConversation | null;
    messages: UserChatMessage[];
}

export interface UserConversationsResponse {
    success: boolean;
    message?: string;
    conversations: ChatConversation[];
}

export interface AgriculturalistConversationsResponse {
    success: boolean;
    message?: string;
    conversations: ChatConversation[];
}

// ============================================================
// USER SEND MESSAGE
//
// POST /chat/message
// ============================================================

export async function sendUserMessage(
    agriculturalistId: string,
    message: string
): Promise<SendMessageResponse> {

    if (!agriculturalistId) {
        throw new Error(
            "Agriculturalist ID is missing."
        );
    }

    if (!message.trim()) {
        throw new Error(
            "Message cannot be empty."
        );
    }

    try {

        const response = await api.post(
            "/chat/message",
            {
                receiver_id: agriculturalistId,
                message: message.trim(),
            }
        );

        return response.data;

    } catch (error: any) {

        console.error(
            "SEND USER MESSAGE ERROR:",
            {
                url: error?.config?.url,
                status: error?.response?.status,
                response: error?.response?.data,
                message: error?.message,
            }
        );

        throw error;
    }
}

// ============================================================
// USER GET ALL CONVERSATIONS
//
// GET /chat/user/conversations
//
// THIS IS REQUIRED FOR:
// frontend/src/app/chat/page.tsx
// ============================================================

export async function getUserConversations()
    : Promise<UserConversationsResponse> {

    try {

        const response = await api.get(
            "/chat/user/conversations"
        );

        return response.data;

    } catch (error: any) {

        console.error(
            "GET USER CONVERSATIONS ERROR:",
            {
                url: error?.config?.url,
                status: error?.response?.status,
                response: error?.response?.data,
                message: error?.message,
            }
        );

        throw error;
    }
}

// ============================================================
// USER GET ONE CONVERSATION
//
// GET /chat/user/{agriculturalist_id}
// ============================================================

export async function getUserConversation(
    agriculturalistId: string
): Promise<GetConversationResponse> {

    if (!agriculturalistId) {
        throw new Error(
            "Agriculturalist ID is missing."
        );
    }

    try {

        const response = await api.get(
            `/chat/user/${encodeURIComponent(
                agriculturalistId
            )}`
        );

        return response.data;

    } catch (error: any) {

        console.error(
            "GET USER CONVERSATION ERROR:",
            {
                url: error?.config?.url,
                status: error?.response?.status,
                response: error?.response?.data,
                message: error?.message,
            }
        );

        throw error;
    }
}

// ============================================================
// USER GET CONVERSATION
//
// ALIAS
//
// This allows older frontend code using a different
// function name to continue working.
// ============================================================

export async function getConversation(
    agriculturalistId: string
): Promise<GetConversationResponse> {

    return getUserConversation(
        agriculturalistId
    );
}

// ============================================================
// AGRICULTURALIST GET ALL CONVERSATIONS
//
// GET /chat/agriculturalist/conversations
// ============================================================

export async function getAgriculturalistConversations()
    : Promise<AgriculturalistConversationsResponse> {

    try {

        const response = await api.get(
            "/chat/agriculturalist/conversations"
        );

        return response.data;

    } catch (error: any) {

        console.error(
            "GET AGRICULTURALIST CONVERSATIONS ERROR:",
            {
                url: error?.config?.url,
                status: error?.response?.status,
                response: error?.response?.data,
                message: error?.message,
            }
        );

        throw error;
    }
}

// ============================================================
// AGRICULTURALIST GET ONE CONVERSATION
//
// GET /chat/agriculturalist/conversations/{user_id}
// ============================================================

export async function getAgriculturalistConversation(
    userId: string
): Promise<GetConversationResponse> {

    if (!userId) {
        throw new Error(
            "User ID is missing."
        );
    }

    try {

        const response = await api.get(
            `/chat/agriculturalist/conversations/${encodeURIComponent(
                userId
            )}`
        );

        return response.data;

    } catch (error: any) {

        console.error(
            "GET AGRICULTURALIST CONVERSATION ERROR:",
            {
                url: error?.config?.url,
                status: error?.response?.status,
                response: error?.response?.data,
                message: error?.message,
            }
        );

        throw error;
    }
}

// ============================================================
// AGRICULTURALIST SEND MESSAGE
//
// POST /chat/agriculturalist/conversations/{user_id}
// ============================================================

export async function sendAgriculturalistMessage(
    userId: string,
    message: string
): Promise<SendMessageResponse> {

    if (!userId) {
        throw new Error(
            "User ID is missing."
        );
    }

    if (!message.trim()) {
        throw new Error(
            "Message cannot be empty."
        );
    }

    try {

        const response = await api.post(
            `/chat/agriculturalist/conversations/${encodeURIComponent(
                userId
            )}`,
            {
                message: message.trim(),
            }
        );

        return response.data;

    } catch (error: any) {

        console.error(
            "SEND AGRICULTURALIST MESSAGE ERROR:",
            {
                url: error?.config?.url,
                status: error?.response?.status,
                response: error?.response?.data,
                message: error?.message,
            }
        );

        throw error;
    }
}

// ============================================================
// MARK AGRICULTURALIST CONVERSATION AS READ
//
// PATCH /chat/agriculturalist/conversations/{user_id}/read
// ============================================================

export async function markAgriculturalistConversationAsRead(
    userId: string
) {

    if (!userId) {
        throw new Error(
            "User ID is missing."
        );
    }

    try {

        const response = await api.patch(
            `/chat/agriculturalist/conversations/${encodeURIComponent(
                userId
            )}/read`
        );

        return response.data;

    } catch (error: any) {

        console.error(
            "MARK AGRICULTURALIST CHAT AS READ ERROR:",
            {
                url: error?.config?.url,
                status: error?.response?.status,
                response: error?.response?.data,
                message: error?.message,
            }
        );

        throw error;
    }
}