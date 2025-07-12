import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';

const API_BASE_URL = 'http://localhost:8080/api';
const PROFILES_PER_PAGE = 6;

export default function Landing() {
  const navigate = useNavigate();

  /* ──────────────────── Auth / UI state ──────────────────── */
  const [loggedIn, setLoggedIn]           = useState(false);
  const [currentUser, setCurrentUser]     = useState(null);

  /* ──────────────────── Filter  & paging state ────────────── */
  const [search, setSearch]               = useState('');
  const [availability, setAvailability]   = useState('');
  const [currentPage, setCurrentPage]     = useState(1);

  /* ──────────────────── Backend data state ────────────────── */
  const [profiles, setProfiles]           = useState([]);
  const [stats, setStats]                 = useState({ activeMembers: 0, successfulMatches: 0 });
  const [totalPages, setTotalPages]       = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  /* ──────────────────── UX helpers ────────────────────────── */
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  /* ──────────────────── Initial auth check ────────────────── */
  useEffect(() => {
    const token     = localStorage.getItem('authToken');
    const userJson  = localStorage.getItem('user');
    if (token && userJson) {
      setLoggedIn(true);
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);

  /* ──────────────────── Data fetch triggers ───────────────── */
  useEffect(() => { fetchProfiles(); fetchStats(); }, [currentPage, search, availability]);
  useEffect(() => { if (currentPage !== 1) setCurrentPage(1); }, [search, availability]);

  /* ──────────────────── API helpers ───────────────────────── */
  const fetchProfiles = async () => {
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams({
        page: (currentPage - 1).toString(),
        size: PROFILES_PER_PAGE.toString(),
        ...(search && { search }),
        ...(availability && { availability })
      });
      const res = await fetch(`${API_BASE_URL}/profiles?${qs}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfiles(data.profiles || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch { setError('Could not load profiles, please retry.'); }
    finally   { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stats`);
      if (res.ok) setStats(await res.json());
    } catch {/* silently ignore */}
  };

  const sendRequest = async profile => {
    if (!loggedIn) return alert('Please log in first.');
    try {
      const token = localStorage.getItem('authToken');
      const res   = await fetch(`${API_BASE_URL}/connections/request`, {
        method : 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body   : JSON.stringify({ receiverId: profile.id, message:`Hi ${profile.firstName}!` })
      });
      const data = await res.json();
      alert(data.message || 'Request processed');
    } catch { alert('Could not send request, try again.'); }
  };

  /* ──────────────────── Converters / helpers ──────────────── */
  const asCardData = u => ({
    id      : u.id,
    name    : u.fullName || `${u.firstName} ${u.lastName}`,
    photo   : u.profilePhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    rating  : u.averageRating || 0,
    swaps   : u.completedSwaps || 0,
    location: u.location || 'Unknown',
    availability: (u.availability || 'FLEXIBLE').toLowerCase(),
    offered : u.skillsOffered || [],
    wanted  : u.skillsWanted  || []
  });

  const stars = r => Array.from({length:5},(_,i)=>(
    <span key={i} className={`text-lg ${i<Math.floor(r)?'text-amber-400':i<r?'text-amber-300':'text-gray-300'}`}>★</span>
  ));

  const pages = () => {
    if (totalPages<=1) return [];
    const d=2, range=[], out=[];
    for (let i=Math.max(2,currentPage-d); i<=Math.min(totalPages-1,currentPage+d); i++) range.push(i);
    if (currentPage-d>2) out.push(1,'...'); else out.push(1);
    out.push(...range);
    if (currentPage+d<totalPages-1) out.push('...',totalPages);
    else if (totalPages>1) out.push(totalPages);
    return out;
  };

  /* ──────────────────── Top-bar handlers ─────────────────── */
  const loginRoute   = () => navigate('/auth');
  const profileRoute = () => navigate('/profile');
  const logout       = () => { localStorage.clear(); setLoggedIn(false); setCurrentUser(null); };

  /* ──────────────────── Render ────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* moving gradients */}
      <motion.div className="absolute inset-0 opacity-30"
        animate={{background:[
          "radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #f093fb 0%, transparent 50%)",
          "radial-gradient(circle at 60% 20%, #667eea 0%, transparent 50%), radial-gradient(circle at 20% 80%, #764ba2 0%, transparent 50%), radial-gradient(circle at 80% 40%, #f093fb 0%, transparent 50%)",
          "radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #f093fb 0%, transparent 50%)"
        ]}} transition={{duration:20,repeat:Infinity,ease:"linear"}}/>

      {/* floating dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({length:6}).map((_,i)=>(
          <motion.div key={i} className="absolute w-4 h-4 bg-white/10 rounded-full"
            animate={{x:[0,100,0],y:[0,-100,0],opacity:[.3,.8,.3]}}
            transition={{duration:10+i*2,repeat:Infinity,ease:"easeInOut",delay:i*2}}
            style={{left:`${20+i*15}%`,top:`${10+i*10}%`}}/>
        ))}
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">

          {/* ───── Header */}
          <motion.header initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:.6}}
            className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{rotate:180}} transition={{duration:.3}}
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <span className="text-2xl">⚡</span>
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">SkillSwap</h1>
                <p className="text-white/80 text-sm font-medium">Connect • Learn • Grow Together</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {loggedIn ? (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">🔔</Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">⚙️</Button>

                  {/* profile pic */}
                  <motion.div whileHover={{scale:1.05}} whileTap={{scale:.95}}
                    onClick={profileRoute}
                    className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 cursor-pointer hover:ring-white/50 transition-all duration-200">
                    <img src={currentUser?.profilePhoto
                      || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'}
                      alt="profile" className="w-full h-full object-cover"/>
                  </motion.div>

                  <Button onClick={logout} variant="outline"
                    className="text-white border-white/30 hover:bg-white/10 rounded-xl">Logout</Button>
                </div>
              ) : (
                <motion.div whileHover={{scale:1.05}} whileTap={{scale:.95}}>
                  <Button onClick={loginRoute}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200">
                    Sign In
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.header>

          {/* ───── Stats */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            transition={{duration:.6,delay:.2}}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {icon:'👥',label:'Active Members',value:stats.activeMembers.toLocaleString(),color:'from-blue-500 to-cyan-500'},
              {icon:'🤝',label:'Successful Matches',value:stats.successfulMatches.toLocaleString(),color:'from-emerald-500 to-teal-500'}
            ].map((s,i)=>(
              <motion.div key={i} whileHover={{scale:1.05}}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${s.color} mb-4`}>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{s.value}</h3>
                <p className="text-white/80 text-sm font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ───── Filters */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            transition={{duration:.6,delay:.4}}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <Input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search skills, technologies, expertise..."
                className="flex-1 max-w-md pl-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 bg-white/80"/>
              <select value={availability} onChange={e=>setAvailability(e.target.value)}
                className="w-48 rounded-xl border-gray-200 bg-white/80 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500">
                <option value="">All Availability</option>
                <option value="weekend">Weekends</option>
                <option value="working">Working Days</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </motion.div>

          {/* ───── Error banner */}
          {error && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6">
              <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-white font-medium">{error}</p>
                <Button onClick={fetchProfiles}
                  className="mt-2 bg-white/20 hover:bg-white/30 text-white rounded-lg">Retry</Button>
              </div>
            </motion.div>
          )}

          {/* ───── Summary */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}}
            transition={{duration:.6,delay:.6}} className="mb-6">
            <p className="text-white/80 text-sm">
              {loading ? 'Loading professionals…'
               : `Showing ${profiles.length} of ${totalElements} professionals${search ? ` matching “${search}”` : ''}`}
            </p>
          </motion.div>

          {/* ───── Profile list */}
          <AnimatePresence mode="wait">
            <motion.div key={`${currentPage}-${search}-${availability}`}
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              transition={{duration:.3}} className="grid gap-6 mb-12">
              {loading
                ? <Loader/>
                : profiles.length
                  ? profiles.map(p=><ProfileCard key={p.id} profile={asCardData(p)} />)
                  : <NoResults/>}
            </motion.div>
          </AnimatePresence>

          {/* ───── Pagination */}
          {totalPages>1 && !loading && (
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
              transition={{duration:.6,delay:.8}}
              className="flex justify-center items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage===1}
                onClick={()=>setCurrentPage(c=>c-1)}
                className="rounded-xl bg-white/80 border-gray-200 hover:bg-white disabled:opacity-50">←</Button>
              {pages().map((pg,i)=>pg==='...' ? (
                <span key={i} className="px-3 py-2 text-white/60">…</span>
              ) : (
                <Button key={i} size="sm" onClick={()=>setCurrentPage(pg)}
                  variant={currentPage===pg?'default':'outline'}
                  className={`rounded-xl min-w-[40px] ${
                    currentPage===pg
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white/80 border-gray-200 hover:bg-white'
                  }`}>{pg}</Button>
              ))}
              <Button variant="outline" size="sm" disabled={currentPage===totalPages}
                onClick={()=>setCurrentPage(c=>c+1)}
                className="rounded-xl bg-white/80 border-gray-200 hover:bg-white disabled:opacity-50">→</Button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );

  /* ───── Small sub-components ─────────────────────────────── */
  function Loader() {
    return (
      <div className="text-center py-12">
        <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm inline-block">
          <motion.div animate={{rotate:360}}
            transition={{duration:1,repeat:Infinity,ease:'linear'}}
            className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"/>
          <p className="text-white font-medium">Loading profiles…</p>
        </div>
      </div>
    );
  }

  function NoResults() {
    return (
      <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
        className="text-center py-12">
        <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm inline-block">
          <span className="text-6xl mb-4 block">👥</span>
          <h3 className="text-xl font-semibold text-white mb-2">No professionals found</h3>
          <p className="text-white/80">Try adjusting your search criteria</p>
        </div>
      </motion.div>
    );
  }

  function ProfileCard({profile}) {
    return (
      <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
        transition={{duration:.4,ease:'easeOut'}} whileHover={{y:-2}}
        className="group">
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* photo */}
              <motion.div whileHover={{scale:1.05}} transition={{type:'spring',stiffness:300}}>
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                  <img src={profile.photo} alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={e=>{ e.target.src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'; }}/>
                </div>
              </motion.div>

              {/* info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 truncate">{profile.name}</h3>
                  <div className="flex items-center gap-1">
                    {stars(profile.rating)}
                    <span className="text-sm text-gray-600 ml-1">({profile.rating.toFixed(1)})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="capitalize">📅 {profile.availability}</span>
                  <span>🏆 {profile.swaps} swaps</span>
                  <span>📍 {profile.location}</span>
                </div>

                {/* skills */}
                <SkillSection title="Skills Offered" color="emerald" skills={profile.offered}/>
                <SkillSection title="Skills Wanted"  color="blue"    skills={profile.wanted}/>
              </div>

              {/* actions */}
              <div className="flex flex-col gap-3 lg:items-end">
                <motion.div whileHover={{scale:1.02}} whileTap={{scale:.98}}>
                  <Button disabled={!loggedIn} onClick={()=>sendRequest(profile)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 min-w-[120px]">
                    💬 Request
                  </Button>
                </motion.div>
                <Button variant="outline" size="sm"
                  onClick={()=>navigate(`/profile/${profile.id}`)}
                  className="border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg">
                  View Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  function SkillSection({title,color,skills}) {
    if (!skills.length) return null;
    const badge=(s,i)=>(
      <span key={i}
        className={`inline-block text-xs font-medium px-3 py-1 rounded-full
          bg-${color}-100 text-${color}-700 border border-${color}-200`}>{s}</span>);
    return (
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">{title}</h4>
        <div className="flex flex-wrap gap-2">{skills.map(badge)}</div>
      </div>
    );
  }
}
