import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { set } from "mongoose";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { HiMail, HiLockClosed } from "react-icons/hi";
import "./SignIn.css"; // 引入CSS文件
import { Alert, Button, Label, Spinner, Checkbox } from "flowbite-react";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill in all the fields."));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dynamic-bg relative">
      <div className="relative z-10 bg-white bg-opacity-40 backdrop-blur-lg p-8 rounded-lg w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">登录</h1>
        <form
          className="flex flex-col gap-6 items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative input-container w-full">
            <HiMail className={`icon ${emailFocused ? "icon-focused" : ""}`} />
            <label
              htmlFor="email"
              className={`floating-label ${emailFocused || formData.email ? "label-focused" : ""
                }`}
            >
              邮箱
            </label>
            <input
              type="email"
              id="email"
              onChange={handleChange}
              className="input-field"
              required
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </div>
          <div className="relative input-container w-full">
            <HiLockClosed
              className={`icon ${passwordFocused ? "icon-focused" : ""}`}
            />
            <label
              htmlFor="password"
              className={`floating-label ${passwordFocused || formData.password ? "label-focused" : ""
                }`}
            >
              密码
            </label>
            <input
              type="password"
              id="password"
              onChange={handleChange}
              className="input-field"
              required
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </div>
          <div className="flex items-center justify-between w-full">
            <div>
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="ml-2">
                Remember me
              </Label>
            </div>
            <Link to="/forgot-password" className="text-blue-500 text-sm">
              Forgot your password?
            </Link>
          </div>
          <Button
            gradientDuoTone="purpleToPink"
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <OAuth />
        </form>
        <div className="flex gap-2 text-sm mt-5 justify-center">
          <span>Don't have an account?</span>
          <Link to="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}