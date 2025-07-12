import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from "lucide-react";

const SwapRequests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // ✅ Real-time data state
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // API configuration
  const API_BASE_URL = 'http://localhost:8080/api';

  // ✅ Load requests on component mount
  useEffect(() => {
    loadConnectionRequests();
  }, []);

  // ✅ Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // ✅ Load connection requests from backend
  const loadConnectionRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/connections/received`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load connection requests');
      }

      const requestsData = await response.json();
      setSwapRequests(requestsData);
    } catch (error) {
      console.error('Error loading requests:', error);
      setError('Failed to load swap requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Accept connection request
  const handleAccept = async (requestId) => {
    setActionLoading(requestId);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/connections/${requestId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setSwapRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === requestId
              ? { ...request, status: 'ACCEPTED' }
              : request
          )
        );
        alert('Connection request accepted successfully!');
      } else {
        alert(result.message || 'Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Reject connection request
  const handleReject = async (requestId) => {
    setActionLoading(requestId);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/connections/${requestId}/decline`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject request');
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setSwapRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === requestId
              ? { ...request, status: 'DECLINED' }
              : request
          )
        );
        alert('Connection request rejected successfully!');
      } else {
        alert(result.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    } finally {
      setActionLoading(null);
    }
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

  // ✅ Transform backend data to frontend format
  const transformRequest = (backendRequest) => ({
    id: backendRequest.id,
    name: backendRequest.sender?.firstName && backendRequest.sender?.lastName
      ? `${backendRequest.sender.firstName} ${backendRequest.sender.lastName}`
      : 'Unknown User',
    photo: backendRequest.sender?.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    skillOffered: backendRequest.sender?.skillsOffered?.join(', ') || 'Various Skills',
    skillWanted: backendRequest.sender?.skillsWanted?.join(', ') || 'Various Skills',
    status: backendRequest.status?.toLowerCase() || 'pending',
    rating: backendRequest.sender?.averageRating || 0,
    message: backendRequest.message || 'No message provided',
    createdAt: backendRequest.createdAt,
    location: backendRequest.sender?.location || 'Unknown Location'
  });

  // Filter requests based on search and status
  const filteredRequests = swapRequests
    .map(transformRequest)
    .filter(request => {
      const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.skillOffered.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.skillWanted.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 bg-amber-100';
      case 'declined':
        return 'text-red-600 bg-red-100';
      case 'accepted':
        return 'text-emerald-600 bg-emerald-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white font-medium">Loading swap requests...</p>
        </div>
      </div>
    );
  }

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
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>

              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"
              >
                <span className="text-2xl">🔄</span>
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  Swap Requests
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Manage your incoming skill swap requests
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/profile')}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
              >
                Profile
              </Button>
              <Button
                onClick={() => navigate('/')}
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
            {/* ✅ Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-white font-medium">{error}</p>
                  <Button
                    onClick={loadConnectionRequests}
                    className="mt-2 bg-white/20 hover:bg-white/30 text-white rounded-lg"
                  >
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by name or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 min-w-[150px]"
                    >
                      <option value="pending">Pending</option>
                      <option value="declined">Rejected</option>
                      <option value="accepted">Accepted</option>
                      <option value="all">All Status</option>
                    </select>

                    {/* ✅ Refresh Button */}
                    <Button
                      onClick={loadConnectionRequests}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-semibold"
                    >
                      🔄 Refresh
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Requests List */}
            <div className="space-y-6">
              {paginatedRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Profile Section */}
                        <div className="flex items-center gap-4 lg:w-1/3">
                          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-purple-200 shadow-lg">
                            <img
                              src={request.photo}
                              alt={request.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{request.name}</h3>
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(request.rating)}
                              <span className="text-sm text-gray-600 ml-1">({request.rating.toFixed(1)})</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                            {request.location && (
                              <p className="text-xs text-gray-500 mt-1">📍 {request.location}</p>
                            )}
                          </div>
                        </div>

                        {/* Skills Section */}
                        <div className="lg:w-1/3 space-y-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Skills Offered:</p>
                            <div className="flex flex-wrap gap-1">
                              {request.skillOffered.split(', ').map((skill, idx) => (
                                <span key={idx} className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Skills Wanted:</p>
                            <div className="flex flex-wrap gap-1">
                              {request.skillWanted.split(', ').map((skill, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {request.message}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="lg:w-1/3 flex flex-col justify-center gap-3">
                          {request.status === 'pending' ? (
                            <>
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                  onClick={() => handleAccept(request.id)}
                                  disabled={actionLoading === request.id}
                                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                                >
                                  {actionLoading === request.id ? 'Accepting...' : 'Accept'}
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                  onClick={() => handleReject(request.id)}
                                  disabled={actionLoading === request.id}
                                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                                >
                                  {actionLoading === request.id ? 'Rejecting...' : 'Reject'}
                                </Button>
                              </motion.div>
                            </>
                          ) : (
                            <div className="text-center">
                              <span className={`text-lg font-semibold capitalize ${
                                request.status === 'accepted' ? 'text-emerald-600' : 'text-red-600'
                              }`}>
                                {request.status}
                              </span>
                              <p className="text-sm text-gray-500 mt-1">
                                {request.status === 'accepted' ? 'Request has been accepted' : 'Request has been rejected'}
                              </p>
                              {request.createdAt && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex justify-center items-center gap-4 mt-8"
              >
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-white text-purple-600'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm'
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* Empty State */}
            {filteredRequests.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No requests found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'You don\'t have any swap requests yet.'}
                    </p>
                    <Button
                      onClick={loadConnectionRequests}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-semibold"
                    >
                      🔄 Refresh Requests
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapRequests;
