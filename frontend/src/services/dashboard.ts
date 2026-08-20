// ============================================================
// USER DASHBOARD SERVICE
// frontend/src/services/dashboard.ts
// ============================================================

import api from "@/services/api";

// ============================================================
// TYPES
// ============================================================

export interface DashboardStats {
    total_farms: number;
    total_crops: number;
    total_predictions: number;
    model_accuracy: number;
}

export interface DashboardActivity {
    farms: any[];
    crops: any[];
    predictions: any[];
}

// ============================================================
// GET DASHBOARD STATS
// ============================================================

export const getDashboardStats =
    async (): Promise<DashboardStats> => {

        try {

            console.log(
                "Calling /dashboard/stats..."
            );

            const response =
                await api.get(
                    "/dashboard/stats"
                );

            console.log(
                "Dashboard stats response:",
                response.status,
                response.data
            );

            const data =
                response.data || {};

            // ------------------------------------------------
            // SAFELY CONVERT MODEL ACCURACY
            // ------------------------------------------------

            let accuracy =
                data.model_accuracy;

            if (
                typeof accuracy === "string"
            ) {

                accuracy =
                    accuracy.replace(
                        "%",
                        ""
                    );

            }

            const numericAccuracy =
                Number(accuracy);

            return {

                total_farms:
                    Number(
                        data.total_farms ?? 0
                    ),

                total_crops:
                    Number(
                        data.total_crops ?? 0
                    ),

                total_predictions:
                    Number(
                        data.total_predictions ?? 0
                    ),

                model_accuracy:
                    Number.isFinite(
                        numericAccuracy
                    )
                        ? numericAccuracy
                        : 0,

            };

        }
        catch (error: any) {

            console.error(
                "================================"
            );

            console.error(
                "DASHBOARD STATS ERROR"
            );

            console.error(
                "Status:",
                error?.response?.status
            );

            console.error(
                "Response data:",
                error?.response?.data
            );

            console.error(
                "Message:",
                error?.message
            );

            console.error(
                "================================"
            );

            throw error;

        }

    };

// ============================================================
// GET DASHBOARD ACTIVITY
// ============================================================

export const getDashboardActivity =
    async (): Promise<DashboardActivity> => {

        try {

            const [
                farmsResponse,
                cropsResponse,
                predictionsResponse,
            ] = await Promise.all([

                api.get(
                    "/farms"
                ),

                api.get(
                    "/crops"
                ),

                api.get(
                    "/prediction/history"
                ),

            ]);

            const farmsData =
                farmsResponse.data;

            const cropsData =
                cropsResponse.data;

            const predictionsData =
                predictionsResponse.data;

            const farms =
                Array.isArray(farmsData)
                    ? farmsData
                    : farmsData?.farms || [];

            const crops =
                Array.isArray(cropsData)
                    ? cropsData
                    : cropsData?.crops || [];

            const predictions =
                Array.isArray(predictionsData)
                    ? predictionsData
                    : predictionsData?.predictions ||
                      predictionsData?.history ||
                      [];

            return {

                farms:
                    farms.slice(0, 3),

                crops:
                    crops.slice(0, 3),

                predictions:
                    predictions.slice(0, 3),

            };

        }
        catch (error: any) {

            console.error(
                "DASHBOARD ACTIVITY ERROR:",
                error?.response?.data ||
                error?.message ||
                error
            );

            throw error;

        }

    };