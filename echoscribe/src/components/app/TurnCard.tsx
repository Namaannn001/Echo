import React from 'react';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

// Define the component's props using TypeScript
// This tells us what information each TurnCard needs to be displayed.
interface TurnCardProps {
  authorName: string;
  text: string;
  isAI: boolean;
  imageUrl?: string;
}

export function TurnCard({ authorName, text, isAI, imageUrl }: TurnCardProps) {
  // Conditionally change styles based on whether the turn is from the AI or a user.
  const cardStyle = isAI
    ? "bg-slate-800/50 border-l-4 border-purple-500" // AI turns have a purple accent
    : "bg-slate-700/50"; // User turns are a neutral gray

  const authorIcon = isAI 
    ? <Bot className="w-5 h-5 mr-3 text-purple-400 shrink-0" /> 
    : <User className="w-5 h-5 mr-3 text-blue-400 shrink-0" />;

  return (
    // We wrap the component in `motion.div` from Framer Motion for a simple fade-in animation.
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-4 rounded-lg my-4 shadow-md ${cardStyle}`}
    >
      <div className="flex items-center font-bold mb-3 text-white">
        {authorIcon}
        <span>{authorName}</span>
      </div>
      
      {/* The 'whitespace-pre-wrap' class preserves line breaks from the textarea */}
      <p className="text-gray-300 whitespace-pre-wrap ml-[32px]">{text}</p>
      
      {/* This section only renders if an `imageUrl` is provided */}
      {imageUrl && (
        <div className="mt-4 ml-[32px] rounded-lg overflow-hidden border border-gray-600">
          
          <img src={imageUrl} alt={`AI generated scene for ${authorName}'s turn`} className="w-full h-auto object-cover" />
        </div>
      )}
    </motion.div>
  );
}