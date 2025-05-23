import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface SellPointsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSell: (amount: number) => void;
  currentPoints: number;
}

export default function SellPointsDialog({
  isOpen,
  onClose,
  onSell,
  currentPoints,
}: SellPointsDialogProps) {
  const [amount, setAmount] = useState(100);
  const [payoutMethod, setPayoutMethod] = useState("crypto");

  // Adjust amount if user tries to sell more than they have
  useEffect(() => {
    if (amount > currentPoints) {
      setAmount(currentPoints);
    }
  }, [currentPoints, amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAmount(Math.min(value, currentPoints));
    }
  };

  const calculatePayout = () => {
    // Simple payout calculation with a lower rate than buying (exchange fee)
    return (amount / 25).toFixed(2);
  };

  const pointPackages = [
    { amount: 100, price: 4 },
    { amount: 500, price: 18 },
    { amount: 1000, price: 32 },
    {
      amount: Math.floor(currentPoints / 2),
      price: Math.floor(currentPoints / 2 / 25),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <motion.div
            className="bg-background border-4 border-foreground p-6 rounded-lg w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Sell Points</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-secondary rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/token.png"
                  width={32}
                  height={32}
                  alt="Points"
                  className="mr-2"
                />
                <span className="text-lg">
                  Current Balance: {currentPoints} points
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {pointPackages.map(
                  (pkg) =>
                    pkg.amount <= currentPoints && (
                      <motion.button
                        key={pkg.amount}
                        className={`flex-1 min-w-24 p-3 border-2 rounded-lg ${
                          amount === pkg.amount
                            ? "border-[hsl(var(--accent-purple))] bg-[hsl(var(--accent-purple)/0.1)]"
                            : "border-foreground/30"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAmount(pkg.amount)}
                      >
                        <div className="text-center">
                          <div className="font-bold text-lg">{pkg.amount}</div>
                          <div className="text-sm">${pkg.price}</div>
                        </div>
                      </motion.button>
                    )
                )}
                {currentPoints > 0 && (
                  <motion.button
                    className={`flex-1 min-w-24 p-3 border-2 rounded-lg ${
                      amount === currentPoints
                        ? "border-[hsl(var(--accent-purple))] bg-[hsl(var(--accent-purple)/0.1)]"
                        : "border-foreground/30"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAmount(currentPoints)}
                  >
                    <div className="text-center">
                      <div className="font-bold text-lg">All</div>
                      <div className="text-sm">
                        ${(currentPoints / 25).toFixed(2)}
                      </div>
                    </div>
                  </motion.button>
                )}
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                  Custom Amount
                </label>
                <div className="flex">
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full p-2 border-2 border-foreground/30 bg-background rounded-lg"
                    min="1"
                    max={currentPoints}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Payout Method</h3>
              <div className="flex gap-3">
                <button
                  className={`flex-1 p-3 border-2 rounded-lg ${
                    payoutMethod === "crypto"
                      ? "border-[hsl(var(--accent-purple))] bg-[hsl(var(--accent-purple)/0.1)]"
                      : "border-foreground/30"
                  }`}
                  onClick={() => setPayoutMethod("crypto")}
                >
                  <div className="text-center">
                    <div className="font-bold">Crypto</div>
                    <div className="text-sm text-foreground/70">ETH</div>
                  </div>
                </button>

                <button
                  className={`flex-1 p-3 border-2 rounded-lg ${
                    payoutMethod === "card"
                      ? "border-[hsl(var(--accent-purple))] bg-[hsl(var(--accent-purple)/0.1)]"
                      : "border-foreground/30"
                  }`}
                  onClick={() => setPayoutMethod("card")}
                >
                  <div className="text-center">
                    <div className="font-bold">Bank</div>
                    <div className="text-sm text-foreground/70">Transfer</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-medium">You'll receive:</div>
              <div className="text-xl font-bold">${calculatePayout()}</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border-2 border-foreground/30 rounded-lg font-bold"
              >
                Cancel
              </button>

              <motion.button
                onClick={() => onSell(amount)}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={currentPoints <= 0}
              >
                Sell Points
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
