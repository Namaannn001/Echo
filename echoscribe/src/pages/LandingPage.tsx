import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PenTool, Zap, Users } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
        Where Stories Come to Life, <span className="text-purple-400">Together</span>.
      </h1>
      <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-400">
        EchoScribe is a collaborative storytelling platform where your imagination is amplified by AI, turning simple ideas into epic sagas.
      </p>
      <div className="mt-10">
        <Link to="/dashboard">
          <Button variant="primary" className="text-lg px-8 py-3">
            Start Writing Now
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-gray-800 rounded-lg">
          <Users className="w-10 h-10 mx-auto text-purple-400 mb-4" />
          <h3 className="text-xl font-bold">Collaborate</h3>
          <p className="text-gray-400 mt-2">Write stories turn-by-turn with friends or the community.</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg">
          <Zap className="w-10 h-10 mx-auto text-purple-400 mb-4" />
          <h3 className="text-xl font-bold">AI-Powered Muse</h3>
          <p className="text-gray-400 mt-2">Get inspired by AI-generated plot twists and stunning imagery.</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg">
          <PenTool className="w-10 h-10 mx-auto text-purple-400 mb-4" />
          <h3 className="text-xl font-bold">Export Your Saga</h3>
          <p className="text-gray-400 mt-2">Finish your masterpiece and export it as a beautiful eBook.</p>
        </div>
      </div>
    </div>
  );
}