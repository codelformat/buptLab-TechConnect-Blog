import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { set } from "mongoose";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import * as THREE from "three"; // Import three.js explicitly
import Waves from "../components/Globe";
import Clouds from "../components/Clouds";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
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
      // Set loading to true to display the loading spinner
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
      // If the request is unsuccessful, display the error message
      // Example: Duplicate username or email
      if (data.success === false) {
        return setErrorMessage(data.message);
        setLoading(false);
      }
      setLoading(false);
      if (res.ok) {
        // Redirect the user to the sign in page if the request is successful
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen 
    bg-gradient-to-r from-pink-300 to-pink-400"
    >
      <div className="h-4/5 w-4/5 bg-white mx-auto rounded-3xl border flex">
        {/* <div className="flex p-1 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-20"> */}
        {/* Left side */}

        <Clouds></Clouds>

        {/* Right side */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* <div className="text-3xl font-bold mb-4">
              Sign Up
            </div> */}
          <div className="text-4xl font-bold mb-4 mt-[-1rem] text-black">
            注册
          </div>
          <form
            className="flex flex-col gap-10 w-full max-w-md justify-center items-center"
            onSubmit={handleSubmit}
          >
            <div className="w-4/5">
              <Label value="用户名" />
              <input
                type="text"
                placeholder="Username..."
                id="username"
                onChange={handleChange}
                className="border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent w-full py-1 text-lg font-bold text-black"
              />
            </div>
            <div className="w-4/5">
              <Label value="邮箱地址" />
              <input
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                className="border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent w-full py-1 text-lg font-bold text-black"
              />
            </div>
            <div className="w-4/5">
              <Label value="密码" />
              <input
                type="password"
                placeholder="Password..."
                id="password"
                onChange={handleChange}
                className="border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent w-full py-1 text-lg font-bold text-black"
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
              className="w-4/5"
            >
              Sign Up
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
    </div>
  );
}
