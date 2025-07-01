import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { generate as generateWords } from 'random-words';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { sendCryptoOrderEmail } from '@/lib/email';

interface CryptoPaymentProps {
  challengeData: any;
  successRedirectPath: string;
  onProcessingStateChange: (state: boolean) => void;
  cryptoPrices: CryptoPrice;
}

interface CryptoPrice {
  BTC: number;
  ETH: number;
  USDT: number;
  USDC: number;
}

interface CryptoAddress {
  BTC: string;
  ETH: string;
  USDT: string;
  USDC: string;
}

const CRYPTO_ADDRESSES: CryptoAddress = {
  BTC: 'bc1q4zs3mwhv50vgfp05pawdp0s2w8qfd0h824464u',  // Replace with your actual BTC address
  ETH: '0x54634008a757D262f0fD05213595dEE77a82026B',  // Replace with your actual ETH address
  USDT: 'TLVMLJhSmWTTtitpeF5Gvv2j4avXVZ3EMd',  // Replace with your actual USDT address (TRC20)
  USDC: '8ShmNrRPeN1KaCixPhPWPQTvZJn9a8s7oqsCdhoJgeJj'  // Replace with your actual USDC address (Solana)
};

export default function CryptoPayment({ challengeData, successRedirectPath, onProcessingStateChange, cryptoPrices }: CryptoPaymentProps) {
  const router = useRouter();
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'USDT' | 'USDC'>('BTC');
  const [cryptoAmount, setCryptoAmount] = useState<CryptoPrice>({ BTC: 0, ETH: 0, USDT: 0, USDC: 0 });
  const [verificationPhrase, setVerificationPhrase] = useState<string[]>([]);
  const [userPhrase, setUserPhrase] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate verification phrase on mount
  useEffect(() => {
    const words = generateWords({ exactly: 10 });
    setVerificationPhrase(Array.isArray(words) ? words : [words]);
  }, []);

  // Calculate crypto amounts when prices or challenge data changes
  useEffect(() => {
    const usdAmount = challengeData.price;
    setCryptoAmount({
      BTC: usdAmount / cryptoPrices.BTC,
      ETH: usdAmount / cryptoPrices.ETH,
      USDT: usdAmount,
      USDC: usdAmount
    });
  }, [challengeData.price, cryptoPrices]);

  const handleCryptoSelect = (crypto: 'BTC' | 'ETH' | 'USDT' | 'USDC') => {
    setSelectedCrypto(crypto);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CRYPTO_ADDRESSES[selectedCrypto]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = async () => {
    if (userPhrase.toLowerCase() !== verificationPhrase.join(' ').toLowerCase()) {
      setError('Verification phrase does not match. Please try again.');
      return;
    }

    setIsLoading(true);
    onProcessingStateChange(true);

    try {
      const response = await fetch('/api/crypto/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeData,
          cryptoDetails: {
            type: selectedCrypto,
            amount: cryptoAmount[selectedCrypto],
            address: CRYPTO_ADDRESSES[selectedCrypto],
            verificationPhrase: verificationPhrase.join(' '),
            usdAmount: challengeData.price
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const { orderId } = await response.json();

      // Send order notification emails
      try {
        const emailResponse = await fetch('/api/send-crypto-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: orderId,
            status: 'PENDING',
            cryptoType: selectedCrypto,
            cryptoAmount: cryptoAmount[selectedCrypto].toString(),
            cryptoAddress: CRYPTO_ADDRESSES[selectedCrypto],
            usdAmount: challengeData.price,
            verificationPhrase: verificationPhrase.join(' '),
            challengeType: challengeData.type,
            challengeAmount: challengeData.amount,
            platform: challengeData.platform,
            addOns: challengeData.addOns || [],
            customerEmail: challengeData.formData.email,
            customerName: `${challengeData.formData.firstName} ${challengeData.formData.lastName}`,
            customerPhone: challengeData.formData.phone,
            customerCountry: challengeData.formData.country,
            customerDiscordUsername: challengeData.formData.discordUsername,
            createdAt: new Date().toISOString()
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send order emails');
        }
      } catch (emailError) {
        console.error('Error sending order emails:', emailError);
      }

      router.push('/challenge/cryptopending');
    } catch (error) {
      setError('Failed to submit order. Please try again.');
      setIsLoading(false);
      onProcessingStateChange(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Crypto Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['BTC', 'ETH', 'USDT', 'USDC'] as const).map((crypto) => (
          <button
            key={crypto}
            onClick={() => handleCryptoSelect(crypto)}
            className={`p-4 rounded-xl border ${
              selectedCrypto === crypto
                ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                : 'border-[#2F2F2F]/50 hover:border-[#0FF1CE]/50'
            } transition-colors`}
          >
            <div className="text-center">
              <div className="font-medium">
                {crypto}
              </div>
              {crypto === 'USDT' && (
                <div className="text-xs text-gray-400">
                  (TRC20)
                </div>
              )}
              {crypto === 'USDC' && (
                <div className="text-xs text-gray-400">
                  (SOL)
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-[#151515] rounded-xl p-4 border border-[#2F2F2F]/50">
        <div className="text-center mb-4">
          <div className="text-lg font-medium">
            1 {selectedCrypto} = ${cryptoPrices[selectedCrypto].toLocaleString()}
          </div>
        </div>
        
        <div className="text-orange-500 text-sm text-center">
          {selectedCrypto === 'BTC' && 
            "Only send Bitcoin (BTC) assets to this address. Other assets will be lost forever."
          }
          {selectedCrypto === 'ETH' &&
            "Only send Ethereum (ETH) assets to this address. Other assets will be lost forever."
          }
          {selectedCrypto === 'USDT' &&
            "Only send Tether (TRC20) assets to this address. Other assets will be lost forever."
          }
          {selectedCrypto === 'USDC' &&
            "Only send USD Coin (SPL) assets to this address. Other assets will be lost forever."
          }
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        <div className="bg-[#151515] rounded-xl p-4 border border-[#2F2F2F]/50">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-400 mb-1">Send exactly</div>
            <div className="text-2xl font-bold text-[#0FF1CE]">
              {cryptoAmount[selectedCrypto].toFixed(selectedCrypto === 'USDC' || selectedCrypto === 'USDT' ? 2 : 8)} {selectedCrypto}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              ≈ ${challengeData.price.toFixed(2)}
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <QRCodeSVG
              value={
                selectedCrypto === 'USDT' 
                  ? `tron:${CRYPTO_ADDRESSES[selectedCrypto]}?amount=${cryptoAmount[selectedCrypto].toFixed(2)}`
                  : selectedCrypto === 'USDC'
                  ? `solana:${CRYPTO_ADDRESSES[selectedCrypto]}?amount=${(cryptoAmount[selectedCrypto] / 1000).toFixed(2)}&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
                  : selectedCrypto === 'BTC'
                  ? `bitcoin:${CRYPTO_ADDRESSES[selectedCrypto]}?amount=${cryptoAmount[selectedCrypto].toFixed(8)}`
                  : `ethereum:${CRYPTO_ADDRESSES[selectedCrypto]}?value=${(cryptoAmount[selectedCrypto] * 1e18).toFixed(0)}`
              }
              size={200}
              level="H"
              className="p-2 bg-white rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg p-3">
            <div className="flex-1 font-mono text-sm truncate">
              {CRYPTO_ADDRESSES[selectedCrypto]}
            </div>
            <button
              onClick={copyAddress}
              className="flex items-center gap-1 text-[#0FF1CE] hover:text-[#0FF1CE]/80"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Verification Phrase */}
        <div className="bg-[#151515] rounded-xl p-4 border border-[#2F2F2F]/50">
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Type this phrase to verify:</div>
            <div className="font-mono bg-[#1A1A1A] p-3 rounded-lg text-[#0FF1CE] text-sm">
              {verificationPhrase.join(' ')}
            </div>
          </div>

          <input
            type="text"
            value={userPhrase}
            onChange={(e) => setUserPhrase(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder="Type the verification phrase here"
            className="w-full bg-[#1A1A1A] border border-[#2F2F2F]/50 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50"
          />
          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || userPhrase.toLowerCase() !== verificationPhrase.join(' ').toLowerCase()}
          className="w-full bg-[#0FF1CE] hover:bg-[#0FF1CE]/90 disabled:bg-[#0FF1CE]/50 disabled:cursor-not-allowed text-black font-medium py-4 rounded-xl transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin" size={16} />
              <span>Processing...</span>
            </div>
          ) : (
            "I've Sent the Payment"
          )}
        </button>
      </div>

      <div className="text-sm text-gray-400">
        <p className="mb-2">
          • The payment amount is locked in for 15 minutes. If you don't send the payment within this time, the price may be updated.
        </p>
        <p>
          • After sending the payment, click the button above and wait for confirmation. This may take up to 30 minutes depending on network conditions.
        </p>
      </div>
    </div>
  );
} 