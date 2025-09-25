'use client';
import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Send,
  Search,
  User,
  Check,
  Loader,
  Users,
  Eye,
  ChevronDown
} from 'lucide-react';
import { getAllUsers, UserData, db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

// Enhanced email templates with improved login credentials template
const initialTemplates = [
  {
    id: 1,
    name: 'Welcome Email',
    subject: 'Welcome to Shockwave Capital',
    body: `<div style="margin-bottom: 20px;">
<p style="font-size: 18px; color: #333; margin-bottom: 15px;">Hello {{firstName}},</p>
<p style="color: #555; margin-bottom: 15px;">Welcome to Shockwave Capital! We're excited to have you join our trading community.</p>
<p style="color: #555; margin-bottom: 15px;">Your account has been created successfully and you can now log in to your dashboard to get started.</p>
<p style="color: #555; margin-bottom: 15px;">If you have any questions, feel free to reach out to our support team.</p>
<p style="color: #333; margin-top: 25px;">Best regards,<br><strong>The Shockwave Capital Team</strong></p>
</div>`,
    variables: ['firstName', 'lastName', 'email'],
    lastUpdated: '2023-05-25'
  },
  {
    id: 2,
    name: 'Order Confirmation',
    subject: 'Your Shockwave Capital Order Confirmation',
    body: `<div style="margin-bottom: 20px;">
<p style="font-size: 18px; color: #333; margin-bottom: 15px;">Hello {{firstName}},</p>
<p style="color: #555; margin-bottom: 15px;">Thank you for your order with Shockwave Capital!</p>
<p style="color: #555; margin-bottom: 15px;">We're excited to confirm your {{challengeType}} purchase. Your order number is {{orderNumber}}.</p>
<p style="color: #555; margin-bottom: 15px;">Your login credentials will be sent to you shortly in a separate email.</p>
<p style="color: #555; margin-bottom: 15px;">If you have any questions about your order, please don't hesitate to contact us.</p>
<p style="color: #333; margin-top: 25px;">Best regards,<br><strong>The Shockwave Capital Team</strong></p>
</div>`,
    variables: ['firstName', 'lastName', 'email', 'challengeType', 'accountSize', 'orderNumber'],
    lastUpdated: '2023-05-24'
  },
  {
    id: 3,
    name: 'Login Credentials',
    subject: 'Challenge Login Details - Shockwave Capital',
    body: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Challenge Login Details - Shockwave Capital</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <style>
    @media screen {
      @font-face {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
      }
      @font-face {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
      }
    }
    body {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }
    @media all and (max-width:621px) {
      h1 {
        font-size: 24px !important;
        line-height: 26px !important;
      }
      .mobilecontent {
        display: table-row !important;
        max-height: none !important;
      }
      .desktopcontent {
        mso-hide: all;
        display: none !important;
        max-height: 0px;
        overflow: hidden;
      }
      .mobile-header {
        padding: 20px 15px !important;
        text-align: center !important;
      }
      .mobile-header h1 {
        font-size: 18px !important;
        text-align: center !important;
        margin-bottom: 15px !important;
      }
      .mobile-header table {
        width: 100% !important;
      }
      .mobile-header td {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        padding: 5px 0 !important;
      }
      .mobile-content {
        padding: 20px 15px !important;
      }
      .mobile-table {
        width: 100% !important;
        max-width: 100% !important;
      }
      .mobile-cell {
        padding: 10px 8px !important;
        font-size: 12px !important;
      }
      .mobile-button {
        padding: 8px 12px !important;
        font-size: 12px !important;
      }
    }
  </style>
</head>
<body style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; height: 100% !important; width: 100% !important; margin: 0; padding: 0;" bgcolor="#f4f4f4">
  
  <!-- Preview Text -->
  <span style="display: none !important; font-size: 0px; line-height: 0px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; visibility: hidden;">Your challenge account login details for {{platform}}</span>
  
  <!-- Main Container -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse !important; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0;">
    
    <!-- HEADER -->
    <tr>
      <td bgcolor="#0FF1CE" align="center" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse !important; table-layout: fixed; max-width: 600px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0;">
          <tr>
            <td align="center" valign="middle" class="mobile-header" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 30px 20px;">
              <!-- Text Logo -->
              
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- MAIN CONTENT -->
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0; padding: 0px 20px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse !important; table-layout: fixed; max-width: 600px; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0;">
          
          <!-- Welcome Message -->
          <tr>
            <td bgcolor="#ffffff" align="left" class="mobile-content" style="color: #1a1a1a; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 26px; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 40px;">
              <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0 0 20px 0;">Your Trading Challenge Details</h1>
              <p style="margin: 0 0 20px 0; color: #444;">Hello {{firstName}},</p>
              <p style="margin: 0 0 25px 0; color: #444;">Welcome to Shockwave Capital! Your trading challenge account has been successfully set up. Below are your login credentials and setup instructions.</p>
            </td>
          </tr>

          <!-- Login Credentials Table -->
          <tr>
            <td bgcolor="#ffffff" align="center" class="mobile-content" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 40px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="mobile-table" style="border-collapse: collapse !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                
                <!-- Credentials Header -->
                <tr>
                  <td colspan="2" style="background: #0FF1CE; color: #1a1a1a; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 700; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
                    Your Trading Account Credentials
                  </td>
                </tr>

                <!-- Platform -->
                <tr style="border-bottom: 1px solid #E5E5E5;">
                  <td bgcolor="#fafafa" valign="left" class="mobile-cell" style="width: 35%; color: #1a1a1a; font-weight: 600; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 18px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 15px; border: 1px solid #E5E5E5;">
                    Platform:
                  </td>
                  <td valign="left" class="mobile-cell" style="color: #1a1a1a; font-weight: 600; font-family: 'Courier New', monospace; font-size: 14px; line-height: 17px; background: rgba(15, 241, 206, 0.1); -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 15px; border: 1px solid #E5E5E5;" bgcolor="#ffffff">
                    {{platform}}
                  </td>
                </tr>

                <!-- Login ID -->
                <tr style="border-bottom: 1px solid #E5E5E5;">
                  <td bgcolor="#fafafa" valign="left" class="mobile-cell" style="width: 35%; color: #1a1a1a; font-weight: 600; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 18px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 15px; border: 1px solid #E5E5E5;">
                    Login ID:
                  </td>
                  <td valign="left" class="mobile-cell" style="color: #1a1a1a; font-weight: 600; font-family: 'Courier New', monospace; font-size: 14px; line-height: 17px; background: rgba(15, 241, 206, 0.1); cursor: pointer; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 15px; border: 1px solid #E5E5E5;" bgcolor="#ffffff" onclick="navigator.clipboard.writeText('{{loginId}}');" title="Click to copy">
                    {{loginId}} <span style="color: #0FF1CE; font-size: 12px; margin-left: 8px;">Copy</span>
                  </td>
                </tr>

                <!-- Password -->
                <tr style="border-bottom: 1px solid #E5E5E5;">
                  <td bgcolor="#fafafa" valign="left" class="mobile-cell" style="width: 35%; color: #1a1a1a; font-weight: 600; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 18px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 15px; border: 1px solid #E5E5E5;">
                    Password:
                  </td>
                  <td valign="left" class="mobile-cell" style="color: #1a1a1a; font-weight: 600; font-family: 'Courier New', monospace; font-size: 14px; line-height: 17px; background: rgba(15, 241, 206, 0.1); cursor: pointer; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 15px; border: 1px solid #E5E5E5;" bgcolor="#ffffff" onclick="navigator.clipboard.writeText('{{password}}');" title="Click to copy">
                    {{password}} <span style="color: #0FF1CE; font-size: 12px; margin-left: 8px;">Copy</span>
                  </td>
                </tr>

                <!-- Server -->
                <tr>
                  <td bgcolor="#fafafa" valign="left" class="mobile-cell" style="width: 35%; color: #1a1a1a; font-weight: 600; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 18px; border-radius: 0 0 0 8px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 15px; border: 1px solid #E5E5E5;">
                    Server:
                  </td>
                  <td valign="left" class="mobile-cell" style="color: #1a1a1a; font-weight: 600; font-family: 'Courier New', monospace; font-size: 14px; line-height: 17px; background: rgba(15, 241, 206, 0.1); cursor: pointer; border-radius: 0 0 8px 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 15px; border: 1px solid #E5E5E5;" bgcolor="#ffffff" onclick="navigator.clipboard.writeText('{{server}}');" title="Click to copy">
                    {{server}} <span style="color: #0FF1CE; font-size: 12px; margin-left: 8px;">Copy</span>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Dashboard Button -->
          <tr>
            <td bgcolor="#ffffff" align="center" class="mobile-content" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 40px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate !important; border-radius: 4px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 1px solid #1a1a1a;" bgcolor="#1a1a1a">
                <tbody>
                  <tr>
                    <td align="center" valign="middle" class="mobile-button" style="font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 12px 16px;">
                      <a href="https://shockwave-capital.com" target="_blank" style="font-weight: normal; letter-spacing: normal; line-height: 100%; text-align: center; text-decoration: none; color: #0FF1CE; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
                        START TRADING
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Setup Instructions -->
          <tr>
            <td bgcolor="#ffffff" align="left" class="mobile-content" style="color: #1a1a1a; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 26px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0px 40px 40px;">
              <h3 style="color: #444; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">Getting Started</h3>
              <ol style="margin: 0; padding-left: 20px; color: #444;">
                <li style="margin-bottom: 12px;">Download and install the {{platform}} trading platform</li>
                <li style="margin-bottom: 12px;">Use the credentials above to log in (click to copy)</li>
                <li style="margin-bottom: 12px;">Review the challenge rules thoroughly</li>
                <li style="margin-bottom: 12px;">Start trading with your defined strategy</li>
              </ol>
            </td>
          </tr>

        </table>
      </td>
    </tr>

    <!-- SUPPORT SECTION -->
    <tr>
      <td align="center" bgcolor="#f4f4f4" class="mobile-content" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0px 20px;">
        <table bgcolor="#e8f8f5" role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="100%" class="mobile-table" style="max-width: 600px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important;">
          <tr>
            <td align="center" valign="top" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <table role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%" class="mobile-table" style="max-width: 536px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important;">
                <tr>
                  <td align="left" class="mobile-content" style="color: #444; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 50px 20px 20px;">
                    <h2 style="font-size: 22px; font-weight: 600; margin: 0; color: #444;">Need Help?</h2>
                    <p style="font-size: 16px; font-weight: 300; margin: 10px 0 0; color: #444;">We're here to support your trading journey 24/7</p>
                  </td>
                </tr>
                <tr>
                  <td align="left" class="mobile-content" style="color: #444; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 26px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0px 20px 50px;">
                    <table style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important;">
                      <tr>
                        <td valign="top" style="padding-right: 10px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <span style="color: #0FF1CE; font-size: 16px;">•</span>
                        </td>
                        <td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          Email us at <a href="mailto:support@shockwavecapital.com" style="color: #0FF1CE; text-decoration: none;">support@shockwavecapital.com</a>
                        </td>
                      </tr>
                      <tr>
                        <td valign="top" style="padding-right: 10px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <span style="color: #0FF1CE; font-size: 16px;">•</span>
                        </td>
                        <td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          Check our <a href="https://shockwavecapital.com/faq" style="color: #0FF1CE; text-decoration: none;">FAQ page</a> for quick answers
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0; padding: 20px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; margin: 0;">
          <tbody>
            <tr>
              <td bgcolor="#ffffff" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 40px 20px; text-align: center;">
                <p style="margin: 0; color: #888; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px;">
                  © 2025 Shockwave Capital. All rights reserved.<br>
                  This email contains confidential information. Please do not share your login credentials.
                </p>
                <p style="margin: 15px 0 0 0; color: #888; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 11px;">
                  You received this email because you signed up for a trading challenge with Shockwave Capital.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>

  </table>
</body>
</html>`,
    variables: ['firstName', 'platform', 'loginId', 'password', 'server'],
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  lastUpdated: string;
}

interface TestValues {
  [key: string]: string;
}

interface Customer {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  [key: string]: any;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [testValues, setTestValues] = useState<TestValues>({});
  
  // User selection state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Recent orders state
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [showRecentOrdersDropdown, setShowRecentOrdersDropdown] = useState(false);
  const [recentOrdersType, setRecentOrdersType] = useState<'crypto' | 'credit'>('crypto');
  
  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
        setShowRecentOrdersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Load recent orders when dropdown type changes
  useEffect(() => {
    if (showRecentOrdersDropdown) {
      loadRecentOrders();
    }
  }, [recentOrdersType, showRecentOrdersDropdown]);
  
  const loadCustomers = async () => {
    try {
      setLoadingUsers(true);
      const usersData = await getAllUsers();
      const transformedCustomers: Customer[] = usersData.map(user => ({
        id: user.uid,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Unknown User',
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        country: user.country,
        status: user.status,
        totalSpent: user.totalSpent,
        orderCount: user.orderCount
      }));
      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoadingUsers(false);
    }
  };
  
  // Load recent orders
  const loadRecentOrders = async () => {
    try {
      const orders: any[] = [];
      
      if (recentOrdersType === 'crypto') {
        // Load recent crypto orders
        const cryptoOrdersRef = collection(db, 'crypto-orders');
        const cryptoQuery = query(cryptoOrdersRef, orderBy('createdAt', 'desc'), limit(10));
        const cryptoSnapshot = await getDocs(cryptoQuery);
        
        cryptoSnapshot.forEach((doc) => {
          const data = doc.data();
          orders.push({
            id: doc.id,
            email: data.customerEmail,
            firstName: data.customerName?.split(' ')[0] || 'Unknown',
            challengeType: data.challengeType,
            challengeAmount: data.challengeAmount,
            platform: data.platform,
            type: 'crypto',
            createdAt: data.createdAt
          });
        });
      } else {
        // Load recent credit orders
        const ordersRef = collection(db, 'orders');
        const creditQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(10));
        const creditSnapshot = await getDocs(creditQuery);
        
        creditSnapshot.forEach((doc) => {
          const data = doc.data();
          orders.push({
            id: doc.id,
            email: data.customerEmail,
            firstName: data.firstName || 'Unknown',
            challengeType: data.challengeType,
            challengeAmount: data.challengeAmount,
            platform: data.platform,
            type: 'credit',
            createdAt: data.createdAt
          });
        });
      }
      
      setRecentOrders(orders);
    } catch (error) {
      console.error('Error loading recent orders:', error);
    }
  };
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    (customer.displayName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
     customer.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
     customer.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
     customer.lastName?.toLowerCase().includes(userSearchTerm.toLowerCase()))
  ).slice(0, 10); // Limit to 10 results

  const handleCreateNew = () => {
    const newTemplate = {
      id: Date.now(),
      name: 'New Template',
      subject: 'New Email Subject',
      body: '<p>New Email Content</p>',
      variables: [],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setCurrentTemplate(newTemplate);
    setIsEditing(true);
    setShowPreview(false);
  };

  const handleEdit = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setIsEditing(true);
    setShowPreview(false);
    setEmailSent(false);
    
    // Initialize test values with more comprehensive defaults
    const values: Record<string, string> = {};
    template.variables.forEach((variable: string) => {
      values[variable] = variable === 'firstName' ? 'John' : 
                         variable === 'lastName' ? 'Doe' : 
                         variable === 'email' ? 'john@example.com' :
                         variable === 'displayName' ? 'John Doe' :
                         variable === 'challengeType' ? 'Standard Challenge' :
                         variable === 'accountSize' ? '$10,000' :
                         variable === 'orderNumber' ? 'OSK1234' :
                         variable === 'platform' ? 'MetaTrader 4' :
                         variable === 'loginId' ? '12345678' :
                         variable === 'password' ? 'TempPass123!' :
                         variable === 'server' ? 'AXI-US03-DEMO' :
                         `Sample ${variable}`;
    });
    setTestValues(values);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(template => template.id !== id));
    }
  };

  const handleSave = () => {
    if (!currentTemplate) return;
    
    const updatedTemplate = {
      ...currentTemplate,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    if (templates.find(t => t.id === currentTemplate.id)) {
      setTemplates(templates.map(t => t.id === currentTemplate.id ? updatedTemplate : t));
    } else {
      setTemplates([...templates, updatedTemplate]);
    }
    
    setIsEditing(false);
    setCurrentTemplate(null);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentTemplate(null);
    setShowPreview(false);
    setEmailSent(false);
  };
  
  const handlePreview = () => {
    if (!currentTemplate) return;
    setShowPreview(!showPreview);
  };

  const handleSendEmail = async () => {
    if (!currentTemplate || !selectedUser) {
      alert('Please select a template and a user');
      return;
    }

    try {
      setSendingEmail(true);
      
      const response = await fetch('/api/send-template-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: currentTemplate,
          user: selectedUser,
          testValues: testValues
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };
  
  const renderPreview = () => {
    if (!currentTemplate) return null;
    
    let previewSubject = currentTemplate.subject;
    let previewBody = currentTemplate.body;
    
    // Replace variables with test values
    Object.entries(testValues).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      previewSubject = previewSubject.replace(regex, value);
      previewBody = previewBody.replace(regex, value);
    });
    
    return (
      <div className="bg-[#151515] rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-white font-medium mb-2">Subject</h3>
          <div className="bg-[#0D0D0D] p-3 rounded text-white border border-[#2F2F2F]">{previewSubject}</div>
        </div>
        <div>
          <h3 className="text-white font-medium mb-2">Body</h3>
          <div 
            className="bg-[#0D0D0D] p-4 rounded text-white border border-[#2F2F2F] max-h-96 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: previewBody }}
          ></div>
        </div>
      </div>
    );
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (currentTemplate) {
      setCurrentTemplate({
        ...currentTemplate,
        [name]: value
      });
    }
  };
  
  const handleVariableAdd = (variable: string) => {
    if (variable && currentTemplate && !currentTemplate.variables.includes(variable)) {
      setCurrentTemplate({
        ...currentTemplate,
        variables: [...currentTemplate.variables, variable]
      });
    }
  };

  const handleVariableRemove = (variable: string) => {
    if (currentTemplate) {
      setCurrentTemplate({
        ...currentTemplate,
        variables: currentTemplate.variables.filter((v: string) => v !== variable)
      });
      
      // Remove from test values
      const newTestValues = { ...testValues };
      delete newTestValues[variable];
      setTestValues(newTestValues);
    }
  };
  
  const handleTestValueChange = (variable: string, value: string) => {
    setTestValues({
      ...testValues,
      [variable]: value
    });
  };

  // Get dropdown options for specific variables
  const getVariableOptions = (variable: string) => {
    switch (variable) {
      case 'platform':
        return ['MetaTrader 4', 'MetaTrader 5'];
      case 'server':
        return ['AXI-US03-DEMO', 'AdmiralsGroup-DEMO', 'FusionMarkets-DEMO', 'DominionMarkets-Live'];
      default:
        return null;
    }
  };

  // Render variable input (text input or dropdown)
  const renderVariableInput = (variable: string) => {
    const options = getVariableOptions(variable);
    
    if (options) {
      return (
        <select
          value={testValues[variable] || ''}
          onChange={(e) => handleTestValueChange(variable, e.target.value)}
          className="w-full bg-[#0D0D0D] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0FF1CE]/50"
        >
          <option value="">Select {variable}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }
    
    return (
      <input
        type="text"
        value={testValues[variable] || ''}
        onChange={(e) => handleTestValueChange(variable, e.target.value)}
        className="w-full bg-[#0D0D0D] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0FF1CE]/50"
      />
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const value = target.value.trim();
      if (value) {
        handleVariableAdd(value);
        target.value = '';
      }
    }
  };

  const handleUserSelect = (user: Customer) => {
    setSelectedUser(user);
    setShowUserDropdown(false);
    setUserSearchTerm(user.displayName || user.email);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Email Templates</h1>
          <p className="text-gray-400">Create and manage email templates with user selection</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-[#0FF1CE] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0FF1CE]/90 transition-colors"
        >
          <Plus size={16} />
          <span>New Template</span>
        </button>
      </div>

      {/* User Selection Section */}
      {isEditing && currentTemplate && (
        <div className="bg-[#151515] rounded-lg p-6 mb-6 border border-[#2F2F2F]/50">
          <div className="flex items-center gap-3 mb-4">
            <Users size={20} className="text-[#0FF1CE]" />
            <h3 className="text-white font-medium">Select User</h3>
            {currentTemplate.name === 'Login Credentials' && (
              <span className="text-sm text-gray-400">(Recent orders available)</span>
            )}
          </div>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative user-dropdown-container">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Search and select a user to send email to
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearchTerm}
                  onChange={(e) => {
                    setUserSearchTerm(e.target.value);
                    setShowUserDropdown(true);
                    setShowRecentOrdersDropdown(false);
                    if (!e.target.value) setSelectedUser(null);
                  }}
                  onFocus={() => {
                    if (currentTemplate.name === 'Login Credentials' && !userSearchTerm) {
                      setShowRecentOrdersDropdown(true);
                      setShowUserDropdown(false);
                    } else {
                      setShowUserDropdown(true);
                      setShowRecentOrdersDropdown(false);
                    }
                  }}
                  className="w-full pl-10 pr-12 py-2.5 bg-[#0D0D0D] border border-[#2F2F2F] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0FF1CE]/50"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
              
              {/* Recent Orders Dropdown - Only for Login Credentials template */}
              {currentTemplate.name === 'Login Credentials' && showRecentOrdersDropdown && userSearchTerm === '' && (
                <div className="absolute z-10 w-full mt-1 bg-[#0D0D0D] border border-[#2F2F2F] rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-[#2F2F2F] flex items-center justify-between sticky top-0 bg-[#0D0D0D]">
                    <span className="text-sm text-gray-400">Recent Orders</span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecentOrdersType('crypto');
                        }}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          recentOrdersType === 'crypto' ? 'bg-[#0FF1CE] text-black' : 'bg-[#151515] text-gray-400 hover:text-white'
                        }`}
                      >
                        Crypto
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecentOrdersType('credit');
                        }}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          recentOrdersType === 'credit' ? 'bg-[#0FF1CE] text-black' : 'bg-[#151515] text-gray-400 hover:text-white'
                        }`}
                      >
                        Credit
                      </button>
                    </div>
                  </div>
                  {recentOrders.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">No recent orders</div>
                  ) : (
                    recentOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => {
                          setUserSearchTerm(order.email);
                          setShowRecentOrdersDropdown(false);
                          // Auto-populate test values with order details
                          setTestValues(prev => ({
                            ...prev,
                            email: order.email,
                            firstName: order.firstName,
                            platform: order.platform.toLowerCase() === 'mt4' ? 'MetaTrader 4' : 
                                     order.platform.toLowerCase() === 'mt5' ? 'MetaTrader 5' : order.platform
                          }));
                          // Find and select the user
                          const user = customers.find(c => c.email === order.email);
                          if (user) {
                            setSelectedUser(user);
                          }
                        }}
                        className="p-3 hover:bg-[#2F2F2F] cursor-pointer border-b border-[#2F2F2F] last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white font-medium">{order.email}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {order.challengeType} • ${order.challengeAmount} • {order.platform}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            order.type === 'crypto' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {order.type}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {/* User Dropdown */}
              {showUserDropdown && userSearchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-[#0D0D0D] border border-[#2F2F2F] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {loadingUsers ? (
                    <div className="p-4 text-center text-gray-400">
                      <Loader size={16} className="animate-spin inline mr-2" />
                      Loading users...
                    </div>
                  ) : filteredCustomers.length > 0 ? (
                    filteredCustomers.map(customer => (
                      <div
                        key={customer.id}
                        onClick={() => handleUserSelect(customer)}
                        className="p-3 hover:bg-[#2F2F2F] cursor-pointer border-b border-[#2F2F2F] last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#0FF1CE]/20 rounded-full flex items-center justify-center">
                            <User size={16} className="text-[#0FF1CE]" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{customer.displayName}</div>
                            <div className="text-gray-400 text-sm">{customer.email}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">No users found</div>
                  )}
                </div>
              )}
            </div>
            
            {selectedUser && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#0FF1CE]/20 text-[#0FF1CE] rounded-lg">
                <Check size={16} />
                <span className="text-sm font-medium">Selected: {selectedUser.displayName}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className={`lg:col-span-1 ${isEditing ? 'hidden lg:block' : ''}`}>
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#151515] border border-[#2F2F2F] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0FF1CE]/50"
              />
            </div>
            
            <div className="space-y-3">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  className="bg-[#151515] rounded-lg p-4 hover:border-[#0FF1CE]/30 transition-all border border-transparent cursor-pointer group"
                  onClick={() => handleEdit(template)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1 group-hover:text-[#0FF1CE] transition-colors">{template.name}</h3>
                      <p className="text-gray-400 text-sm truncate mb-2">{template.subject}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Updated: {template.lastUpdated}</span>
                        <span className="flex items-center gap-1">
                          <Mail size={12} />
                          {template.variables.length} variables
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-1 text-gray-400 hover:text-[#0FF1CE] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(template);
                        }}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(template.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8">
                  <Mail className="mx-auto text-gray-500 mb-2" size={24} />
                  <p className="text-gray-500">No templates found</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Template Editor */}
        {isEditing && currentTemplate && (
          <div className="lg:col-span-2">
            <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {templates.find(t => t.id === currentTemplate.id) ? 'Edit Template' : 'Create New Template'}
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePreview}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#151515] text-white hover:bg-[#2F2F2F] transition-colors"
                  >
                    <Eye size={16} />
                    <span>{showPreview ? 'Edit' : 'Preview'}</span>
                  </button>
                  
                  {showPreview && selectedUser && (
                    <button 
                      onClick={handleSendEmail}
                      disabled={sendingEmail}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0FF1CE] text-black hover:bg-[#0FF1CE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingEmail ? (
                        <Loader size={16} className="animate-spin" />
                      ) : emailSent ? (
                        <Check size={16} />
                      ) : (
                        <Send size={16} />
                      )}
                      <span>
                        {sendingEmail ? 'Sending...' : emailSent ? 'Sent!' : 'Send Email'}
                      </span>
                    </button>
                  )}
                  
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0FF1CE] text-black hover:bg-[#0FF1CE]/90 transition-colors"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#151515] text-white hover:bg-[#2F2F2F] transition-colors"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
              
              {showPreview ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Mail size={16} />
                      Email Preview
                      {selectedUser && (
                        <span className="text-sm text-gray-400">
                          → {selectedUser.displayName} ({selectedUser.email})
                        </span>
                      )}
                    </h3>
                  {renderPreview()}
                  </div>
                  
                  <div className="bg-[#151515] rounded-lg p-6 border border-[#2F2F2F]">
                    <h3 className="text-white font-medium mb-4">Variable Values</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentTemplate.variables.map((variable: string) => (
                        <div key={variable}>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            {variable}
                            {getVariableOptions(variable) && (
                              <span className="ml-2 text-xs text-[#0FF1CE]">(dropdown)</span>
                            )}
                          </label>
                          {renderVariableInput(variable)}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentTemplate.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={currentTemplate.subject}
                      onChange={handleInputChange}
                      className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Body (HTML)
                    </label>
                    <textarea
                      name="body"
                      value={currentTemplate.body}
                      onChange={handleInputChange}
                      rows={12}
                      className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50 font-mono text-sm"
                    ></textarea>
                    <div className="text-xs text-gray-400 mt-1">
                      Use {'{{'} variableName {'}}'}  to insert dynamic content. HTML tags are supported for styling.
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Variables
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {currentTemplate.variables.map((variable: string) => (
                        <div 
                          key={variable}
                          className="flex items-center gap-1 px-3 py-1 bg-[#0FF1CE]/20 text-[#0FF1CE] rounded-full text-sm border border-[#0FF1CE]/30"
                        >
                          <span>{variable}</span>
                          {getVariableOptions(variable) && (
                            <span className="text-xs">📋</span>
                          )}
                          <button 
                            onClick={() => handleVariableRemove(variable)}
                            className="hover:text-red-500 transition-colors ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      
                      {currentTemplate.variables.length === 0 && (
                        <div className="text-gray-500 text-sm">No variables added yet</div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add variable name (e.g., firstName, loginId)"
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#0FF1CE]/50"
                      />
                      <button 
                        onClick={() => {
                          const input = document.querySelector('input[placeholder*="Add variable name"]') as HTMLInputElement;
                          if (input?.value) {
                            handleVariableAdd(input.value.trim());
                            input.value = '';
                          }
                        }}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#151515] text-white hover:bg-[#2F2F2F] transition-colors border border-[#2F2F2F]"
                      >
                        <Plus size={14} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Empty state when no template is selected */}
        {!isEditing && (
          <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
            <div className="text-center py-12">
              <Mail className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-white font-medium mb-2">Select a template to edit</h3>
              <p className="text-gray-500 mb-6">Choose from the list or create a new template to get started</p>
              <button 
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-[#0FF1CE] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#0FF1CE]/90 transition-colors mx-auto"
              >
                <Plus size={18} />
                <span>Create New Template</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 