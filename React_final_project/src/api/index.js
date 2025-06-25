import axios from "axios";
import { refreshTokeAPI } from "./auth";
import { jwtDecode } from "jwt-decode";

export const APIClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function removeTokenHandler() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  const currentPath = window.location.pathname;

  // 🛑 لو المستخدم بالفعل في صفحة المصادقة، متعملش redirect تاني
  if (!currentPath.startsWith("/auth")) {
    window.location.replace("/auth");
  }
}


export function isTokenExpire(token) {
  try {
    const { exp, expiresIn } = jwtDecode(token);
    const now = Date.now() / 1000;
    return (exp ?? expiresIn) < now;
  } catch {
    return true;
  }
}

export const publicRoutes = ["/signup", "/refresh-token", "/login"];

APIClient.interceptors.request.use(
  async (config) => {
    const fullUrl = config.url || "";
    const urlPath = new URL(fullUrl, APIClient.defaults.baseURL).pathname;

    console.log("📦 Request to:", urlPath);

    const isPublic = publicRoutes.some((route) => urlPath.startsWith(route));
    if (!isPublic) {
      const authStore =
        JSON.parse(localStorage.getItem("auth-store"))?.state ?? {};
      const { token, refreshToken } = authStore;

      console.log("🔐 Found token:", token?.slice(0, 20), "...");

      if (isTokenExpire(token)) {
        console.warn("⚠️ Token expired");

        if (!isTokenExpire(refreshToken)) {
          console.log("🔁 Trying to refresh token...");
          try {
            const res = await refreshTokeAPI({ refreshToken });

            // ✅ خزّن التوكن الجديد في localStorage
            const newToken = res.data.token;
            const newAuthStore = {
              ...authStore,
              token: newToken,
            };
            localStorage.setItem(
              "auth-store",
              JSON.stringify({ state: newAuthStore, version: 0 })
            );

            config.headers.Authorization = `Bearer ${newToken}`;
            console.log("✅ Token refreshed and saved");
            return config;
          } catch (err) {
            console.error("❌ Failed to refresh token", err);
            removeTokenHandler();
            return config;
          }
        }

        console.error("❌ Refresh token also expired");
        removeTokenHandler();
        return config;
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Token attached to request");
      } else {
        console.warn("❌ No token found in localStorage");
      }
    } else {
      console.log("🟢 Public route, no token needed");
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error in interceptor", error);
    return Promise.reject(error);
  }
);
