'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Particles from '../components/Particles';
import Image from 'next/image';

// Define the type for challenge options
type ChallengeType = 'Standard' | 'Instant';

const challengeTypes = [
  { 
    id: 'Standard' as const, 
    name: 'Shockwave Challenge', 
    amounts: ['$5,000', '$10,000', '$25,000', '$50,000', '$100,000', '$200,000', '$500,000'],
    image: '/shockwavechallenge.png',
    description: 'Classic two-step challenge for confident traders'
  },
  { 
    id: 'Instant' as const, 
    name: 'Shockwave Instant', 
    amounts: ['$25,000', '$50,000', '$100,000'],
    image: '/shockwaveinstant.png',
    description: 'Skip the evaluation and get funded instantly'
  }
];

const platforms = ['MT4', 'MT5'];

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  type?: string;
  amount?: string;
  platform?: string;
  terms?: string;
}

// Function to calculate price based on challenge type and amount
const calculatePrice = (type: ChallengeType, amount: string): number => {
  const baseAmount = parseInt(amount.replace(/\$|,/g, ''));
  
  switch(type) {
    case 'Standard':
      switch(baseAmount) {
        case 5000: return 79;
        case 10000: return 149;
        case 25000: return 299;
        case 50000: return 349;
        case 100000: return 599;
        case 200000: return 999;
        case 500000: return 1999;
        default: return 0;
      }
    case 'Instant':
      switch(baseAmount) {
        case 25000: return 799;
        case 50000: return 999;
        case 100000: return 1999;
        default: return 0;
      }
    default:
      return 0;
  }
};

// Function to calculate table values
const calculateTableValues = (selectedType: ChallengeType | null, selectedAmount: string | null) => {
  if (!selectedType || !selectedAmount) return null;
  
  const baseAmount = parseInt(selectedAmount.replace(/\$|,/g, ''));
  
  return {
    maxDailyLoss: baseAmount * (selectedType === 'Standard' ? 0.08 : 0.04),
    maxLoss: baseAmount * (selectedType === 'Standard' ? 0.15 : 0.12),
    profitTargetStep1: baseAmount * (selectedType === 'Standard' ? 0.10 : 0.12),
    profitTargetStep2: baseAmount * (selectedType === 'Standard' ? 0.05 : 0)
  };
};

export default function ChallengePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ChallengeType | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    discordUsername: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // Calculate table values when selectedType or selectedAmount changes
  const tableValues = calculateTableValues(selectedType, selectedAmount);

  const handleTypeSelect = (type: ChallengeType) => {
    setSelectedType(type);
    setSelectedAmount(null);
  };

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCurrentPrice = () => {
    if (!selectedType || !selectedAmount) return null;
    return calculatePrice(selectedType, selectedAmount);
  };

  const handleProceedToPayment = () => {
    if (!isFormValid()) {
      // Show validation errors
      const errors: FormErrors = {};
      if (!formData.firstName) errors.firstName = 'First name is required';
      if (!formData.lastName) errors.lastName = 'Last name is required';
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.phone) errors.phone = 'Phone number is required';
      if (!formData.country) errors.country = 'Country is required';
      if (!selectedType) errors.type = 'Please select a challenge type';
      if (!selectedAmount) errors.amount = 'Please select an amount';
      if (!selectedPlatform) errors.platform = 'Please select a platform';
      if (!termsAccepted) errors.terms = 'Please accept the terms and conditions';
      
      setFormErrors(errors);
      return;
    }
    
    // Store form data in session storage
    sessionStorage.setItem('challengeData', JSON.stringify({
      type: selectedType,
      amount: selectedAmount,
      platform: selectedPlatform,
      formData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        discordUsername: formData.discordUsername || ''
      },
      price: getCurrentPrice()
    }));
    
    router.push('/challenge/payment');
  };

  const isFormValid = () => {
    return (
      selectedType &&
      selectedAmount &&
      selectedPlatform &&
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.country &&
      termsAccepted
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Get Started with Your Challenge</h1>

        {/* Challenge Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First Card - Challenge Selection */}
          <div className="lg:col-span-1 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-white">Select Challenge Type</h3>
              <div className="grid grid-cols-2 gap-4">
                {challengeTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`relative group w-full rounded-xl overflow-hidden border transition-all duration-300 ${
                      selectedType === type.id
                        ? 'border-[#0FF1CE] shadow-[0_0_40px_rgba(15,241,206,0.2)]'
                        : 'border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30'
                    }`}
                  >
                    {/* Image section - top 70% */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden flex items-center justify-center bg-[#151515]">
                      <div className="relative w-[105%] h-[105%] md:w-[105%] md:h-[105%]">
                        <Image
                          src={type.image}
                          alt={type.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    </div>
                    
                    {/* Text section - bottom 30% */}
                    <div className="p-4 bg-[#0D0D0D]">
                      <h2 className="text-[10px] md:text-sm font-bold mb-1 text-white text-center">
                        {type.name}
                      </h2>
                      <div className="h-0.5 w-12 bg-[#0FF1CE] mb-2 rounded mx-auto"></div>
                      <p className="text-[8px] md:text-xs text-gray-400 text-center">
                        {type.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div className={`mb-8 ${selectedType ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <h3 className="text-lg font-medium mb-4 text-white">Select Account Size</h3>
              <div className="grid grid-cols-2 gap-4">
                {(selectedType ? challengeTypes.find(type => type.id === selectedType)?.amounts : [])?.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-4 rounded-lg border ${
                      selectedAmount === amount
                        ? 'border-[#0FF1CE] bg-[#0FF1CE]/10 text-white'
                        : 'border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30 text-gray-300'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div className={`mb-8 ${selectedAmount ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <h3 className="text-lg font-medium mb-4 text-white">Select Platform</h3>
              <div className="grid grid-cols-2 gap-4">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformSelect(platform)}
                    className={`p-4 rounded-lg border ${
                      selectedPlatform === platform
                        ? 'border-[#0FF1CE] bg-[#0FF1CE]/10 text-white'
                        : 'border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30 text-gray-300'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Display */}
            {selectedPlatform && (
              <div className="mt-6 p-4 bg-[#151515] rounded-lg">
                <h3 className="text-xl font-medium text-white">Total Price: <span className="text-[#0FF1CE]">${getCurrentPrice()}</span></h3>
              </div>
            )}
          </div>

          {/* Second Card - Personal Information */}
          <div className="lg:col-span-1 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
            <h3 className="text-lg font-medium mb-4 text-white">Your Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full bg-[#151515] border ${formErrors.firstName ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50`}
                />
                {formErrors.firstName && <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full bg-[#151515] border ${formErrors.lastName ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50`}
                />
                {formErrors.lastName && <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-[#151515] border ${formErrors.email ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50`}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full bg-[#151515] border ${formErrors.phone ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50`}
                />
                {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full bg-[#151515] border ${formErrors.country ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50`}
                >
                  <option value="">Select a country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="SG">Singapore</option>
                  {/* Add more countries as needed */}
                </select>
                {formErrors.country && <p className="mt-1 text-sm text-red-500">{formErrors.country}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Discord Username (Optional)</label>
                <input
                  type="text"
                  name="discordUsername"
                  value={formData.discordUsername}
                  onChange={handleInputChange}
                  className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                />
              </div>
              
              <div className="pt-4">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    className={`mt-1 ${formErrors.terms ? 'border-red-500' : ''}`}
                  />
                  <span className="text-sm text-gray-400">
                    I accept the <a href="#" className="text-[#0FF1CE] hover:underline">Terms and Conditions</a> and <a href="#" className="text-[#0FF1CE] hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {formErrors.terms && <p className="mt-1 text-sm text-red-500">{formErrors.terms}</p>}
              </div>
              
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-[#0FF1CE] text-black font-bold py-3 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors mt-6"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>

        {/* Challenge Details Table */}
        {selectedType && selectedAmount && (
          <div className="mt-12 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#2F2F2F]/50">
            <h3 className="text-xl font-bold text-[#0FF1CE] mb-6 text-center">Challenge Details</h3>
            
            <div className={`${selectedType === 'Standard' ? 'max-w-5xl' : 'max-w-3xl'} mx-auto overflow-x-auto py-4 px-4 md:px-8`}>
              <div className={`${selectedType === 'Standard' ? 'min-w-[650px]' : 'min-w-[450px]'} md:min-w-0 rounded-2xl transform hover:scale-[1.01] transition-transform duration-300 overflow-hidden mx-auto md:scale-[0.85] md:origin-top`}>
                <div 
                  className={`grid ${selectedType === 'Standard' ? 'grid-cols-4' : 'grid-cols-2'} text-xs md:text-sm bg-gradient-to-br from-[#0FF1CE]/10 to-transparent backdrop-blur-sm rounded-2xl border border-[#0FF1CE]/30`}
                  style={{
                    boxShadow: '0 0 30px rgba(15, 241, 206, 0.2)'
                  }}
                >
                  {/* Header */}
                  {selectedType === 'Standard' ? (
                    <div className="col-span-4 grid grid-cols-4 bg-gradient-to-r from-[#0FF1CE] to-[#0FF1CE]/80">
                      <div className="p-3 md:p-4 border-r border-black/20 text-black font-bold"></div>
                      <div className="p-3 md:p-4 border-r border-black/20 text-center text-black font-bold">CHALLENGE</div>
                      <div className="p-3 md:p-4 border-r border-black/20 text-center text-black font-bold">VERIFICATION</div>
                      <div className="p-3 md:p-4 text-center text-black font-bold">FUNDED</div>
                    </div>
                  ) : (
                    <div className="col-span-2 grid grid-cols-2 bg-gradient-to-r from-[#0FF1CE] to-[#0FF1CE]/80">
                      <div className="p-3 md:p-4 border-r border-black/20 text-black font-bold"></div>
                      <div className="p-3 md:p-4 text-center text-black font-bold">FUNDED</div>
                    </div>
                  )}

                  {/* Rows */}
                  {selectedType === 'Standard' ? (
                    <>
                      {[
                        ['Trading Period', 'Unlimited', 'Unlimited', 'Unlimited'],
                        ['Minimum Profitable Days', '4 Days', '4 Days', 'X'],
                        ['Maximum Daily Loss', 
                          <div key="daily1" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">8%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.maxDailyLoss.toLocaleString()}</span>
                          </div>, 
                          <div key="daily2" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">8%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.maxDailyLoss.toLocaleString()}</span>
                          </div>, 
                          <div key="daily3" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">8%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.maxDailyLoss.toLocaleString()}</span>
                          </div>
                        ],
                        ['Maximum Loss', 
                          <div key="max1" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">15%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.maxLoss.toLocaleString()}</span>
                          </div>,
                          <div key="max2" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">15%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.maxLoss.toLocaleString()}</span>
                          </div>,
                          <div key="max3" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">15%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.maxLoss.toLocaleString()}</span>
                          </div>
                        ],
                        ['Profit Target', 
                          <div key="profit1" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">10%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.profitTargetStep1.toLocaleString()}</span>
                          </div>,
                          <div key="profit2" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">5%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.profitTargetStep2.toLocaleString()}</span>
                          </div>,
                          'X'
                        ],
                        ['Leverage', '1:200', '1:200', '1:200'],
                        ['News Trading', 'Allowed', 'Allowed', 'Allowed'],
                        ['First Withdrawal', 'X', 'X', '14 Days'],
                        ['Profit Split', 'X', 'X', '80%'],
                        ['Refundable Fee', '$79', 'X', 'X']
                      ].map((row, index) => (
                        <div key={index} className="contents text-white">
                          <div className="p-3 md:p-4 border-t border-[#2F2F2F]/50 font-medium">{row[0]}</div>
                          <div className="p-3 md:p-4 border-t border-l border-[#2F2F2F]/50 text-center">{row[1]}</div>
                          <div className="p-3 md:p-4 border-t border-l border-[#2F2F2F]/50 text-center">{row[2]}</div>
                          <div className="p-3 md:p-4 border-t border-l border-[#2F2F2F]/50 text-center">{row[3]}</div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {[
                        ['Trading Period', '30 Days'],
                        ['Minimum Profitable Days', '5 Days'],
                        ['Maximum Daily Loss', 
                          <div key="daily" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">4%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.maxDailyLoss.toLocaleString()}</span>
                          </div>
                        ],
                        ['Maximum Loss', 
                          <div key="max" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">12%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.maxLoss.toLocaleString()}</span>
                          </div>
                        ],
                        ['Profit Target', 
                          <div key="profit" className="flex flex-col items-center">
                            <span className="text-[#0FF1CE] font-bold text-base md:text-lg">12%</span>
                            <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.profitTargetStep1.toLocaleString()}</span>
                          </div>
                        ],
                        ['Leverage', '1:100'],
                        ['News Trading', 'Allowed'],
                        ['First Withdrawal', '14 Days'],
                        ['Profit Split', '70%'],
                        ['Refundable Fee', '$799']
                      ].map((row, index) => (
                        <div key={index} className="contents text-white">
                          <div className="p-3 md:p-4 border-t border-[#2F2F2F]/50 font-medium">{row[0]}</div>
                          <div className="p-3 md:p-4 border-t border-l border-[#2F2F2F]/50 text-center">{row[1]}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .background-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.15;
        }
      `}</style>
    </div>
  );
} 