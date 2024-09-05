// /client/src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Alert, Button, Label, TextInput, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css"; // 引入CSS文件

export default function ForgotPassword() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      return setErrorMessage("请输入邮件.");
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      } else {
        setSuccessMessage("Verification code sent to your email.");
        setTimeout(() => navigate("/reset-password"), 3000); // 3秒后跳转
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dynamic-bg relative">
      <div className="relative z-10 bg-white bg-opacity-40 backdrop-blur-lg p-8 rounded-lg w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">忘记密码</h1>
        <form className="flex flex-col gap-6 items-center" onSubmit={handleSubmit}>
          <div className="relative input-container w-full">
            <label
              htmlFor="email"
              className={`floating-label ${formData.email ? "label-focused" : ""}`}
            >
              请输入您的邮箱
            </label>
            <input
              type="email"
              id="email"
              onChange={handleChange}
              required
              className="input-field"
            />
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
                <span className="pl-3">发送中...</span>
              </>
            ) : (
              "发送验证码"
            )}
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-5 justify-center">
          <span>记得密码？</span>
          <Link to="/sign-in" className="text-blue-500">
            登录
          </Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert className="mt-5" color="success">
            {successMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}