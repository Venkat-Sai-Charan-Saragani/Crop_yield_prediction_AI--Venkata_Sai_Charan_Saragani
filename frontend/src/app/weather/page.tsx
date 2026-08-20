"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    AlertCircle,
    CalendarDays,
    Cloud,
    CloudRain,
    CloudSun,
    Droplets,
    Eye,
    Loader2,
    MapPin,
    RefreshCw,
    Sprout,
    Sun,
    Sunset,
    Thermometer,
    Umbrella,
    Wind,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

interface WeatherData {
    latitude: number;
    longitude: number;
    timezone: string;
    timezone_abbreviation?: string;

    current: {
        time: string;
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        precipitation: number;
        rain: number;
        weather_code: number;
        wind_speed_10m: number;
        wind_direction_10m: number;
        uv_index: number;
    };

    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: number[];
        precipitation_sum: number[];
        wind_speed_10m_max: number[];
        uv_index_max: number[];
        sunrise: string[];
        sunset: string[];
    };
}

interface LocationState {
    latitude: number;
    longitude: number;
}

// ============================================================
// WEATHER DESCRIPTION
// Open-Meteo WMO Weather Interpretation Codes
// ============================================================

function getWeatherDescription(code: number): string {
    switch (code) {
        case 0:
            return "Clear sky";

        case 1:
            return "Mainly clear";

        case 2:
            return "Partly cloudy";

        case 3:
            return "Overcast";

        case 45:
        case 48:
            return "Foggy";

        case 51:
        case 53:
        case 55:
            return "Drizzle";

        case 56:
        case 57:
            return "Freezing drizzle";

        case 61:
        case 63:
        case 65:
            return "Rain";

        case 66:
        case 67:
            return "Freezing rain";

        case 71:
        case 73:
        case 75:
        case 77:
            return "Snow";

        case 80:
        case 81:
        case 82:
            return "Rain showers";

        case 85:
        case 86:
            return "Snow showers";

        case 95:
            return "Thunderstorm";

        case 96:
        case 99:
            return "Thunderstorm with hail";

        default:
            return "Unknown";
    }
}

// ============================================================
// WEATHER ICON
// ============================================================

function getWeatherIcon(
    code: number,
    size = 32
) {
    if (code === 0 || code === 1) {
        return <Sun size={size} />;
    }

    if (code === 2) {
        return <CloudSun size={size} />;
    }

    if (
        code === 3 ||
        code === 45 ||
        code === 48
    ) {
        return <Cloud size={size} />;
    }

    if (
        [
            51,
            53,
            55,
            56,
            57,
            61,
            63,
            65,
            66,
            67,
            80,
            81,
            82,
        ].includes(code)
    ) {
        return <CloudRain size={size} />;
    }

    if (
        [
            95,
            96,
            99,
        ].includes(code)
    ) {
        return <CloudRain size={size} />;
    }

    return <Cloud size={size} />;
}

// ============================================================
// WIND DIRECTION
// ============================================================

function getWindDirection(
    degrees: number
): string {
    const directions = [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW",
    ];

    const index =
        Math.round(degrees / 45) % 8;

    return directions[index];
}

// ============================================================
// DATE FORMAT
// ============================================================

function formatDate(
    date: string
): string {
    return new Date(
        `${date}T00:00:00`
    ).toLocaleDateString(
        "en-IN",
        {
            weekday: "short",
            day: "numeric",
            month: "short",
        }
    );
}

// ============================================================
// TIME FORMAT
// ============================================================

function formatTime(
    dateTime: string
): string {
    try {
        return new Date(
            dateTime
        ).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        );
    } catch {
        return "--";
    }
}

// ============================================================
// UV LEVEL
// ============================================================

function getUVLevel(
    uv: number
): {
    label: string;
    description: string;
} {
    if (uv <= 2) {
        return {
            label: "Low",
            description:
                "Low UV exposure",
        };
    }

    if (uv <= 5) {
        return {
            label: "Moderate",
            description:
                "Moderate UV exposure",
        };
    }

    if (uv <= 7) {
        return {
            label: "High",
            description:
                "High UV exposure",
        };
    }

    if (uv <= 10) {
        return {
            label: "Very High",
            description:
                "Very high UV exposure",
        };
    }

    return {
        label: "Extreme",
        description:
            "Extreme UV exposure",
    };
}

// ============================================================
// AGRICULTURAL ADVISORY
// ============================================================

function getAgriculturalAdvisory(
    weather: WeatherData
): {
    title: string;
    message: string;
    action: string;
    type: "rain" | "hot" | "normal";
} {
    const todayRainProbability =
        weather.daily
            .precipitation_probability_max[0] ?? 0;

    const todayRainfall =
        weather.daily
            .precipitation_sum[0] ?? 0;

    const todayMaxTemperature =
        weather.daily
            .temperature_2m_max[0] ?? 0;

    const todayWeatherCode =
        weather.daily
            .weather_code[0] ?? 0;

    const isStorm =
        [95, 96, 99].includes(
            todayWeatherCode
        );

    if (
        isStorm ||
        todayRainProbability >= 60 ||
        todayRainfall >= 5
    ) {
        return {
            title: "Rainfall Expected",
            message:
                "Rain is likely during the next few days.",
            action:
                "Review irrigation requirements and consider postponing fertilizer or pesticide application before significant rainfall.",
            type: "rain",
        };
    }

    if (
        todayMaxTemperature >= 38
    ) {
        return {
            title: "High Temperature",
            message:
                "High temperatures may increase crop water requirements.",
            action:
                "Monitor soil moisture closely and consider irrigation during cooler parts of the day.",
            type: "hot",
        };
    }

    return {
        title:
            "Favorable Conditions",
        message:
            "Weather conditions are generally favorable for agricultural activities.",
        action:
            "Continue monitoring soil moisture and crop conditions.",
        type: "normal",
    };
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function WeatherPage() {
    const [
        location,
        setLocation,
    ] =
        useState<LocationState | null>(
            null
        );

    const [
        weather,
        setWeather,
    ] =
        useState<WeatherData | null>(
            null
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        refreshing,
        setRefreshing,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState("");

    // ========================================================
    // FETCH WEATHER
    // ========================================================

    const loadWeather =
        useCallback(
            async (
                latitude: number,
                longitude: number
            ) => {
                try {
                    setError("");

                    const url =
                        "https://api.open-meteo.com/v1/forecast" +
                        `?latitude=${latitude}` +
                        `&longitude=${longitude}` +
                        "&current=" +
                        [
                            "temperature_2m",
                            "relative_humidity_2m",
                            "apparent_temperature",
                            "precipitation",
                            "rain",
                            "weather_code",
                            "wind_speed_10m",
                            "wind_direction_10m",
                            "uv_index",
                        ].join(",") +
                        "&daily=" +
                        [
                            "weather_code",
                            "temperature_2m_max",
                            "temperature_2m_min",
                            "precipitation_probability_max",
                            "precipitation_sum",
                            "wind_speed_10m_max",
                            "uv_index_max",
                            "sunrise",
                            "sunset",
                        ].join(",") +
                        "&timezone=auto" +
                        "&forecast_days=7";

                    const response =
                        await fetch(
                            url,
                            {
                                method: "GET",
                                cache: "no-store",
                            }
                        );

                    if (!response.ok) {
                        throw new Error(
                            `Weather API returned ${response.status}`
                        );
                    }

                    const data: WeatherData =
                        await response.json();

                    if (
                        !data.current ||
                        !data.daily
                    ) {
                        throw new Error(
                            "Invalid weather data received."
                        );
                    }

                    setWeather(data);
                } catch (err) {
                    console.error(
                        "WEATHER ERROR:",
                        err
                    );

                    setError(
                        "Unable to load live weather information. Please check your internet connection and try again."
                    );
                }
            },
            []
        );

    // ========================================================
    // REQUEST USER LOCATION
    // ========================================================

    const requestLocation =
        useCallback(() => {
            setError("");
            setLoading(true);

            if (
                typeof navigator ===
                    "undefined" ||
                !navigator.geolocation
            ) {
                setError(
                    "Your browser does not support location services."
                );

                setLoading(false);

                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (
                    position
                ) => {
                    const latitude =
                        position.coords
                            .latitude;

                    const longitude =
                        position.coords
                            .longitude;

                    setLocation({
                        latitude,
                        longitude,
                    });

                    await loadWeather(
                        latitude,
                        longitude
                    );

                    setLoading(false);
                },
                (geoError) => {
                    console.error(
                        "LOCATION ERROR:",
                        geoError
                    );

                    let message =
                        "Unable to access your location.";

                    if (
                        geoError.code ===
                        geoError.PERMISSION_DENIED
                    ) {
                        message =
                            "Location access was denied. Please allow location access in your browser and try again.";
                    }

                    if (
                        geoError.code ===
                        geoError.POSITION_UNAVAILABLE
                    ) {
                        message =
                            "Your current location could not be determined.";
                    }

                    if (
                        geoError.code ===
                        geoError.TIMEOUT
                    ) {
                        message =
                            "Location request timed out. Please try again.";
                    }

                    setError(message);
                    setLoading(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 300000,
                }
            );
        }, [loadWeather]);

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    // ========================================================
    // REFRESH
    // ========================================================

    const refreshWeather =
        async () => {
            if (!location) {
                requestLocation();
                return;
            }

            try {
                setRefreshing(true);
                setError("");

                await loadWeather(
                    location.latitude,
                    location.longitude
                );
            } finally {
                setRefreshing(false);
            }
        };

    // ========================================================
    // LOADING SCREEN
    // ========================================================

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
                <div className="flex min-h-[75vh] flex-col items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50">
                        <Loader2
                            size={42}
                            className="animate-spin text-emerald-600"
                        />
                    </div>

                    <h2 className="mt-6 text-xl font-bold text-slate-900">
                        Loading Weather
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Getting your location and live forecast...
                    </p>
                </div>
            </main>
        );
    }

    // ========================================================
    // ERROR SCREEN
    // ========================================================

    if (
        error &&
        !weather
    ) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
                <div className="mx-auto flex min-h-[75vh] max-w-2xl items-center justify-center">
                    <div className="w-full rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <AlertCircle
                                size={32}
                            />
                        </div>

                        <h1 className="mt-5 text-2xl font-bold text-slate-900">
                            Weather Unavailable
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={
                                requestLocation
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <RefreshCw
                                size={17}
                            />
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (!weather) {
        return null;
    }

    // ========================================================
    // DERIVED DATA
    // ========================================================

    const advisory =
        getAgriculturalAdvisory(
            weather
        );

    const uvLevel =
        getUVLevel(
            weather.current.uv_index
        );

    const todayMaxWind =
        weather.daily
            .wind_speed_10m_max[0] ?? 0;

    const todaySunrise =
        weather.daily.sunrise[0];

    const todaySunset =
        weather.daily.sunset[0];

    const windDirection =
        getWindDirection(
            weather.current
                .wind_direction_10m
        );

    // ========================================================
    // PAGE
    // ========================================================

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">

                {/* ====================================================
                    HEADER
                ==================================================== */}

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                            <CloudSun
                                size={17}
                            />
                            Live Weather
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                            Weather Forecast
                        </h1>

                        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
                            <MapPin
                                size={16}
                                className="text-emerald-600"
                            />

                            <span>
                                Your Current Location
                            </span>

                            <span className="text-slate-300">
                                •
                            </span>

                            <span>
                                {weather.latitude.toFixed(
                                    4
                                )}
                                ,{" "}
                                {weather.longitude.toFixed(
                                    4
                                )}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            refreshWeather
                        }
                        disabled={
                            refreshing
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh Weather"}
                    </button>
                </div>

                {/* ====================================================
                    ERROR BANNER
                ==================================================== */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>
                            <p className="font-semibold">
                                Weather update issue
                            </p>

                            <p className="mt-1 text-sm">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* ====================================================
                    CURRENT WEATHER
                ==================================================== */}

                <section className="mb-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

                    {/* MAIN CURRENT CARD */}

                    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">

                        <div className="p-6 md:p-8">

                            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

                                <div>

                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                                        <span>
                                            Current Weather
                                        </span>

                                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                            Live
                                        </span>
                                    </div>

                                    <div className="mt-5 flex items-center gap-5">

                                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-sky-50 text-sky-600">
                                            {getWeatherIcon(
                                                weather
                                                    .current
                                                    .weather_code,
                                                50
                                            )}
                                        </div>

                                        <div>

                                            <div className="text-5xl font-bold tracking-tight text-slate-900">
                                                {Math.round(
                                                    weather
                                                        .current
                                                        .temperature_2m
                                                )}
                                                °C
                                            </div>

                                            <p className="mt-1 text-sm font-medium text-slate-500">
                                                {getWeatherDescription(
                                                    weather
                                                        .current
                                                        .weather_code
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="rounded-2xl bg-slate-50 p-5 md:min-w-[170px]">

                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        <Thermometer
                                            size={15}
                                        />
                                        Feels like
                                    </div>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {Math.round(
                                            weather
                                                .current
                                                .apparent_temperature
                                        )}
                                        °C
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Apparent temperature
                                    </p>

                                </div>

                            </div>

                            {/* LIVE UPDATE */}

                            <div className="mt-8 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                                <span>
                                    Live weather data
                                </span>

                                <span>
                                    •
                                </span>

                                <span>
                                    Updated{" "}
                                    {formatTime(
                                        weather
                                            .current
                                            .time
                                    )}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* QUICK STATS */}

                    <div className="grid grid-cols-2 gap-4">

                        {/* HUMIDITY */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <Droplets
                                size={22}
                                className="text-blue-500"
                            />

                            <p className="mt-4 text-xs font-medium text-slate-500">
                                Humidity
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {Math.round(
                                    weather
                                        .current
                                        .relative_humidity_2m
                                )}
                                %
                            </p>
                        </div>

                        {/* WIND */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <Wind
                                size={22}
                                className="text-cyan-500"
                            />

                            <p className="mt-4 text-xs font-medium text-slate-500">
                                Wind
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {Math.round(
                                    weather
                                        .current
                                        .wind_speed_10m
                                )}{" "}
                                <span className="text-sm font-medium text-slate-400">
                                    km/h
                                </span>
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {windDirection}{" "}
                                {
                                    weather
                                        .current
                                        .wind_direction_10m
                                }
                                °
                            </p>
                        </div>

                        {/* RAIN */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <Umbrella
                                size={22}
                                className="text-indigo-500"
                            />

                            <p className="mt-4 text-xs font-medium text-slate-500">
                                Rain
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {weather
                                    .current
                                    .rain
                                    .toFixed(
                                        1
                                    )}{" "}
                                <span className="text-sm font-medium text-slate-400">
                                    mm
                                </span>
                            </p>
                        </div>

                        {/* UV */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <Sun
                                size={22}
                                className="text-orange-500"
                            />

                            <p className="mt-4 text-xs font-medium text-slate-500">
                                UV Index
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {weather
                                    .current
                                    .uv_index
                                    .toFixed(
                                        1
                                    )}
                            </p>

                            <p className="mt-1 text-xs font-medium text-orange-600">
                                {uvLevel.label}
                            </p>
                        </div>

                    </div>
                </section>

                {/* ====================================================
                    AGRICULTURAL ADVISORY
                ==================================================== */}

                <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">

                    <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <Sprout
                                size={25}
                            />
                        </div>

                        <div className="min-w-0 flex-1">

                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                Agricultural Weather Advisory
                            </p>

                            <h2 className="mt-2 text-xl font-bold text-slate-900">
                                {advisory.title}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {advisory.message}
                            </p>

                            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                    Recommended action
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                    {advisory.action}
                                </p>
                            </div>

                        </div>

                    </div>
                </section>

                {/* ====================================================
                    SUN + WIND INFORMATION
                ==================================================== */}

                <section className="mb-8 grid gap-4 sm:grid-cols-3">

                    {/* SUNRISE */}

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                                <Sun
                                    size={22}
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Sunrise
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {formatTime(
                                        todaySunrise
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SUNSET */}

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                                <Sunset
                                    size={22}
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Sunset
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {formatTime(
                                        todaySunset
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* MAX WIND */}

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                <Wind
                                    size={22}
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Today's Max Wind
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {Math.round(
                                        todayMaxWind
                                    )}{" "}
                                    <span className="text-sm font-medium text-slate-400">
                                        km/h
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                </section>

                {/* ====================================================
                    7 DAY FORECAST
                ==================================================== */}

                <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">

                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CalendarDays
                                    size={22}
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    7-Day Forecast
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Plan agricultural activities according to upcoming weather.
                                </p>
                            </div>

                        </div>

                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                            Live forecast
                        </div>

                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">

                        {weather.daily.time.map(
                            (
                                date,
                                index
                            ) => {

                                const rainProbability =
                                    weather
                                        .daily
                                        .precipitation_probability_max[
                                        index
                                    ] ?? 0;

                                const rainfall =
                                    weather
                                        .daily
                                        .precipitation_sum[
                                        index
                                    ] ?? 0;

                                const wind =
                                    weather
                                        .daily
                                        .wind_speed_10m_max[
                                        index
                                    ] ?? 0;

                                const uv =
                                    weather
                                        .daily
                                        .uv_index_max[
                                        index
                                    ] ?? 0;

                                return (
                                    <div
                                        key={date}
                                        className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
                                    >

                                        {/* DATE */}

                                        <p className="text-xs font-bold text-slate-500">
                                            {formatDate(
                                                date
                                            )}
                                        </p>

                                        {/* ICON */}

                                        <div className="my-5 flex justify-center text-sky-600">
                                            {getWeatherIcon(
                                                weather
                                                    .daily
                                                    .weather_code[
                                                    index
                                                ],
                                                36
                                            )}
                                        </div>

                                        {/* DESCRIPTION */}

                                        <p className="min-h-[40px] text-center text-sm font-semibold text-slate-700">
                                            {getWeatherDescription(
                                                weather
                                                    .daily
                                                    .weather_code[
                                                    index
                                                ]
                                            )}
                                        </p>

                                        {/* TEMPERATURE */}

                                        <div className="mt-4 flex items-end justify-center gap-2">
                                            <span className="text-2xl font-bold text-slate-900">
                                                {Math.round(
                                                    weather
                                                        .daily
                                                        .temperature_2m_max[
                                                        index
                                                    ]
                                                )}
                                                °
                                            </span>

                                            <span className="mb-0.5 text-sm text-slate-400">
                                                {Math.round(
                                                    weather
                                                        .daily
                                                        .temperature_2m_min[
                                                        index
                                                    ]
                                                )}
                                                °
                                            </span>
                                        </div>

                                        {/* RAIN */}

                                        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-xs">

                                            <span className="font-semibold text-blue-600">
                                                💧{" "}
                                                {
                                                    rainProbability
                                                }
                                                %
                                            </span>

                                            <span className="text-slate-500">
                                                {rainfall.toFixed(
                                                    1
                                                )}{" "}
                                                mm
                                            </span>

                                        </div>

                                        {/* WIND */}

                                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">

                                            <span className="flex items-center gap-1">
                                                <Wind
                                                    size={13}
                                                />
                                                Wind
                                            </span>

                                            <span className="font-semibold text-slate-700">
                                                {Math.round(
                                                    wind
                                                )}{" "}
                                                km/h
                                            </span>

                                        </div>

                                        {/* UV */}

                                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">

                                            <span className="flex items-center gap-1">
                                                <Sun
                                                    size={13}
                                                />
                                                UV
                                            </span>

                                            <span className="font-semibold text-orange-600">
                                                {uv.toFixed(
                                                    1
                                                )}
                                            </span>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                </section>

                {/* ====================================================
                    FOOTER SOURCE
                ==================================================== */}

                <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-5 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">

                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                        <Eye
                            size={14}
                        />
                        <span>
                            Weather data:
                            Open-Meteo
                        </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <MapPin
                            size={14}
                        />

                        <span>
                            Coordinates:{" "}
                            {weather.latitude.toFixed(
                                4
                            )}
                            ,{" "}
                            {weather.longitude.toFixed(
                                4
                            )}
                        </span>
                    </div>

                </div>

            </div>
        </main>
    );
}