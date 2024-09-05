// /client/src/pages/ResetPassword.jsx
import { useState } from "react";
import { Alert, Button, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css"; // 引入CSS文件

export default function ResetPassword() {
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
    if (!formData.code || !formData.newPassword) {
      return setErrorMessage("请填写所有字段.");
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset-password", {
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
        setSuccessMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/sign-in"), 3000); // 3秒后跳转
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
        <h1 className="text-3xl font-bold text-center mb-6">重置密码</h1>
        <form className="flex flex-col gap-6 items-center" onSubmit={handleSubmit}>
          <div className="relative input-container w-full">
            <label
              htmlFor="code"
              className={`floating-label ${formData.code ? "label-focused" : ""}`}
            >
              验证码
            </label>
            <input
              type="text"
              id="code"
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="relative input-container w-full">
            <label
              htmlFor="newPassword"
              className={`floating-label ${formData.newPassword ? "label-focused" : ""}`}
            >
              新密码
            </label>
            <input
              type="password"
              id="newPassword"
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
                <span className="pl-3">重置中...</span>
              </>
            ) : (
              "重置密码"
            )}
          </Button>
        </form>
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