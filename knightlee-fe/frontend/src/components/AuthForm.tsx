import React, { useState } from "react";
import { useAuth } from "./src/api/AuthContext";

const AuthForm: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (err: any) {
      console.error(err);
      setError("Authentication failed. Check details and try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-slate-950">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-emerald-400 text-center">
          Knightlee
        </h1>
        <p className="text-xs text-slate-400 mb-4 text-center">
          Safety-aware navigation & urban safety platform
        </p>

        <div className="flex mb-4 text-sm">
          <button
            className={`flex-1 py-1 rounded-l ${
              mode === "login" ? "bg-emerald-500 text-black" : "bg-slate-800"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-1 rounded-r ${
              mode === "register" ? "bg-emerald-500 text:black" : "bg-slate-800"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full px-3 py-2 rounded bg-slate-800 text-sm"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 rounded bg-slate-800 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-xs text-red-400 bg-red-950/50 px-2 py-1 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded bg-emerald-500 text-black font-semibold text-sm"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
