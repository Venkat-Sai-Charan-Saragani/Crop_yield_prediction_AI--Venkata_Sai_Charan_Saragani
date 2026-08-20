// ============================================================
// AUTHENTICATION STORAGE
// frontend/src/utils/auth.ts
// ============================================================

// ============================================================
// USER STORAGE
// ============================================================

const USER_TOKEN_KEY = "access_token";
const USER_EMAIL_KEY = "user_email";
const USER_ROLE_KEY = "user_role";

// ============================================================
// ADMIN STORAGE
// ============================================================

const ADMIN_TOKEN_KEY = "admin_access_token";
const ADMIN_EMAIL_KEY = "admin_email";
const ADMIN_ROLE_KEY = "admin_role";

// ============================================================
// AGRICULTURALIST STORAGE
// ============================================================

const AGRICULTURALIST_TOKEN_KEY =
    "agriculturalist_access_token";

const AGRICULTURALIST_EMAIL_KEY =
    "agriculturalist_email";

const AGRICULTURALIST_ROLE_KEY =
    "agriculturalist_role";

// ============================================================
// BROWSER CHECK
// ============================================================

const isBrowser = (): boolean => {
    return typeof window !== "undefined";
};

// ============================================================
// USER TOKEN
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

    localStorage.setItem(
        USER_TOKEN_KEY,
        token.trim()
    );
};

export const getToken = (): string | null => {

    if (!isBrowser()) {
        return null;
    }

    const token =
        localStorage.getItem(
            USER_TOKEN_KEY
        );

    if (
        !token ||
        !token.trim()
    ) {
        return null;
    }

    return token.trim();
};

export const removeToken = (): void => {

    if (!isBrowser()) {
        return;
    }

    localStorage.removeItem(
        USER_TOKEN_KEY
    );

    localStorage.removeItem(
        USER_EMAIL_KEY
    );

    localStorage.removeItem(
        USER_ROLE_KEY
    );
};

// ============================================================
// USER AUTH HEADERS
// ============================================================

export const getAuthHeaders = (): Record<string, string> => {

    const token = getToken();

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

// ============================================================
// USER EMAIL
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

    localStorage.setItem(
        USER_EMAIL_KEY,
        email.trim()
    );
};

export const getEmail = (): string | null => {

    if (!isBrowser()) {
        return null;
    }

    return localStorage.getItem(
        USER_EMAIL_KEY
    );
};

// ============================================================
// USER ROLE
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

    localStorage.setItem(
        USER_ROLE_KEY,
        role.trim()
    );
};

export const getRole = (): string | null => {

    if (!isBrowser()) {
        return null;
    }

    return localStorage.getItem(
        USER_ROLE_KEY
    );
};

// ============================================================
// ADMIN TOKEN
// ============================================================

export const saveAdminToken = (
    token: string
): void => {

    if (
        !isBrowser() ||
        !token
    ) {
        return;
    }

    localStorage.setItem(
        ADMIN_TOKEN_KEY,
        token.trim()
    );
};

export const getAdminToken = (): string | null => {

    if (!isBrowser()) {
        return null;
    }

    const token =
        localStorage.getItem(
            ADMIN_TOKEN_KEY
        );

    if (
        !token ||
        !token.trim()
    ) {
        return null;
    }

    return token.trim();
};

export const removeAdminToken = (): void => {

    if (!isBrowser()) {
        return;
    }

    localStorage.removeItem(
        ADMIN_TOKEN_KEY
    );

    localStorage.removeItem(
        ADMIN_EMAIL_KEY
    );

    localStorage.removeItem(
        ADMIN_ROLE_KEY
    );
};

// ============================================================
// ADMIN AUTH HEADERS
// ============================================================

export const getAdminAuthHeaders = (): Record<string, string> => {

    const token =
        getAdminToken();

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

// ============================================================
// ADMIN EMAIL
// ============================================================

export const saveAdminEmail = (
    email: string
): void => {

    if (
        !isBrowser() ||
        !email
    ) {
        return;
    }

    localStorage.setItem(
        ADMIN_EMAIL_KEY,
        email.trim()
    );
};

export const getAdminEmail = (): string | null => {

    if (!isBrowser()) {
        return null;
    }

    return localStorage.getItem(
        ADMIN_EMAIL_KEY
    );
};

// ============================================================
// ADMIN ROLE
// ============================================================

export const saveAdminRole = (
    role: string
): void => {

    if (
        !isBrowser() ||
        !role
    ) {
        return;
    }

    localStorage.setItem(
        ADMIN_ROLE_KEY,
        role.trim()
    );
};

export const getAdminRole = (): string | null => {

    if (!isBrowser()) {
        return null;
    }

    return localStorage.getItem(
        ADMIN_ROLE_KEY
    );
};

// ============================================================
// AGRICULTURALIST TOKEN
// ============================================================

export const saveAgriculturalistToken = (
    token: string
): void => {

    if (
        !isBrowser() ||
        !token
    ) {
        return;
    }

    localStorage.setItem(
        AGRICULTURALIST_TOKEN_KEY,
        token.trim()
    );
};

export const getAgriculturalistToken = (): string | null => {

    if (!isBrowser()) {
        return null;
    }

    const token =
        localStorage.getItem(
            AGRICULTURALIST_TOKEN_KEY
        );

    if (
        !token ||
        !token.trim()
    ) {
        return null;
    }

    return token.trim();
};

export const removeAgriculturalistToken = (): void => {

    if (!isBrowser()) {
        return;
    }

    localStorage.removeItem(
        AGRICULTURALIST_TOKEN_KEY
    );

    localStorage.removeItem(
        AGRICULTURALIST_EMAIL_KEY
    );

    localStorage.removeItem(
        AGRICULTURALIST_ROLE_KEY
    );
};

// ============================================================
// AGRICULTURALIST AUTH HEADERS
// IMPORTANT:
// This is ONLY for the agriculturalist portal.
// User chat does NOT use this.
// ============================================================

export const getAgriculturalistAuthHeaders =
    (): Record<string, string> => {

        const token =
            getAgriculturalistToken();

        if (!token) {
            return {};
        }

        return {
            Authorization: `Bearer ${token}`,
        };
    };

// ============================================================
// AGRICULTURALIST EMAIL
// ============================================================

export const saveAgriculturalistEmail = (
    email: string
): void => {

    if (
        !isBrowser() ||
        !email
    ) {
        return;
    }

    localStorage.setItem(
        AGRICULTURALIST_EMAIL_KEY,
        email.trim()
    );
};

export const getAgriculturalistEmail = (): string | null => {

    if (!isBrowser()) {
        return null;
    }

    return localStorage.getItem(
        AGRICULTURALIST_EMAIL_KEY
    );
};

// ============================================================
// AGRICULTURALIST ROLE
// ============================================================

export const saveAgriculturalistRole = (
    role: string
): void => {

    if (
        !isBrowser() ||
        !role
    ) {
        return;
    }

    localStorage.setItem(
        AGRICULTURALIST_ROLE_KEY,
        role.trim()
    );
};

export const getAgriculturalistRole = (): string | null => {

    if (!isBrowser()) {
        return null;
    }

    return localStorage.getItem(
        AGRICULTURALIST_ROLE_KEY
    );
};

// ============================================================
// CLEAR ADMIN AUTH
// ============================================================

export const clearAdminAuth = (): void => {
    removeAdminToken();
};

// ============================================================
// CLEAR AGRICULTURALIST AUTH
// ============================================================

export const clearAgriculturalistAuth = (): void => {
    removeAgriculturalistToken();
};

// ============================================================
// CLEAR ALL AUTH
// ============================================================

export const clearAllAuth = (): void => {

    removeToken();

    removeAdminToken();

    removeAgriculturalistToken();
};