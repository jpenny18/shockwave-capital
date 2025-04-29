'use client';
import React, { useState, useMemo } from 'react';
import Particles from '../../components/Particles';
import { 
  ChevronDown, 
  ChevronUp, 
  Search,
  HelpCircle,
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const categories = [
  'General',
  'Account',
  'Trading',
  'Challenges',
  'Payments',
  'Technical',
];

const FAQCard = ({ question, answer, isExpanded, onClick }: { 
  question: string;
  answer: string;
  isExpanded: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between gap-4 hover:bg-[#0FF1CE]/5 transition-colors"
        onClick={onClick}
      >
        <h3 className="text-white font-medium">{question}</h3>
        <button>
          {isExpanded ? 
            <ChevronUp size={20} className="text-[#0FF1CE]" /> : 
            <ChevronDown size={20} className="text-gray-400" />
          }
        </button>
      </div>
      
      <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isExpanded ? 'max-h-96' : 'max-h-0'}
      `}>
        <div className="p-4 pt-0 border-t border-[#2F2F2F]/50 text-gray-300 text-sm leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Sample FAQ data (replace with real data from API)
  const faqs: FAQItem[] = [
    {
      question: "What is Shockwave Capital?",
      answer: "Shockwave Capital is a proprietary trading firm that provides funded trading accounts to qualified traders. Our mission is to identify talented traders and provide them with the capital they need to succeed in the financial markets.",
      category: "General"
    },
    {
      question: "How do I qualify for a funded account?",
      answer: "To qualify for a funded account, you need to pass our trading challenge. The challenge is designed to assess your trading skills, risk management, and consistency. Once you pass the challenge, you'll be provided with a funded account where you can trade with our capital and keep a significant portion of the profits.",
      category: "Challenges"
    },
    {
      question: "What are the rules of the trading challenge?",
      answer: "The trading challenge rules include maintaining the account balance above a specified drawdown limit, reaching a profit target, trading for a minimum number of days, and adhering to risk management guidelines. Specific rules vary by challenge type and account size. You can view the detailed rules for each challenge on the challenge details page.",
      category: "Challenges"
    },
    {
      question: "What markets can I trade?",
      answer: "With a Shockwave Capital funded account, you can trade Forex, Indices, Commodities, Cryptocurrencies, and Stocks. The specific instruments available depend on your account type and size.",
      category: "Trading"
    },
    {
      question: "How often are profits paid out?",
      answer: "Profits are paid out on a monthly basis, provided that you have reached the minimum payout threshold and maintained compliance with all trading rules. Payouts are typically processed within 5-7 business days after the end of the month.",
      category: "Payments"
    },
    {
      question: "What is the profit split?",
      answer: "The standard profit split is 80/20, meaning you keep 80% of the profits and Shockwave Capital retains 20%. High-performing traders may qualify for our enhanced profit split program, which offers up to 95/5 split based on consistent performance.",
      category: "Payments"
    },
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and you'll receive a password reset link. If you don't receive the email, please check your spam folder or contact our support team.",
      category: "Account"
    },
    {
      question: "What trading platforms do you support?",
      answer: "We support MetaTrader 4 (MT4), MetaTrader 5 (MT5), and TradingView. The available platforms may vary based on your account type and size. Login credentials and setup instructions are provided once your account is activated.",
      category: "Technical"
    },
    {
      question: "Is there a time limit to complete the challenge?",
      answer: "Yes, most challenges have a time limit. Standard challenges typically have a 30-day time limit, while Express challenges have a 14-day limit. If you don't meet the profit target within the specified time, you'll need to restart the challenge.",
      category: "Challenges"
    },
    {
      question: "Can I trade with multiple strategies?",
      answer: "Yes, you can use multiple trading strategies as long as they comply with our risk management rules. We evaluate your overall performance rather than focusing on specific strategies. However, all trading must be manual – expert advisors (EAs) and automated trading are not permitted.",
      category: "Trading"
    }
  ];

  const filteredFAQs = useMemo(() => {
    return faqs
      .filter(faq => 
        (activeCategory === null || faq.category === activeCategory) &&
        (searchQuery === '' || 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [faqs, activeCategory, searchQuery]);

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h1>

        {/* Search and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <a href="/dashboard/support" className="flex items-center justify-center gap-2 w-full bg-[#0FF1CE] text-black font-semibold py-3 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors">
              <HelpCircle size={18} />
              <span>Need more help? Contact Support</span>
            </a>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === null
                ? 'bg-[#0FF1CE] text-black font-medium'
                : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category
                  ? 'bg-[#0FF1CE] text-black font-medium'
                  : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-8">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <FAQCard
                key={index}
                question={faq.question}
                answer={faq.answer}
                isExpanded={expandedFAQ === index}
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              />
            ))
          ) : (
            <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-8 text-center">
              <HelpCircle size={32} className="text-[#0FF1CE] mx-auto mb-4" />
              <h3 className="text-white font-medium text-lg mb-2">No matching questions found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or browse all categories.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory(null); }}
                className="text-[#0FF1CE] font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
          <h2 className="text-lg font-bold text-white mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="#" className="bg-[#1A1A1A] rounded-xl p-5 hover:bg-[#1A1A1A]/80 transition-colors flex flex-col">
              <BookOpen size={24} className="text-[#0FF1CE] mb-3" />
              <h3 className="text-white font-medium mb-2">Trading Guidelines</h3>
              <p className="text-gray-400 text-sm mb-4">Complete explanation of our trading rules and requirements.</p>
              <div className="flex items-center text-[#0FF1CE] mt-auto text-sm">
                <span>Read more</span>
                <ArrowRight size={14} className="ml-2" />
              </div>
            </a>
            <a href="#" className="bg-[#1A1A1A] rounded-xl p-5 hover:bg-[#1A1A1A]/80 transition-colors flex flex-col">
              <ExternalLink size={24} className="text-[#0FF1CE] mb-3" />
              <h3 className="text-white font-medium mb-2">Platform Guides</h3>
              <p className="text-gray-400 text-sm mb-4">Step-by-step tutorials for our supported trading platforms.</p>
              <div className="flex items-center text-[#0FF1CE] mt-auto text-sm">
                <span>Read more</span>
                <ArrowRight size={14} className="ml-2" />
              </div>
            </a>
            <a href="#" className="bg-[#1A1A1A] rounded-xl p-5 hover:bg-[#1A1A1A]/80 transition-colors flex flex-col">
              <HelpCircle size={24} className="text-[#0FF1CE] mb-3" />
              <h3 className="text-white font-medium mb-2">Challenge FAQ</h3>
              <p className="text-gray-400 text-sm mb-4">Detailed answers to common questions about our challenges.</p>
              <div className="flex items-center text-[#0FF1CE] mt-auto text-sm">
                <span>Read more</span>
                <ArrowRight size={14} className="ml-2" />
              </div>
            </a>
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