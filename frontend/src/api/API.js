
import axios from "axios";

// ================================
// BACKEND URL
// ================================
const BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? "/api" : "http://127.0.0.1:5000/api");

// ================================
// AXIOS INSTANCE
// ================================
const API = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
});

// ================================
// REQUEST INTERCEPTOR
// ================================
API.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("access_token") ||
            localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(
            "REQUEST:",
            config.method?.toUpperCase(),
            config.url
        );

        return config;
    },
    (error) => Promise.reject(error)
);

// ================================
// RESPONSE INTERCEPTOR
// ================================
API.interceptors.response.use(
    (response) => {
        const body = response.data;

        // Preserve compatibility with Flask responses.
        if (
            body &&
            typeof body === "object" &&
            body.data &&
            typeof body.data === "object" &&
            !Array.isArray(body.data)
        ) {
            response.data = {
                ...body,
                ...body.data,
                data: body.data
            };
        }

        return response;
    },
    (error) => {
        if (!error.response) {
            console.error(
                "Backend not reachable:",
                error.message
            );

            return Promise.reject(error);
        }

        const status = error.response.status;
        const requestUrl = error.config?.url || "";

        console.error(
            "API ERROR:",
            status,
            requestUrl,
            error.response.data
        );

        // Do not redirect when the login request itself fails.
        const isLoginRequest = requestUrl.includes("/auth/login");

        // Only clear the session for 401 responses from
        // protected endpoints, not from login itself.
        if (status === 401 && !isLoginRequest) {
            console.warn(
                "Unauthorized protected API request:",
                requestUrl
            );

            localStorage.removeItem("token");
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            localStorage.removeItem("login_time");

            // Avoid repeatedly redirecting if already on login.
            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        // A 403 is an authorization failure, not necessarily
        // an expired or invalid login session.
        return Promise.reject(error);
    }
);

export default API;
