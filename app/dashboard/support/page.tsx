'use client';
import React, { useState } from 'react';
import Particles from '../../components/Particles';
import { 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Plus, 
  Search,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  RotateCcw,
  X
} from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  category: string;
  lastUpdated: string;
  messages: {
    sender: 'user' | 'support';
    content: string;
    timestamp: string;
  }[];
}

const statusColors = {
  open: 'bg-green-500',
  pending: 'bg-yellow-500',
  closed: 'bg-gray-500'
};

const statusIcons = {
  open: MessageCircle,
  pending: Clock,
  closed: CheckCircle
};

const categories = [
  'Account Issues', 
  'Trading Platform', 
  'Payment Problems', 
  'Verification', 
  'Challenge Rules',
  'Technical Support'
];

const TicketCard = ({ ticket, isActive, onClick }: { 
  ticket: SupportTicket; 
  isActive: boolean;
  onClick: () => void;
}) => {
  const StatusIcon = statusIcons[ticket.status];
  
  return (
    <div 
      onClick={onClick}
      className={`
        p-4 border rounded-lg cursor-pointer transition-all 
        ${isActive 
          ? 'border-[#0FF1CE] bg-[#0FF1CE]/5' 
          : 'border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30 bg-[#0D0D0D]/80'}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${isActive ? 'bg-[#0FF1CE]/20' : 'bg-[#2F2F2F]/30'}`}>
            <StatusIcon size={18} className={isActive ? 'text-[#0FF1CE]' : 'text-gray-400'} />
          </div>
          <div>
            <div className="text-white font-medium line-clamp-1">{ticket.subject}</div>
            <div className="text-gray-400 text-sm">{ticket.category}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className={`px-2 py-0.5 rounded-full text-xs ${statusColors[ticket.status]} bg-opacity-20 capitalize`}>
                {ticket.status}
              </div>
              <div className="text-gray-500 text-xs">Last updated: {ticket.lastUpdated}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ message }: { message: SupportTicket['messages'][0] }) => (
  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`
      max-w-[80%] rounded-lg p-3
      ${message.sender === 'user' 
        ? 'bg-[#0FF1CE]/20 text-white' 
        : 'bg-[#2F2F2F]/50 text-white'}
    `}>
      <div className="text-sm">
        {message.content}
      </div>
      <div className="text-xs text-gray-400 mt-1 text-right">
        {message.timestamp}
      </div>
    </div>
  </div>
);

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Sample ticket data (replace with real data from API)
  const tickets: SupportTicket[] = [
    {
      id: 'TKT-12345',
      subject: 'Problem accessing trading platform',
      status: 'open',
      category: 'Trading Platform',
      lastUpdated: '2 hours ago',
      messages: [
        {
          sender: 'user',
          content: "I cannot log in to the trading platform. It keeps saying \"Invalid credentials\" but I'm sure my password is correct.",
          timestamp: 'Jun 12, 2023 - 10:23 AM'
        },
        {
          sender: 'support',
          content: "Hello, thank you for reaching out. Have you tried resetting your password through the \"Forgot Password\" link on the login page?",
          timestamp: 'Jun 12, 2023 - 10:45 AM'
        },
        {
          sender: 'user',
          content: "Yes, I tried that but I'm not receiving the reset email.",
          timestamp: 'Jun 12, 2023 - 11:02 AM'
        }
      ]
    },
    {
      id: 'TKT-12344',
      subject: 'Withdrawal request pending for 7 days',
      status: 'pending',
      category: 'Payment Problems',
      lastUpdated: '1 day ago',
      messages: [
        {
          sender: 'user',
          content: "I submitted a withdrawal request 7 days ago and it's still pending. The normal processing time is supposed to be 3 days.",
          timestamp: 'Jun 10, 2023 - 3:15 PM'
        },
        {
          sender: 'support',
          content: "Hello, we apologize for the delay. Our payment team is reviewing your request. Could you please verify the last 4 digits of your bank account to help us expedite this?",
          timestamp: 'Jun 11, 2023 - 9:30 AM'
        }
      ]
    },
    {
      id: 'TKT-12343',
      subject: 'Account verification issue',
      status: 'closed',
      category: 'Verification',
      lastUpdated: '5 days ago',
      messages: [
        {
          sender: 'user',
          content: "I uploaded my verification documents but they got rejected. The message wasn't clear on what was wrong.",
          timestamp: 'Jun 05, 2023 - 11:20 AM'
        },
        {
          sender: 'support',
          content: "Hello, thank you for reaching out. Looking at your submission, the ID document was partially cut off on the right side. Could you please resubmit with the full document visible?",
          timestamp: 'Jun 05, 2023 - 2:45 PM'
        },
        {
          sender: 'user',
          content: "Thanks for clarifying. I've resubmitted the document.",
          timestamp: 'Jun 05, 2023 - 3:30 PM'
        },
        {
          sender: 'support',
          content: "Perfect! We've received your new submission and your account has been verified successfully. You can now proceed with trading.",
          timestamp: 'Jun 06, 2023 - 9:15 AM'
        }
      ]
    }
  ];

  const filteredTickets = activeCategory 
    ? tickets.filter(ticket => ticket.category === activeCategory) 
    : tickets;

  const currentTicket = tickets.find(ticket => ticket.id === selectedTicket);

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Support</h1>
          
          <button 
            onClick={() => {
              setShowNewTicket(true);
              setSelectedTicket(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0FF1CE] text-black font-semibold rounded-lg hover:bg-[#0FF1CE]/90 transition-colors"
          >
            <Plus size={16} />
            <span>New Ticket</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Tickets list */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
              />
            </div>
            
            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  activeCategory === null
                    ? 'bg-[#0FF1CE] text-black font-medium'
                    : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    activeCategory === category
                      ? 'bg-[#0FF1CE] text-black font-medium'
                      : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Tickets list */}
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {filteredTickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  isActive={ticket.id === selectedTicket}
                  onClick={() => {
                    setSelectedTicket(ticket.id);
                    setShowNewTicket(false);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right column - Ticket details or new ticket */}
          <div className="lg:col-span-2 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl border border-[#2F2F2F]/50 overflow-hidden h-[calc(100vh-180px)] flex flex-col">
            {currentTicket && !showNewTicket ? (
              <>
                {/* Ticket header */}
                <div className="p-6 border-b border-[#2F2F2F]">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-white">{currentTicket.subject}</h2>
                    <div className={`px-3 py-1 rounded-full text-xs ${statusColors[currentTicket.status]} bg-opacity-20 capitalize flex items-center gap-1`}>
                      <StatusIcon size={14} /> {currentTicket.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div>ID: {currentTicket.id}</div>
                    <div>Category: {currentTicket.category}</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {currentTicket.messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                  ))}
                </div>

                {/* Reply box */}
                <div className="p-4 border-t border-[#2F2F2F]">
                  <div className="relative">
                    <textarea
                      placeholder="Type your message here..."
                      className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50 resize-none"
                      rows={3}
                    ></textarea>
                    <button className="absolute bottom-3 right-3 p-2 rounded-lg bg-[#0FF1CE] text-black hover:bg-[#0FF1CE]/90 transition-colors">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : showNewTicket ? (
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Create New Support Ticket</h2>
                  <button 
                    onClick={() => setShowNewTicket(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-6 flex-1">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief description of your issue"
                      className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                    />
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <div className="relative">
                      <select className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-[#0FF1CE]/50">
                        {categories.map(category => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                    <textarea
                      placeholder="Describe your issue in detail"
                      className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50 resize-none"
                      rows={8}
                    ></textarea>
                  </div>
                  
                  {/* Submit button */}
                  <div>
                    <button className="w-full md:w-auto px-6 py-3 bg-[#0FF1CE] text-black font-semibold rounded-lg hover:bg-[#0FF1CE]/90 transition-colors flex items-center justify-center gap-2">
                      <Send size={18} />
                      <span>Submit Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center mb-4">
                  <MessageCircle size={28} className="text-[#0FF1CE]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Welcome to Support</h3>
                <p className="text-gray-400 max-w-md mb-6">
                  Select a ticket from the left or create a new support ticket to get help with your account.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-[#1A1A1A] border border-[#2F2F2F]/50">
                    <MessageCircle size={24} className="text-[#0FF1CE] mb-2" />
                    <div className="text-white font-medium">Live Chat</div>
                    <div className="text-gray-400 text-sm">Available 24/7</div>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-[#1A1A1A] border border-[#2F2F2F]/50">
                    <Phone size={24} className="text-[#0FF1CE] mb-2" />
                    <div className="text-white font-medium">Phone</div>
                    <div className="text-gray-400 text-sm">9am - 5pm ET</div>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-[#1A1A1A] border border-[#2F2F2F]/50">
                    <Mail size={24} className="text-[#0FF1CE] mb-2" />
                    <div className="text-white font-medium">Email</div>
                    <div className="text-gray-400 text-sm">24h response</div>
                  </div>
                </div>
              </div>
            )}
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