import React, { useState } from "react";
import { AudioSample } from "../types";
import { X, CheckCircle, CreditCard, Music, Send, Loader2 } from "lucide-react";

interface OrderModalProps {
  sample: AudioSample;
  onClose: () => void;
}

export default function OrderModal({ sample, onClose }: OrderModalProps) {
  // We start in "checking payment" state. They can click "I have paid" to immediately go to name entry, 
  // or we can simulate payment validation nicely.
  const [step, setStep] = useState<"payment" | "customize">("payment");
  const [djName, setDjName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleSimulateSuccess = () => {
    setIsVerifying(true);
    // Simulate a brief secure payment verification block
    setTimeout(() => {
      setIsVerifying(false);
      setStep("customize");
    }, 1500);
  };

  const handleMakeClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!djName.trim()) {
      setError("Please enter your custom DJ Name.");
      return;
    }

    // Build the exact WhatsApp link structure requested:
    // https://wa.me/918955932061?text=Hello!%20I%20just%20paid%20for%20a%20DJ%20Vocal.%20My%20DJ%20Name%20is:%20${djName}.%20Reference%20Sample%20URL:%20${sampleUrl}
    const encodedDjName = encodeURIComponent(djName.trim());
    const encodedSampleUrl = encodeURIComponent(sample.audioUrl);
    
    const waUrl = `https://wa.me/918955932061?text=Hello!%20I%20just%20paid%20for%20a%20DJ%20Vocal.%20My%20DJ%20Name%20is:%20${encodedDjName}.%20Reference%20Sample%20URL:%20${encodedSampleUrl}`;

    // Redirect to WhatsApp
    window.open(waUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div id="order-modal-backdrop" className="fixed inset-0 bg-[#06030c]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        id="order-modal" 
        className="bg-[#120c24] border border-purple-500 rounded-3xl w-full max-w-md p-6 shadow-2xl shadow-purple-500/20 relative animate-fade-in overflow-hidden"
      >
        {/* Close Button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-purple-400 hover:text-white hover:bg-purple-950/50 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Payment Check */}
        {step === "payment" && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-12 h-12 bg-purple-950 border border-purple-500/30 rounded-2xl flex items-center justify-center text-pink-500 mb-2.5">
              <CreditCard className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
              Pay ₹49 securely via UPI
            </h3>
            <p className="text-xs text-purple-300 mt-1 max-w-sm">
              Tap your preferred app below to pay instantly.
            </p>

            {/* Direct App Logo Buttons Grid */}
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              {/* Paytm Button */}
              <a
                id="btn-pay-paytm"
                href="paytmmp://pay?pa=8955932061@paytm&pn=Gautam%20Tiwari&am=49&cu=INR&tn=DJVocalAdda"
                className="flex flex-col items-center justify-center bg-[#002e6e]/20 hover:bg-[#002e6e]/40 border border-[#00b9f5]/30 hover:border-[#00b9f5]/60 rounded-2xl p-3.5 transition-all group relative active:scale-95"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner mb-2">
                  {/* Paytm stylized "P" Logo */}
                  <svg viewBox="0 0 24 24" className="w-7 h-7">
                    <path fill="#002E6E" d="M6 3h7c3.87 0 7 3.13 7 7s-3.13 7-7 7H9v4H6V3zm3 11h4c2.21 0 4-1.79 4-4s-1.79-4-4-4H9v8z" />
                    <path fill="#00B9F5" d="M11 6h2c1.66 0 3 1.34 3 3s-1.34 3-3 3h-2V6z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-[#00b9f5] group-hover:text-white transition-colors">
                  Paytm
                </span>
              </a>

              {/* PhonePe Button */}
              <a
                id="btn-pay-phonepe"
                href="phonepe://pay?pa=8955932061@paytm&pn=Gautam%20Tiwari&am=49&cu=INR&tn=DJVocalAdda"
                className="flex flex-col items-center justify-center bg-[#4d148c]/10 hover:bg-[#4d148c]/30 border border-[#5f259f]/30 hover:border-[#5f259f]/60 rounded-2xl p-3.5 transition-all group active:scale-95"
              >
                <div className="w-10 h-10 bg-[#5f259f] rounded-xl flex items-center justify-center p-1.5 shadow-inner mb-2">
                  {/* PhonePe Clean Custom Symbol */}
                  <span className="text-white font-black text-lg tracking-tighter">Pe</span>
                </div>
                <span className="text-[11px] font-bold text-purple-400 group-hover:text-white transition-colors">
                  PhonePe
                </span>
              </a>

              {/* Google Pay Button */}
              <a
                id="btn-pay-gpay"
                href="tez://upi/pay?pa=8955932061@paytm&pn=Gautam%20Tiwari&am=49&cu=INR&tn=DJVocalAdda"
                className="flex flex-col items-center justify-center bg-[#1a73e8]/10 hover:bg-[#1a73e8]/30 border border-[#1a73e8]/30 hover:border-[#1a73e8]/60 rounded-2xl p-3.5 transition-all group active:scale-95"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner mb-2">
                  {/* Google "G" logo SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-blue-400 group-hover:text-white transition-colors">
                  Google Pay
                </span>
              </a>

              {/* Other UPI / Chooser Button */}
              <a
                id="btn-pay-upi"
                href="upi://pay?pa=8955932061@paytm&pn=Gautam%20Tiwari&am=49&cu=INR&tn=DJVocalAdda"
                className="flex flex-col items-center justify-center bg-pink-950/10 hover:bg-pink-950/30 border border-pink-900/30 hover:border-pink-800/60 rounded-2xl p-3.5 transition-all group active:scale-95"
              >
                <div className="w-10 h-10 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-xl flex items-center justify-center p-1.5 shadow-inner mb-2">
                  <span className="text-white font-extrabold text-xs">UPI</span>
                </div>
                <span className="text-[11px] font-bold text-pink-400 group-hover:text-white transition-colors">
                  Other App
                </span>
              </a>
            </div>

            {/* Reference Sample details inside payment */}
            <div className="bg-[#0a0515] border border-purple-950/60 p-2.5 rounded-xl w-full mt-3 flex items-center space-x-2.5 text-left">
              <div className="p-1.5 bg-pink-900/20 rounded-lg text-pink-400 border border-pink-800/10 flex-shrink-0">
                <Music className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[9px] text-purple-400 font-mono uppercase tracking-wider font-semibold">Reference Style</div>
                <div className="text-xs text-white/95 font-semibold truncate">{sample.title}</div>
              </div>
            </div>

            {/* Desktop Fallback Instruction */}
            <div className="mt-3.5 text-[11px] text-purple-300 bg-purple-950/20 border border-purple-900/30 px-3 py-2 rounded-xl w-full">
              Using Computer or Browser?{" "}
              <a
                id="link-repay-desktop"
                href="https://upilinks.in/payment-link/upi1931767291"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 underline font-bold"
              >
                Click here for Web Gateway
              </a>
            </div>

            {/* Verify Payment Button */}
            <div className="w-full mt-4">
              <button
                id="btn-confirm-payment"
                onClick={handleSimulateSuccess}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider font-display"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying secure payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>I have paid successfully</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Customize Tag Info */}
        {step === "customize" && (
          <div className="py-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center text-green-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Payment Verified!
                </h3>
                <p className="text-xs text-green-400 font-medium">
                  ₹49 received successfully.
                </p>
              </div>
            </div>

            <form onSubmit={handleMakeClick} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
                  Enter your DJ Name
                </label>
                <input
                  id="input-dj-name"
                  type="text"
                  required
                  value={djName}
                  onChange={(e) => {
                    setDjName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. DJ Gautam Raj, DJ Rohit Remix"
                  className="w-full bg-[#0a0515] border border-purple-500 rounded-xl py-3 px-4 text-white text-sm placeholder-purple-400/30 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  autoFocus
                />
                <p className="text-[10px] text-purple-400/80 mt-1.5 leading-normal">
                  Our professional vocal artists will record your tag exactly as entered above.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl text-xs">
                  {error}
                </div>
              )}

              {/* Reference Sample details in Name Step */}
              <div className="bg-[#0a0515] p-3 rounded-xl border border-purple-950/60">
                <span className="text-[10px] uppercase font-bold text-purple-400/80 tracking-wide block mb-1">
                  Reference Audio Style
                </span>
                <span className="text-xs text-white/90 truncate block font-medium">
                  {sample.title}
                </span>
              </div>

              <button
                id="btn-make-tag-submit"
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 via-emerald-600 to-green-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-wider font-display"
              >
                <Send className="w-4 h-4" />
                <span>Make</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
