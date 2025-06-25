import { registerSchema } from "@/forms/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerAPI } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import defaultAvatar from "@/assets/default-avatar.png";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === "avatar") {
        formData.append("avatar", data.avatar[0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      await registerAPI(formData);
      navigate("/auth");
    } catch (e) {
      console.error(e);
    } finally {
      reset();
      setAvatarPreview(null);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setValue("avatar", e.target.files);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <h2 className="text-center">Register</h2>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="row g-4 align-items-start">
              <div className=" col-md-12 d-flex flex-column align-items-center justify-content-start text-center">
                <div
                  className="avatar-hover-box position-relative "
                  onClick={handleAvatarClick}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={avatarPreview || defaultAvatar}
                    alt="avatar preview"
                    className="avatar-img-small"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                  <div className="upload-overlay d-flex align-items-center justify-content-center">
                    Upload
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                </div>
                <p className="text-danger text-center small mt-1">
                  {errors?.avatar?.message}
                </p>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="name"
                    {...register("name")}
                  />
                  <p className="text-danger small mt-1">
                    {errors?.name?.message}
                  </p>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="username"
                    {...register("username")}
                  />
                  <p className="text-danger small mt-1">
                    {errors?.username?.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="email"
                {...register("email")}
              />
              <p className="text-danger small mt-1">{errors?.email?.message}</p>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  {...register("password")}
                />
                <p className="text-danger small mt-1">
                  {errors?.password?.message}
                </p>
              </div>

              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="phone number"
                  {...register("phone")}
                />
                <p className="text-danger small mt-1">
                  {errors?.phone?.message}
                </p>
              </div>
            </div>

            <button type="submit" className="btn btn-dark w-100 mt-3">
              Create My Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
