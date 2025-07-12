import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const SkillSwap = ({ onNavigate }) => {
  const [userRating, setUserRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  // Sample profile data - in real app this would come from props/routing
  const profileData = {
    id: 1,
    name: "Marc Demo",
    skillsOffered: ["React", "Node.js", "TypeScript", "JavaScript", "MongoDB"],
    skillsWanted: ["UI Design", "Figma", "Adobe XD", "Photoshop"],
    availability: "weekend",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    rating: 4.5,
    completedSwaps: 12,
    location: "San Francisco, CA",
    bio: "Passionate full-stack developer with 5+ years of experience. Love to share knowledge and learn new design skills.",
    joinedDate: "January 2023"
  };

  const handleRatingSubmit = () => {
    if (userRating === 0) {
      alert("Please select a rating!");
      return;
    }
    alert(`Rating submitted: ${userRating} stars\nFeedback: ${feedback}`);
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-2xl cursor-${interactive ? 'pointer' : 'default'} transition-all duration-200 ${
          index < Math.floor(rating) 
            ? 'text-amber-400' 
            : index < rating 
            ? 'text-amber-300' 
            : 'text-gray-300'
        } ${interactive ? 'hover:text-amber-400 hover:scale-110' : ''}`}
        onClick={() => interactive && onStarClick && onStarClick(index + 1)}
      >
        ★
      </span>
    ));
  };

  const SkillBadge = ({ skill, variant = 'offered' }) => {
    return (
      <span 
        className={`
          inline-block text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 hover:scale-105
          ${variant === 'offered' 
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200' 
            : 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
          }
        `}
      >
        {skill}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background Elements */}
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

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/10 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`
            }}
          />
        ))}
      </div>

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
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"
              >
                <span className="text-2xl">⚡</span>
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  Skill Swap Platform
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Connect • Learn • Grow Together
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                onClick={() => onNavigate('request', profileData)}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
              >
                Send Request
              </Button>
              <Button 
                onClick={() => onNavigate('home')}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
              >
                Home
              </Button>
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.header>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Details - Now Full Width on Left */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="mb-4"
                      >
                        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-200 shadow-lg">
                          <img 
                            src={profileData.photo} 
                            alt={profileData.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </motion.div>
                      
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">{profileData.name}</h2>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(profileData.rating)}
                        <span className="text-sm text-gray-600 ml-2">({profileData.rating})</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span>📍 {profileData.location}</span>
                        <span>🏆 {profileData.completedSwaps} swaps</span>
                        <span>📅 {profileData.availability}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">{profileData.bio}</p>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                          Skills Offered
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profileData.skillsOffered.map((skill, index) => (
                            <SkillBadge key={index} skill={skill} variant="offered" />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          Skills Wanted
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profileData.skillsWanted.map((skill, index) => (
                            <SkillBadge key={index} skill={skill} variant="wanted" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center items-center mt-6">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          onClick={() => onNavigate('request', profileData)}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          💬 Send Request
                        </Button>
                      </motion.div>
                      
                      {/* <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                          💬 Connect Now
                        </Button>
                      </motion.div> */}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Rating and Feedback Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Rating and Feedback</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Rate this user
                        </label>
                        <div className="flex gap-1">
                          {renderStars(userRating, true, setUserRating)}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Leave feedback
                        </label>
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Share your experience working with this person..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                        />
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleRatingSubmit}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          Submit Rating
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Info Card */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden mt-6">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-purple-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-600">{profileData.completedSwaps}</div>
                        <div className="text-sm text-gray-600">Completed Swaps</div>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-emerald-600">{profileData.rating}</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-600">{profileData.skillsOffered.length}</div>
                        <div className="text-sm text-gray-600">Skills Offered</div>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-amber-600">{profileData.skillsWanted.length}</div>
                        <div className="text-sm text-gray-600">Skills Wanted</div>
                      </div>
                    </div>
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

export default SkillSwap;