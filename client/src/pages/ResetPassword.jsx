// /client/src/pages/ResetPassword.jsx
import { useState } from "react";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";

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
        setTimeout(() => navigate("/sign-in"), 3000); // Redirect after 3 seconds
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
          <h1 className="font-bold dark:text-white text-4xl">
            Reset Password
          </h1>
          <p className="text-sm mt-5">
            Enter the verification code you received via email and your new password.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Verification Code" />
              <TextInput
                type="text"
                placeholder="Enter the code"
                id="code"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="New Password" />
              <TextInput
                type="password"
                placeholder="********"
                id="newPassword"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
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