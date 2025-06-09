'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Particles from '../components/Particles';
import Image from 'next/image';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Define the type for challenge options
type ChallengeType = 'Standard' | 'Instant';

const challengeTypes = [
  { 
    id: 'Standard' as const, 
    name: 'Shockwave Challenge', 
    amounts: ['$5,000', '$10,000', '$25,000', '$50,000', '$100,000', '$200,000', '$500,000'],
    image: '/shockwavechallenge.png',
    description: 'Classic two-phase trading evaluation'
  },
  { 
    id: 'Instant' as const, 
    name: 'Shockwave Instant', 
    amounts: ['$25,000', '$50,000', '$100,000'],
    image: '/shockwaveinstant.png',
    description: 'Access a simulated funded account instantly'
  }
];

const platforms = ['MT4', 'MT5'];

const countries = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo, Democratic Republic' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: 'Korea, North' },
  { code: 'KR', name: 'Korea, South' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestine' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VA', name: 'Vatican City' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' }
];

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
  discountCode?: string;
}

interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  expiresAt: any;
  usageLimit: number | null;
  usageCount: number;
}

// Calculate reset prices - significantly discounted
const calculateResetPrice = (type: ChallengeType, amount: string): number => {
  const baseResetPrices: Record<ChallengeType, Record<string, number>> = {
    'Standard': {
      '$5,000': 29,
      '$10,000': 39,
      '$25,000': 49,
      '$50,000': 69,
      '$100,000': 89,
      '$200,000': 109,
      '$500,000': 149
    },
    'Instant': {
      '$25,000': 199,
      '$50,000': 299,
      '$100,000': 399
    }
  };
  
  return baseResetPrices[type]?.[amount] || 0;
};

export default function ResetPage() {
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
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState('');

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

  const validateDiscountCode = async (code: string) => {
    if (!code.trim()) {
      setAppliedDiscount(null);
      setDiscountError('');
      return;
    }

    setIsValidatingDiscount(true);
    setDiscountError('');

    try {
      const q = query(
        collection(db, 'discountCodes'),
        where('code', '==', code.toUpperCase()),
        where('active', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setDiscountError('Invalid discount code');
        setAppliedDiscount(null);
        setIsValidatingDiscount(false);
        return;
      }

      const doc = querySnapshot.docs[0];
      const discountData = { id: doc.id, ...doc.data() } as DiscountCode;

      // Check if code has expired
      if (discountData.expiresAt && discountData.expiresAt.toDate() < new Date()) {
        setDiscountError('This discount code has expired');
        setAppliedDiscount(null);
        setIsValidatingDiscount(false);
        return;
      }

      // Check usage limit
      if (discountData.usageLimit && discountData.usageCount >= discountData.usageLimit) {
        setDiscountError('This discount code has reached its usage limit');
        setAppliedDiscount(null);
        setIsValidatingDiscount(false);
        return;
      }

      setAppliedDiscount(discountData);
      setDiscountError('');
    } catch (error) {
      console.error('Error validating discount code:', error);
      setDiscountError('Error validating discount code');
      setAppliedDiscount(null);
    }

    setIsValidatingDiscount(false);
  };

  const calculateDiscountedPrice = (originalPrice: number, discount: DiscountCode | null): number => {
    if (!discount) return originalPrice;
    
    if (discount.type === 'percentage') {
      return originalPrice * (1 - discount.value / 100);
    } else {
      return Math.max(0, originalPrice - discount.value);
    }
  };

  const getCurrentPrice = () => {
    if (!selectedType || !selectedAmount) return null;
    const originalPrice = calculateResetPrice(selectedType, selectedAmount);
    return calculateDiscountedPrice(originalPrice, appliedDiscount);
  };

  const handleProceedToPayment = () => {
    const errors: FormErrors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.country.trim()) errors.country = 'Country is required';
    if (!selectedType) errors.type = 'Challenge type is required';
    if (!selectedAmount) errors.amount = 'Account size is required';
    if (!selectedPlatform) errors.platform = 'Platform is required';
    if (!termsAccepted) errors.terms = 'You must accept the terms';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    
    const finalPrice = getCurrentPrice();
    if (finalPrice === null) return;
    
    const resetData = {
      type: selectedType,
      amount: selectedAmount,
      platform: selectedPlatform,
      formData,
      price: finalPrice,
      discount: appliedDiscount,
      isReset: true
    };
    
    sessionStorage.setItem('resetData', JSON.stringify(resetData));
    router.push('/reset/payment');
  };

  const isFormValid = () => {
    return selectedType && selectedAmount && selectedPlatform && 
           formData.firstName && formData.lastName && formData.email && 
           formData.phone && formData.country && termsAccepted;
  };

  const renderDiscountSection = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-400 mb-2">Discount Code (Optional)</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
          placeholder="Enter discount code"
          className="flex-1 bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
        />
        <button
          onClick={() => validateDiscountCode(discountCode)}
          disabled={isValidatingDiscount}
          className="px-4 py-2.5 bg-[#0FF1CE]/10 hover:bg-[#0FF1CE]/20 border border-[#0FF1CE]/30 rounded-lg text-[#0FF1CE] disabled:opacity-50"
        >
          {isValidatingDiscount ? <RefreshCw className="animate-spin" size={16} /> : 'Apply'}
        </button>
      </div>
      {discountError && <p className="mt-1 text-sm text-red-500">{discountError}</p>}
      {appliedDiscount && (
        <div className="mt-2 text-[#0FF1CE] text-sm flex items-center gap-2">
          <Check size={16} />
          <span>
            Discount applied: {appliedDiscount.type === 'percentage' 
              ? `${appliedDiscount.value}% off` 
              : `$${appliedDiscount.value} off`}
          </span>
        </div>
      )}
    </div>
  );

  const renderPriceSection = () => {
    const originalPrice = selectedType && selectedAmount ? calculateResetPrice(selectedType, selectedAmount) : null;
    const finalPrice = getCurrentPrice();
    
    if (!originalPrice || !finalPrice) return null;
    
    return (
      <div className="text-right">
        {appliedDiscount && (
          <div className="text-gray-400 line-through mb-1">${originalPrice.toFixed(2)}</div>
        )}
        <div className="text-2xl font-bold text-[#0FF1CE]">${finalPrice.toFixed(2)}</div>
      </div>
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
        {/* Reset Special Offer Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20 shadow-lg shadow-orange-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl -ml-8 -mb-8"></div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
            <div className="flex items-center md:items-start gap-4">
              <AlertTriangle className="text-orange-500" size={32} />
              <div className="flex flex-col">
                <div className="text-sm text-white/70 mb-1">⚡ Second Chance Special</div>
                <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-1 md:mb-0">RESET & RESTART</div>
                <div className="text-sm text-gray-400">Get back in the game with discounted reset prices</div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end mt-3 md:mt-0">
              <div className="text-xs text-gray-400 mb-1">Use Code:</div>
              <div className="text-xl font-mono font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-wider px-4 py-2 border border-orange-500/30 rounded-md">
                ACTFAST
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Reset Your Challenge Account</h1>
        <p className="text-gray-400 mb-8">Start fresh with a new challenge account at a significantly discounted price. Perfect for traders who want to get back in the game!</p>

        {/* Challenge Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First Card - Challenge Selection */}
          <div className="lg:col-span-1 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-white">Select Your Previous Challenge Type</h3>
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
                    <div className="font-medium">{amount}</div>
                    {selectedType && (
                      <div className="text-xs text-[#0FF1CE] mt-1">
                        Reset: ${calculateResetPrice(selectedType, amount)}
                      </div>
                    )}
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

            {/* Discount Code */}
            {selectedType && selectedAmount && selectedPlatform && (
              <>
                {renderDiscountSection()}
                <div className="p-4 bg-[#151515] rounded-lg">
                  {renderPriceSection()}
                </div>
              </>
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
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
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
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="disclaimer"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    className="mt-1 w-4 h-4 rounded border-gray-600 text-[#0FF1CE] focus:ring-[#0FF1CE] focus:ring-offset-0 bg-[#1A1A1A]"
                  />
                  <label htmlFor="disclaimer" className="text-sm text-gray-400">
                    I acknowledge that Shockwave Capital provides a simulated trading environment and that all activity is for educational and evaluative purposes only. I agree to the{' '}
                    <Link href="/disclaimer" className="text-[#0FF1CE] hover:underline">
                      Disclaimer
                    </Link>, {' '}
                    <Link href="/terms" className="text-[#0FF1CE] hover:underline">
                      Terms of Use
                    </Link>, {' '}
                    <Link href="/privacy" className="text-[#0FF1CE] hover:underline">
                      Privacy Policy
                    </Link>, {' '}
                    <Link href="/legal-disclosure" className="text-[#0FF1CE] hover:underline">
                      Legal Disclosure
                    </Link>, and {' '}
                    <Link href="/refund" className="text-[#0FF1CE] hover:underline">
                      Refund Policy
                    </Link>.
                  </label>
                </div>
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

        {/* Reset Benefits */}
        <div className="mt-12 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#2F2F2F]/50">
          <h3 className="text-xl font-bold text-[#0FF1CE] mb-6 text-center">Why Choose Account Reset?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center">
                <RefreshCw className="text-[#0FF1CE]" size={32} />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">Fresh Start</h4>
              <p className="text-gray-400 text-sm">Begin with a clean slate and all your rules reset to zero</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center">
                <AlertTriangle className="text-[#0FF1CE]" size={32} />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">Massive Savings</h4>
              <p className="text-gray-400 text-sm">Save up to 80% compared to purchasing a new challenge</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center">
                <Check className="text-[#0FF1CE]" size={32} />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">Instant Access</h4>
              <p className="text-gray-400 text-sm">Get your new account credentials within minutes of payment</p>
            </div>
          </div>
        </div>
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