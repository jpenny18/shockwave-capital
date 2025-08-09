'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Particles from '../components/Particles';
import Image from 'next/image';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, createOrder, Timestamp } from '@/lib/firebase';
import { Check, Zap, Shield, TrendingUp, ChevronRight, AlertCircle, CreditCard } from 'lucide-react';
import Link from 'next/link';

// Define the type for challenge options
type ChallengeType = 'Standard' | '1-Step' | 'Instant';

const challengeTypes = [
  { 
    id: 'Standard' as const, 
    name: 'Shockwave Challenge', 
    amounts: ['$5,000', '$10,000', '$25,000', '$50,000', '$100,000', '$200,000', '$500,000'],
    image: '/shockwavechallenge.png',
    description: 'Classic two-phase trading evaluation',
    badge: 'MOST POPULAR',
    features: ['2 Phase Evaluation', 'Up to 100% Profit Split', '15% Max Drawdown']
  },
  { 
    id: '1-Step' as const, 
    name: 'Shockwave 1-Step', 
    amounts: ['$5,000', '$10,000', '$25,000', '$50,000', '$100,000', '$200,000', '$500,000'],
    image: '/shockwave1step.png',
    description: 'Fast-track single phase evaluation',
    badge: 'BEST VALUE',
    features: ['1 Phase Only', 'Up to 100% Profit Split', '8% Max Drawdown']
  },
  { 
    id: 'Instant' as const, 
    name: 'Shockwave Instant', 
    amounts: ['$5,000', '$10,000', '$25,000', '$50,000', '$100,000', '$200,000', '$500,000'],
    image: '/shockwaveinstant.png',
    description: 'Access a simulated funded account instantly',
    badge: 'FASTEST',
    features: ['Instant Funding', '70% Profit Split', '4% Max Drawdown']
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

interface AddOn {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
}

const addOns: AddOn[] = [
  {
    id: 'no-min-days',
    name: 'No Min Trading Days',
    description: 'Trade at your own pace without minimum day requirements',
    priceMultiplier: 0.30
  },
  {
    id: 'profit-split-100',
    name: '100% Initial Profit Split',
    description: 'Start with 100% profit split instead of standard rates',
    priceMultiplier: 0.30
  }
  // Hidden add-ons (keeping for potential future use):
  // {
  //   id: 'leverage-500',
  //   name: '1:500 Leverage',
  //   description: 'Trade with higher leverage for increased potential',
  //   priceMultiplier: 0.30
  // },
  // {
  //   id: 'reward-150',
  //   name: '150% Reward',
  //   description: 'Boost your refundable fee by 50% extra!',
  //   priceMultiplier: 0.30
  // }
];

// Function to calculate price based on challenge type and amount
const calculatePrice = (type: ChallengeType, amount: string): number => {
  const baseAmount = parseInt(amount.replace(/\$|,/g, ''));
  
  switch(type) {
    case 'Standard':
      switch(baseAmount) {
        case 5000: return 59;
        case 10000: return 109;
        case 25000: return 189;
        case 50000: return 289;
        case 100000: return 499;
        case 200000: return 949;
        case 500000: return 1899;
        default: return 0;
      }
    case '1-Step':
      switch(baseAmount) {
        case 5000: return 65;
        case 10000: return 119;
        case 25000: return 199;
        case 50000: return 289;
        case 100000: return 569;
        case 200000: return 989;
        case 500000: return 1999;
        default: return 0;
      }
    case 'Instant':
      switch(baseAmount) {
        case 5000: return 299;
        case 10000: return 549;
        case 25000: return 749;
        case 50000: return 899;
        case 100000: return 1799;
        case 200000: return 3499;
        case 500000: return 6999;
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
    maxDailyLoss: baseAmount * (selectedType === 'Standard' ? 0.08 : selectedType === '1-Step' ? 0.04 : 0.04),
    maxLoss: baseAmount * (selectedType === 'Standard' ? 0.15 : selectedType === '1-Step' ? 0.08 : 0.04),
    profitTargetStep1: baseAmount * (selectedType === 'Standard' ? 0.10 : selectedType === '1-Step' ? 0.10 : 0.12),
    profitTargetStep2: baseAmount * (selectedType === 'Standard' ? 0.05 : 0)
  };
};

export default function ChallengePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ChallengeType | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
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
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  
  // Check for preselected values from pricing table
  useEffect(() => {
    const preselectedType = sessionStorage.getItem('preselectedChallengeType');
    const preselectedBalance = sessionStorage.getItem('preselectedBalance');
    
    if (preselectedType) {
      // Map the pricing table types to challenge types
      let mappedType: ChallengeType = 'Standard';
      if (preselectedType === 'Instant') {
        mappedType = 'Instant';
      } else if (preselectedType === '1-Step') {
        mappedType = '1-Step';
      }
      setSelectedType(mappedType);
      sessionStorage.removeItem('preselectedChallengeType');
    }
    
    if (preselectedBalance) {
      const formattedBalance = `$${parseInt(preselectedBalance).toLocaleString()}`;
      setSelectedAmount(formattedBalance);
      sessionStorage.removeItem('preselectedBalance');
    }
  }, []);
  
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

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateAddOnsPrice = (basePrice: number): number => {
    let totalMultiplier = 0;
    selectedAddOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) {
        totalMultiplier += addOn.priceMultiplier;
      }
    });
    return basePrice * totalMultiplier;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateDiscountCode = async (code: string) => {
    if (!code) {
      setAppliedDiscount(null);
      return;
    }

    setIsValidatingCode(true);
    try {
      const discountQuery = query(
        collection(db, 'discounts'),
        where('code', '==', code.toUpperCase()),
        where('active', '==', true)
      );
      
      const snapshot = await getDocs(discountQuery);
      
      if (snapshot.empty) {
        setFormErrors(prev => ({ ...prev, discountCode: 'Invalid discount code' }));
        setAppliedDiscount(null);
        return;
      }
      
      const discount = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      } as DiscountCode;
      
      // Validate expiration
      if (discount.expiresAt && new Date() > discount.expiresAt.toDate()) {
        setFormErrors(prev => ({ ...prev, discountCode: 'This code has expired' }));
        setAppliedDiscount(null);
        return;
      }
      
      // Validate usage limit
      if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
        setFormErrors(prev => ({ ...prev, discountCode: 'This code has reached its usage limit' }));
        setAppliedDiscount(null);
        return;
      }
      
      setFormErrors(prev => ({ ...prev, discountCode: undefined }));
      setAppliedDiscount(discount);
      
    } catch (error) {
      console.error('Error validating discount code:', error);
      setFormErrors(prev => ({ ...prev, discountCode: 'Error validating code' }));
      setAppliedDiscount(null);
    } finally {
      setIsValidatingCode(false);
    }
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
    const basePrice = calculatePrice(selectedType, selectedAmount);
    const addOnsPrice = calculateAddOnsPrice(basePrice);
    const priceWithAddOns = basePrice + addOnsPrice;
    return calculateDiscountedPrice(priceWithAddOns, appliedDiscount);
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
      addOns: selectedAddOns,
      formData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        discordUsername: formData.discordUsername || ''
      },
      price: getCurrentPrice(),
      discount: appliedDiscount ? {
        id: appliedDiscount.id,
        code: appliedDiscount.code,
        type: appliedDiscount.type,
        value: appliedDiscount.value
      } : null
    }));
    
    router.push('/challenge/payment');
  };

  // Credit card payment links mapping
  const getCreditCardPaymentLink = (type: ChallengeType, amount: string): string => {
    const baseAmount = parseInt(amount.replace(/\$|,/g, ''));
    
    // Map challenge types and amounts to payment links
    const linkMap: Record<ChallengeType, Record<number, string>> = {
      'Standard': {
        5000: 'https://www.hub-shockwave.com/shockpb/p/5-standard-pb',
        10000: 'https://www.hub-shockwave.com/shockpb/p/10-standard-pb',
        25000: 'https://www.hub-shockwave.com/shockpb/p/25-standard-pb',
        50000: 'https://www.hub-shockwave.com/shockpb/p/50-standard-pb',
        100000: 'https://www.hub-shockwave.com/shockpb/p/100-standard-pb',
        200000: 'https://www.hub-shockwave.com/shockpb/p/200-standard-pb',
        500000: 'https://www.hub-shockwave.com/shockpb/p/500-standard-pb',
      },
      'Instant': {
        5000: 'https://www.hub-shockwave.com/shockpb/p/5-instant-playbook',
        10000: 'https://www.hub-shockwave.com/shockpb/p/5-instant-playbook-bg3s6',
        25000: 'https://www.hub-shockwave.com/shockpb/p/5-instant-playbook-r2xm3',
        50000: 'https://www.hub-shockwave.com/shockpb/p/5-instant-playbook-bg3s6-3sayc',
        100000: 'https://www.hub-shockwave.com/shockpb/p/5-instant-playbook-hrhlp',
        200000: 'https://www.hub-shockwave.com/shockpb/p/5-instant-playbook-hrhlp-e3exg',
        500000: 'https://www.hub-shockwave.com/shockpb/p/5-instant-playbook-hrhlp-e3exg-4s8ya',
      },
      '1-Step': {
        5000: 'https://www.hub-shockwave.com/shockpb/p/5-one-step-playbook',
        10000: 'https://www.hub-shockwave.com/shockpb/p/5-one-step-playbook-yp7fc',
        25000: 'https://www.hub-shockwave.com/shockpb/p/5-one-step-playbook-r7rtb',
        50000: 'https://www.hub-shockwave.com/shockpb/p/5-one-step-playbook-87wmp',
        100000: 'https://www.hub-shockwave.com/shockpb/p/5-one-step-playbook-tzmch',
        200000: 'https://www.hub-shockwave.com/shockpb/p/5-one-step-playbook-bd8cz',
        500000: 'https://www.hub-shockwave.com/shockpb/p/5-one-step-playbook-yp7fc-99ncy',
      }
    };
    
    return linkMap[type][baseAmount] || '';
  };

  const handleCreditCardPayment = async () => {
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
    
    try {
      // Create order in Firebase
      const orderData = {
        customerEmail: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        country: formData.country,
        discordUsername: formData.discordUsername || '',
        challengeType: selectedType!,
        challengeAmount: selectedAmount!,
        platform: selectedPlatform!,
        addOns: selectedAddOns,
        totalAmount: getCurrentPrice() || 0,
        paymentMethod: 'card' as const,
        paymentStatus: 'pending' as const,
      };
      
      await createOrder(orderData);
      
      // Get the payment link
      const paymentLink = getCreditCardPaymentLink(selectedType!, selectedAmount!);
      
      if (paymentLink) {
        // Redirect to payment link
        window.location.href = paymentLink;
      } else {
        console.error('No payment link found for this selection');
        alert('Payment link not available for this selection. Please contact support.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to process order. Please try again.');
    }
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

  const renderAddOnsSection = () => (
    <div className={`mb-8 ${selectedPlatform ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
      <h3 className="text-lg font-medium mb-4 text-[#0FF1CE]">Available Add-ons</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {addOns.map((addOn) => (
          <div
            key={addOn.id}
            onClick={() => selectedPlatform && handleAddOnToggle(addOn.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
              selectedAddOns.includes(addOn.id)
                ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                : 'border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{addOn.name}</h4>
                <p className="text-sm text-gray-400">{addOn.description}</p>
              </div>
              <div className="ml-4 text-right">
                <div className="text-[#0FF1CE] font-bold">+{(addOn.priceMultiplier * 100).toFixed(0)}%</div>
                <div className="relative w-6 h-6 mt-2">
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addOn.id)}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded border-2 transition-all duration-300 ${
                    selectedAddOns.includes(addOn.id)
                      ? 'bg-[#0FF1CE] border-[#0FF1CE]'
                      : 'bg-transparent border-gray-400'
                  }`}>
                    {selectedAddOns.includes(addOn.id) && (
                      <Check size={16} className="text-black m-auto" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Promotional Text - Shows when add-ons are selected */}
      {selectedAddOns.length > 0 && (
        <div className="hidden mt-4 p-4 bg-gradient-to-r from-[#FF6B6B]/10 to-[#EE5A24]/10 border border-[#FF6B6B]/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-pulse"></div>
            <span className="text-[#FF6B6B] font-semibold text-sm">🎉 SPECIAL OFFER</span>
          </div>
          <p className="text-white text-sm">
            <strong>Add-Ons are free for debit/credit card purchases during our re-launch week only!</strong>
          </p>
        </div>
      )}
    </div>
  );

  const renderDiscountSection = () => (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4 text-white">Discount Code</h3>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => {
              setDiscountCode(e.target.value.toUpperCase());
              setFormErrors(prev => ({ ...prev, discountCode: undefined }));
            }}
            onBlur={() => validateDiscountCode(discountCode)}
            placeholder="Enter discount code"
            className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0FF1CE]/50 focus:border-transparent transition-all"
          />
          {isValidatingCode && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0FF1CE] border-t-transparent"></div>
            </div>
          )}
        </div>
        <button
          onClick={() => validateDiscountCode(discountCode)}
          disabled={isValidatingCode || !discountCode}
          className="bg-[#0FF1CE] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#0FF1CE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
      {formErrors.discountCode && (
        <p className="mt-2 text-red-400 text-sm">{formErrors.discountCode}</p>
      )}
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
    if (!selectedType || !selectedAmount) return null;
    
    const basePrice = calculatePrice(selectedType, selectedAmount);
    const addOnsPrice = calculateAddOnsPrice(basePrice);
    const subtotal = basePrice + addOnsPrice;
    const finalPrice = calculateDiscountedPrice(subtotal, appliedDiscount);
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Base Price:</span>
          <span className="text-white font-semibold">${basePrice.toFixed(2)}</span>
        </div>
        
        {selectedAddOns.length > 0 && (
          <>
            <div className="border-t border-gray-600 pt-2">
              {selectedAddOns.map(addOnId => {
                const addOn = addOns.find(a => a.id === addOnId);
                if (!addOn) return null;
                const addOnPrice = basePrice * addOn.priceMultiplier;
                return (
                  <div key={addOnId} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{addOn.name}:</span>
                    <span className="text-white">+${addOnPrice.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center font-semibold">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
          </>
        )}
        
        {appliedDiscount && (
          <div className="flex justify-between items-center text-[#0FF1CE]">
            <span>Discount:</span>
            <span>
              -{appliedDiscount.type === 'percentage' 
                ? `${appliedDiscount.value}%` 
                : `$${appliedDiscount.value}`}
            </span>
          </div>
        )}
        
        <div className="border-t border-[#0FF1CE]/30 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-white">Total:</span>
            <span className="text-2xl font-bold text-[#0FF1CE]">${finalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderChallengeTable = () => {
    if (!selectedType) return null;

  return (
      <div className="bg-gradient-to-br from-[#1A1A1A]/80 to-[#151515]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
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
              ) : selectedType === '1-Step' ? (
                <div className="col-span-2 grid grid-cols-2 bg-gradient-to-r from-[#0FF1CE] to-[#0FF1CE]/80">
                  <div className="p-3 md:p-4 border-r border-black/20 text-black font-bold"></div>
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
                    ['Minimum Trading Days', '5 Days', '5 Days', 'X'],
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
                    ['Payout Eligibility', 'X', 'X', '14 Days'],
                    ['Profit Split', 'X', 'X', 'Up to 95%']
                  ].map((row, index) => (
                    <div key={index} className={`contents text-white ${index % 2 === 0 ? 'bg-[#ffffff08]' : 'bg-[#0FF1CE]/[0.08]'}`}>
                      <div className="p-3 md:p-4 border-t border-[#2F2F2F]/50 font-medium text-sm md:text-xs">{row[0]}</div>
                      <div className="p-3 md:p-4 border-t border-l border-[#2F2F2F]/50 text-center text-sm md:text-xs">{row[1]}</div>
                      <div className="p-3 md:p-4 border-t border-l border-[#2F2F2F]/50 text-center text-sm md:text-xs">{row[2]}</div>
                      <div className="p-3 md:p-4 border-t border-l border-[#2F2F2F]/50 text-center text-sm md:text-xs">{row[3]}</div>
                    </div>
                  ))}
                </>
              ) : selectedType === '1-Step' ? (
                <>
                  {[
                    ['Trading Period', 'Unlimited'],
                    ['Minimum Trading Days', '5 Days'],
                    ['Maximum Daily Loss', 
                      <div key="daily" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">4%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.maxDailyLoss.toLocaleString()}</span>
                      </div>
                    ],
                    ['Maximum Loss', 
                      <div key="max" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">8%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.maxLoss.toLocaleString()}</span>
                      </div>
                    ],
                    ['Profit Target', 
                      <div key="profit" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">10%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${tableValues?.profitTargetStep1.toLocaleString()}</span>
                      </div>
                    ],
                    ['Leverage', '1:200'],
                    ['News Trading', 'Allowed'],
                    ['First Withdrawal', '5 Days'],
                    ['Profit Split', 'Up to 95%']
                  ].map((row, index) => (
                    <div key={index} className={`contents text-white ${index % 2 === 0 ? 'bg-[#ffffff08]' : 'bg-[#0FF1CE]/[0.08]'}`}>
                      <div className="p-3 md:p-4 border-t border-[#2F2F2F]/50 font-medium text-sm md:text-xs">{row[0]}</div>
                      <div className="p-3 md:p-4 border-t border-l border-[#2F2F2F]/50 text-center text-sm md:text-xs">{row[1]}</div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    ['Trading Period', '30 Days'],
                    ['Minimum Profitable Days', '5 Days'],
                    ['Maximum Loss', 
                      <div key="max" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">4%</span>
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
                    ['First Withdrawal', '6 Days'],
                    ['Profit Split', '70%']
                  ].map((row, index) => (
                    <div key={index} className={`contents text-white ${index % 2 === 0 ? 'bg-[#ffffff08]' : 'bg-[#0FF1CE]/[0.08]'}`}>
                      <div className="p-3 md:p-4 border-t border-[#2F2F2F]/50 font-medium text-sm md:text-xs">{row[0]}</div>
                      <div className="p-3 md:p-4 border-t border-l border-[#2F2F2F]/50 text-center text-sm md:text-xs">{row[1]}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#0D0D0D] to-[#151515] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#0FF1CE]/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#0FF1CE]/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
      </div>
      <Particles />

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-xl lg:text-5xl font-bold bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] bg-clip-text text-transparent mb-4">
            Start Your Trading Journey
          </h1>
            </div>

        {/* Launch Day Sale Banner - Mobile Optimized */}
        <div className="mb-8 lg:mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0FF1CE]/20 to-[#00D4FF]/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-r from-[#0FF1CE]/10 to-[#00D4FF]/10 rounded-2xl p-6 lg:p-8 border border-[#0FF1CE]/20 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Zap className="w-5 h-5 text-[#0FF1CE]" />
                  <span className="text-sm font-bold text-white">SuperCharged Offer!</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-[#0FF1CE] mb-1">SAVE 40%</div>
                <p className="text-xs text-gray-300 mt-1">+ 1 Free Retry</p>
              </div>
              <div className="text-center lg:text-right">
              <div className="text-xs text-gray-400 mb-1">Use Code:</div>
                <div className="inline-block text-xl font-mono font-bold bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] bg-clip-text text-transparent px-4 py-2 border border-[#0FF1CE]/30 rounded-lg">
                  TURBOCHARGED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* First Card - Challenge Selection */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#1A1A1A]/80 to-[#151515]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-[#0FF1CE]">Select Challenge Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {challengeTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`relative group w-full rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedType === type.id
                        ? 'border-[#0FF1CE] shadow-[0_0_20px_rgba(15,241,206,0.3)]'
                        : 'border-[#2F2F2F]/50 hover:border-[#0FF1CE]/50'
                    }`}
                  >
                    {/* Image section */}
                    <div className="relative w-full aspect-[16/12] overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#151515] to-[#0D0D0D]">
                      <div className="relative w-[85%] h-[85%]">
                        <Image
                          src={type.image}
                          alt={type.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    </div>
                    
                    {/* Text section */}
                    <div className="p-3 bg-[#0D0D0D]">
                      <h2 className="text-xs lg:text-sm font-bold mb-1 text-white text-center">
                        {type.name}
                      </h2>
                      <div className="h-0.5 w-12 bg-[#0FF1CE] mb-2 rounded mx-auto"></div>
                      <p className="text-[10px] lg:text-xs text-gray-400 text-center">
                        {type.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div className={`mb-8 ${selectedType ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <h3 className="text-lg font-medium mb-4 text-[#0FF1CE]">Select Account Size</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {(selectedType ? challengeTypes.find(type => type.id === selectedType)?.amounts : [])?.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      selectedAmount === amount
                        ? 'border-[#0FF1CE] bg-[#0FF1CE]/10 text-[#0FF1CE] shadow-[0_0_15px_rgba(15,241,206,0.2)]'
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
              <h3 className="text-lg font-medium mb-4 text-[#0FF1CE]">Select Platform</h3>
              <div className="grid grid-cols-2 gap-4">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformSelect(platform)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      selectedPlatform === platform
                        ? 'border-[#0FF1CE] bg-[#0FF1CE]/10 text-[#0FF1CE] shadow-[0_0_15px_rgba(15,241,206,0.2)]'
                        : 'border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30 text-gray-300'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons Selection */}
            {renderAddOnsSection()}

            {/* Discount Code */}
            {selectedType && selectedAmount && selectedPlatform && (
              <>
                {renderDiscountSection()}
                
                {/* Desktop Price Display - Below Discount */}
                <div className="hidden lg:block p-4 bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 rounded-lg border border-[#0FF1CE]/20">
                  {renderPriceSection()}
                </div>
                
                {/* Mobile Price Display - Original */}
                <div className="p-4 bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 rounded-lg border border-[#0FF1CE]/20 lg:hidden">
                  {renderPriceSection()}
                </div>
              </>
            )}
          </div>

          {/* Second Card - Challenge Details */}
          <div className="lg:col-span-5 relative">
            {/* Sticky container for desktop */}
            <div className="lg:sticky lg:top-8">
              {/* Sticky Price Display - Desktop Only */}
              {selectedType && selectedAmount && (
                <div className="hidden lg:block mb-4 bg-gradient-to-br from-[#1A1A1A]/80 to-[#151515]/80 backdrop-blur-sm rounded-2xl p-4 border border-[#0FF1CE]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Your Selection</div>
                      <div className="text-lg font-semibold text-white">{selectedType} - {selectedAmount}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Total Price</div>
                      <div className="text-2xl font-bold text-[#0FF1CE]">
                        ${getCurrentPrice()?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Show price breakdown if there are add-ons or discount */}
                  {(selectedAddOns.length > 0 || appliedDiscount) && (
                    <div className="mt-4 pt-4 border-t border-[#0FF1CE]/20">
                      {renderPriceSection()}
                    </div>
                  )}
                </div>
              )}
              
              {/* Challenge Details Table */}
              {renderChallengeTable()}
            </div>
          </div>
        </div>

        {/* Personal Information Section - Full Width Mobile First */}
        <div className="mt-8 lg:mt-12 bg-gradient-to-br from-[#1A1A1A]/80 to-[#151515]/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-[#2F2F2F]/50">
          <h3 className="text-xl lg:text-2xl font-bold text-[#0FF1CE] mb-6 text-center">Your Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                className={`w-full bg-[#151515]/50 backdrop-blur-sm border ${formErrors.firstName ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0FF1CE]/50 focus:border-transparent transition-all`}
                placeholder="Enter your first name"
                />
              {formErrors.firstName && <p className="mt-1 text-sm text-red-400 flex items-center gap-1"><AlertCircle size={14} />{formErrors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                className={`w-full bg-[#151515]/50 backdrop-blur-sm border ${formErrors.lastName ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0FF1CE]/50 focus:border-transparent transition-all`}
                placeholder="Enter your last name"
                />
              {formErrors.lastName && <p className="mt-1 text-sm text-red-400 flex items-center gap-1"><AlertCircle size={14} />{formErrors.lastName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                className={`w-full bg-[#151515]/50 backdrop-blur-sm border ${formErrors.email ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0FF1CE]/50 focus:border-transparent transition-all`}
                placeholder="your@email.com"
                />
              {formErrors.email && <p className="mt-1 text-sm text-red-400 flex items-center gap-1"><AlertCircle size={14} />{formErrors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                className={`w-full bg-[#151515]/50 backdrop-blur-sm border ${formErrors.phone ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0FF1CE]/50 focus:border-transparent transition-all`}
                placeholder="+1 (555) 000-0000"
                />
              {formErrors.phone && <p className="mt-1 text-sm text-red-400 flex items-center gap-1"><AlertCircle size={14} />{formErrors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                className={`w-full bg-[#151515]/50 backdrop-blur-sm border ${formErrors.country ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0FF1CE]/50 focus:border-transparent transition-all`}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              {formErrors.country && <p className="mt-1 text-sm text-red-400 flex items-center gap-1"><AlertCircle size={14} />{formErrors.country}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Discord Username (Optional)</label>
                <input
                  type="text"
                  name="discordUsername"
                  value={formData.discordUsername}
                  onChange={handleInputChange}
                className="w-full bg-[#151515]/50 backdrop-blur-sm border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0FF1CE]/50 focus:border-transparent transition-all"
                placeholder="username#0000"
                />
            </div>
              </div>
              
          <div className="mt-8 max-w-4xl mx-auto">
            
            
            <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="disclaimer"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                className="mt-1 w-4 h-4 rounded border-gray-600 text-[#0FF1CE] focus:ring-[#0FF1CE] focus:ring-offset-0 bg-[#1A1A1A]/50"
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
            {formErrors.terms && <p className="mt-1 text-sm text-red-400 flex items-center gap-1"><AlertCircle size={14} />{formErrors.terms}</p>}
              
              <button
                onClick={handleProceedToPayment}
              disabled={!isFormValid()}
              className={`w-full mt-6 relative overflow-hidden rounded-xl font-bold py-4 px-6 transition-all duration-300 ${
                isFormValid()
                  ? 'bg-gradient-to-r from-[#0FF1CE] to-[#0AA89E] text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[#0FF1CE]/25'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="relative flex items-center justify-center gap-2">
                <span>Pay with Crypto</span>
                <ChevronRight size={20} className={isFormValid() ? 'group-hover:translate-x-1 transition-transform' : ''} />
              </div>
              </button>
              
              <button
                onClick={handleCreditCardPayment}
                disabled={!isFormValid()}
                className={`w-full mt-3 relative overflow-hidden rounded-xl font-bold py-4 px-6 transition-all duration-300 hidden ${
                  isFormValid()
                    ? 'bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[#FF6B6B]/25'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="relative flex items-center justify-center gap-2">
                  <CreditCard size={20} />
                  <span>Pay with Credit/Debit Card</span>
                </div>
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                You will be redirected to complete your purchase
              </p>
            </div>
          </div>
        </div>
    </div>
  );
} 