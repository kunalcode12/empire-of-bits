"use client";

import { motion } from "framer-motion";
import { Trophy, Users, Clock, Coins } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "./animated-button";

interface TournamentCardProps {
  tournament: {
    id: number;
    title: string;
    game: string;
    entryFee: number;
    prize: number;
    players: number;
    status: string;
    timeLeft: string;
  };
  onHover?: () => void;
  onClick?: () => void;
}

export function TournamentCard({
  tournament,
  onHover,
  onClick,
}: TournamentCardProps) {
  return (
    <motion.div
      className="bg-black border-3 border-white hover:border-yellow-400 transition-colors arcade-card"
      whileHover={{ y: -8 }}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold">{tournament.title}</h3>
            <p className="text-lg text-gray-400 mt-1">{tournament.game}</p>
          </div>
          <div
            className={`px-3 py-1.5 text-base font-bold ${
              tournament.status === "live"
                ? "bg-red-600"
                : tournament.status === "registering"
                ? "bg-green-600"
                : "bg-yellow-600"
            }`}
          >
            {tournament.status.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 p-4 border-2 border-gray-800">
            <div className="text-sm text-gray-400 mb-2 flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              PRIZE POOL
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {tournament.prize} ETH
            </div>
          </div>

          <div className="bg-gray-900 p-4 border-2 border-gray-800">
            <div className="text-sm text-gray-400 mb-2 flex items-center">
              <Coins className="h-4 w-4 mr-2" />
              ENTRY FEE
            </div>
            <div className="text-2xl font-bold">{tournament.entryFee} ETH</div>
          </div>

          <div className="bg-gray-900 p-4 border-2 border-gray-800">
            <div className="text-sm text-gray-400 mb-2 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              PLAYERS
            </div>
            <div className="text-2xl font-bold">{tournament.players}</div>
          </div>

          <div className="bg-gray-900 p-4 border-2 border-gray-800">
            <div className="text-sm text-gray-400 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              TIME LEFT
            </div>
            <div className="text-2xl font-bold">{tournament.timeLeft}</div>
          </div>
        </div>

        <Link href={`/tournaments/${tournament.id}`}>
          <AnimatedButton className="arcade-btn bg-purple-700 text-white px-5 py-3 w-full border-3 border-purple-600 hover:bg-purple-600 transition-colors text-lg">
            {tournament.status === "registering"
              ? "REGISTER NOW"
              : "VIEW DETAILS"}
          </AnimatedButton>
        </Link>
      </div>
    </motion.div>
  );
}
