// pages/SkillSwap.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Star, MapPin, Calendar, Award, Users } from "lucide-react";

const SkillSwap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get profile data from navigation state or load from API
    if (location.state?.selectedProfile) {
      setProfile(location.state.selectedProfile);
      setLoading(false);
    } else {
      // If no profile in state, redirect back to landing
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleSendRequest = () => {
    // Navigate to Request form with profile data
    navigate('/request', {
      state: {
        targetProfile: profile,
        fromSkillSwap: true
      }
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? 'text-amber-400 fill-current'
            : index < rating
            ? 'text-amber-300 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const SkillBadge = ({ skill, variant = 'offered' }) => (
    <span
      className={`
        inline-block text-sm font-medium px-4 py-2 rounded-full transition-all duration-200
        ${variant === 'offered'
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
          : 'bg-blue-100 text-blue-700 border border-blue-200'
        }
      `}
    >
      {skill}
    </span>
  );

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white font-medium">Loading profile...</p>
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
            "radial-gradient(circle at 60% 20%, #667eea 0%, transparent 50%), radial-gradient(circle at 20% 80%, #764ba2 0%, transparent 50%), radial-gradient(circle at 80% 40%, #f093fb 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #f093fb 0%, transparent 50%)"
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
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>

              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  Profile Details
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Learn more about this professional
                </p>
              </div>
            </div>
          </motion.header>

          <div className="max-w-4xl mx-auto">
            {/* Main Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  {/* Profile Header */}
                  <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-200 shadow-lg mb-4">
                        <img
                          src={profile.photo}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
                          }}
                        />
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-gray-800">{profile.rating.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-gray-800">{profile.completedSwaps}</div>
                          <div className="text-xs text-gray-600">Swaps</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-gray-800">{profile.totalReviews || 0}</div>
                          <div className="text-xs text-gray-600">Reviews</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">{profile.name}</h2>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {renderStars(profile.rating)}
                        </div>
                        <span className="text-gray-600">({profile.rating.toFixed(1)})</span>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">{profile.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700 capitalize">{profile.availability}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">{profile.completedSwaps} Completed Swaps</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">Active Member</span>
                        </div>
                      </div>

                      {/* Bio */}
                      {profile.bio && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-6">
                    {/* Skills Offered */}
                    {profile.skillsOffered.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                          Skills Offered ({profile.skillsOffered.length})
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {profile.skillsOffered.map((skill, index) => (
                            <SkillBadge key={index} skill={skill} variant="offered" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills Wanted */}
                    {profile.skillsWanted.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          Skills Wanted ({profile.skillsWanted.length})
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {profile.skillsWanted.map((skill, index) => (
                            <SkillBadge key={index} skill={skill} variant="wanted" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8 pt-6 border-t">
                    <Button
                      onClick={() => navigate('/')}
                      variant="outline"
                      className="flex-1 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
                    >
                      Back to Browse
                    </Button>
                    <Button
                      onClick={handleSendRequest}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Send Skill Swap Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillSwap;
