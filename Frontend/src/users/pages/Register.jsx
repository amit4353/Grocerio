import React, { useState } from 'react';
import { registerUser } from '../../services/authServices';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  const navigate = useNavigate();

  const validateName = (name) => {
    if (!name) return 'Full name is required';
    if (name.length < 3) return 'Name must be at least 3 characters';
    if (name.length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s\-']+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address (e.g., name@example.com)';
    if (email.length > 100) return 'Email must be less than 100 characters';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password.length > 50) return 'Password must be less than 50 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character (!@#$%^&* etc.)';
    if (/\s/.test(password)) return 'Password cannot contain spaces';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';

    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');

    const indiaRegex = /^[6-9]\d{9}$/;
    const internationalRegex = /^\d{10,15}$/;
    
    if (!indiaRegex.test(cleanPhone) && !internationalRegex.test(cleanPhone)) {
      return 'Please enter a valid phone number (10-15 digits)';
    }
    return '';
  };

  const validateAddress = (address) => {
    if (!address) return 'Address is required';
    if (address.length < 10) return 'Please enter a complete address (minimum 10 characters)';
    if (address.length > 200) return 'Address must be less than 200 characters';
    return '';
  };

  const handleBlur = (field) => {
    let error = '';
    switch(field) {
      case 'name':
        error = validateName(name);
        break;
      case 'email':
        error = validateEmail(email);
        break;
      case 'password':
        error = validatePassword(password);
        break;
      case 'phone':
        error = validatePhone(phone);
        break;
      case 'address':
        error = validateAddress(address);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const formatPhoneNumber = (value) => {

    const cleaned = value.replace(/\D/g, '');
    

    if (cleaned.length <= 10) {
      return cleaned;
    } else {
      return cleaned.slice(0, 15);
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: validatePhone(formatted) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const phoneError = validatePhone(phone);
    const addressError = validateAddress(address);
    
    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      phone: phoneError,
      address: addressError,
    };
    
    setErrors(newErrors);
    
    // Check if any errors exist
    if (Object.values(newErrors).some(error => error !== '')) {
      toast.error('Please fix the validation errors');
      return;
    }
    setIsLoading(true);
    
    try {

      const cleanPhone = phone.replace(/\D/g, '');
      
      const res = await registerUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone_number: cleanPhone,
        address: address.trim(),
      });
      
      toast.success(res.message || 'Registration successful! Please login.');
      navigate('/users/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };


  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const getStrengthText = () => {
    switch(passwordStrength) {
      case 0: return '';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return '';
    }
  };

  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-green-600';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500">Join Grocerio and start shopping</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`appearance-none relative block w-full px-4 py-3 border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">Minimum 3 characters, letters only</p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`appearance-none relative block w-full px-4 py-3 border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              className={`appearance-none relative block w-full px-4 py-3 border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1.5">
                  {[1,2,3,4,5].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        level <= passwordStrength ? getStrengthColor() : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password strength: <span className="font-medium">{getStrengthText()}</span>
                </p>
              </div>
            )}
            
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
            <ul className="mt-2 text-xs text-gray-400 space-y-0.5">
              <li className={password.length >= 8 ? 'text-green-600' : ''}>✓ At least 8 characters</li>
              <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>✓ One uppercase letter</li>
              <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>✓ One lowercase letter</li>
              <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>✓ One number</li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : ''}>✓ One special character</li>
            </ul>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phone')}
              className={`appearance-none relative block w-full px-4 py-3 border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="9876543210"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">Enter 10-digit mobile number</p>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows="3"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => handleBlur('address')}
              className={`appearance-none relative block w-full px-4 py-3 border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="House No., Street Name, City, PIN Code"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">Complete address with PIN code (minimum 10 characters)</p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white font-medium bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Terms and Conditions */}
        <p className="text-center text-xs text-gray-400">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
        </p>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/users/login')}
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;