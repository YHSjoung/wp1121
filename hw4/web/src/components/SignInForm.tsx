"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";

import useLogin from "@/useHook/useLogin";

function SignInForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const comfirmPasswordRef = useRef<HTMLInputElement>(null);
  const { login, signup } = useLogin();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSignIn = async () => {
    const name = nameRef.current?.value;
    const password = passwordRef.current?.value;
    if (!(name && password)) {
      return;
    }
    try {
      const res = await login({ name, password });
      const { user, token } = res;
      localStorage.setItem("jwt-token", token);
      const params = new URLSearchParams(searchParams);
      params.set("user", user.name);
      router.push(`/chat/?${params.toString()}`);
    } catch (e) {
      console.error(e);
      alert("Failed to login");
    }
  };
  const handleSingUp = async () => {
    const name = nameRef.current?.value;
    const password = passwordRef.current?.value;
    if (!(name && password)) {
      return;
    }
    if (password !== comfirmPasswordRef.current?.value) {
      return new Error("pass word don't match!");
    }
    if (password?.length && password.length < 8) {
      return new Error("pass word is too short!");
    }
    try {
      const res = await signup({ name, password });
      const { user, token } = res;
      localStorage.setItem("jwt-token", token);
      const params = new URLSearchParams(searchParams);
      params.set("user", user.name);
      router.push(`/chat/?${params.toString()}`);
    } catch (e) {
      console.error(e);
      alert("Failed to login");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignIn) {
      await handleSignIn();
    } else {
      await handleSingUp();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border shadow-lg p-6 rounded-xl flex flex-col gap-4 lg:w-1/3 md:w-1/2 w-2/3"
    >
      <div className="flex flex-col gap-1">
        {isSignIn ? (
          <h1 className="text-xl font-bold">Sign In</h1>
        ) : (
          <h1 className="text-xl font-bold">Sign Up</h1>
        )}
        {isSignIn ? (
          <p className="text-sm text-gray-400 font-light text-clip">
            Enter your Name and password to sign in.
          </p>
        ) : (
          <p className="text-sm text-gray-400 font-light text-clip">
            Enter your Name and password to sign up.
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 gap-4 items-center">
        <label
          htmlFor="displayId"
          className="col-span-1 text-right text-sm font-semibold"
        >
          Name
        </label>
        <input
          className="col-span-3 focus:border-gray-600 transition duration-200 ease-in-out outline-none border p-1 rounded-md"
          type="text"
          // id="displayId"
          ref={nameRef}
          required
        />
      </div>
      <div className="grid grid-cols-4 gap-4 items-center">
        <label
          htmlFor="displayId"
          className="col-span-1 text-right text-sm font-semibold"
        >
          Password
        </label>
        <input
          className="col-span-3 focus:border-gray-600 transition duration-200 ease-in-out outline-none border p-1 rounded-md"
          type="password"
          // id="displayId"
          ref={passwordRef}
          required
        />
      </div>
      {!isSignIn && (
        <div className="grid grid-cols-4 gap-4 items-center">
          <label
            htmlFor="displayId"
            className="col-span-1 text-right text-sm font-semibold"
          >
            Confirm Password
          </label>
          <input
            className="col-span-3 focus:border-gray-600 transition duration-200 ease-in-out outline-none border p-1 rounded-md"
            type="password"
            id="displayId"
            ref={comfirmPasswordRef}
            required
          />
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
        <button
          onClick={() => setIsSignIn(!isSignIn)}
          className="text-black py-2 px-4 rounded-lg text-sm hover:text-blue-500 hover:underline"
        >
          {isSignIn ? (
            <p>Don't have an account?</p>
          ) : (
            <p>Already have an account?</p>
          )}
        </button>
        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          {isSignIn ? <p>SignIn</p> : <p>SignUp</p>}
        </button>
      </div>
    </form>
  );
}

export default SignInForm;
