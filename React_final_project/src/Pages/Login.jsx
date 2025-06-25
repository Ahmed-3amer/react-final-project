import { logInAPI } from "@/api/auth";
import { logInAndRegisterSchema } from "@/forms/schema";
import { useAuthStore } from "@/store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import qs from "qs";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Login() {
  const { search } = useLocation();
  const { redirectTo } = qs.parse(search, { ignoreQueryPrefix: true });
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const [remember, setRemember] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(logInAndRegisterSchema),
  });

  useEffect(() => {
    const saved = localStorage.getItem("rememberMe");
    if (saved) {
      const parsed = JSON.parse(saved);
      setValue("email", parsed.email);
      setValue("password", parsed.password);
      setRemember(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const res = await logInAPI(data);
      setTokens(res.data);
      if (remember) {
        localStorage.setItem("rememberMe", JSON.stringify(data));
      } else {
        localStorage.removeItem("rememberMe");
      }
      navigate(redirectTo ?? "/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <h2 className="text-center mb-4">Login</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete={remember ? "on" : "off"}
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                {...register("email")}
              />
              <p className="text-danger small mt-1">{errors?.email?.message}</p>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                {...register("password")}
              />
              <p className="text-danger small mt-1">
                {errors?.password?.message}
              </p>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            <button type="submit" className="btn btn-dark w-100">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
