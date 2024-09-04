// /client/src/pages/SignUp.jsx
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { HiMail, HiLockClosed, HiUser } from "react-icons/hi";
import './SignUp.css'; // 引入CSS文件

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("请填写所有字段.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dynamic-bg relative">
      <div className="relative z-10 bg-white bg-opacity-40 backdrop-blur-lg p-8 rounded-lg w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">注册</h1>
        <form className="flex flex-col gap-6 items-center" onSubmit={handleSubmit}>
          <div className="relative input-container w-full">
            <HiUser className={`icon ${usernameFocused ? 'icon-focused' : ''}`} />

            <input
              type="text"
              placeholder="Username..."
              id="username"
              onChange={handleChange}
              className="input-field"
              required
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
            />
          </div>
          <div className="relative input-container w-full">
            <HiMail className={`icon ${emailFocused ? 'icon-focused' : ''}`} />

            <input
              type="email"
              placeholder="name@company.com"
              id="email"
              onChange={handleChange}
              className="input-field"
              required
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              
            />
          </div>
          <div className="relative input-container w-full">
            <HiLockClosed className={`icon ${passwordFocused ? 'icon-focused' : ''}`} />
            <input
              type="password"
              placeholder="Password..."
              id="password"
              onChange={handleChange}
              className="input-field"
              required
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
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
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          <OAuth />
        </form>
        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}