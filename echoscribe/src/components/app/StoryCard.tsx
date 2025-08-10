import React from 'react';
import { Link } from 'react-router-dom';
import type { Story } from '../../types'; // Import our type definition

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link to={`/story/${story.id}`} className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-all transform hover:-translate-y-1">
      <h3 className="text-xl font-bold text-white mb-2">{story.title}</h3>
      <p className="text-gray-400 line-clamp-3">{story.premise}</p>
      <div className="mt-4 flex items-center">
        <span className="text-sm text-gray-500">{story.participants.length} Participant(s)</span>
      </div>
    </Link>
  );
}