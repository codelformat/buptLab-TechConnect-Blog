// /client/src/pages/ForgotPassword.jsx
import {useState} from 'react'

import { Alert, Button, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

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
        setTimeout(() => navigate("/reset-password"), 3000); // Redirect after 3 seconds
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span
              className="px-2 py-1 bg-gradient-to-r from-indigo-500
                via-purple-500 to-pink-500 rounded-lg text-white"
            >
              Codelformat's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Enter your email to receive a verification code to reset your password.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Verification Code"}
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
    </div>
  );
}
