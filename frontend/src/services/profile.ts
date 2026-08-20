import api from "./api";


// ============================================================
// GET USER PROFILE
// ============================================================

export async function getProfile() {

    const response =
        await api.get(
            "/profile/"
        );

    return response.data;

}


// ============================================================
// UPDATE USER PROFILE
// ============================================================

export async function updateProfile(
    data: FormData
) {

    const response =
        await api.put(
            "/users/profile",
            data,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

    return response.data;

}