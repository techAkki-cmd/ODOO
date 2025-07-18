import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  ArrowLeft,
  Send,
  User,
  MessageSquare,
  Calendar,
  Clock,
  Star,
  MapPin,
  Sparkles,
  CheckCircle,
  Heart,
  Zap,
  Gift
} from "lucide-react";

const Request = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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

      // Enhanced pre-fill message
      const preMessage = `Hi ${location.state.targetProfile.firstName}! 👋\n\nI hope you're having a wonderful day! I came across your profile and I'm really impressed by your skills. I'd love to connect and explore an exciting skill swap opportunity with you.\n\nI'm particularly interested in learning from your expertise and I believe we could create something amazing together through knowledge sharing.\n\nI'm looking forward to hearing from you and hopefully starting this journey of mutual learning!\n\nBest regards ✨`;
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
          message: formData.message,
          skillOffered: formData.mySkillOffered,
          skillWanted: formData.skillWanted,
          preferredSchedule: formData.preferredSchedule
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/', { state: { requestSent: true } });
        }, 2000);
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

  const FloatingLabel = ({ children, htmlFor, required = false }) => (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      {children}
      {required && <span className="text-rose-500">*</span>}
    </label>
  );

  // Enhanced Loading State
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 p-8 rounded-3xl backdrop-blur-lg border border-white/20 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white font-medium text-lg"
          >
            Loading your connection...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%), radial-gradient(circle at 40% 80%, #c084fc 0%, transparent 50%)",
            "radial-gradient(circle at 60% 20%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 20% 80%, #a855f7 0%, transparent 50%), radial-gradient(circle at 80% 40%, #c084fc 0%, transparent 50%)",
            "radial-gradient(circle at 40% 60%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 70% 30%, #a855f7 0%, transparent 50%), radial-gradient(circle at 30% 70%, #c084fc 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md mx-4 shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Sent! 🎉</h3>
              <p className="text-gray-600">Your skill swap request has been sent successfully!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/skillswap', { state: { selectedProfile: profile } })}
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200 border border-white/30"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>

              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3"
                >
                  Send Request
                  <Sparkles className="w-8 h-8 text-amber-300" />
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-sm font-medium"
                >
                  Connect with {profile.firstName} for an amazing skill swap journey
                </motion.p>
              </div>
            </div>
          </motion.header>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Enhanced Profile Summary */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="xl:col-span-1"
              >
                <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden sticky top-8">
                  <CardContent className="p-0">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white text-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/50 shadow-xl mx-auto mb-4"
                      >
                        <img
                          src={profile.photo}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-1">{profile.name}</h3>
                      <div className="flex items-center justify-center gap-2 text-white/90">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{profile.location}</span>
                      </div>
                    </div>

                    {/* Profile Stats */}
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-purple-50 rounded-xl p-3">
                          <div className="text-lg font-bold text-purple-700">{profile.rating?.toFixed(1) || '5.0'}</div>
                          <div className="text-xs text-purple-600">Rating</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3">
                          <div className="text-lg font-bold text-emerald-700">{profile.completedSwaps || 0}</div>
                          <div className="text-xs text-emerald-600">Swaps</div>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-3">
                          <div className="text-lg font-bold text-amber-700">{profile.totalReviews || 0}</div>
                          <div className="text-xs text-amber-600">Reviews</div>
                        </div>
                      </div>

                      {/* Skills Preview */}
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-4">
                          <div className="flex items-center gap-2 font-semibold text-emerald-800 mb-2">
                            <Gift className="w-4 h-4" />
                            Skills Offered
                          </div>
                          <div className="text-sm text-emerald-600 leading-relaxed">
                            {profile.skillsOffered?.slice(0, 2).join(', ')}
                            {profile.skillsOffered?.length > 2 && ` +${profile.skillsOffered.length - 2} more`}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4">
                          <div className="flex items-center gap-2 font-semibold text-blue-800 mb-2">
                            <Zap className="w-4 h-4" />
                            Skills Wanted
                          </div>
                          <div className="text-sm text-blue-600 leading-relaxed">
                            {profile.skillsWanted?.slice(0, 2).join(', ')}
                            {profile.skillsWanted?.length > 2 && ` +${profile.skillsWanted.length - 2} more`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Request Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="xl:col-span-3"
              >
                <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800">Skill Swap Request</h2>
                        <p className="text-gray-600">Create a personalized connection request</p>
                      </div>
                    </div>

                    <form className="space-y-8">
                      {/* Enhanced Message Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                      >
                        <FloatingLabel htmlFor="message" required>
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                          Personal Message
                        </FloatingLabel>
                        <div className="relative">
                          <textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={10}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-700 placeholder-gray-500 resize-none"
                            placeholder="Craft your personalized message here..."
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {formData.message.length}/1000
                          </div>
                        </div>
                      </motion.div>

                      {/* Enhanced Skills Exchange Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Skill Offering */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-3"
                        >
                          <FloatingLabel htmlFor="skillOffered">
                            <Gift className="w-4 h-4 text-emerald-600" />
                            Skill I Can Offer
                          </FloatingLabel>
                          <div className="relative">
                            <input
                              id="skillOffered"
                              type="text"
                              value={formData.mySkillOffered}
                              onChange={(e) => setFormData({ ...formData, mySkillOffered: e.target.value })}
                              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-gray-700 placeholder-gray-500"
                              placeholder="What skill can you teach in return?"
                            />
                          </div>
                        </motion.div>

                        {/* Skill Wanted - Changed from dropdown to text input */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-3"
                        >
                          <FloatingLabel htmlFor="skillWanted">
                            <Zap className="w-4 h-4 text-blue-600" />
                            Skill I Want to Learn
                          </FloatingLabel>
                          <div className="relative">
                            <input
                              id="skillWanted"
                              type="text"
                              value={formData.skillWanted}
                              onChange={(e) => setFormData({ ...formData, skillWanted: e.target.value })}
                              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-500"
                              placeholder="What skill do you want to learn?"
                            />
                          </div>
                        </motion.div>
                      </div>

                      {/* Enhanced Schedule Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-3"
                      >
                        <FloatingLabel htmlFor="schedule">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          Preferred Schedule
                        </FloatingLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { value: 'flexible', label: 'Flexible', icon: '🌟' },
                            { value: 'weekends', label: 'Weekends', icon: '🎉' },
                            { value: 'weekdays', label: 'Weekdays', icon: '💼' },
                            { value: 'evenings', label: 'Evenings', icon: '🌙' }
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, preferredSchedule: option.value })}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                                formData.preferredSchedule === option.value
                                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                                  : 'border-gray-200 bg-white/50 text-gray-700 hover:border-purple-300'
                              }`}
                            >
                              <div className="text-2xl mb-1">{option.icon}</div>
                              <div className="font-medium text-sm">{option.label}</div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      {/* Enhanced Action Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200"
                      >
                        <Button
                          type="button"
                          onClick={() => navigate('/skillswap', { state: { selectedProfile: profile } })}
                          variant="outline"
                          className="flex-1 py-4 rounded-2xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 font-medium text-lg"
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Back to Profile
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSendRequest}
                          disabled={sending || !formData.message.trim()}
                          className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                        >
                          {sending ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              />
                              Sending Your Request...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Send Request
                              <Heart className="w-5 h-5 text-pink-200" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>

                    {/* Enhanced Tips Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        Tips for a Great Request
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          Be specific about what you want to learn
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                          Mention your experience level
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                          Suggest a meeting format (online/offline)
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          Be friendly and professional
                        </div>
                      </div>
                    </motion.div>
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
