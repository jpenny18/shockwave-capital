'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Particles from '../components/Particles';
import Header from '../components/Header';
import { ArrowRight, ThumbsUp, ThumbsDown, MessageSquare, Plus } from 'lucide-react';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';

interface Poll {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: any;
  yesVotes: number;
  noVotes: number;
  userVotes: Record<string, 'yes' | 'no'>;
}

interface Comment {
  id: string;
  pollId: string;
  text: string;
  username: string;
  createdAt: any;
}

export default function ShockwavePulsePage() {
  const [username, setUsername] = useState('');
  const [isSettingUsername, setIsSettingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPollTitle, setNewPollTitle] = useState('');
  const [newPollDescription, setNewPollDescription] = useState('');
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.displayName) {
          setUsername(user.displayName);
          setIsSettingUsername(false);
          await initializeData();
        } else {
          setIsSettingUsername(true);
        }
      } else {
        router.push('/auth');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Add a simple useEffect to handle keyboard events for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCreatingPoll(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const initializeData = async () => {
    await fetchPolls();
    await fetchComments();
  };

  const fetchPolls = async () => {
    const querySnapshot = await getDocs(query(collection(db, 'polls'), orderBy('createdAt', 'desc')));
    const pollsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Poll));
    setPolls(pollsData);
  };

  const fetchComments = async () => {
    const querySnapshot = await getDocs(query(collection(db, 'comments'), orderBy('createdAt', 'desc')));
    const commentsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment));
    setComments(commentsData);
  };

  const handleSetUsername = async () => {
    if (!auth.currentUser) return;
    
    // Validate username
    if (!newUsername || newUsername.length < 3) {
      alert('Username must be at least 3 characters long');
      return;
    }
    
    if (newUsername.length > 20) {
      alert('Username must be less than 20 characters');
      return;
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
      alert('Username can only contain letters, numbers, underscores and hyphens');
      return;
    }

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: newUsername
      });

      // Store additional user info in Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        username: newUsername,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      }, { merge: true });

      setUsername(newUsername);
      setIsSettingUsername(false);
    } catch (error) {
      console.error('Error setting username:', error);
      alert('Failed to set username. Please try again.');
    }
  };

  // Add a helper function for starting poll creation
  const startCreatePoll = () => {
    console.log("Start create poll clicked", { username, isLoggedIn: !!auth.currentUser });
    
    if (!auth.currentUser) {
      console.log("No auth user, redirecting to auth");
      router.push('/auth');
      return;
    }
    
    if (!username) {
      console.log("No username, showing username modal");
      setIsSettingUsername(true);
      return;
    }
    
    console.log("Opening create poll modal");
    setIsCreatingPoll(true);
  };

  const handleCreatePoll = async () => {
    try {
      // Validate inputs
      if (!newPollTitle.trim() || !newPollDescription.trim()) {
        alert('Please provide both a title and description for your poll.');
        return;
      }
      
      if (!auth.currentUser) {
        alert('You must be logged in to create a poll.');
        router.push('/auth');
        return;
      }
      
      if (!username) {
        alert('Please set a username before creating a poll.');
        setIsSettingUsername(true);
        return;
      }

      // Close modal first
      setIsCreatingPoll(false);
      
      // Create poll data
      const pollData = {
        title: newPollTitle.trim(),
        description: newPollDescription.trim(),
        createdBy: username,
        createdAt: serverTimestamp(),
        yesVotes: 0,
        noVotes: 0,
        userVotes: {},
        userId: auth.currentUser.uid
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'polls'), pollData);
      console.log('Poll created successfully with ID:', docRef.id);

      // Reset form
      setNewPollTitle('');
      setNewPollDescription('');
      
      // Refresh polls
      await fetchPolls();
      
      // Show success message
      alert('Poll created successfully!');
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
    }
  };

  const handleVote = async (pollId: string, vote: 'yes' | 'no') => {
    const user = auth.currentUser;
    if (!user) return;
    
    const pollRef = doc(db, 'polls', pollId);
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    const userId = user.uid;
    const previousVote = poll.userVotes?.[userId];

    const updates: any = {
      yesVotes: poll.yesVotes,
      noVotes: poll.noVotes,
      userVotes: { ...(poll.userVotes || {}) }
    };

    // Remove previous vote if exists
    if (previousVote) {
      updates[`${previousVote}Votes`]--;
      delete updates.userVotes[userId];
    }

    // Add new vote
    if (previousVote !== vote) {
      updates[`${vote}Votes`]++;
      updates.userVotes[userId] = vote;
    }

    await updateDoc(pollRef, updates);
    fetchPolls();
  };

  const handleAddComment = async (pollId: string) => {
    if (!newComment) return;

    await addDoc(collection(db, 'comments'), {
      pollId,
      text: newComment,
      username,
      createdAt: serverTimestamp()
    });

    setNewComment('');
    fetchComments();
  };

  const UsernameSetupModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0D0D0D] rounded-2xl p-8 border border-[#2F2F2F] max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-[#0FF1CE] mb-6">Welcome to Shockwave Pulse!</h2>
        <p className="text-gray-300 mb-6">Before you can participate, please set your username. This will be your identity in the community.</p>
        <p className="text-sm text-gray-400 mb-6">
          Username requirements:
          <ul className="list-disc list-inside mt-2">
            <li>3-20 characters long</li>
            <li>Letters, numbers, underscores and hyphens only</li>
            <li>Cannot be changed once set</li>
          </ul>
        </p>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white mb-6"
          placeholder="Enter username"
          maxLength={20}
          pattern="[a-zA-Z0-9_-]+"
        />
        <button
          onClick={handleSetUsername}
          className="w-full bg-[#0FF1CE] text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
        >
          Set Username & Continue
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans flex items-center justify-center">
        <div className="text-[#0FF1CE] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
      <Header />
      
      {isSettingUsername && <UsernameSetupModal />}
      
      {/* Hero Section */}
      <section className="relative px-6 pt-40 pb-32 text-center overflow-hidden bg-gradient-to-b from-[#121212] to-[#131313]">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        <Particles />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#0FF1CE] mb-6">
            Shockwave Pulse
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Shape the future of Shockwave Capital. Vote, discuss, and propose new features.
          </p>
          {username && (
            <p className="text-sm text-gray-400 mt-4">
              Participating as: <span className="text-[#0FF1CE]">{username}</span>
            </p>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-20 px-6">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Create Poll Button - Replaced with simpler implementation */}
          <div className="flex justify-end">
            <div 
              className="bg-[#0FF1CE] text-black px-6 py-3 rounded-full font-bold hover:opacity-90 cursor-pointer transition-all flex items-center gap-2 shadow-lg"
              onClick={() => setIsCreatingPoll(true)}
              style={{ zIndex: 10 }}
            >
              <Plus size={20} />
              <span>Create Poll</span>
            </div>
          </div>

          {/* Create Poll Modal */}
          {isCreatingPoll && (
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100]"
              onClick={(e) => {
                // Close if clicking outside the modal content
                if (e.target === e.currentTarget) {
                  setIsCreatingPoll(false);
                }
              }}
            >
              <div className="bg-gradient-to-b from-[#0D0D0D] to-[#131313] rounded-2xl p-8 border border-[#2F2F2F] max-w-lg w-full mx-4 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#0FF1CE]">Create New Poll</h3>
                  <button 
                    onClick={() => setIsCreatingPoll(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreatePoll();
                }} className="space-y-6">
                  <div>
                    <label htmlFor="pollTitle" className="block text-white text-sm font-medium mb-2">Poll Title</label>
                    <input
                      id="pollTitle"
                      type="text"
                      value={newPollTitle}
                      onChange={(e) => setNewPollTitle(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0FF1CE]/50 focus:border-transparent transition-all"
                      placeholder="Enter a clear, concise title"
                      maxLength={100}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pollDescription" className="block text-white text-sm font-medium mb-2">Poll Description</label>
                    <textarea
                      id="pollDescription"
                      value={newPollDescription}
                      onChange={(e) => setNewPollDescription(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#0FF1CE]/50 focus:border-transparent transition-all"
                      placeholder="Describe your poll in detail to get meaningful responses"
                      maxLength={500}
                      required
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      {newPollDescription.length}/500 characters
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setIsCreatingPoll(false)}
                      className="px-6 py-3 rounded-full font-medium border border-[#2F2F2F] hover:bg-[#1A1A1A] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#0FF1CE] text-black px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Create Poll
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Polls List */}
          <div className="space-y-6">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{poll.title}</h3>
                    <p className="text-gray-300">{poll.description}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    by {poll.createdBy}
                  </div>
                </div>

                {/* Voting Section */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => handleVote(poll.id, 'yes')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-colors ${
                      auth.currentUser && poll.userVotes?.[auth.currentUser.uid] === 'yes' ? 'bg-green-500/20 text-green-500' : 'hover:bg-green-500/10'
                    }`}
                  >
                    <ThumbsUp size={20} />
                    <span>{poll.yesVotes}</span>
                  </button>
                  <button
                    onClick={() => handleVote(poll.id, 'no')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-colors ${
                      auth.currentUser && poll.userVotes?.[auth.currentUser.uid] === 'no' ? 'bg-red-500/20 text-red-500' : 'hover:bg-red-500/10'
                    }`}
                  >
                    <ThumbsDown size={20} />
                    <span>{poll.noVotes}</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={selectedPollId === poll.id ? newComment : ''}
                      onChange={(e) => {
                        setSelectedPollId(poll.id);
                        setNewComment(e.target.value);
                      }}
                      className="flex-1 bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white"
                      placeholder="Add a comment..."
                    />
                    <button
                      onClick={() => handleAddComment(poll.id)}
                      className="bg-[#0FF1CE] text-black px-4 py-2 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                      <MessageSquare size={20} />
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {comments
                      .filter(comment => comment.pollId === poll.id)
                      .map(comment => (
                        <div key={comment.id} className="bg-[#1A1A1A] rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-[#0FF1CE]">{comment.username}</span>
                            <span className="text-sm text-gray-400">
                              {comment.createdAt?.toDate().toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300">{comment.text}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 