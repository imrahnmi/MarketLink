import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { User, Phone, Lock, Briefcase } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    userRole: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const { register } = useAppContext();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }
    const phoneRegex = /^0[789][01]\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid Nigerian phone number";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.userRole) {
      newErrors.userRole = "Please select your role";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const result = register({
        name: formData.fullName,
        phone: formData.phone,
        password: formData.password,
        role: formData.userRole,
      });
      if (result.success) {
        navigate('/');
      } else {
        setServerError(result.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          {serverError && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{serverError}</p>}
          
          <div className="mb-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="fullName" placeholder="Full Name" onChange={handleChange} className="w-full pl-12 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div className="mb-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="phone" placeholder="Phone Number" type="tel" onChange={handleChange} className="w-full pl-12 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="mb-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="password" placeholder="Password" type="password" onChange={handleChange} className="w-full pl-12 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select name="userRole" onChange={handleChange} className="w-full pl-12 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                <option value="">Select your role</option>
                <option value="farmer">Farmer</option>
                <option value="trader">Trader</option>
                <option value="consumer">Consumer</option>
                <option value="reporter">Market Reporter</option>
              </select>
            </div>
            {errors.userRole && <p className="text-red-500 text-sm mt-1">{errors.userRole}</p>}
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Create Account
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;