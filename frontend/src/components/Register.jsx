import {
  divider,
  errorClass,
  formCard,
  formGroup,
  formTitle,
  inputClass,
  labelClass,
  pageBackground,
  submitBtn,
  mutedText,
} from "../styles/common";

import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const onUserRegister = async (userObj) => {
    try {
      setLoading(true);
      setApiError(null);

      console.log("Form Data:", userObj);

      // ---------------- FORM DATA ----------------
      const formData = new FormData();

      formData.append("role", userObj.role);
      formData.append("firstName", userObj.firstName);
      formData.append("lastName", userObj.lastName);
      formData.append("email", userObj.email);
      formData.append("password", userObj.password);

      // image file
      if (userObj.profileImageUrl && userObj.profileImageUrl.length > 0) {
        formData.append("profileImageUrl", userObj.profileImageUrl[0]);
      }

      // ---------------- API CALL ----------------
      const res = await axios.post(
        "https://blog-app-13-s3pi.onrender.com/auth/users",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.log("Registration Error:", err);
      setApiError(
        err.response?.data?.error || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create an Account</h2>

        {apiError && <p className={errorClass}>{apiError}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>

          {/* ROLE */}
          <div className="mb-5">
            <p className={labelClass}>Register as</p>

            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="USER"
                  {...register("role", { required: "Role required" })}
                />
                User
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="AUTHOR"
                  {...register("role", { required: "Role required" })}
                />
                Author
              </label>
            </div>

            {errors.role && (
              <p className={errorClass}>{errors.role.message}</p>
            )}
          </div>

          <div className={divider} />

          {/* NAME */}
          <input
            placeholder="First Name"
            className={inputClass}
            {...register("firstName", { required: "First name required" })}
          />
          {errors.firstName && (
            <p className={errorClass}>{errors.firstName.message}</p>
          )}

          <input
            placeholder="Last Name"
            className={inputClass}
            {...register("lastName")}
          />

          {/* EMAIL */}
          <input
            placeholder="Email"
            type="email"
            className={inputClass}
            {...register("email", { required: "Email required" })}
          />
          {errors.email && (
            <p className={errorClass}>{errors.email.message}</p>
          )}

          {/* PASSWORD */}
          <input
            placeholder="Password"
            type="password"
            className={inputClass}
            {...register("password", { required: "Password required" })}
          />
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}

          {/* IMAGE */}
          <input
            type="file"
            accept="image/*"
            className={inputClass}
            {...register("profileImageUrl")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 rounded-full mt-3 object-cover"
            />
          )}

          {/* SUBMIT */}
          <button type="submit" className={submitBtn} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-600">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;