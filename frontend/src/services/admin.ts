// ============================================================
// ADMIN API SERVICE
// frontend/src/services/admin.ts
// ============================================================

import api from "@/services/api";

// ============================================================
// TYPES
// ============================================================

export interface AdminUser {
    id?: string;
    _id?: string;

    full_name?: string;
    name?: string;

    email?: string;

    phone_number?: string | null;
    phone?: string | null;

    role?: string;
    status?: string;

    is_active?: boolean;

    // Authentication provider
    auth_provider?: string | null;

    created_at?: string;
    updated_at?: string;
}


// ============================================================
// AGRICULTURALIST
// ============================================================

export interface AgriculturalistRequest {
    id: string;
    _id?: string;

    full_name: string;
    name?: string;

    email: string;

    phone_number?: string | null;
    phone?: string | null;

    specialization?: string | null;
    experience_years?: number;

    government_id?: string | null;
    issuing_authority?: string | null;

    verification_document?: string | null;
    verification_document_name?: string | null;

    verification_submitted_at?: string | null;
    reviewed_at?: string | null;
    reviewed_by?: string | null;

    state?: string | null;
    district?: string | null;

    location?: {
        state?: string;
        district?: string;
        village?: string;
    } | string | null;

    role?: string;

    status: string;

    availability?: boolean;
    is_active?: boolean;

    rejection_reason?: string | null;

    approved_at?: string | null;
    rejected_at?: string | null;

    created_at?: string;
    updated_at?: string;
}


// ============================================================
// FARM
// ============================================================

export interface AdminFarm {
    id?: string;
    _id?: string;

    name?: string;
    farm_name?: string;

    location?: string;

    area?: number;
    area_size?: number;
    area_unit?: string;

    soil_type?: string;

    latitude?: number;
    longitude?: number;

    user_id?: string;
    owner_id?: string;

    created_at?: string;
    updated_at?: string;
}


// ============================================================
// CROP
// ============================================================

export interface AdminCrop {
    id?: string;
    _id?: string;

    name?: string;
    crop_name?: string;

    crop_type?: string;
    variety?: string;

    farm_id?: string;
    user_id?: string;

    sowing_date?: string;
    harvest_date?: string;
    expected_harvest_date?: string;

    season?: string;
    status?: string;

    created_at?: string;
    updated_at?: string;
}


// ============================================================
// PREDICTION
// ============================================================

export interface AdminPrediction {
    id?: string;
    _id?: string;

    user_id?: string;
    farm_id?: string;
    crop_id?: string;

    crop?: string;
    crop_name?: string;

    predicted_yield?: number;
    yield_prediction?: number;
    predicted_yield_value?: number;

    area?: number;
    rainfall?: number;
    temperature?: number;
    pesticides?: number;
    year?: number;

    created_at?: string;
    updated_at?: string;
}


// ============================================================
// ADMIN STATS
// ============================================================

export interface AdminStats {
    total_users: number;

    active_users?: number;
    inactive_users?: number;

    total_farms: number;
    total_crops: number;
    total_predictions: number;

    model_accuracy: number;

    total_agriculturalists?: number;
    pending_agriculturalists?: number;
}


export interface AdminStatsResponse {
    success: boolean;
    message?: string;
    stats: AdminStats;
}


// ============================================================
// RESPONSE TYPES
// ============================================================

export interface AdminUsersResponse {
    success: boolean;
    message?: string;
    users: AdminUser[];
}


export interface AdminFarmsResponse {
    success: boolean;
    message?: string;
    farms: AdminFarm[];
}


export interface AdminCropsResponse {
    success: boolean;
    message?: string;
    crops: AdminCrop[];
}


export interface AdminPredictionsResponse {
    success: boolean;
    message?: string;
    predictions: AdminPrediction[];
}


export interface AgriculturalistRequestsResponse {
    success: boolean;
    message?: string;
    count: number;
    agriculturalists: AgriculturalistRequest[];
}


export interface AgriculturalistActionResponse {
    success: boolean;
    message: string;
    agriculturalist?: AgriculturalistRequest;
}


// ============================================================
// HELPERS
// ============================================================

function isObject(
    value: unknown
): value is Record<string, any> {

    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}


function getString(
    value: unknown,
    fallback = ""
): string {

    return typeof value === "string"
        ? value
        : fallback;
}


function getNumber(
    value: unknown,
    fallback = 0
): number {

    return typeof value === "number"
        ? value
        : fallback;
}


// ============================================================
// AGRICULTURALIST NORMALIZER
// ============================================================

function normalizeAgriculturalist(
    value: unknown
): AgriculturalistRequest | null {

    if (!isObject(value)) {
        return null;
    }


    const idValue =
        value.id ??
        value._id;


    if (
        typeof idValue !== "string" ||
        idValue.trim() === ""
    ) {
        return null;
    }


    return {

        id: idValue,

        _id:
            typeof value._id === "string"
                ? value._id
                : idValue,


        full_name:
            getString(
                value.full_name ??
                value.name
            ),


        name:
            getString(
                value.name ??
                value.full_name
            ),


        email:
            getString(
                value.email
            ),


        phone_number:
            typeof value.phone_number === "string"
                ? value.phone_number
                : null,


        phone:
            typeof value.phone === "string"
                ? value.phone
                : null,


        specialization:
            typeof value.specialization === "string"
                ? value.specialization
                : null,


        experience_years:
            getNumber(
                value.experience_years
            ),


        government_id:
            typeof value.government_id === "string"
                ? value.government_id
                : null,


        issuing_authority:
            typeof value.issuing_authority === "string"
                ? value.issuing_authority
                : null,


        verification_document:
            typeof value.verification_document === "string"
                ? value.verification_document
                : null,


        verification_document_name:
            typeof value.verification_document_name === "string"
                ? value.verification_document_name
                : null,


        verification_submitted_at:
            typeof value.verification_submitted_at === "string"
                ? value.verification_submitted_at
                : null,


        reviewed_at:
            typeof value.reviewed_at === "string"
                ? value.reviewed_at
                : null,


        reviewed_by:
            typeof value.reviewed_by === "string"
                ? value.reviewed_by
                : null,


        state:
            typeof value.state === "string"
                ? value.state
                : null,


        district:
            typeof value.district === "string"
                ? value.district
                : null,


        location:
            value.location as
                AgriculturalistRequest["location"],


        role:
            getString(
                value.role,
                "agriculturalist"
            ),


        status:
            getString(
                value.status,
                "pending"
            ),


        availability:
            typeof value.availability === "boolean"
                ? value.availability
                : false,


        is_active:
            typeof value.is_active === "boolean"
                ? value.is_active
                : false,


        rejection_reason:
            typeof value.rejection_reason === "string"
                ? value.rejection_reason
                : null,


        approved_at:
            typeof value.approved_at === "string"
                ? value.approved_at
                : null,


        rejected_at:
            typeof value.rejected_at === "string"
                ? value.rejected_at
                : null,


        created_at:
            typeof value.created_at === "string"
                ? value.created_at
                : undefined,


        updated_at:
            typeof value.updated_at === "string"
                ? value.updated_at
                : undefined,

    };
}


// ============================================================
// NORMALIZE AGRICULTALIST ARRAY
// ============================================================

function normalizeAgriculturalists(
    value: unknown
): AgriculturalistRequest[] {

    if (Array.isArray(value)) {

        return value
            .map(normalizeAgriculturalist)
            .filter(
                (
                    item
                ): item is AgriculturalistRequest =>
                    item !== null
            );

    }


    if (!isObject(value)) {
        return [];
    }


    if (
        Array.isArray(
            value.agriculturalists
        )
    ) {

        return value.agriculturalists
            .map(normalizeAgriculturalist)
            .filter(
                (
                    item
                ): item is AgriculturalistRequest =>
                    item !== null
            );

    }


    if (
        Array.isArray(
            value.requests
        )
    ) {

        return value.requests
            .map(normalizeAgriculturalist)
            .filter(
                (
                    item
                ): item is AgriculturalistRequest =>
                    item !== null
            );

    }


    if (
        Array.isArray(
            value.data
        )
    ) {

        return value.data
            .map(normalizeAgriculturalist)
            .filter(
                (
                    item
                ): item is AgriculturalistRequest =>
                    item !== null
            );

    }


    return [];
}


// ============================================================
// ADMIN LOGIN
// ============================================================

export async function adminLogin(
    email: string,
    password: string
) {

    const response =
        await api.post(
            "/admin/login",
            {
                email: email.trim(),
                password,
            }
        );

    return response.data;
}


// ============================================================
// ADMIN STATS
// ============================================================

export async function getAdminStats(): Promise<AdminStatsResponse> {

    const response =
        await api.get(
            "/admin/stats"
        );


    const data =
        response.data;


    const source =
        isObject(data?.stats)
            ? data.stats
            : data;


    return {

        success:
            isObject(data) &&
            typeof data.success === "boolean"
                ? data.success
                : true,


        message:
            isObject(data) &&
            typeof data.message === "string"
                ? data.message
                : undefined,


        stats: {

            total_users:
                getNumber(
                    source?.total_users
                ),


            active_users:
                getNumber(
                    source?.active_users
                ),


            inactive_users:
                getNumber(
                    source?.inactive_users
                ),


            total_farms:
                getNumber(
                    source?.total_farms
                ),


            total_crops:
                getNumber(
                    source?.total_crops
                ),


            total_predictions:
                getNumber(
                    source?.total_predictions
                ),


            model_accuracy:
                getNumber(
                    source?.model_accuracy
                ),


            total_agriculturalists:
                getNumber(
                    source?.total_agriculturalists
                ),


            pending_agriculturalists:
                getNumber(
                    source?.pending_agriculturalists
                ),

        },

    };
}


// ============================================================
// ADMIN USERS
// ============================================================

export async function getAdminUsers(): Promise<AdminUsersResponse> {

    const response =
        await api.get(
            "/admin/users"
        );


    const data =
        response.data;


    let users: AdminUser[] = [];


    if (Array.isArray(data)) {

        users =
            data as AdminUser[];

    }
    else if (
        isObject(data) &&
        Array.isArray(data.users)
    ) {

        users =
            data.users as AdminUser[];

    }


    return {

        success: true,

        users,

        message:
            isObject(data) &&
            typeof data.message === "string"
                ? data.message
                : undefined,

    };
}


// ============================================================
// DELETE USER
// ============================================================

export async function deleteAdminUser(
    userId: string
) {

    const response =
        await api.delete(
            `/admin/users/${userId}`
        );


    return response.data;
}


// ============================================================
// AGRICULTALIST - PENDING
// ============================================================

export async function getPendingAgriculturalists(): Promise<AgriculturalistRequestsResponse> {

    const response =
        await api.get(
            "/admin/agriculturalists/pending"
        );


    const data =
        response.data;


    const agriculturalists =
        normalizeAgriculturalists(
            data
        );


    return {

        success:
            isObject(data) &&
            typeof data.success === "boolean"
                ? data.success
                : true,


        message:
            isObject(data) &&
            typeof data.message === "string"
                ? data.message
                : undefined,


        count:
            agriculturalists.length,


        agriculturalists,

    };
}


// ============================================================
// AGRICULTALIST - ALL
// ============================================================

export async function getAdminAgriculturalists(): Promise<AgriculturalistRequestsResponse> {

    const response =
        await api.get(
            "/admin/agriculturalists"
        );


    const data =
        response.data;


    const agriculturalists =
        normalizeAgriculturalists(
            data
        );


    return {

        success: true,

        count:
            agriculturalists.length,

        agriculturalists,

        message:
            isObject(data) &&
            typeof data.message === "string"
                ? data.message
                : undefined,

    };
}


// ============================================================
// AGRICULTALIST - APPROVE
// ============================================================

export async function approveAgriculturalist(
    agriculturalistId: string
): Promise<AgriculturalistActionResponse> {

    const response =
        await api.patch(
            `/admin/agriculturalists/${agriculturalistId}/approve`
        );


    const data =
        response.data;


    return {

        success:
            isObject(data) &&
            typeof data.success === "boolean"
                ? data.success
                : true,


        message:
            isObject(data) &&
            typeof data.message === "string"
                ? data.message
                : "Agriculturalist approved successfully.",


        agriculturalist:
            isObject(data)
                ? normalizeAgriculturalist(
                    data.agriculturalist
                ) ?? undefined
                : undefined,

    };
}


// ============================================================
// AGRICULTALIST - REJECT
// ============================================================

export async function rejectAgriculturalist(
    agriculturalistId: string,
    rejectionReason: string
): Promise<AgriculturalistActionResponse> {

    const response =
        await api.patch(
            `/admin/agriculturalists/${agriculturalistId}/reject`,
            {
                rejection_reason:
                    rejectionReason.trim(),
            }
        );


    const data =
        response.data;


    return {

        success:
            isObject(data) &&
            typeof data.success === "boolean"
                ? data.success
                : true,


        message:
            isObject(data) &&
            typeof data.message === "string"
                ? data.message
                : "Agriculturalist rejected successfully.",


        agriculturalist:
            isObject(data)
                ? normalizeAgriculturalist(
                    data.agriculturalist
                ) ?? undefined
                : undefined,

    };
}


// ============================================================
// FARMS
// ============================================================

export async function getAdminFarms(): Promise<AdminFarmsResponse> {

    const response =
        await api.get(
            "/admin/farms"
        );


    const data =
        response.data;


    const farms =
        isObject(data) &&
        Array.isArray(data.farms)
            ? data.farms as AdminFarm[]
            : [];


    return {

        success: true,

        farms,

        message:
            isObject(data) &&
            typeof data.message === "string"
                ? data.message
                : undefined,

    };
}


// ============================================================
// DELETE FARM
// ============================================================

export async function deleteAdminFarm(
    farmId: string
) {

    const response =
        await api.delete(
            `/admin/farms/${farmId}`
        );


    return response.data;
}


// ============================================================
// CROPS
// ============================================================

export async function getAdminCrops(): Promise<AdminCropsResponse> {

    const response =
        await api.get(
            "/admin/crops"
        );


    const data =
        response.data;


    const crops =
        isObject(data) &&
        Array.isArray(data.crops)
            ? data.crops as AdminCrop[]
            : [];


    return {

        success: true,

        crops,

        message:
            isObject(data) &&
            typeof data.message === "string"
                ? data.message
                : undefined,

    };
}


// ============================================================
// DELETE CROP
// ============================================================

export async function deleteAdminCrop(
    cropId: string
) {

    const response =
        await api.delete(
            `/admin/crops/${cropId}`
        );


    return response.data;
}


// ============================================================
// PREDICTIONS
// ============================================================

export async function getAdminPredictions(): Promise<AdminPredictionsResponse> {

    const response =
        await api.get(
            "/admin/predictions"
        );


    const data =
        response.data;


    const predictions =
        isObject(data) &&
        Array.isArray(data.predictions)
            ? data.predictions as AdminPrediction[]
            : [];


    return {

        success: true,

        predictions,

        message:
            isObject(data) &&
            typeof data.message === "string"
                ? data.message
                : undefined,

    };
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {

    // Admin
    adminLogin,
    getAdminStats,

    // Users
    getAdminUsers,
    deleteAdminUser,

    // Agriculturalists
    getPendingAgriculturalists,
    getAdminAgriculturalists,
    approveAgriculturalist,
    rejectAgriculturalist,

    // Farms
    getAdminFarms,
    deleteAdminFarm,

    // Crops
    getAdminCrops,
    deleteAdminCrop,

    // Predictions
    getAdminPredictions,

};