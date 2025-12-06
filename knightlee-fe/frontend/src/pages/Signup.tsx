// import React, { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import Navbar from "../components/Navbar"

// export default function Signup() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   })
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const navigate = useNavigate()

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {}

//     if (formData.firstName.trim().length < 2) {
//       newErrors.firstName = "First name must be at least 2 characters"
//     }
//     if (formData.lastName.trim().length < 2) {
//       newErrors.lastName = "Last name must be at least 2 characters"
//     }
//     if (!formData.email.includes("@")) {
//       newErrors.email = "Please enter a valid email"
//     }
//     if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters"
//     }
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }))
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) return

//     console.log("Signup attempt:", formData)
//     navigate("/")
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#CCF5E9] to-[#E9FFF7]">
//       <Navbar />

//       <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-6 py-10">
//         <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
//           {/* Logo Section */}
//           <div className="flex justify-center mb-6">
//             <div className="w-16 h-16 bg-[#08a870] rounded-2xl flex items-center justify-center shadow-lg">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="2"
//                 stroke="white"
//                 className="w-9 h-9"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
//                 />
//               </svg>
//             </div>
//           </div>

//           {/* Title */}
//           <h1 className="text-4xl font-extrabold text-gray-900 text-center">
//             Create Account
//           </h1>
//           <p className="text-gray-600 text-center mt-2">
//             Join Knightlee for safe navigation
//           </p>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="mt-8 space-y-5">
//             {/* First Name */}
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
//                 First Name
//               </label>
//               <input
//                 id="firstName"
//                 name="firstName"
//                 type="text"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 placeholder="John"
//                 className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#009c6a] focus:ring-2 focus:ring-[#CCF5E9] transition-all ${
//                   errors.firstName ? "border-red-500" : "border-gray-300"
//                 }`}
//                 required
//               />
//               {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
//             </div>

//             {/* Last Name */}
//             <div>
//               <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
//                 Last Name
//               </label>
//               <input
//                 id="lastName"
//                 name="lastName"
//                 type="text"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//                 placeholder="Doe"
//                 className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#009c6a] focus:ring-2 focus:ring-[#CCF5E9] transition-all ${
//                   errors.lastName ? "border-red-500" : "border-gray-300"
//                 }`}
//                 required
//               />
//               {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
//             </div>

//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="you@example.com"
//                 className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#009c6a] focus:ring-2 focus:ring-[#CCF5E9] transition-all ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 }`}
//                 required
//               />
//               {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
//             </div>

//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="••••••••"
//                   className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#009c6a] focus:ring-2 focus:ring-[#CCF5E9] transition-all ${
//                     errors.password ? "border-red-500" : "border-gray-300"
//                   }`}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
//                 >
//                   {showPassword ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="2"
//                       stroke="currentColor"
//                       className="w-5 h-5"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="2"
//                       stroke="currentColor"
//                       className="w-5 h-5"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                       />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   placeholder="••••••••"
//                   className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#009c6a] focus:ring-2 focus:ring-[#CCF5E9] transition-all ${
//                     errors.confirmPassword ? "border-red-500" : "border-gray-300"
//                   }`}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
//                 >
//                   {showConfirmPassword ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="2"
//                       stroke="currentColor"
//                       className="w-5 h-5"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="2"
//                       stroke="currentColor"
//                       className="w-5 h-5"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                       />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-[#009c6a] text-white py-3 rounded-xl font-semibold text-lg hover:bg-[#008458] transition-all shadow-lg mt-6"
//             >
//               Create Account
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="mt-8 relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or</span>
//             </div>
//           </div>

//           {/* Login Link */}
//           <p className="text-center mt-8 text-gray-600">
//             Already have an account?{" "}
//             <Link to="/login" className="font-semibold text-[#009c6a] hover:text-[#008458]">
//               Sign in here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { signup } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate("/home"); // auto-login after signup
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#CCF5E9] to-[#E9FFF7]">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-6 py-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#08a870] rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="white"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 text-center">
            Create Account
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Join Knightlee for safe navigation
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#009c6a] focus:ring-2 focus:ring-[#CCF5E9] transition-all ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#009c6a] focus:ring-2 focus:ring-[#CCF5E9] transition-all ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#009c6a] focus:ring-2 focus:ring-[#CCF5E9] transition-all ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#009c6a] focus:ring-2 focus:ring-[#CCF5E9] transition-all ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#009c6a] focus:ring-2 focus:ring-[#CCF5E9] transition-all ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#009c6a] text-white py-3 rounded-xl font-semibold text-lg hover:bg-[#008458] transition-all shadow-lg mt-6"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center mt-8 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#009c6a] hover:text-[#008458]"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
