import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Award,
  Users,
  Mail,
  Clock,
  MessageCircle,
  Shield,
  Heart,
  ThumbsUp,
  Eye,
  X
} from "lucide-react";

const SkillSwap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileId } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    checkAuthStatus();
    loadProfileData();
  }, [location.state, navigate, profileId]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  };

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (location.state?.selectedProfile) {
        setProfile(location.state.selectedProfile);
        setLoading(false);
        return;
      }

      if (!profileId) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`);

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const profileData = await response.json();

      const convertedProfile = {
        id: profileData.id,
        name: `${profileData.firstName} ${profileData.lastName}`,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        skillsOffered: profileData.skillsOffered || [],
        skillsWanted: profileData.skillsWanted || [],
        availability: profileData.availability?.toLowerCase() || 'flexible',
        photo: profileData.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        rating: profileData.averageRating || 0,
        completedSwaps: profileData.completedSwaps || 0,
        totalReviews: profileData.totalReviews || 0,
        location: profileData.location || 'Location not specified',
        bio: profileData.bio || 'No bio available',
        joinedDate: profileData.joinedDate,
        isVerified: profileData.isVerified || false,
        responseRate: profileData.responseRate || 95,
        achievements: profileData.achievements || []
      };

      setProfile(convertedProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = () => {
    if (!isLoggedIn) {
      alert("Please log in to send a skill swap request.");
      navigate('/auth');
      return;
    }

    navigate('/request', {
      state: {
        targetProfile: profile,
        fromSkillSwap: true
      }
    });
  };

  const handleSubmitRating = async () => {
    if (!isLoggedIn) {
      alert("Please log in to rate this user.");
      return;
    }

    if (userRating === 0) {
      alert("Please select a rating.");
      return;
    }

    setIsSubmittingRating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profile.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          rating: userRating,
          comment: ratingComment
        })
      });

      if (response.ok) {
        // Update profile with new rating
        const updatedProfile = {
          ...profile,
          totalReviews: profile.totalReviews + 1,
          rating: ((profile.rating * profile.totalReviews) + userRating) / (profile.totalReviews + 1)
        };
        setProfile(updatedProfile);
        setShowRatingModal(false);
        setUserRating(0);
        setRatingComment("");
        alert("Thank you for your rating!");
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const renderStars = (rating, interactive = false, size = "w-5 h-5") => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} cursor-pointer transition-all duration-200 ${
          index < Math.floor(interactive ? (hoverRating || userRating) : rating)
            ? 'text-amber-400 fill-current'
            : index < (interactive ? (hoverRating || userRating) : rating)
            ? 'text-amber-300 fill-current'
            : 'text-gray-300 hover:text-amber-200'
        }`}
        onClick={() => interactive && setUserRating(index + 1)}
        onMouseEnter={() => interactive && setHoverRating(index + 1)}
        onMouseLeave={() => interactive && setHoverRating(0)}
      />
    ));
  };

  const SkillBadge = ({ skill, variant = 'offered' }) => (
    <motion.span
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        inline-block text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 cursor-pointer
        ${variant === 'offered'
          ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-300 hover:from-emerald-200 hover:to-emerald-300 shadow-sm hover:shadow-md'
          : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300 hover:from-blue-200 hover:to-blue-300 shadow-sm hover:shadow-md'
        }
      `}
    >
      {skill}
    </motion.span>
  );

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently joined';
    const date = new Date(dateString);
    return `Member since ${date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })}`;
  };

  // Loading State
  if (loading) {
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
          <p className="text-white font-medium text-lg">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 p-8 rounded-3xl backdrop-blur-lg border border-white/20 text-center max-w-md"
        >
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-semibold text-white mb-2">Profile Not Found</h3>
          <p className="text-white/80 mb-6">{error}</p>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/')}
              className="bg-white/20 hover:bg-white/30 text-white rounded-xl flex-1 backdrop-blur-sm"
            >
              Back to Home
            </Button>
            <Button
              onClick={loadProfileData}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex-1"
            >
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex items-center justify-center">
        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-lg border border-white/20 text-center">
          <p className="text-white font-medium">Profile not found</p>
          <Button
            onClick={() => navigate('/')}
            className="mt-4 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm"
          >
            Back to Home
          </Button>
        </div>
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
            "radial-gradient(circle at 20% 50%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%), radial-gradient(circle at 40% 80%, #c084fc 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header */}
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
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200 border border-white/30"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>

              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  Profile Details
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Connect with {profile.firstName} and explore skills together
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-2"
            >
              <Button
                onClick={() => setShowRatingModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2 flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Rate User
              </Button>
            </motion.div>
          </motion.header>

          <div className="max-w-5xl mx-auto">
            {/* Enhanced Main Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Profile Header Card */}
              <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center lg:items-start"
                    >
                      <div className="relative">
                        <div className="w-40 h-40 rounded-3xl overflow-hidden ring-4 ring-purple-200 shadow-2xl mb-4">
                          <img
                            src={profile.photo}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
                            }}
                          />
                        </div>
                        {profile.isVerified && (
                          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-full">
                            <Shield className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Enhanced Quick Stats */}
                      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 text-center shadow-lg"
                        >
                          <div className="text-3xl font-bold text-purple-800">{profile.rating.toFixed(1)}</div>
                          <div className="text-sm text-purple-600 font-medium">Rating</div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl p-4 text-center shadow-lg"
                        >
                          <div className="text-3xl font-bold text-emerald-800">{profile.completedSwaps}</div>
                          <div className="text-sm text-emerald-600 font-medium">Swaps</div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4 text-center shadow-lg"
                        >
                          <div className="text-3xl font-bold text-blue-800">{profile.totalReviews}</div>
                          <div className="text-sm text-blue-600 font-medium">Reviews</div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl p-4 text-center shadow-lg"
                        >
                          <div className="text-3xl font-bold text-amber-800">{profile.responseRate}%</div>
                          <div className="text-sm text-amber-600 font-medium">Response</div>
                        </motion.div>
                      </div>
                    </motion.div>

                    <div className="flex-1 space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <h2 className="text-4xl font-bold text-gray-800">{profile.name}</h2>
                          {profile.isVerified && (
                            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              <Shield className="w-4 h-4" />
                              Verified
                            </div>
                          )}
                        </div>

                        {/* Enhanced Rating Display */}
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex items-center gap-1">
                            {renderStars(profile.rating, false, "w-6 h-6")}
                          </div>
                          <span className="text-gray-600 font-medium">({profile.rating.toFixed(1)} • {profile.totalReviews} reviews)</span>
                        </div>

                        {/* Enhanced Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                          >
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">{profile.location}</span>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                          >
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium capitalize">{profile.availability} availability</span>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                          >
                            <Award className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">{profile.completedSwaps} Completed Swaps</span>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                          >
                            <Clock className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">{formatJoinDate(profile.joinedDate)}</span>
                          </motion.div>
                        </div>
                      </div>

                      {/* Enhanced Bio */}
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          About {profile.firstName}
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{profile.bio}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Skills Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skills Offered */}
                {profile.skillsOffered.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl rounded-3xl overflow-hidden h-full">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                          Skills Offered
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                            {profile.skillsOffered.length}
                          </span>
                        </h3>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {profile.skillsOffered.map((skill, index) => (
                            <SkillBadge key={index} skill={skill} variant="offered" />
                          ))}
                        </div>
                        <p className="text-gray-600 italic">
                          {profile.firstName} can teach you these amazing skills
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Skills Wanted */}
                {profile.skillsWanted.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl rounded-3xl overflow-hidden h-full">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          Skills Wanted
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {profile.skillsWanted.length}
                          </span>
                        </h3>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {profile.skillsWanted.map((skill, index) => (
                            <SkillBadge key={index} skill={skill} variant="wanted" />
                          ))}
                        </div>
                        <p className="text-gray-600 italic">
                          {profile.firstName} is eager to learn these skills
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Enhanced Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="flex-1 py-4 rounded-2xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 text-lg font-medium"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Browse
                      </Button>
                      <Button
                        onClick={handleSendRequest}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        {isLoggedIn ? 'Send Skill Swap Request' : 'Login to Send Request'}
                      </Button>
                      <Button
                        onClick={() => setShowRatingModal(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Star className="w-5 h-5 mr-2" />
                        Rate
                      </Button>
                    </div>

                    {/* Enhanced Additional Info */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Shield className="w-5 h-5 text-purple-500" />
                        <span>
                          This profile is public and verified.
                          {isLoggedIn ? ' You can send requests and rate this user.' : ' Please log in to connect and rate.'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Rate {profile.firstName}</h3>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="flex justify-center items-center gap-2 mb-4">
                  {renderStars(userRating, true, "w-8 h-8")}
                </div>
                <p className="text-gray-600">
                  {userRating === 0 && "Select a rating"}
                  {userRating === 1 && "Poor"}
                  {userRating === 2 && "Fair"}
                  {userRating === 3 && "Good"}
                  {userRating === 4 && "Very Good"}
                  {userRating === 5 && "Excellent"}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (optional)
                </label>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowRatingModal(false)}
                  variant="outline"
                  className="flex-1 py-3 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitRating}
                  disabled={userRating === 0 || isSubmittingRating}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillSwap;
