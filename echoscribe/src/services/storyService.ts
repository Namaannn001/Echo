import { supabase } from '../lib/supabaseClient';

export async function getStories() {
  // For now, we fetch all stories. Later you'll filter by user.
  const { data, error } = await supabase
    .from('stories')
    .select(`
      id,
      title,
      premise,
      participants:participants(user_id)
    `); // This is a simplified query

  if (error) throw error;
  
  // A simple transformation to count participants
  return data.map(story => ({
    ...story,
    // Supabase returns participants as an array of objects, so we get the count
    participants: { length: story.participants.length } 
  }));
}
// ... (keep the getStories function)

export async function createStory(storyData: { title: string, premise: string, author_id: string }) {
  // Insert the new story into the 'stories' table
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .insert(storyData)
    .select() // Use .select() to get the newly created story back
    .single();

  if (storyError) throw storyError;
  if (!story) throw new Error("Story creation failed.");

  // Also add the author as a participant in the 'participants' table
  const { error: participantError } = await supabase
    .from('participants')
    .insert({ story_id: story.id, user_id: story.author_id });

  if (participantError) throw participantError;

  return story;
}

// ... (keep the other functions)

export async function getStoryById(storyId: string) {
  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      turns ( * )
    `)
    .eq('id', storyId)
    .single(); // .single() returns one object instead of an array

  if (error) throw error;
  return data;
}
// ... (keep getStories, createStory, getStoryById)

export async function createTurn(turnData: {
  story_id: string;
  author_id: string;
  content: string;
  turn_number: number;
}) {
  const { error } = await supabase.rpc('handle_new_turn', {
    story_id_param: turnData.story_id,
    author_id_param: turnData.author_id,
    content_param: turnData.content,
    turn_number_param: turnData.turn_number
  });

  if (error) throw error;
  return { success: true };
}