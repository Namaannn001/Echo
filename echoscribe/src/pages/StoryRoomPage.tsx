import React, { useState, useEffect } from 'react'; // Make sure useEffect is imported
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoryById, createTurn } from '../services/storyService';
import { TurnCard } from '../components/app/TurnCard';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient'; // Make sure supabase is imported

export function StoryRoomPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const [newTurnContent, setNewTurnContent] = useState('');
  const user = useAuthStore((state) => state.session?.user);
  const queryClient = useQueryClient();

  const { data: story, isLoading, isError, error } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => getStoryById(storyId!),
    enabled: !!storyId,
  });

  const createTurnMutation = useMutation({
    mutationFn: createTurn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story', storyId] });
      setNewTurnContent('');
      // We don't need a toast here anymore, the real-time update is enough!
    },
    onError: (err: any) => {
      toast.error(err.message);
    }
  });

  // ==================================================================
  // ▼▼▼ PUT THE NEW USEEFFECT HOOK HERE ▼▼▼
  // ==================================================================
  useEffect(() => {
    if (!storyId) return;

    const channel = supabase
      .channel(`story-room-${storyId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'turns', filter: `story_id=eq.${storyId}` },
        (payload) => {
          console.log('New turn received!', payload);
          // When a new turn is inserted, tell React Query to refetch the data.
          // This makes the UI update in real-time.
          queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        }
      )
      .subscribe();

    // This is a cleanup function that runs when the user navigates away from the page.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [storyId, queryClient]);
  // ==================================================================
  // ▲▲▲ END OF THE NEW CODE ▲▲▲
  // ==================================================================

  const handleTurnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !story || newTurnContent.trim() === '') return;

    createTurnMutation.mutate({
      story_id: story.id,
      author_id: user.id,
      content: newTurnContent,
      turn_number: story.turns.length + 1,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-purple-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-20 bg-red-900/50 rounded-lg max-w-md mx-auto mt-10">
        <p className="font-bold text-red-400">Error: {error.message}</p>
      </div>
    );
  }
  
  const isMyTurn = true; // Still simplified for now

  // The rest of your JSX return statement...
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
      <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-lg">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{story.title}</h1>
        <p className="text-gray-400 mb-6 italic">"{story.premise}"</p>
        <div className="story-turns-container space-y-6">
          {story.turns.length > 0 ? (
            story.turns.map((turn: any) => (
              <TurnCard 
                key={turn.id} 
                authorName={turn.author_id}
                text={turn.content}
                isAI={turn.is_ai_generated}
                imageUrl={turn.ai_image_url}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">This story has no turns yet. Be the first to write!</p>
          )}
        </div>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-bold mb-3 text-lg">Participants</h3>
        </div>
        {isMyTurn ? (
          <form onSubmit={handleTurnSubmit} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-purple-400">Your Turn!</h3>
            <textarea 
              value={newTurnContent}
              onChange={(e) => setNewTurnContent(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-purple-500 min-h-[150px]"
              placeholder="Continue the story..."
            />
            <Button type="submit" variant="primary" className="w-full mt-3" isLoading={createTurnMutation.isPending}>
              Submit Turn
            </Button>
          </form>
        ) : (
          <div className="text-center p-6 bg-gray-700 rounded-md">
            <p className="font-bold">Waiting for other writers...</p>
          </div>
        )}
      </div>
    </div>
  );
}