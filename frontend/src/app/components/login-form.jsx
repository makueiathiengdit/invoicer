"use client";

import { login } from "@/actions/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let res = await login(formData);
      res = JSON.parse(res);

      if (res._success) {
        toast.success("Login successful");
        router.push("/i/invoices");
      } else {
        toast.error(res._message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center  sm:px-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>
            <p className="">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
        <div className="bg-white shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-teal-600 shadow-sm rounded-lg"
                onChange={handleInputChange}
                placeholder="e.g nyibol@zain.com"
              />
            </div>
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-teal-600 shadow-sm rounded-lg"
                onChange={handleInputChange}
                placeholder="*********"
              />
            </div>
            <button
              className="w-full px-4 py-2 text-white font-medium bg-teal-600 hover:bg-teal-500 active:bg-teal-600 rounded-lg duration-150"
              onClick={handleSubmit}
            >
              Sign in
            </button>
          </form>
        </div>
        <div className="text-center">
          <a href="#" className="hover:text-teal-600">
            Forgot password?
          </a>
        </div>
      </div>
    </main>
  );
};

export default LoginForm;
