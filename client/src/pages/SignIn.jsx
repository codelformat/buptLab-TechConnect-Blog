import React, { useState, useEffect } from "react"; // 引入useEffect
import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  Checkbox,
} from "flowbite-react";
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

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false, // 添加rememberMe状态
  });
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme); // 获取当前的theme

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 使用useEffect在组件加载时检查localStorage中的信息
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    // 如果localStorage中存在之前保存的登录信息并且rememberMe为true，则自动填充
    if (rememberMe) {
      setFormData({
        email: savedEmail || "",
        password: savedPassword || "",
        rememberMe,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target; // 获取input的ID和对应的值
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value.trim(), // 处理checkbox的状态
    });
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
        // 如果用户选择了记住密码，将信息保存到localStorage中
        if (formData.rememberMe) {
          localStorage.setItem("email", formData.email);
          localStorage.setItem("password", formData.password);
          localStorage.setItem("rememberMe", formData.rememberMe);
        } else {
          // 用户未选择记住密码，清空localStorage中的信息
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          localStorage.removeItem("rememberMe");
        }
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative ${
        theme === "dark" ? "dynamic-bg-dark" : "dynamic-bg"
      }`}
    >
      <div className="relative z-10 bg-white bg-opacity-40 backdrop-blur-lg p-8 rounded-lg w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">登录</h1>
        <form
          className="flex flex-col gap-6 items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative input-container w-full">
            <HiMail className={`icon ${emailFocused ? "icon-focused" : ""}`} />
            {!emailFocused && !formData.email && (
              <label
                htmlFor="email"
                className={`floating-label ${
                  emailFocused || formData.email ? "label-focused" : ""
                }`}
              >
                邮箱
              </label>
            )}

            <input
              type="email"
              id="email"
              value={formData.email} // 将输入框的值绑定到formData
              onChange={handleChange}
              required
              className="input-field"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </div>
          <div className="relative input-container w-full">
            <HiLockClosed
              className={`icon ${passwordFocused ? "icon-focused" : ""}`}
            />
            {!passwordFocused && !formData.password && (
              <label
                htmlFor="password"
                className={`floating-label ${
                  passwordFocused || !formData.password ? "label-focused" : ""
                }`}
              >
                密码
              </label>
            )}

            <input
              type="password"
              id="password"
              value={formData.password} // 将输入框的值绑定到formData
              onChange={handleChange}
              className="input-field"
              required
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </div>
          <div className="flex items-center justify-between w-full">
            <div>
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe} // 将checkbox的状态绑定到formData
                onChange={handleChange}
              />
              <Label htmlFor="rememberMe" className="ml-2">
                记住我
              </Label>
            </div>
            <Link to="/forgot-password" className="text-blue-500 text-sm">
              忘记密码？
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
                <span className="pl-3">加载中...</span>
              </>
            ) : (
              "登录"
            )}
          </Button>
          <OAuth />
        </form>
        <div className="flex gap-2 text-sm mt-5 justify-center">
          <span>没有账号？</span>
          <Link to="/sign-up" className="text-blue-500">
            注册
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
