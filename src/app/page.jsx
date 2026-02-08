"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, User, Lock, Sparkles } from "lucide-react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (!res.ok) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-blue-100 flex flex-col items-center justify-center p-4">
      
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Left Side - Branding */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Unique Library
              </h1>
              <p className="text-sky-700 text-lg mt-2">Where stories come to life</p>
            </div>
          </div>
          
          <div className="hidden lg:block space-y-6 mt-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-sky-500" />
              </div>
              <p className="text-sky-800 text-lg font-medium">Curated collection of rare books</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 text-sky-500" />
              </div>
              <p className="text-sky-800 text-lg font-medium">Personalized reading experience</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-sky-500" />
              </div>
              <p className="text-sky-800 text-lg font-medium">Smart recommendations</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-sky-900 mb-3">Welcome Back</h2>
              <p className="text-sky-600">Sign in to your Unique Library account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-sky-800">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-sky-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 py-4 bg-sky-50 border border-sky-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sky-900 placeholder-sky-400 transition-all duration-200"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-sky-800">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-sky-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-4 py-4 bg-sky-50 border border-sky-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sky-900 placeholder-sky-400 transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="absolute bottom-6 text-center text-sky-500/70 text-sm">
        © 2024 Unique Library. All rights reserved.
      </div>
    </div>
  );
}