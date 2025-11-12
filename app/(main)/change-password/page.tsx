"use client";
import apiClient, { AUT001 } from "@/data/api-client";
import { BaseEntity, ErrorEntity } from "@/data/entities/base-entity";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Shield,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ChangePasswordPage = () => {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const passwordRequirements = [
    { label: "Ít nhất 8 ký tự", test: (pwd: string) => pwd.length >= 8 },
    {
      label: "Có chứa ký tự in hoa",
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      label: "Có chứa ký tự thường",
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    { label: "Có chứa số", test: (pwd: string) => /[0-9]/.test(pwd) },
    {
      label: "Có chứa ký tự đặc biệt",
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSaved(false);
  };

  const toggleShowPassword = (field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    // Validation
    if (!passwords.current) {
      setError("Làm ơn nhập mật khẩu hiện tại");
      return;
    }

    if (!passwords.new) {
      setError("Làm ơn nhập mật khẩu mới");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError("Mật khẩu mới không khớp");
      return;
    }

    const allRequirementsMet = passwordRequirements.every((req) =>
      req.test(passwords.new)
    );
    if (!allRequirementsMet) {
      setError("Mật khẩu mới không thỏa mãn tất cả các điều kiện");
      return;
    }

    if (passwords.current === passwords.new) {
      setError("Mật khẩu mới phải khác mật khẩu cũ");
      return;
    }

    // Success
    const changePassword = async () => {
      try {
        const response = await apiClient.post<BaseEntity<ErrorEntity>>(AUT001, {
          old_password: passwords.current,
          new_password: passwords.new,
        });
        if (response?.result == "OK") {
          setSaved(true);
          setTimeout(() => {
            router.back();
          }, 2000);
        } else {
          setError(`${response?.data.message_id}`);
        }
      } catch (e) {
        setError(`${(e as Error).message}`);
      }
    };
    changePassword();
  };

  const handleReset = () => {
    router.back();
  };

  const getStrengthColor = () => {
    const metCount = passwordRequirements.filter((req) =>
      req.test(passwords.new)
    ).length;
    if (metCount <= 2) return "bg-red-500";
    if (metCount <= 3) return "bg-yellow-500";
    if (metCount <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    const metCount = passwordRequirements.filter((req) =>
      req.test(passwords.new)
    ).length;
    if (metCount <= 2) return "Yếu";
    if (metCount <= 3) return "Trung bình";
    if (metCount <= 4) return "Tốt";
    return "Mạnh";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Thay đổi mật khẩu
          </h1>
          <p className="text-lg text-gray-600">
            Cập nhật mật khẩu để bảo mật tài khoản hơn
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          {/* Current Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword.current ? "text" : "password"}
                value={passwords.current}
                onChange={(e) =>
                  handlePasswordChange("current", e.target.value)
                }
                className="w-full pl-12 pr-12 py-4 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                onClick={() => toggleShowPassword("current")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu mới
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword.new ? "text" : "password"}
                value={passwords.new}
                onChange={(e) => handlePasswordChange("new", e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Nhập mật khẩu mới"
              />
              <button
                onClick={() => toggleShowPassword("new")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwords.new && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">
                    Độ bảo mật của mật khẩu
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      getStrengthText() === "Mạnh"
                        ? "text-green-600"
                        : getStrengthText() === "Tốt"
                        ? "text-blue-600"
                        : getStrengthText() === "Trung bình"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {getStrengthText()}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{
                      width: `${
                        (passwordRequirements.filter((req) =>
                          req.test(passwords.new)
                        ).length /
                          passwordRequirements.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nhập lại mật khẩu mới
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword.confirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) =>
                  handlePasswordChange("confirm", e.target.value)
                }
                className="w-full pl-12 pr-12 py-4 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                onClick={() => toggleShowPassword("confirm")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwords.confirm && passwords.new !== passwords.confirm && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                Mật khẩu không khớp
              </p>
            )}
            {passwords.confirm && passwords.new === passwords.confirm && (
              <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Mật khẩu đã khớp
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Yêu cầu mật khẩu
            </h4>
            <div className="space-y-2">
              {passwordRequirements.map((req, index) => {
                const isMet = req.test(passwords.new);
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        passwords.new && isMet ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {passwords.new && isMet && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        passwords.new && isMet
                          ? "text-green-700 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {req.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {saved && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 font-medium">
                Đổi mật khẩu thành công
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              className="flex-1 group relative px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Lock className="w-5 h-5" />
              {saved ? "Mật khẩu đã đổi!" : "Đổi mật khẩu"}
            </button>

            <button
              onClick={handleReset}
              className="px-6 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 border border-gray-200"
            >
              <X className="w-5 h-5" />
              Hủy
            </button>
          </div>
        </div>

        {/* Info Banner */}
        {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Security Tips
              </h4>
              <p className="text-gray-600 text-sm">
                Use a strong, unique password that you don't use anywhere else.
                Consider using a password manager to generate and store secure
                passwords. Change your password regularly and never share it
                with others.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ChangePasswordPage;
