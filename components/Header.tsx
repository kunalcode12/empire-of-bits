import { useState, useRef, useEffect } from "react";
import { Gamepad2, Bell, Wallet, X, Menu, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { ParticleButton } from "@/components/particle-button";
import BuyPointsDialog from "@/components/buyPointsDialog";
import SellPointsDialog from "@/components/sellPointsDialog";
import { AnimatedButton } from "./animated-button";
import RetroWelcomePopup from "./retroWelcomePopup";

interface HeaderProps {
  userPoints?: number;
  onPointsUpdate?: (newPoints: number) => void;
}

export default function Header({
  userPoints = 0,
  onPointsUpdate,
}: HeaderProps) {
  const [isHovering, setIsHovering] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [cryptoBalance, setCryptoBalance] = useState("0.00");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [showRetroWelcome, setShowRetroWelcome] = useState(false);

  const [points, setPoints] = useState(userPoints);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Tournament Starting",
      message: "WEEKEND WARRIOR tournament starts in 30 minutes!",
    },
    {
      id: 2,
      title: "New Game Added",
      message: "CRYPTO PUZZLER is now available to play!",
    },
    {
      id: 3,
      title: "Bonus Tokens",
      message: "You received 50 bonus tokens for daily login!",
    },
  ]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const { theme } = useTheme();
  const { toast } = useToast();

  const fetchUserPoints = async () => {
    // if (!walletConnected) return;
    // console.log(walletConnected);
    console.log("Fetching user points...");
    try {
      setIsLoading(true);

      // Get user ID from wallet address
      const walletAddress = "wallet-address-here"; // This would be the actual connected wallet address
      localStorage.setItem("walletAddress", walletAddress);
      console.log("Wallet address:", walletAddress);

      // Make API call to your backend
      const response = await fetch("http://127.0.0.1:3001/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: walletAddress,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setPoints(data.data.points);

        // Show retro congratulation popup for new users
        if (data.newUser) {
          setShowRetroWelcome(true);
          // Pre-load the welcome sound
          const audio = new Audio("/sounds/retro-welcome.mp3");
          audio.load();
        }
      } else {
        console.error("Failed to fetch user:", data.message);
      }
    } catch (error) {
      console.error("Error in user data operation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setPoints(userPoints);
  }, [userPoints]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const playSound = (sound: string) => {
    if (audioRef.current) {
      audioRef.current.src = `/sounds/${sound}.mp3`;
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play prevented:", e));
    }
  };

  useEffect(() => {
    if (walletConnected || localStorage.getItem("walletAddress")) {
      console.log("Wallet connected, fetching points...");
      fetchUserPoints();
    }
  }, [walletConnected]);

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      console.log("Connecting wallet...");

      // Mock wallet connection process
      // For real implementation, replace with actual wallet connection code
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setWalletConnected(true);
      setShowWalletModal(false);
      setCryptoBalance("0.05");
      setTokenBalance("100");

      // Note: We're not calling fetchUserPoints here anymore
      // because the useEffect will handle that

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully!",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyPoints = (amount: number) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    setShowBuyDialog(false);

    if (onPointsUpdate) {
      onPointsUpdate(newPoints);
    }

    toast({
      title: "Points Purchased!",
      description: `You have successfully purchased ${amount} points.`,
      duration: 3000,
    });
    playSound("success");
  };

  const handleSellPoints = (amount: number) => {
    if (points >= amount) {
      const newPoints = points - amount;
      setPoints(newPoints);
      setShowSellDialog(false);

      if (onPointsUpdate) {
        onPointsUpdate(newPoints);
      }

      toast({
        title: "Points Sold!",
        description: `You have successfully sold ${amount} points.`,
        duration: 3000,
      });
      playSound("success");
    } else {
      toast({
        title: "Insufficient Points",
        description: "You don't have enough points to sell.",
        variant: "destructive",
        duration: 3000,
      });
      playSound("error");
    }
  };

  return (
    <>
      {/* Audio element for sound effects */}
      <AnimatePresence>
        {showRetroWelcome && (
          <RetroWelcomePopup onClose={() => setShowRetroWelcome(false)} />
        )}
      </AnimatePresence>
      <audio ref={audioRef} className="hidden" />

      {/* Custom cursor (desktop only) */}
      {!isMobile && (
        <motion.div
          className="fixed w-12 h-12 pointer-events-none z-50 mix-blend-difference hidden md:block"
          animate={{ x: cursorPosition.x - 24, y: cursorPosition.y - 24 }}
          transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        >
          <div className="w-full h-full border-3 border-current rotate-45 animate-pulse"></div>
        </motion.div>
      )}

      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-background/90 backdrop-blur-md border-b-4 border-foreground"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, rotate: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 3,
                times: [0, 0.2, 0.8, 1],
              }}
              className="mr-3"
            >
              <Gamepad2 className="h-10 w-10 text-foreground" />
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl font-bold tracking-tight glitch-text-lg"
              data-text="EMPIRE OF BITS"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block">EMPIRE</span>
              <span className="inline-block text-[hsl(var(--accent-yellow))]">
                {" "}
                OF{" "}
              </span>
              <span className="inline-block text-[hsl(var(--accent-purple))]">
                BITS
              </span>
            </motion.h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link
                  href="/"
                  className="nav-link text-lg"
                  onMouseEnter={() => playSound("hover")}
                  onClick={() => playSound("click")}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="nav-link text-lg"
                  onMouseEnter={() => playSound("hover")}
                  onClick={() => playSound("click")}
                >
                  GAMES
                </Link>
              </li>
            </ul>
          </nav>

          {/* Wallet Section */}
          <div className="flex items-center gap-4">
            {/* Points Display and Buttons */}
            <div className="hidden md:flex items-center gap-2 bg-secondary p-2 border-3 border-foreground rounded-lg">
              <div className="flex items-center">
                <div className="flex items-center mr-3">
                  <Image
                    src="/token.png"
                    width={24}
                    height={24}
                    alt="Points"
                    className="mr-1"
                  />
                  <span className="text-base font-bold">{points}</span>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowBuyDialog(true);
                      playSound("click");
                    }}
                    onMouseEnter={() => playSound("hover")}
                  >
                    BUY
                  </motion.button>

                  <motion.button
                    className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowSellDialog(true);
                      playSound("click");
                    }}
                    onMouseEnter={() => playSound("hover")}
                  >
                    SELL
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <motion.button
                className="relative p-3 arcade-btn-large border-3 border-current"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => playSound("hover")}
                onClick={() => {
                  setShowNotification(!showNotification);
                  playSound("notification");
                }}
              >
                <Bell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {notifications.length}
                  </span>
                )}
              </motion.button>

              {/* Notifications dropdown */}
              <AnimatePresence>
                {showNotification && (
                  <motion.div
                    className="absolute right-0 mt-2 w-80 bg-background border-3 border-foreground shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-3 border-b-2 border-foreground/20 flex justify-between items-center">
                      <h3 className="text-sm font-bold">NOTIFICATIONS</h3>
                      <button
                        className="text-xs text-foreground/70 hover:text-foreground"
                        onClick={() => setNotifications([])}
                      >
                        CLEAR ALL
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="p-4 border-b border-foreground/10 hover:bg-foreground/5 transition-colors"
                          >
                            <h4 className="text-sm font-bold mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-foreground/70">
                              {notification.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-foreground/50">
                          <p className="text-sm">No new notifications</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {walletConnected ? (
              <motion.div
                className="hidden md:flex items-center gap-3 bg-secondary p-3 border-3 border-foreground arcade-btn-large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => playSound("hover")}
                onClick={() => setShowWalletModal(true)}
              >
                <Wallet className="h-6 w-6 text-[hsl(var(--accent-yellow))]" />
                <span className="text-base font-bold">{cryptoBalance} ETH</span>
                <div className="flex items-center ml-2">
                  <Image
                    src="/token.png"
                    width={20}
                    height={20}
                    alt="Game Token"
                    className="mr-1"
                  />
                  <span className="text-base font-bold">{tokenBalance}</span>
                </div>
              </motion.div>
            ) : (
              <ParticleButton
                onClick={() => {
                  setShowWalletModal(true);
                  playSound("click");
                }}
                onHover={() => playSound("hover")}
                className="hidden md:flex items-center gap-3 bg-[hsl(var(--accent-purple))] p-3 border-3 border-[hsl(var(--accent-purple)/0.7)] text-base font-bold text-white"
              >
                <Wallet className="h-6 w-6" />
                <span>CONNECT WALLET</span>
              </ParticleButton>
            )}

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden arcade-btn-large p-3 border-3 border-current"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMenuOpen(!menuOpen);
                playSound("click");
              }}
            >
              {menuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showWalletModal && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-900 border-4 border-white p-8 max-w-md w-full relative"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  onClick={() => {
                    setShowWalletModal(false);
                    playSound("click");
                  }}
                >
                  <ChevronLeft className="h-8 w-8 rotate-180" />
                </button>

                <h2
                  className="text-3xl font-bold mb-8 text-center glitch-text-sm"
                  data-text="CONNECT WALLET"
                >
                  CONNECT WALLET
                </h2>

                <div className="grid gap-5">
                  <AnimatedButton
                    className="flex items-center justify-between p-5 border-3 border-white hover:border-yellow-400 hover:bg-gray-800 transition-colors"
                    onClick={handleConnectWallet}
                  >
                    <div className="flex items-center">
                      <Image
                        src="/metamask.png"
                        width={40}
                        height={40}
                        alt="MetaMask"
                        className="mr-4"
                      />
                      <span className="font-bold text-xl">MetaMask</span>
                    </div>
                    <ChevronLeft className="h-6 w-6 rotate-180" />
                  </AnimatedButton>

                  <AnimatedButton
                    className="flex items-center justify-between p-5 border-3 border-white hover:border-yellow-400 hover:bg-gray-800 transition-colors"
                    onClick={handleConnectWallet}
                  >
                    <div className="flex items-center">
                      <Image
                        src="/walletconnect.png"
                        width={40}
                        height={40}
                        alt="WalletConnect"
                        className="mr-4"
                      />
                      <span className="font-bold text-xl">WalletConnect</span>
                    </div>
                    <ChevronLeft className="h-6 w-6 rotate-180" />
                  </AnimatedButton>

                  <AnimatedButton
                    className="flex items-center justify-between p-5 border-3 border-white hover:border-yellow-400 hover:bg-gray-800 transition-colors"
                    onClick={handleConnectWallet}
                  >
                    <div className="flex items-center">
                      <Image
                        src="/coinbase.png"
                        width={40}
                        height={40}
                        alt="Coinbase Wallet"
                        className="mr-4"
                      />
                      <span className="font-bold text-xl">Coinbase Wallet</span>
                    </div>
                    <ChevronLeft className="h-6 w-6 rotate-180" />
                  </AnimatedButton>
                </div>

                <p className="text-sm text-gray-400 mt-8 text-center">
                  By connecting your wallet, you agree to our Terms of Service
                  and Privacy Policy
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-background border-t-2 border-foreground/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <nav className="p-4">
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/"
                      className="block text-lg font-bold"
                      onClick={() => {
                        setMenuOpen(false);
                        playSound("click");
                      }}
                    >
                      HOME
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/games"
                      className="block text-lg font-bold"
                      onClick={() => {
                        setMenuOpen(false);
                        playSound("click");
                      }}
                    >
                      GAMES
                    </Link>
                  </li>
                  {/* Points for mobile */}
                  <li className="py-2">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <Image
                          src="/token.png"
                          width={24}
                          height={24}
                          alt="Points"
                          className="mr-2"
                        />
                        <span className="text-base font-bold">
                          POINTS: {points}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-md w-full"
                          onClick={() => {
                            setShowBuyDialog(true);
                            setMenuOpen(false);
                            playSound("click");
                          }}
                        >
                          BUY POINTS
                        </button>

                        <button
                          className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-md w-full"
                          onClick={() => {
                            setShowSellDialog(true);
                            setMenuOpen(false);
                            playSound("click");
                          }}
                        >
                          SELL POINTS
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Buy Points Dialog */}
      <BuyPointsDialog
        isOpen={showBuyDialog}
        onClose={() => setShowBuyDialog(false)}
        onBuy={handleBuyPoints}
        currentPoints={points}
      />

      {/* Sell Points Dialog */}
      <SellPointsDialog
        isOpen={showSellDialog}
        onClose={() => setShowSellDialog(false)}
        onSell={handleSellPoints}
        currentPoints={points}
      />
    </>
  );
}
