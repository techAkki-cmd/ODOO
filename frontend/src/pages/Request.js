// pages/Request.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Send, User, MessageSquare } from "lucide-react";

const Request = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    mySkillOffered: '',
    skillWanted: '',
    preferredSchedule: 'flexible'
  });

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    if (location.state?.targetProfile) {
      setProfile(location.state.targetProfile);
      setLoading(false);

      // Pre-fill message
      const preMessage = `Hi ${location.state.targetProfile.firstName},\n\nI'd love to connect and explore a skill swap opportunity with you! I'm particularly interested in learning from your expertise.\n\nLooking forward to hearing from you!\n\nBest regards`;
      setFormData(prev => ({ ...prev, message: preMessage }));
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleSendRequest = async () => {
    setSending(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("Please log in to send a request.");
        navigate('/auth');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/connections/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: profile.id,
          message: formData.message
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Skill swap request sent successfully!');
        navigate('/', { state: { requestSent: true } });
      } else {
        alert(result.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send request. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #f093fb 0%, transparent 50%)",
            "radial-gradient(circle at 60% 20%, #667eea 0%, transparent 50%), radial-gradient(circle at 20% 80%, #764ba2 0%, transparent 50%), radial-gradient(circle at 80% 40%, #f093fb 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/skillswap', { state: { selectedProfile: profile } })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>

              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  Send Request
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Connect with {profile.firstName} for a skill swap
                </p>
              </div>
            </div>
          </motion.header>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-purple-200 shadow-lg mx-auto mb-4">
                        <img
                          src={profile.photo}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{profile.name}</h3>
                      <p className="text-gray-600 mb-4">{profile.location}</p>

                      <div className="space-y-2 text-sm">
                        <div className="bg-emerald-50 rounded-lg p-3">
                          <div className="font-medium text-emerald-800">Skills Offered</div>
                          <div className="text-emerald-600">
                            {profile.skillsOffered.slice(0, 3).join(', ')}
                            {profile.skillsOffered.length > 3 && ` +${profile.skillsOffered.length - 3} more`}
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="font-medium text-blue-800">Skills Wanted</div>
                          <div className="text-blue-600">
                            {profile.skillsWanted.slice(0, 3).join(', ')}
                            {profile.skillsWanted.length > 3 && ` +${profile.skillsWanted.length - 3} more`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Request Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                      <h2 className="text-2xl font-bold text-gray-800">Skill Swap Request</h2>
                    </div>

                    <form className="space-y-6">
                      {/* Message */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Personal Message
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={8}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Introduce yourself and explain what you'd like to learn..."
                        />
                      </div>

                      {/* Skill I'm Offering */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Skill I Can Offer
                        </label>
                        <input
                          type="text"
                          value={formData.mySkillOffered}
                          onChange={(e) => setFormData({ ...formData, mySkillOffered: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="What skill can you teach in return?"
                        />
                      </div>

                      {/* Skill I Want */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Skill I Want to Learn
                        </label>
                        <select
                          value={formData.skillWanted}
                          onChange={(e) => setFormData({ ...formData, skillWanted: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select a skill...</option>
                          {profile.skillsOffered.map((skill, index) => (
                            <option key={index} value={skill}>{skill}</option>
                          ))}
                        </select>
                      </div>

                      {/* Preferred Schedule */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Preferred Schedule
                        </label>
                        <select
                          value={formData.preferredSchedule}
                          onChange={(e) => setFormData({ ...formData, preferredSchedule: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="flexible">Flexible</option>
                          <option value="weekends">Weekends</option>
                          <option value="weekdays">Weekdays</option>
                          <option value="evenings">Evenings</option>
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-6">
                        <Button
                          type="button"
                          onClick={() => navigate('/skillswap', { state: { selectedProfile: profile } })}
                          variant="outline"
                          className="flex-1 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
                        >
                          Back to Profile
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSendRequest}
                          disabled={sending || !formData.message.trim()}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {sending ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Request
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;
