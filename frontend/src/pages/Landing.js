import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Avatar } from "../components/ui/avatar";

const Landing = () => {
  const navigate = useNavigate();

  // Authentication and UI state
  const [loggedIn, setLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 6;

  // API data state
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeMembers: 0,
    successfulMatches: 0
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // User data state
  const [currentUser, setCurrentUser] = useState(null);

  // API configuration
  const API_BASE_URL = 'http://localhost:8080/api';

  // Check authentication status and load user data
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setLoggedIn(true);
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Load data when component mounts and when search/filter changes
  useEffect(() => {
    loadProfiles();
    loadStats();
  }, [currentPage, search, availability]);

  // Reset to first page when search or availability changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [search, availability]);

  // API service functions
  const profileService = {
    async getProfiles(page = 0, size = 6, search = '', availability = '') {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(search && { search }),
        ...(availability && { availability })
      });

      const response = await fetch(`${API_BASE_URL}/profiles?${params}`);
      if (!response.ok) throw new Error('Failed to fetch profiles');
      return response.json();
    },

    async getPlatformStats() {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },

    async sendConnectionRequest(receiverId, message, token) {
      const response = await fetch(`${API_BASE_URL}/connections/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId, message })
      });

      if (!response.ok) throw new Error('Failed to send connection request');
      return response.json();
    }
  };

  // Load profiles from backend API
  const loadProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileService.getProfiles(
        currentPage - 1, // Backend uses 0-based pagination
        profilesPerPage,
        search.trim(),
        availability
      );

      setProfiles(response.profiles || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('Error loading profiles:', error);
      setError('Failed to load profiles. Please try again.');
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Load platform statistics
  const loadStats = async () => {
    try {
      const statsData = await profileService.getPlatformStats();
      setStats({
        activeMembers: statsData.activeMembers || 0,
        successfulMatches: statsData.successfulMatches || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // Keep default values if stats fail to load
    }
  };

  // Handle connection request
  const handleRequest = (profile) => {
    if (!loggedIn) {
      alert("Please log in to send a request.");
      return;
    }

    // Navigate to swap page with profile data
    navigate('/skillswap', {
      state: {
        selectedProfile: profile,
        action: 'request'
      }
    });
  };

  // Handle profile picture click
  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Handle sign in
  const handleSignIn = () => {
    navigate('/auth');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setCurrentUser(null);
  };

  // Convert backend profile data to match frontend expectations
  const convertProfile = (backendProfile) => ({
    id: backendProfile.id,
    name: backendProfile.fullName || `${backendProfile.firstName} ${backendProfile.lastName}`,
    firstName: backendProfile.firstName,
    lastName: backendProfile.lastName,
    skillsOffered: backendProfile.skillsOffered || [],
    skillsWanted: backendProfile.skillsWanted || [],
    availability: backendProfile.availability?.toLowerCase() || 'flexible',
    photo: backendProfile.profilePhoto || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face`,
    rating: backendProfile.averageRating || 0,
    completedSwaps: backendProfile.completedSwaps || 0,
    location: backendProfile.location || 'Unknown'
  });

  // Get current profiles for display
  const currentProfiles = profiles.map(convertProfile);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < Math.floor(rating)
            ? 'text-amber-400'
            : index < rating
            ? 'text-amber-300'
            : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const SkillBadge = ({ skill, variant = 'offered' }) => {
    return (
      <span
        className={`
          inline-block text-xs font-medium px-3 py-1 rounded-full transition-all duration-200 hover:scale-105
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

  const ProfileCard = ({ profile }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Section */}
              <div className="flex items-start gap-4 flex-1">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face`;
                      }}
                    />
                  </div>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{profile.name}</h3>
                    <div className="flex items-center gap-1">
                      {renderStars(profile.rating)}
                      <span className="text-sm text-gray-600 ml-1">({profile.rating.toFixed(1)})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span className="capitalize">{profile.availability}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🏆</span>
                      <span>{profile.completedSwaps} swaps</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{profile.location}</span>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-3">
                    {profile.skillsOffered.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          Skills Offered
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skillsOffered.map((skill, index) => (
                            <SkillBadge key={index} skill={skill} variant="offered" />
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.skillsWanted.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Skills Wanted
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skillsWanted.map((skill, index) => (
                            <SkillBadge key={index} skill={skill} variant="wanted" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex flex-col gap-3 lg:items-end">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => handleRequest(profile)}
                    disabled={!loggedIn}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                  >
                    💬 Request
                  </Button>
                </motion.div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg"
                >
                  View Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
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
            className="flex justify-between items-center mb-12"
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
                  SkillSwap
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Connect • Learn • Grow Together
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {loggedIn ? (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">
                    🔔
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">
                    ⚙️
                  </Button>

                  {/* Clickable profile picture */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProfileClick}
                    className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 cursor-pointer hover:ring-white/50 transition-all duration-200"
                  >
                    <img
                      src={currentUser?.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10 rounded-xl"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSignIn}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.header>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {[
              { icon: "👥", label: "Active Members", value: stats.activeMembers?.toLocaleString() || "0", color: "from-blue-500 to-cyan-500" },
              { icon: "🤝", label: "Successful Matches", value: stats.successfulMatches?.toLocaleString() || "0", color: "from-emerald-500 to-teal-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Search Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Search skills, technologies, expertise..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-4 pr-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
                />
              </div>

              <div className="flex gap-3 items-center">
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-48 rounded-xl border-gray-200 bg-white/80 px-4 py-3 text-sm"
                >
                  <option value="">All Availability</option>
                  <option value="weekend">Weekends</option>
                  <option value="working">Working Days</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-white font-medium">{error}</p>
                <Button
                  onClick={loadProfiles}
                  className="mt-2 bg-white/20 hover:bg-white/30 text-white rounded-lg"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}

          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-6"
          >
            <p className="text-white/80 text-sm">
              {loading ? (
                "Loading professionals..."
              ) : (
                <>
                  Showing {currentProfiles.length} of {totalElements} professionals
                  {search && ` matching "${search}"`}
                </>
              )}
            </p>
          </motion.div>

          {/* Profile Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 mb-12"
            >
              {loading ? (
                // Loading state
                <div className="text-center py-12">
                  <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm inline-block">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
                    />
                    <p className="text-white font-medium">Loading profiles...</p>
                  </div>
                </div>
              ) : currentProfiles.length > 0 ? (
                currentProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm inline-block">
                    <span className="text-6xl mb-4 block">👥</span>
                    <h3 className="text-xl font-semibold text-white mb-2">No professionals found</h3>
                    <p className="text-white/80">Try adjusting your search criteria</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex justify-center items-center gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl bg-white/80 border-gray-200 hover:bg-white"
              >
                ←
              </Button>

              {getVisiblePages().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-white/60">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-xl min-w-[40px] ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-white/80 border-gray-200 hover:bg-white'
                      }`}
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-xl bg-white/80 border-gray-200 hover:bg-white"
              >
                →
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
