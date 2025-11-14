import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { DollarSign, MapPin, Tag, Check, Upload } from 'lucide-react';

const PriceSubmissionForm = () => {
  const { commodities, markets, submitPrice, currentUser } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    commodityId: '',
    marketId: '',
    pricePerUnit: '',
    qualityGrade: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // A simple check to see if the user is a reporter
  if (!currentUser || currentUser.role !== 'reporter') {
    return (
        <div className="text-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
            <p className="font-bold">Access Denied</p>
            <p>You must be a registered Market Reporter to submit prices.</p>
        </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (!formData.commodityId) newErrors.commodityId = "Please select a commodity";
    if (!formData.marketId) newErrors.marketId = "Please select a market";
    if (!formData.pricePerUnit || formData.pricePerUnit < 1000) newErrors.pricePerUnit = "Enter a valid price (minimum ₦1,000)";
    if (!formData.qualityGrade) newErrors.qualityGrade = "Please select a quality grade";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const result = submitPrice({
        commodityId: parseInt(formData.commodityId),
        marketId: parseInt(formData.marketId),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        qualityGrade: formData.qualityGrade,
      });

      if (result.success) {
        setSuccessMessage(result.message);
        setFormData({ commodityId: '', marketId: '', pricePerUnit: '', qualityGrade: '' });
        setTimeout(() => setSuccessMessage(''), 5000); // Clear message after 5s
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit New Price</h1>
        <div className="bg-white p-8 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} noValidate>
            {successMessage && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm flex items-center gap-2"><Check /> {successMessage}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Commodity */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commodity</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select name="commodityId" value={formData.commodityId} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                            <option value="">Select commodity...</option>
                            {commodities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    {errors.commodityId && <p className="text-red-500 text-sm mt-1">{errors.commodityId}</p>}
                </div>

                {/* Market */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select name="marketId" value={formData.marketId} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                            <option value="">Select market...</option>
                            {markets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                    {errors.marketId && <p className="text-red-500 text-sm mt-1">{errors.marketId}</p>}
                </div>
                
                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit (₦)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="pricePerUnit" type="number" value={formData.pricePerUnit} placeholder="e.g., 85000" onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    {errors.pricePerUnit && <p className="text-red-500 text-sm mt-1">{errors.pricePerUnit}</p>}
                </div>
                
                {/* Quality Grade */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quality Grade</label>
                    <div className="relative">
                        <Check className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select name="qualityGrade" value={formData.qualityGrade} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                            <option value="">Select quality...</option>
                            <option value="premium">Premium</option>
                            <option value="standard">Standard</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    {errors.qualityGrade && <p className="text-red-500 text-sm mt-1">{errors.qualityGrade}</p>}
                </div>
            </div>
            
            {/* Photo Upload */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-right">
                <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Submit Price
                </button>
            </div>
        </form>
        </div>
    </div>
  );
};

export default PriceSubmissionForm;