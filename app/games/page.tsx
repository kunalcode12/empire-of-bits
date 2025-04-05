"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Gamepad2,
  Filter,
  Search,
  Wallet,
  Coins,
  Users,
  Trophy,
  Clock,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { AnimatedButton } from "@/components/animated-button";
import { ParticleButton } from "@/components/particle-button";

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [cryptoBalance, setCryptoBalance] = useState("0.00");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [scrolled, setScrolled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMobile = useMobile();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const categories = [
    "All",
    "Action",
    "Racing",
    "Fighting",
    "Puzzle",
    "Adventure",
    "Strategy",
  ];

  const games = [
    {
      id: 1,
      title: "CRYPTO RACER",
      category: "Racing",
      minBet: 0.01,
      maxPlayers: 8,
      prize: 0.25,
      players: 6,
      status: "live",
      featured: true,
    },
    {
      id: 2,
      title: "PIXEL WARRIORS",
      category: "Fighting",
      minBet: 0.05,
      maxPlayers: 2,
      prize: 0.15,
      players: 2,
      status: "live",
      featured: true,
    },
    {
      id: 3,
      title: "NFT HUNTERS",
      category: "Adventure",
      minBet: 0.02,
      maxPlayers: 4,
      prize: 0.12,
      players: 1,
      status: "waiting",
      featured: true,
    },
    {
      id: 4,
      title: "BLOCKCHAIN BLITZ",
      category: "Action",
      minBet: 0.03,
      maxPlayers: 6,
      prize: 0.18,
      players: 4,
      status: "live",
      featured: false,
    },
    {
      id: 5,
      title: "CRYPTO PUZZLER",
      category: "Puzzle",
      minBet: 0.01,
      maxPlayers: 2,
      prize: 0.05,
      players: 0,
      status: "waiting",
      featured: false,
    },
    {
      id: 6,
      title: "TOKEN TACTICS",
      category: "Strategy",
      minBet: 0.04,
      maxPlayers: 4,
      prize: 0.2,
      players: 2,
      status: "live",
      featured: false,
    },
    {
      id: 7,
      title: "DEFI DEFENDER",
      category: "Action",
      minBet: 0.02,
      maxPlayers: 3,
      prize: 0.1,
      players: 1,
      status: "waiting",
      featured: false,
    },
    {
      id: 8,
      title: "META RACER",
      category: "Racing",
      minBet: 0.03,
      maxPlayers: 6,
      prize: 0.15,
      players: 3,
      status: "live",
      featured: false,
    },
    {
      id: 9,
      title: "CRYPTO KOMBAT",
      category: "Fighting",
      minBet: 0.05,
      maxPlayers: 2,
      prize: 0.12,
      players: 0,
      status: "waiting",
      featured: false,
    },
  ];

  const filteredGames = games
    .filter(
      (game) => selectedCategory === "All" || game.category === selectedCategory
    )
    .filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const playSound = (sound: string) => {
    if (audioRef.current) {
      audioRef.current.src = `/sounds/${sound}.mp3`;
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play prevented:", e));
    }
  };

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setShowWalletModal(false);
    setWalletConnected(true);
    setCryptoBalance("1.45");
    setTokenBalance("500");
    playSound("success");
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Audio element for sound effects */}
      <audio ref={audioRef} className="hidden" />

      {/* CRT and scanline effects */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-radial-gradient opacity-20"></div>
        <div className="absolute inset-0 crt-effect"></div>
      </div>

      {/* Pixel grid overlay */}
      <div className="absolute inset-0 bg-[url('/pixel-grid.png')] opacity-5 pointer-events-none z-0"></div>

      {/* Custom cursor (desktop only) */}
      {!isMobile && (
        <motion.div
          className="fixed w-12 h-12 pointer-events-none z-50 mix-blend-difference hidden md:block"
          animate={{ x: cursorPosition.x - 24, y: cursorPosition.y - 24 }}
          transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        >
          <div className="w-full h-full border-3 border-white rotate-45 animate-pulse"></div>
        </motion.div>
      )}

      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-black/90 backdrop-blur-md border-b-4 border-white"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center arcade-btn-large"
              onClick={() => playSound("click")}
            >
              <ChevronLeft className="h-8 w-8 mr-3" />
              <span className="text-xl">BACK</span>
            </Link>
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight glitch-text-sm"
            data-text="GAMES"
          >
            GAMES
          </h1>

          {/* Wallet Section */}
          <div className="flex items-center gap-4">
            {walletConnected ? (
              <motion.div
                className="hidden md:flex items-center gap-3 bg-gray-900 p-3 border-3 border-white arcade-btn-large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => playSound("hover")}
                onClick={() => setShowWalletModal(true)}
              >
                <Wallet className="h-6 w-6 text-yellow-400" />
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
                className="hidden md:flex items-center gap-3 bg-purple-700 p-3 border-3 border-purple-500 text-base font-bold"
              >
                <Wallet className="h-6 w-6" />
                <span>CONNECT WALLET</span>
              </ParticleButton>
            )}
          </div>
        </div>
      </header>

      {/* Wallet Connection Modal */}
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
                By connecting your wallet, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Games Page Content */}
      <div className="py-28 px-4 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <h2 className="text-4xl font-bold flex items-center">
              <Gamepad2 className="mr-3 h-8 w-8 text-yellow-400" />
              GAMES LIBRARY
            </h2>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="SEARCH GAMES"
                className="bg-black border-3 border-white pl-12 pr-5 py-3 focus:border-yellow-400 outline-none w-full md:w-80 arcade-btn text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Filter className="mr-3 h-5 w-5" />
              <h3 className="font-bold text-xl">CATEGORIES</h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <AnimatedButton
                  key={category}
                  className={`px-6 py-3 border-3 text-lg ${
                    selectedCategory === category
                      ? "border-yellow-400 bg-yellow-400 bg-opacity-20 text-yellow-400"
                      : "border-white hover:border-yellow-400"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    playSound("click");
                  }}
                  onHover={() => playSound("hover")}
                >
                  {category}
                </AnimatedButton>
              ))}
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                className="bg-black border-3 border-white hover:border-yellow-400 transition-colors arcade-card"
                whileHover={{ y: -8 }}
                onMouseEnter={() => playSound("hover")}
              >
                <div className="bg-gray-900 h-56 relative overflow-hidden">
                  <Image
                    src={`/game${(game.id % 3) + 1}.png`}
                    alt={game.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full"
                  />

                  <div className="absolute top-0 left-0 w-full p-3 flex justify-between">
                    <span className="px-3 py-1.5 bg-black/80 text-base font-bold">
                      {game.category}
                    </span>

                    <span
                      className={`px-3 py-1.5 text-base font-bold ${
                        game.status === "live" ? "bg-red-600" : "bg-yellow-600"
                      }`}
                    >
                      {game.status === "live" ? "LIVE" : "WAITING"}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-3 flex justify-between text-sm">
                    <span className="px-3 py-1.5 bg-black/80 font-bold flex items-center">
                      <Coins className="h-4 w-4 mr-2 text-yellow-400" />
                      MIN BET: {game.minBet} ETH
                    </span>

                    <span className="px-3 py-1.5 bg-black/80 font-bold flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {game.players}/{game.maxPlayers}
                    </span>
                  </div>

                  {game.featured && (
                    <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
                      <div className="bg-purple-600 text-white text-xs font-bold py-1 text-center w-32 transform rotate-[-45deg] translate-y-8 translate-x-[-10px]">
                        FEATURED
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    {game.title}
                    {game.status === "live" && (
                      <span className="ml-3 inline-flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  </h3>

                  <div className="flex justify-between items-center text-base text-gray-400 mb-5">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                      Prize Pool: {game.prize} ETH
                    </div>

                    {game.status === "live" && (
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        In Progress
                      </div>
                    )}
                  </div>

                  <Link href={`/games/${game.id}`}>
                    <ParticleButton className="arcade-btn bg-purple-700 text-white px-5 py-3 w-full border-3 border-purple-600 hover:bg-purple-600 transition-colors text-lg">
                      {game.status === "live" ? "JOIN GAME" : "PLAY NOW"}
                    </ParticleButton>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-16 border-3 border-white p-10">
              <p className="text-2xl mb-6">
                No games found matching your criteria.
              </p>
              <AnimatedButton
                className="arcade-btn-outline text-lg px-8 py-4 border-3"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  playSound("click");
                }}
                onHover={() => playSound("hover")}
              >
                SHOW ALL GAMES
              </AnimatedButton>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t-4 border-white py-10 px-4 mt-16 relative z-20">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-lg">
          &copy; {new Date().getFullYear()} Empire of Bits. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
