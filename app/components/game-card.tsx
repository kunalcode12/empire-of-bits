"use client";

import { motion } from "framer-motion";
import { Users, Coins, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedButton } from "./animated-button";

interface GameCardProps {
  game: {
    id: number;
    title: string;
    category: string;
    minBet: number;
    maxPlayers: number;
    prize: number;
    players: number;
    status: string;
  };
  onHover?: () => void;
  onClick?: () => void;
}

export function GameCard({ game, onHover, onClick }: GameCardProps) {
  const getGameImage = (id: number) => {
    return `/game${id}.png`;
  };

  return (
    <motion.div
      className="bg-black border-3 border-white hover:border-yellow-400 transition-colors arcade-card"
      whileHover={{ y: -8 }}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <div className="bg-gray-900 h-56 relative overflow-hidden">
        <Image
          src={getGameImage(game.id) || "/placeholder.svg"}
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
            <Zap className="h-5 w-5 mr-2 text-yellow-400" />
            Prize Pool: {game.prize} ETH
          </div>
        </div>

        <Link href={`/games/${game.id}`}>
          <AnimatedButton className="arcade-btn bg-purple-700 text-white px-5 py-3 w-full border-3 border-purple-600 hover:bg-purple-600 transition-colors text-lg">
            {game.status === "live" ? "JOIN GAME" : "PLAY NOW"}
          </AnimatedButton>
        </Link>
      </div>
    </motion.div>
  );
}
