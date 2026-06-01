'use client';
import apiClient, { AUT001 } from '@/data/api-client';
import { BaseEntity, ErrorEntity } from '@/data/entities/base-entity';
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Shield,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ChangePasswordPage = () => {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const passwordRequirements = [
    { label: 'Ít nhất 8 ký tự', test: (pwd: string) => pwd.length >= 8 },
    {
      label: 'Có chứa ký tự in hoa',
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      label: 'Có chứa ký tự thường',
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    { label: 'Có chứa số', test: (pwd: string) => /[0-9]/.test(pwd) },
    {
      label: 'Có chứa ký tự đặc biệt',
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSaved(false);
  };

  const toggleShowPassword = (field: 'new' | 'current' | 'confirm') => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    // Validation
    if (!passwords.current) {
      setError('Làm ơn nhập mật khẩu hiện tại');
      return;
    }

    if (!passwords.new) {
      setError('Làm ơn nhập mật khẩu mới');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    const allRequirementsMet = passwordRequirements.every((req) =>
      req.test(passwords.new)
    );
    if (!allRequirementsMet) {
      setError('Mật khẩu mới không thỏa mãn tất cả các điều kiện');
      return;
    }

    if (passwords.current === passwords.new) {
      setError('Mật khẩu mới phải khác mật khẩu cũ');
      return;
    }

    // Success
    const changePassword = async () => {
      try {
        const response = await apiClient.post<BaseEntity<ErrorEntity>>(AUT001, {
          old_password: passwords.current,
          new_password: passwords.new,
        });
        if (response?.result == 'OK') {
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
    if (metCount <= 2) return 'bg-red-500';
    if (metCount <= 3) return 'bg-yellow-500';
    if (metCount <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    const metCount = passwordRequirements.filter((req) =>
      req.test(passwords.new)
    ).length;
    if (metCount <= 2) return 'Yếu';
    if (metCount <= 3) return 'Trung bình';
    if (metCount <= 4) return 'Tốt';
    return 'Mạnh';
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-stone-950 p-6 md:p-12 text-amber-50 selection:bg-yellow-500 selection:text-red-950'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl mb-4 shadow-lg shadow-yellow-500/20'>
            <KeyRound className='w-8 h-8 text-red-950 font-bold' />
          </div>
          <h1 className='text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent uppercase tracking-wider mb-3 drop-shadow-sm'>
            Thay đổi mật khẩu
          </h1>
          <p className='text-lg text-amber-200/60 font-medium'>
            Cập nhật mật khẩu để bảo mật tài khoản hơn
          </p>
        </div>

        {/* Main Card */}
        <div className='bg-red-950/30 backdrop-blur-xl rounded-3xl border border-yellow-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] p-8 mb-6'>
          {/* Current Password */}
          <div className='mb-6'>
            <label className='block text-sm font-bold text-yellow-300/95 uppercase tracking-wider text-xs mb-2'>
              Mật khẩu hiện tại
            </label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500/60' />
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) =>
                  handlePasswordChange('current', e.target.value)
                }
                className='w-full pl-12 pr-12 py-4 text-amber-100 bg-red-950/40 border-2 border-yellow-500/20 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 placeholder:text-amber-100/30 transition-all'
                placeholder='Nhập mật khẩu hiện tại'
              />
              <button
                onClick={() => toggleShowPassword('current')}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500/60 hover:text-yellow-400 transition-colors'
              >
                {showPassword.current ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className='mb-6'>
            <label className='block text-sm font-bold text-yellow-300/95 uppercase tracking-wider text-xs mb-2'>
              Mật khẩu mới
            </label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500/60' />
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
                className='w-full pl-12 pr-12 py-4 text-amber-100 bg-red-950/40 border-2 border-yellow-500/20 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 placeholder:text-amber-100/30 transition-all'
                placeholder='Nhập mật khẩu mới'
              />
              <button
                onClick={() => toggleShowPassword('new')}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500/60 hover:text-yellow-400 transition-colors'
              >
                {showPassword.new ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwords.new && (
              <div className='mt-3'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs font-semibold text-amber-200/60'>
                    Độ bảo mật của mật khẩu
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      getStrengthText() === 'Mạnh'
                        ? 'text-emerald-400'
                        : getStrengthText() === 'Tốt'
                        ? 'text-sky-400'
                        : getStrengthText() === 'Trung bình'
                        ? 'text-yellow-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {getStrengthText()}
                  </span>
                </div>
                <div className='h-2 bg-red-950/50 border border-yellow-500/10 rounded-full overflow-hidden'>
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
          <div className='mb-6'>
            <label className='block text-sm font-bold text-yellow-300/95 uppercase tracking-wider text-xs mb-2'>
              Nhập lại mật khẩu mới
            </label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500/60' />
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) =>
                  handlePasswordChange('confirm', e.target.value)
                }
                className='w-full pl-12 pr-12 py-4 text-amber-100 bg-red-950/40 border-2 border-yellow-500/20 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 placeholder:text-amber-100/30 transition-all'
                placeholder='Nhập lại mật khẩu mới'
              />
              <button
                onClick={() => toggleShowPassword('confirm')}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500/60 hover:text-yellow-400 transition-colors'
              >
                {showPassword.confirm ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
            {passwords.confirm && passwords.new !== passwords.confirm && (
              <p className='mt-2 text-sm text-rose-400 font-semibold bg-red-950/40 p-1.5 px-3 rounded-lg border border-red-500/20 w-fit flex items-center gap-1'>
                <X className='w-4 h-4' />
                Mật khẩu không khớp
              </p>
            )}
            {passwords.confirm && passwords.new === passwords.confirm && (
              <p className='mt-2 text-sm text-emerald-400 font-semibold bg-red-950/40 p-1.5 px-3 rounded-lg border border-emerald-500/20 w-fit flex items-center gap-1'>
                <Check className='w-4 h-4' />
                Mật khẩu đã khớp
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className='bg-red-950/50 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-5 mb-6'>
            <h4 className='text-sm font-bold text-yellow-300 uppercase tracking-wider mb-3 flex items-center gap-2'>
              <Shield className='w-4 h-4 text-yellow-400' />
              Yêu cầu mật khẩu
            </h4>
            <div className='space-y-2'>
              {passwordRequirements.map((req, index) => {
                const isMet = req.test(passwords.new);
                return (
                  <div
                    key={index}
                    className='flex items-center gap-2'
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        passwords.new && isMet ? 'bg-emerald-500' : 'bg-red-950 border border-yellow-500/20'
                      }`}
                    >
                      {passwords.new && isMet && (
                        <Check className='w-3 h-3 text-white' />
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        passwords.new && isMet
                          ? 'text-emerald-400 font-semibold'
                          : 'text-amber-100/60'
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
            <div className='mb-6 bg-red-950/50 border border-red-500/30 rounded-xl p-4 flex items-start gap-3'>
              <AlertCircle className='w-5 h-5 text-red-400 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-red-300 font-semibold'>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {saved && (
            <div className='mb-6 bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3'>
              <Check className='w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-emerald-300 font-semibold'>
                Đổi mật khẩu thành công
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <button
              onClick={handleSave}
              className='flex-1 group relative px-6 py-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-red-950 font-black uppercase tracking-wider rounded-xl shadow-lg hover:shadow-yellow-500/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border-0'
            >
              <Lock className='w-5 h-5' />
              {saved ? 'Mật khẩu đã đổi!' : 'Đổi mật khẩu'}
            </button>

            <button
              onClick={handleReset}
              className='px-6 py-4 bg-red-950/40 hover:bg-red-900/40 text-amber-300 hover:text-yellow-200 font-bold uppercase tracking-wider rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-3 border border-yellow-500/20 cursor-pointer'
            >
              <X className='w-5 h-5' />
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
