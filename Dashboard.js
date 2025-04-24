import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Trophy, Users, Download, MessageSquare, User, LogOut, Award, Wallet, BarChart2, HelpCircle, MessageCircle } from 'lucide-react';
import Button from './Button';
import CheckoutForm from './CheckoutForm';
import ProfilePage from './ProfilePage';
import SupportPage from './SupportPage';
import Leaderboard from './Leaderboard';
import Payouts from './Payouts';
import MyAccounts from './MyAccounts';
import FAQ from './FAQ';
import FAQDetail from './FAQDetail';
import PaymentSuccess from './payment/PaymentSuccess';

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #1a1a1a;

  @media (max-width: 768px) {
    padding-top: 1rem;
  }
`;

const Sidebar = styled.div`
  width: 240px;
  background: #2a2a2a;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  height: 100vh;
  position: sticky;
  top: 0;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${props => props.isOpen ? '0' : '-100%'};
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
    width: 80%;
    max-width: 300px;
  }
`;

const Logo = styled.img`
  height: 40px;
  margin-bottom: 3rem;
  padding: 0 1rem;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: ${props => props.active ? '#ffc62d' : '#999'};
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${props => props.active ? '#ffc62d' : 'white'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 5rem 1rem 5rem;
    width: 100%;
  }
`;

const UserSection = styled.div`
  margin-top: auto;
  padding: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffc62d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a1a;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const UserName = styled.div`
  color: white;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.div`
  color: #999;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const CheckoutSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ChallengeContainer = styled.div`
  background-color: #1a1a1a;
  color: white;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const SectionHeader = styled.h2`
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const BalanceSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: row;
    gap: 0.3rem;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
`;

const PopularTag = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffc62d;
  color: #1a1a1a;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    top: -10px;
    font-size: 0.6rem;
    padding: 1px 8px;
  }
`;

const BalanceButton = styled.button`
  padding: 1rem 2rem;
  border: 2px solid ${props => props.selected ? '#ffc62d' : '#333'};
  background: ${props => props.selected ? '#ffc62d' : 'transparent'};
  color: ${props => props.selected ? '#000' : '#fff'};
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  flex: 1;
  min-width: 200px;
  position: relative;
  
  @media (max-width: 768px) {
    min-width: unset;
    width: 32%;
    padding: 0.5rem;
    font-size: 0.75rem;
    white-space: nowrap;
    border-width: 1px;
  }
`;

const Table = styled.div`
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    overflow-x: auto;
    background: #222;
    min-height: 420px;
    
    /* Webkit scrollbar styling */
    &::-webkit-scrollbar {
      height: 4px;
      background: #1a1a1a;
      display: block;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 4px;
      visibility: visible;
    }

    /* Firefox scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: #333 #1a1a1a;
    scrollbar-gutter: stable;
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background-color: #2a2a2a;
  padding: 1rem;
  border-bottom: 1px solid #333;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
    grid-template-columns: 150px 120px 120px 120px;
    position: sticky;
    top: 0;
    z-index: 2;
    width: fit-content;
    min-width: 100%;

    > div:first-child {
      position: sticky;
      left: 0;
      background: #2a2a2a;
      padding-left: 0.75rem;
      z-index: 3;
      border-right: 1px solid #333;
    }

    > div {
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 44px;
      border-right: 1px solid #333;
    }
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #333;
  background-color: #222;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
    grid-template-columns: 150px 120px 120px 120px;
    width: fit-content;
    min-width: 100%;

    > div:first-child {
      position: sticky;
      left: 0;
      background: #222;
      padding-left: 0.75rem;
      z-index: 1;
      border-right: 1px solid #333;
    }

    > div {
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 44px;
      border-right: 1px solid #333;
    }

    &:hover {
      background-color: #2a2a2a;
      
      > div {
        background: #2a2a2a;
      }
    }
  }
`;

const HighlightedCell = styled.div`
  color: #ffc62d;
  font-weight: bold;
`;

const PromotionBanner = styled.div`
  background-color: rgba(255, 198, 45, 0.1);
  color: #ffc62d;
  padding: 1rem;
  margin: 2rem 0;
  border-radius: 4px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.5rem;
    padding: 0.5rem;
    margin: 1rem auto;
    width: fit-content;
    min-width: 200px;
    white-space: nowrap;
  }
`;

const StartButton = styled.button`
  background-color: #ffc62d;
  color: black;
  padding: 1.2rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
  max-width: 400px;
  margin: 0 auto;
  display: block;
  
  &:hover {
    background-color: #e6b229;
  }

  @media (max-width: 768px) {
    max-width: 200px;
    padding: 0.8rem;
    font-size: 0.7rem;
    white-space: nowrap;
  }
`;

const MobileHeader = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 0.75rem;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileHeaderLogo = styled.img`
  height: 40px;
`;

const BottomNav = styled.div`
  display: none;
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 100px;
  padding: 0.5rem;
  z-index: 1000;
  width: 90%;
  max-width: 300px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    display: block;
    visibility: ${props => props.isMenuOpen ? 'hidden' : 'visible'};
  }
`;

const BottomNavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const NavIndicator = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: #ffc62d;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  left: ${props => {
    switch (props.active) {
      case 'accounts': return 'calc(16.67% - 20px)';
      case 'challenge': return 'calc(50% - 20px)';
      case 'support': return 'calc(83.33% - 20px)';
      default: return 'calc(50% - 20px)';
    }
  }};
  transition: left 0.3s ease;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: rgba(42, 42, 42, 0.5);
    border-radius: 60px;
    z-index: -1;
  }
`;

const NavButton = styled(Link)`
  width: 33.33%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#1a1a1a' : '#fff'};
  text-decoration: none;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Card = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 8px;
  }
`;

const FooterText = styled.div`
  text-align: center;
  color: #666;
  margin-top: 2rem;
  margin-bottom: 4rem;
  font-size: 0.75rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin-bottom: 5rem;
    padding: 0 1rem;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  a {
    color: #666;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const NavContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 0 -1rem;
  padding: 0 1rem;

  /* Webkit scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: #444;
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
`;

const BackToWebsiteButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #999;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  margin: 0.5rem -1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [selectedBalance, setSelectedBalance] = useState(50000);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('challenge');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name) => {
    if (!name || name === 'User Name') return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getFirstName = (name) => {
    if (!name || name === 'User Name') return 'User';
    return name.split(' ')[0];
  };

  const calculateValues = (balance) => {
    const monthlyPrice = balance === 50000 ? 99 : 
                         balance === 100000 ? 149 : 249;
    
    return {
      maxDailyLoss: balance * 0.06,
      maxLoss: balance * 0.12,
      profitTargetStep1: balance * 0.10,
      profitTargetStep2: balance * 0.05,
      monthlyPrice: monthlyPrice
    };
  };

  const values = calculateValues(selectedBalance);

  return (
    <DashboardContainer>
      <MobileHeader>
        <MobileHeaderLogo 
          src="https://images.squarespace-cdn.com/content/633b282f66006a532ef90a21/58026c80-ad9d-4a80-9a6d-249948356a70/A-removebg-preview.png?content-type=image%2Fpng" 
          alt="ACI Trading Challenge" 
        />
        <HamburgerButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </HamburgerButton>
      </MobileHeader>
      
      <Overlay isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
      
      <Sidebar isOpen={isMenuOpen}>
        <Logo 
          src="https://images.squarespace-cdn.com/content/633b282f66006a532ef90a21/58026c80-ad9d-4a80-9a6d-249948356a70/A-removebg-preview.png?content-type=image%2Fpng" 
          alt="ACI Trading Challenge" 
        />
        
        <NavContainer>
          <NavItem 
            to="/dashboard" 
            active={activeNav === 'challenge'}
            onClick={() => {
              setIsMenuOpen(false);
              setActiveNav('challenge');
            }}
          >
            <Trophy />
            New Challenge
          </NavItem>

          <NavItem 
            to="/dashboard/accounts"
            active={activeNav === 'accounts'}
            onClick={() => {
              setIsMenuOpen(false);
              setActiveNav('accounts');
            }}
          >
            <BarChart2 />
            My Accounts
          </NavItem>

          <NavItem 
            to="/dashboard/leaderboard"
            active={activeNav === 'leaderboard'}
            onClick={() => {
              setIsMenuOpen(false);
              setActiveNav('leaderboard');
            }}
          >
            <Award />
            Leaderboard
          </NavItem>
          
          <NavItem 
            to="/dashboard/payouts"
            active={activeNav === 'payouts'}
            onClick={() => {
              setIsMenuOpen(false);
              setActiveNav('payouts');
            }}
          >
            <Wallet />
            Payouts
          </NavItem>
          
          <NavItem 
            to="/dashboard/support"
            active={activeNav === 'support'}
            onClick={() => {
              setIsMenuOpen(false);
              setActiveNav('support');
            }}
          >
            <MessageCircle />
            Live Support
          </NavItem>

          <NavItem 
            to="/dashboard/faq"
            active={activeNav === 'faq'}
            onClick={() => {
              setIsMenuOpen(false);
              setActiveNav('faq');
            }}
          >
            <HelpCircle />
            FAQ
          </NavItem>

          <NavItem 
            to="/dashboard/profile"
            active={activeNav === 'profile'}
            onClick={() => {
              setIsMenuOpen(false);
              setActiveNav('profile');
            }}
          >
            <User />
            My Profile
          </NavItem>
        </NavContainer>

        <BackToWebsiteButton to="/">
          <LogOut style={{ transform: 'rotate(180deg)' }} />
          Back to Website
        </BackToWebsiteButton>

        <UserSection>
          <Avatar>{getInitials(user?.displayName || 'User Name')}</Avatar>
          <UserInfo>
            <UserName>{getFirstName(user?.displayName || 'User Name')}</UserName>
            <UserEmail>{user?.email || 'No email'}</UserEmail>
          </UserInfo>
          <LogoutButton onClick={handleLogout} title="Logout">
            <LogOut />
          </LogoutButton>
        </UserSection>
      </Sidebar>

      <MainContent>
        <Routes>
          <Route
            path="/"
            element={
              showCheckout ? (
                <>
                  <CheckoutForm
                    selectedBalance={selectedBalance}
                    onBack={() => setShowCheckout(false)}
                    values={values}
                  />
                  <FooterText>
                    <p>All information provided on this site is intended solely for educational purposes related to trading on financial markets and does not serve in any way as a specific investment recommendation, business recommendation, investment opportunity analysis or similar general recommendation regarding the trading of investment instruments. ACI only provides services of simulated trading and educational tools for traders. The information on this site is not directed at residents in any country or jurisdiction where such distribution or use would be contrary to local laws or regulations. ACI companies do not act as a broker and do not accept any deposits. The offered technical solution for the ACI platforms and data feed is powered by liquidity providers.</p>
                    <p>© 2025 - Copyright - ACI Trading LTD. All rights reserved.<br />
                    <Link to="/privacy">Privacy policy</Link> • <Link to="/risk">Risk disclosure</Link> • <Link to="/terms">Terms of service</Link> • <Link to="/refund">Refund & dispute policy</Link></p>
                  </FooterText>
                </>
              ) : (
                <>
                  <ChallengeContent
                    selectedBalance={selectedBalance}
                    setSelectedBalance={setSelectedBalance}
                    values={values}
                    setShowCheckout={setShowCheckout}
                  />
                  <FooterText>
                    <p>All information provided on this site is intended solely for educational purposes related to trading on financial markets and does not serve in any way as a specific investment recommendation, business recommendation, investment opportunity analysis or similar general recommendation regarding the trading of investment instruments. ACI only provides services of simulated trading and educational tools for traders. The information on this site is not directed at residents in any country or jurisdiction where such distribution or use would be contrary to local laws or regulations. ACI companies do not act as a broker and do not accept any deposits. The offered technical solution for the ACI platforms and data feed is powered by liquidity providers.</p>
                    <p>© 2025 - Copyright - ACI Trading LTD. All rights reserved.<br />
                    <Link to="/privacy">Privacy policy</Link> • <Link to="/risk">Risk disclosure</Link> • <Link to="/terms">Terms of service</Link> • <Link to="/refund">Refund & dispute policy</Link></p>
                  </FooterText>
                </>
              )
            }
          />
          <Route path="/accounts" element={<MyAccounts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/faq/:category/:question" element={<FAQDetail />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/profile" element={
            <>
              <ProfilePage />
              <FooterText>
                <p>All information provided on this site is intended solely for educational purposes related to trading on financial markets and does not serve in any way as a specific investment recommendation, business recommendation, investment opportunity analysis or similar general recommendation regarding the trading of investment instruments. ACI only provides services of simulated trading and educational tools for traders. The information on this site is not directed at residents in any country or jurisdiction where such distribution or use would be contrary to local laws or regulations. ACI companies do not act as a broker and do not accept any deposits. The offered technical solution for the ACI platforms and data feed is powered by liquidity providers.</p>
                <p>© 2025 - Copyright - ACI Trading LTD. All rights reserved.<br />
                <Link to="/privacy">Privacy policy</Link> • <Link to="/risk">Risk disclosure</Link> • <Link to="/terms">Terms of service</Link> • <Link to="/refund">Refund & dispute policy</Link></p>
              </FooterText>
            </>
          } />
          <Route path="/support" element={
            <>
              <SupportPage />
              <FooterText>
                <p>All information provided on this site is intended solely for educational purposes related to trading on financial markets and does not serve in any way as a specific investment recommendation, business recommendation, investment opportunity analysis or similar general recommendation regarding the trading of investment instruments. ACI only provides services of simulated trading and educational tools for traders. The information on this site is not directed at residents in any country or jurisdiction where such distribution or use would be contrary to local laws or regulations. ACI companies do not act as a broker and do not accept any deposits. The offered technical solution for the ACI platforms and data feed is powered by liquidity providers.</p>
                <p>© 2025 - Copyright - ACI Trading LTD. All rights reserved.<br />
                <Link to="/privacy">Privacy policy</Link> • <Link to="/risk">Risk disclosure</Link> • <Link to="/terms">Terms of service</Link> • <Link to="/refund">Refund & dispute policy</Link></p>
              </FooterText>
            </>
          } />
          <Route path="/payouts" element={<Payouts />} />
        </Routes>
      </MainContent>

      <BottomNav isMenuOpen={isMenuOpen}>
        <BottomNavContent>
          <NavIndicator active={activeNav} />
          <NavButton 
            to="/dashboard/accounts" 
            active={activeNav === 'accounts'}
            onClick={() => setActiveNav('accounts')}
          >
            <User />
          </NavButton>
          <NavButton 
            to="/dashboard" 
            active={activeNav === 'challenge'}
            onClick={() => setActiveNav('challenge')}
          >
            <Trophy />
          </NavButton>
          <NavButton 
            to="/dashboard/support"
            active={activeNav === 'support'}
            onClick={() => setActiveNav('support')}
          >
            <MessageCircle />
          </NavButton>
        </BottomNavContent>
      </BottomNav>
    </DashboardContainer>
  );
};

const ChallengeContent = ({
  selectedBalance,
  setSelectedBalance,
  values,
  setShowCheckout
}) => {
  const getMonthlyPrice = (balance) => {
    return balance === 50000 ? 99 :
           balance === 100000 ? 149 : 249;
  };

  return (
    <ChallengeContainer>
      <Header>Configure and start ACI Challenge</Header>
      <Card>
        <SectionHeader>BALANCE</SectionHeader>
        <BalanceSection>
          {[50000, 100000, 200000].map(balance => (
            <BalanceButton
              key={balance}
              selected={selectedBalance === balance}
              onClick={() => setSelectedBalance(balance)}
            >
              {balance === 100000 && <PopularTag>POPULAR</PopularTag>}
              ${balance.toLocaleString()}
            </BalanceButton>
          ))}
        </BalanceSection>

        <Table>
          <TableHeader>
            <div></div>
            <div>ACI CHALLENGE</div>
            <div>VERIFICATION</div>
            <div>ACI TRADER</div>
          </TableHeader>

          <TableRow>
            <div>Trading Period</div>
            <div>Unlimited</div>
            <div>Unlimited</div>
            <div>Unlimited</div>
          </TableRow>

          <TableRow>
            <div>Minimum Profitable Days</div>
            <div>4 Days</div>
            <div>4 Days</div>
            <div>X</div>
          </TableRow>

          <TableRow>
            <div>Maximum Daily Loss</div>
            <div>${values.maxDailyLoss.toLocaleString()} (6%)</div>
            <div>${values.maxDailyLoss.toLocaleString()} (6%)</div>
            <div>${values.maxDailyLoss.toLocaleString()} (6%)</div>
          </TableRow>

          <TableRow>
            <div>Maximum Loss</div>
            <div>${values.maxLoss.toLocaleString()} (12%)</div>
            <div>${values.maxLoss.toLocaleString()} (12%)</div>
            <div>${values.maxLoss.toLocaleString()} (12%)</div>
          </TableRow>

          <TableRow>
            <div>Profit Target</div>
            <div>${values.profitTargetStep1.toLocaleString()} (10%)</div>
            <div>${values.profitTargetStep2.toLocaleString()} (5%)</div>
            <div>X</div>
          </TableRow>

          <TableRow>
            <div>Leverage</div>
            <div>1:200</div>
            <div>1:200</div>
            <div>1:200</div>
          </TableRow>


          <TableRow>
            <div>Monthly Price</div>
            <HighlightedCell>${getMonthlyPrice(selectedBalance)}/month</HighlightedCell>
            <div>-</div>
            <div>${getMonthlyPrice(selectedBalance)}/month</div>
          </TableRow>

          <TableRow>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              Risk Desk Setup Fee
              <div 
                style={{
                  cursor: 'help',
                  fontSize: '14px',
                  color: '#666',
                  border: '1px solid #ccc',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="This is a one-time activation fee charged when you pass the challenge to activate your funded account"
              >
                i
              </div>
            </div>
            <div>X</div>
            <div>X</div>
            <HighlightedCell>
              ${selectedBalance === 50000 ? '150' : selectedBalance === 100000 ? '200' : '300'}
            </HighlightedCell>
          </TableRow>
        </Table>

        <PromotionBanner>
          <span style={{textDecoration: 'underline', fontStyle: 'italic'}}>ACI Traders qualify for our <a href="/once-funded-stay-funded">Once Funded Stay Funded Program!</a></span>
        </PromotionBanner>

        <StartButton onClick={() => setShowCheckout(true)}>
          START ACI CHALLENGE
        </StartButton>
      </Card>
    </ChallengeContainer>
  );
};

export default Dashboard; 