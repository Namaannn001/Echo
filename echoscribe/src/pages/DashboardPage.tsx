import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStories, createStory } from '../services/storyService';
import { StoryCard } from '../components/app/StoryCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader2, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

// A simple modal component for the form
function CreateStoryModal({ isOpen, onClose, onSubmit, isLoading }: any) {
  const [title, setTitle] = useState('');
  const [premise, setPremise] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, premise });
    setTitle('');
    setPremise('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create a New Story</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Story Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea
            value={premise} onChange={e => setPremise(e.target.value)}
            placeholder="A short premise or starting idea..." required
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 min-h-[100px]"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>Create Story</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore((state) => state.session?.user);
  const queryClient = useQueryClient();

  const { data: stories, isLoading, isError, error } = useQuery({ 
    queryKey: ['stories'], 
    queryFn: getStories 
  });

  const createStoryMutation = useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      // When a story is created successfully, invalidate the 'stories' query
      // This tells React Query to re-fetch the stories, updating the dashboard automatically!
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      toast.success('Your new story has been created!');
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message);
    }
  });

  const handleCreateStory = (formData: { title: string, premise: string }) => {
    if (!user) {
      toast.error("You must be logged in to create a story.");
      return;
    }
    createStoryMutation.mutate({ ...formData, author_id: user.id });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CreateStoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateStory}
        isLoading={createStoryMutation.isPending}
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Story
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center p-20">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
        </div>
      )}

      {isError && (
        <div className="text-center p-20 bg-red-900/50 rounded-lg">
          <p className="font-bold text-red-400">Error: {error.message}</p>
        </div>
      )}

      {stories && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story: any) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}