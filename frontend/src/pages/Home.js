import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Avatar } from "../components/ui/avatar";

const Home = ({ onNavigate }) => {
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 6;

  const dummyProfiles = [
    {
      id: 1,
      name: "Alice Johnson",
      skillsOffered: ["React", "Node.js", "TypeScript"],
      skillsWanted: ["UI Design", "Figma", "Adobe XD"],
      availability: "weekend",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.5,
      completedSwaps: 12,
      location: "San Francisco, CA"
    },
    {
      id: 2,
      name: "Bob Chen",
      skillsOffered: ["Python", "Machine Learning", "TensorFlow"],
      skillsWanted: ["Video Editing", "After Effects"],
      availability: "working",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      rating: 4.8,
      completedSwaps: 18,
      location: "New York, NY"
    },
    {
      id: 3,
      name: "Catherine Williams",
      skillsOffered: ["Angular", "RxJS", "GraphQL"],
      skillsWanted: ["Tailwind CSS", "SASS"],
      availability: "weekend",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      rating: 4.2,
      completedSwaps: 8,
      location: "Austin, TX"
    },
    {
      id: 4,
      name: "David Rodriguez",
      skillsOffered: ["Java", "Spring Boot", "Microservices"],
      skillsWanted: ["Kotlin", "Android Development"],
      availability: "working",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      rating: 4.6,
      completedSwaps: 15,
      location: "Seattle, WA"
    },
    {
      id: 5,
      name: "Eva Martinez",
      skillsOffered: ["Go", "Kubernetes", "Docker"],
      skillsWanted: ["DevOps", "AWS", "Terraform"],
      availability: "weekend",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      rating: 4.9,
      completedSwaps: 22,
      location: "Denver, CO"
    },
    {
      id: 6,
      name: "Frank Thompson",
      skillsOffered: ["PHP", "Laravel", "Vue.js"],
      skillsWanted: ["React", "Next.js"],
      availability: "working",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      rating: 4.1,
      completedSwaps: 9,
      location: "Chicago, IL"
    },
    {
      id: 7,
      name: "Grace Kim",
      skillsOffered: ["UX Design", "Figma", "Sketch"],
      skillsWanted: ["Frontend Development", "CSS"],
      availability: "flexible",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      rating: 4.7,
      completedSwaps: 14,
      location: "Los Angeles, CA"
    },
    {
      id: 8,
      name: "Henry Lee",
      skillsOffered: ["Data Science", "SQL", "Tableau"],
      skillsWanted: ["Machine Learning", "Python"],
      availability: "weekend",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      rating: 4.4,
      completedSwaps: 11,
      location: "Boston, MA"
    }
  ];

  const filteredProfiles = dummyProfiles.filter((profile) => {
    const searchLower = search.trim().toLowerCase();
    const skills = [...profile.skillsOffered, ...profile.skillsWanted].map((s) => s.toLowerCase());
    const matchesSearch =
      searchLower === "" ||
      skills.some((skill) => skill.includes(searchLower)) ||
      profile.name.toLowerCase().includes(searchLower);
    const matchesAvailability =
      availability === "" || profile.availability === availability;
    return matchesSearch && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  const handleRequest = (profile) => {
    // Navigate to the profile page with the selected profile data
    onNavigate('profile', profile);
  };

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
                    />
                  </div>
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{profile.name}</h3>
                    <div className="flex items-center gap-1">
                      {renderStars(profile.rating)}
                      <span className="text-sm text-gray-600 ml-1">({profile.rating})</span>
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
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-3">
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
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex flex-col gap-3 lg:items-end">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => handleRequest(profile)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 min-w-[120px]"
                  >
                    💬 Request
                  </Button>
                </motion.div>
                
                <Button 
                  onClick={() => onNavigate('profile', profile)}
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
              <Button 
                onClick={() => onNavigate('swapRequests')}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
              >
                Swap Requests
              </Button>
              <motion.button
                onClick={() => onNavigate('profile')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30 hover:ring-white/50 transition-all duration-200"
              >
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </motion.button>
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
              { icon: "👥", label: "Active Members", value: "2,547", color: "from-blue-500 to-cyan-500" },
              { icon: "🤝", label: "Successful Matches", value: "1,284", color: "from-emerald-500 to-teal-500" }
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
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <Input
                  placeholder="Search skills, technologies, expertise..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
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

          {/* Results Summary */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-6"
          >
            <p className="text-white/80 text-sm">
              Showing {currentProfiles.length} of {filteredProfiles.length} professionals
              {search && ` matching "${search}"`}
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
              {currentProfiles.length > 0 ? (
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
          {totalPages > 1 && (
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

export default Home;