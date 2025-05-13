'use client';
import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
  where,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trash2, AlertCircle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface Poll {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: any;
  yesVotes: number;
  noVotes: number;
  userVotes: Record<string, 'yes' | 'no'>;
  status?: 'active' | 'archived' | 'flagged';
}

interface Comment {
  id: string;
  pollId: string;
  text: string;
  username: string;
  createdAt: any;
  status?: 'active' | 'hidden';
}

export default function PulseManagementPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'archived' | 'flagged'>('all');

  useEffect(() => {
    fetchPolls();
    fetchComments();
  }, [filter]);

  const fetchPolls = async () => {
    try {
      let pollsQuery = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
      
      if (filter !== 'all') {
        pollsQuery = query(pollsQuery, where('status', '==', filter));
      }
      
      const querySnapshot = await getDocs(pollsQuery);
      const pollsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Poll));
      setPolls(pollsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching polls:', error);
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'comments'), orderBy('createdAt', 'desc')));
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Comment));
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) return;

    try {
      // Delete the poll
      await deleteDoc(doc(db, 'polls', pollId));
      
      // Delete associated comments
      const pollComments = comments.filter(comment => comment.pollId === pollId);
      for (const comment of pollComments) {
        await deleteDoc(doc(db, 'comments', comment.id));
      }
      
      // Refresh data
      await fetchPolls();
      await fetchComments();
    } catch (error) {
      console.error('Error deleting poll:', error);
      alert('Failed to delete poll. Please try again.');
    }
  };

  const handleUpdatePollStatus = async (pollId: string, status: 'active' | 'archived' | 'flagged') => {
    try {
      await updateDoc(doc(db, 'polls', pollId), { status });
      await fetchPolls();
    } catch (error) {
      console.error('Error updating poll status:', error);
      alert('Failed to update poll status. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteDoc(doc(db, 'comments', commentId));
      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleToggleCommentVisibility = async (commentId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
      await updateDoc(doc(db, 'comments', commentId), { status: newStatus });
      await fetchComments();
    } catch (error) {
      console.error('Error updating comment visibility:', error);
      alert('Failed to update comment visibility. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-[#0FF1CE]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Pulse Management</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[#0FF1CE] text-black' : 'bg-[#1A1A1A] text-white'}`}
          >
            All Polls
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-[#0FF1CE] text-black' : 'bg-[#1A1A1A] text-white'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-4 py-2 rounded-lg ${filter === 'archived' ? 'bg-[#0FF1CE] text-black' : 'bg-[#1A1A1A] text-white'}`}
          >
            Archived
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`px-4 py-2 rounded-lg ${filter === 'flagged' ? 'bg-[#0FF1CE] text-black' : 'bg-[#1A1A1A] text-white'}`}
          >
            Flagged
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {polls.map((poll) => (
          <div key={poll.id} className="bg-[#0D0D0D] rounded-xl p-6 border border-[#2F2F2F]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{poll.title}</h3>
                <p className="text-gray-300">{poll.description}</p>
                <div className="mt-2 text-sm text-gray-400">
                  Created by: {poll.createdBy} | Votes: {poll.yesVotes + poll.noVotes}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdatePollStatus(poll.id, 'active')}
                  className={`p-2 rounded-lg ${poll.status === 'active' ? 'text-[#0FF1CE]' : 'text-gray-400'} hover:bg-[#1A1A1A]`}
                  title="Mark as Active"
                >
                  <CheckCircle size={20} />
                </button>
                <button
                  onClick={() => handleUpdatePollStatus(poll.id, 'archived')}
                  className={`p-2 rounded-lg ${poll.status === 'archived' ? 'text-yellow-500' : 'text-gray-400'} hover:bg-[#1A1A1A]`}
                  title="Archive Poll"
                >
                  <AlertCircle size={20} />
                </button>
                <button
                  onClick={() => handleUpdatePollStatus(poll.id, 'flagged')}
                  className={`p-2 rounded-lg ${poll.status === 'flagged' ? 'text-red-500' : 'text-gray-400'} hover:bg-[#1A1A1A]`}
                  title="Flag Poll"
                >
                  <XCircle size={20} />
                </button>
                <button
                  onClick={() => handleDeletePoll(poll.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-[#1A1A1A]"
                  title="Delete Poll"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedPoll(selectedPoll === poll.id ? null : poll.id)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#0FF1CE]"
            >
              <MessageSquare size={16} />
              {comments.filter(c => c.pollId === poll.id).length} Comments
            </button>

            {selectedPoll === poll.id && (
              <div className="mt-4 space-y-4">
                {comments
                  .filter(comment => comment.pollId === poll.id)
                  .map(comment => (
                    <div key={comment.id} className="bg-[#1A1A1A] rounded-lg p-4 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#0FF1CE]">{comment.username}</span>
                          <span className="text-xs text-gray-400">
                            {comment.createdAt?.toDate().toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{comment.text}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCommentVisibility(comment.id, comment.status || 'active')}
                          className={`p-1 rounded-lg ${comment.status === 'hidden' ? 'text-yellow-500' : 'text-[#0FF1CE]'} hover:bg-[#0D0D0D]`}
                          title={comment.status === 'hidden' ? 'Show Comment' : 'Hide Comment'}
                        >
                          {comment.status === 'hidden' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 rounded-lg text-red-500 hover:bg-[#0D0D0D]"
                          title="Delete Comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 