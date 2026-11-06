import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiViewGrid, 
  HiUsers, 
  HiCalendar, 
  HiBadgeCheck, 
  HiDocumentText, 
  HiPhotograph, 
  HiMail, 
  HiCog, 
  HiShieldCheck, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiSearch, 
  HiFilter, 
  HiExternalLink, 
  HiLogout, 
  HiCheck, 
  HiX, 
  HiExclamationCircle, 
  HiSparkles,
  HiEye,
  HiMenuAlt2,
  HiClipboardCheck,
  HiAcademicCap,
  HiPhone,
  HiDocumentDownload,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiUserGroup
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { 
  getTeam, createMember, updateMember, deleteMember,
  getEvents, createEvent, updateEvent, deleteEvent,
  getAchievements, createAchievement, updateAchievement, deleteAchievement,
  getBlogs, createBlog, updateBlog, deleteBlog,
  getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem,
  getContactInfo, updateContactInfo, getContactSubmissions, deleteContactSubmission,
  getUsers, updateUserRole, deleteUser,
  getApplications, updateApplicationStatus, deleteApplication
} from '../../services/api';
import SEOHead from '../../components/SEOHead';
import logoImg from '../../assets/codetrooperslogo.png';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Active section tab
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [contactData, setContactData] = useState({ info: {}, faq: [] });
  const [usersList, setUsersList] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [appDomainFilter, setAppDomainFilter] = useState('all');

  // Modal states
  const [modalType, setModalType] = useState(null); // 'member', 'event', 'achievement', 'blog', 'gallery', 'deleteConfirm', 'messageView'
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type, id, title }
  const [viewMessage, setViewMessage] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  // Candidate Field Helpers (compatible with Supabase snake_case, JoinUs camelCase, and legacy schemas)
  const getCandidateName = (app) => app?.name || app?.fullName || app?.full_name || 'Candidate';
  const getCandidateEmail = (app) => app?.email || app?.collegeEmail || app?.college_email || '—';
  const getCandidatePhone = (app) => app?.phone || app?.phone_number || '';
  const getCandidateUsn = (app) => app?.usn || '—';
  const getCandidateBranch = (app) => app?.branch || app?.department || '—';
  const getCandidateSemester = (app) => {
    if (app?.semester) {
      return String(app.semester).toLowerCase().includes('sem') ? app.semester : `Sem ${app.semester}`;
    }
    return app?.year || '—';
  };
  const getCandidateSkills = (app) => app?.skills || app?.skillsExperience || app?.skills_experience || '';
  const getCandidateMotivation = (app) => app?.whyJoin || app?.motivation || app?.why_join || '';
  const getCandidateResume = (app) => 
    app?.resumeUrl || 
    app?.resume_url || 
    app?.resume?.driveViewLink ||
    app?.resume?.webViewLink ||
    (typeof app?.resume === 'string' ? app.resume : null);
  const getCandidateDomains = (app) => {
    if (Array.isArray(app?.domains) && app.domains.length > 0) return app.domains;
    if (typeof app?.domain === 'string' && app.domain.trim()) return [app.domain];
    return ['General Track'];
  };
  const getCandidateDate = (app) => app?.appliedAt || app?.created_at || app?.createdAt || null;
  const getCandidateId = (app) => app?.id || app?._id || app?.application_id || '';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Safe tab change that resets tab-specific search & filters to prevent filter bleed
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchQuery('');
    setFilterCategory('all');
    setSidebarOpen(false);
  };

  // Initial Data Fetch
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        teamRes, 
        eventsRes, 
        achieveRes, 
        blogsRes, 
        galleryRes, 
        contactRes, 
        subRes,
        usersRes,
        appsRes
      ] = await Promise.allSettled([
        getTeam(),
        getEvents(),
        getAchievements(),
        getBlogs(),
        getGallery(),
        getContactInfo(),
        getContactSubmissions(),
        getUsers(),
        getApplications()
      ]);

      if (teamRes.status === 'fulfilled') setMembers(teamRes.value.data?.members || []);
      if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value.data?.events || []);
      if (achieveRes.status === 'fulfilled') setAchievements(achieveRes.value.data?.items || []);
      if (blogsRes.status === 'fulfilled') setBlogs(blogsRes.value.data?.blogs || []);
      if (galleryRes.status === 'fulfilled') setGallery(galleryRes.value.data?.items || []);
      if (contactRes.status === 'fulfilled') setContactData(contactRes.value.data || { info: {}, faq: [] });
      if (subRes.status === 'fulfilled') setSubmissions(subRes.value.data?.submissions || []);
      if (usersRes.status === 'fulfilled') setUsersList(usersRes.value.data?.users || []);
      if (appsRes.status === 'fulfilled') {
        const d = appsRes.value.data;
        const list = Array.isArray(d) ? d : (d?.applications || d?.data || []);
        setApplications(list);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showToast('Error syncing some records from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Form State for Modals
  const [formData, setFormData] = useState({});

  const openCreateModal = (type) => {
    setModalType(type);
    setEditItem(null);
    setFormData(getInitialFormData(type));
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditItem(item);
    setFormData(mapItemToFormData(type, item));
  };

  const getInitialFormData = (type) => {
    switch (type) {
      case 'member':
        return {
          name: '',
          position: '',
          department: 'CSE',
          category: 'member',
          team: '',
          photo: '',
          linkedin: '',
          github: '',
          email: ''
        };
      case 'event':
        return {
          title: '',
          type: 'workshops',
          status: 'upcoming',
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM - 01:00 PM',
          venue: 'Seminar Hall A',
          organizer: 'CodeTroopers Club',
          description: '',
          banner: '',
          galleryUrls: ''
        };
      case 'achievement':
        return {
          title: '',
          category: 'community-impact',
          date: new Date().toISOString().split('T')[0],
          description: '',
          image: '',
          tags: '',
          highlights: ''
        };
      case 'blog':
        return {
          title: '',
          slug: '',
          author: user?.name || 'CodeTroopers Core',
          authorRole: 'Editorial Wing',
          date: new Date().toISOString().split('T')[0],
          readTime: '5 min read',
          category: 'Engineering',
          coverImage: '',
          summary: '',
          content: '',
          tags: '',
          status: 'published'
        };
      case 'gallery':
        return {
          title: '',
          category: 'workshops',
          cover: '',
          images: ''
        };
      default:
        return {};
    }
  };

  const mapItemToFormData = (type, item) => {
    switch (type) {
      case 'member':
        return {
          name: item.name || '',
          position: Array.isArray(item.position) ? item.position.join(', ') : item.position || '',
          department: item.department || 'CSE',
          category: item.category || 'member',
          team: Array.isArray(item.team) ? item.team.join(', ') : item.team || '',
          photo: item.photo || '',
          linkedin: item.linkedin || '',
          github: item.github || '',
          email: item.email || ''
        };
      case 'event':
        return {
          title: item.title || '',
          type: item.type || 'workshops',
          status: item.status || 'upcoming',
          date: item.date || '',
          time: item.time || '',
          venue: item.venue || '',
          organizer: item.organizer || '',
          description: item.description || '',
          banner: item.banner || '',
          galleryUrls: Array.isArray(item.gallery) ? item.gallery.join('\n') : ''
        };
      case 'achievement':
        return {
          title: item.title || '',
          category: item.category || 'community-impact',
          date: item.date || '',
          description: item.description || '',
          image: Array.isArray(item.image) ? item.image[0] : item.image || '',
          tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
          highlights: Array.isArray(item.highlights) ? item.highlights.join('\n') : item.highlights || ''
        };
      case 'blog':
        return {
          title: item.title || '',
          slug: item.slug || '',
          author: item.author || '',
          authorRole: item.authorRole || '',
          date: item.date || '',
          readTime: item.readTime || '',
          category: item.category || 'Engineering',
          coverImage: item.coverImage || '',
          summary: item.summary || '',
          content: item.content || '',
          tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
          status: item.status || 'published'
        };
      case 'gallery':
        return {
          title: item.title || '',
          category: item.category || 'workshops',
          cover: item.cover || '',
          images: Array.isArray(item.images) ? item.images.join('\n') : ''
        };
      default:
        return item;
    }
  };

  // Form Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'member') {
        const payload = {
          ...formData,
          position: formData.position ? (formData.position.includes(',') ? formData.position.split(',').map(s => s.trim()) : formData.position) : '',
          team: formData.team ? (formData.team.includes(',') ? formData.team.split(',').map(s => s.trim()) : formData.team) : ''
        };
        if (editItem) {
          const res = await updateMember(editItem.id, payload);
          setMembers(prev => prev.map(m => m.id === editItem.id ? res.data : m));
          showToast(`Updated member: ${payload.name}`);
        } else {
          const res = await createMember(payload);
          setMembers(prev => [res.data, ...prev]);
          showToast(`Added new member: ${payload.name}`);
        }
      } else if (modalType === 'event') {
        const galleryArr = formData.galleryUrls
          ? formData.galleryUrls.split('\n').map(s => s.trim()).filter(Boolean)
          : [];
        const payload = {
          ...formData,
          gallery: galleryArr
        };
        delete payload.galleryUrls;
        if (editItem) {
          const res = await updateEvent(editItem.id, payload);
          setEvents(prev => prev.map(ev => ev.id === editItem.id ? res.data : ev));
          showToast(`Updated event: ${payload.title}`);
        } else {
          const res = await createEvent(payload);
          setEvents(prev => [res.data, ...prev]);
          showToast(`Created new event: ${payload.title}`);
        }
      } else if (modalType === 'achievement') {
        const tagsArr = formData.tags
          ? formData.tags.split(',').map(s => s.trim()).filter(Boolean)
          : [];
        const highlightsArr = formData.highlights
          ? formData.highlights.split('\n').map(s => s.trim()).filter(Boolean)
          : [];
        const payload = {
          ...formData,
          tags: tagsArr,
          highlights: highlightsArr
        };
        if (editItem) {
          const res = await updateAchievement(editItem.id, payload);
          setAchievements(prev => prev.map(a => a.id === editItem.id ? res.data : a));
          showToast(`Updated achievement: ${payload.title}`);
        } else {
          const res = await createAchievement(payload);
          setAchievements(prev => [res.data, ...prev]);
          showToast(`Created new achievement: ${payload.title}`);
        }
      } else if (modalType === 'blog') {
        const tagsArr = formData.tags
          ? formData.tags.split(',').map(s => s.trim()).filter(Boolean)
          : [];
        const payload = {
          ...formData,
          tags: tagsArr
        };
        if (editItem) {
          const res = await updateBlog(editItem.id, payload);
          setBlogs(prev => prev.map(b => b.id === editItem.id ? res.data : b));
          showToast(`Updated blog: ${payload.title}`);
        } else {
          const res = await createBlog(payload);
          setBlogs(prev => [res.data, ...prev]);
          showToast(`Published blog: ${payload.title}`);
        }
      } else if (modalType === 'gallery') {
        const imagesArr = formData.images
          ? formData.images.split('\n').map(s => s.trim()).filter(Boolean)
          : [];
        const payload = {
          ...formData,
          images: imagesArr
        };
        if (editItem) {
          const res = await updateGalleryItem(editItem.id, payload);
          setGallery(prev => prev.map(g => g.id === editItem.id ? res.data : g));
          showToast(`Updated gallery: ${payload.title}`);
        } else {
          const res = await createGalleryItem(payload);
          setGallery(prev => [res.data, ...prev]);
          showToast(`Created gallery collection: ${payload.title}`);
        }
      }

      setModalType(null);
      setEditItem(null);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Failed to save changes', 'error');
    }
  };

  // Delete Handler
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id, title } = deleteTarget;
    try {
      if (type === 'member') {
        await deleteMember(id);
        setMembers(prev => prev.filter(m => m.id !== id));
        showToast(`Deleted member: ${title}`);
      } else if (type === 'event') {
        await deleteEvent(id);
        setEvents(prev => prev.filter(e => e.id !== id));
        showToast(`Deleted event: ${title}`);
      } else if (type === 'achievement') {
        await deleteAchievement(id);
        setAchievements(prev => prev.filter(a => a.id !== id));
        showToast(`Deleted achievement: ${title}`);
      } else if (type === 'blog') {
        await deleteBlog(id);
        setBlogs(prev => prev.filter(b => b.id !== id));
        showToast(`Deleted blog: ${title}`);
      } else if (type === 'gallery') {
        await deleteGalleryItem(id);
        setGallery(prev => prev.filter(g => g.id !== id));
        showToast(`Deleted gallery item: ${title}`);
      } else if (type === 'submission') {
        await deleteContactSubmission(id);
        setSubmissions(prev => prev.filter(s => s.id !== id));
        showToast('Inquiry deleted');
      } else if (type === 'user') {
        await deleteUser(id);
        setUsersList(prev => prev.filter(u => u.id !== id));
        showToast(`User account deleted: ${title}`);
      } else if (type === 'application') {
        await deleteApplication(id);
        setApplications(prev => prev.filter(a => getCandidateId(a) !== id));
        if (selectedApplication && getCandidateId(selectedApplication) === id) {
          setSelectedApplication(null);
        }
        showToast(`Candidate application for ${title} deleted`);
      }
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete item', 'error');
    }
  };

  // Update Application Status (Pending, Reviewing, Shortlisted, Accepted, Rejected)
  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(prev => prev.map(a => 
        getCandidateId(a) === appId ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a
      ));
      if (selectedApplication && getCandidateId(selectedApplication) === appId) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }));
      }
      showToast(`Candidate status updated to: ${newStatus.toUpperCase()}`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update application status', 'error');
    }
  };

  // Toggle User Role
  const handleToggleUserRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'member' : 'admin';
    try {
      const res = await updateUserRole(targetUser.id, newRole);
      setUsersList(prev => prev.map(u => u.id === targetUser.id ? res.data.user : u));
      showToast(`User ${targetUser.name} role updated to ${newRole}`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update user role', 'error');
    }
  };

  // Update Settings
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await updateContactInfo(contactData);
      if (res.data) {
        setContactData(res.data);
      }
      showToast('Site contact settings successfully updated');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update settings', 'error');
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <SEOHead title="Admin Operations Console — CodeTroopers" description="CodeTroopers Club Administrative Management Dashboard" />

      {/* Floating Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            {toast.type === 'error' ? <HiExclamationCircle /> : <HiCheck />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarMobileOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.brand}>
            <img src={logoImg} alt="CodeTroopers" className={styles.brandLogo} />
            <div>
              <span className={styles.brandTitle}>CodeTroopers</span>
              <span className={styles.brandBadge}>ADMIN SECTOR</span>
            </div>
          </Link>
          <button 
            type="button"
            className={styles.sidebarCloseBtn} 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <HiX />
          </button>
        </div>

        <nav className={styles.navMenu}>
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.activeNav : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <HiViewGrid className={styles.navIcon} />
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'applications' ? styles.activeNav : ''}`}
            onClick={() => handleTabChange('applications')}
          >
            <HiClipboardCheck className={styles.navIcon} />
            <span>Recruitment</span>
            {applications.length > 0 && (
              <span className={`${styles.counterBadge} ${applications.some(a => a.status === 'pending') ? styles.counterPending : ''}`}>
                {applications.length}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'members' ? styles.activeNav : ''}`}
            onClick={() => handleTabChange('members')}
          >
            <HiUsers className={styles.navIcon} />
            <span>Members</span>
            <span className={styles.counterBadge}>{members.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'events' ? styles.activeNav : ''}`}
            onClick={() => handleTabChange('events')}
          >
            <HiCalendar className={styles.navIcon} />
            <span>Events</span>
            <span className={styles.counterBadge}>{events.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'achievements' ? styles.activeNav : ''}`}
            onClick={() => handleTabChange('achievements')}
          >
            <HiBadgeCheck className={styles.navIcon} />
            <span>Achievements</span>
            <span className={styles.counterBadge}>{achievements.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'blogs' ? styles.activeNav : ''}`}
            onClick={() => handleTabChange('blogs')}
          >
            <HiDocumentText className={styles.navIcon} />
            <span>Blogs / Articles</span>
            <span className={styles.counterBadge}>{blogs.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'gallery' ? styles.activeNav : ''}`}
            onClick={() => handleTabChange('gallery')}
          >
            <HiPhotograph className={styles.navIcon} />
            <span>Gallery</span>
            <span className={styles.counterBadge}>{gallery.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'inquiries' ? styles.activeNav : ''}`}
            onClick={() => handleTabChange('inquiries')}
          >
            <HiMail className={styles.navIcon} />
            <span>Inquiries</span>
            {submissions.length > 0 && (
              <span className={`${styles.counterBadge} ${styles.counterAlert}`}>{submissions.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'users' ? styles.activeNav : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <HiShieldCheck className={styles.navIcon} />
            <span>Roles & Access</span>
            <span className={styles.counterBadge}>{usersList.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.activeNav : ''}`}
            onClick={() => handleTabChange('settings')}
          >
            <HiCog className={styles.navIcon} />
            <span>Site Settings</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.viewSiteBtn}>
            <HiExternalLink /> View Live Site
          </Link>
          <div className={styles.adminProfile}>
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'Admin')}`} 
              alt={user?.name}
              className={styles.adminAvatar} 
            />
            <div className={styles.adminInfo}>
              <span className={styles.adminName}>{user?.name}</span>
              <span className={styles.adminRole}>Administrator</span>
            </div>
            <button 
              type="button"
              className={styles.logoutIconBtn} 
              onClick={() => { logout(); navigate('/'); }}
              title="Logout"
            >
              <HiLogout />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className={styles.mainContent}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button 
              type="button"
              className={styles.mobileNavToggle}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <HiMenuAlt2 />
            </button>
            <h1 className={styles.sectionHeading}>
              {activeTab === 'overview' && 'Executive Overview'}
              {activeTab === 'applications' && 'Recruitment & Candidate Applications'}
              {activeTab === 'members' && 'Member Roster Management'}
              {activeTab === 'events' && 'Event Protocols & Calendar'}
              {activeTab === 'achievements' && 'Milestones & Achievements'}
              {activeTab === 'blogs' && 'Editorial & Technical Dispatches'}
              {activeTab === 'gallery' && 'Visual Media & Albums'}
              {activeTab === 'inquiries' && 'Public Inquiries & Messages'}
              {activeTab === 'users' && 'Trooper Access & Permissions'}
              {activeTab === 'settings' && 'Club Details & Configuration'}
            </h1>
          </div>

          <div className={styles.topBarRight}>
            <Link to="/" className={styles.topSiteLink}>
              <span>Main Site</span> <HiExternalLink />
            </Link>
          </div>
        </header>

        {/* Content Views */}
        <div className={styles.contentBody}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className={styles.overviewContainer}>
              {/* Stat Cards */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard} onClick={() => handleTabChange('applications')}>
                  <div className={`${styles.statIconWrapper} ${styles.statRecruitIcon}`}><HiClipboardCheck /></div>
                  <div className={styles.statNumber}>{applications.length}</div>
                  <div className={styles.statLabel}>Recruitment Applications</div>
                  <span className={styles.statHint}>
                    {applications.filter(a => a.status === 'pending').length} pending review →
                  </span>
                </div>

                <div className={styles.statCard} onClick={() => handleTabChange('members')}>
                  <div className={styles.statIconWrapper}><HiUsers /></div>
                  <div className={styles.statNumber}>{members.length}</div>
                  <div className={styles.statLabel}>Total Members</div>
                  <span className={styles.statHint}>Manage roster →</span>
                </div>

                <div className={styles.statCard} onClick={() => handleTabChange('events')}>
                  <div className={`${styles.statIconWrapper} ${styles.statEventsIcon}`}><HiCalendar /></div>
                  <div className={styles.statNumber}>{events.length}</div>
                  <div className={styles.statLabel}>Club Events</div>
                  <span className={styles.statHint}>Workshops & talks →</span>
                </div>

                <div className={styles.statCard} onClick={() => handleTabChange('achievements')}>
                  <div className={`${styles.statIconWrapper} ${styles.statAchieveIcon}`}><HiBadgeCheck /></div>
                  <div className={styles.statNumber}>{achievements.length}</div>
                  <div className={styles.statLabel}>Achievements</div>
                  <span className={styles.statHint}>Milestones & honors →</span>
                </div>

                <div className={styles.statCard} onClick={() => handleTabChange('blogs')}>
                  <div className={`${styles.statIconWrapper} ${styles.statBlogIcon}`}><HiDocumentText /></div>
                  <div className={styles.statNumber}>{blogs.length}</div>
                  <div className={styles.statLabel}>Published Blogs</div>
                  <span className={styles.statHint}>Articles & news →</span>
                </div>

                <div className={styles.statCard} onClick={() => handleTabChange('gallery')}>
                  <div className={`${styles.statIconWrapper} ${styles.statGalleryIcon}`}><HiPhotograph /></div>
                  <div className={styles.statNumber}>{gallery.length}</div>
                  <div className={styles.statLabel}>Gallery Albums</div>
                  <span className={styles.statHint}>Photo captures →</span>
                </div>

                <div className={styles.statCard} onClick={() => handleTabChange('inquiries')}>
                  <div className={`${styles.statIconWrapper} ${styles.statInqIcon}`}><HiMail /></div>
                  <div className={styles.statNumber}>{submissions.length}</div>
                  <div className={styles.statLabel}>Contact Inquiries</div>
                  <span className={styles.statHint}>Review submissions →</span>
                </div>
              </div>

              {/* Quick Actions & Recent Tables */}
              <div className={styles.overviewGrid}>
                {/* Recent Applications Card */}
                <div className={styles.panelCard} style={{ gridColumn: '1 / -1' }}>
                  <div className={styles.panelHeader}>
                    <div>
                      <h3>Recent Candidate Applications (Join Us)</h3>
                      <p className={styles.panelDesc}>Submissions received for troop recruitments</p>
                    </div>
                    <button type="button" className={styles.panelActionBtn} onClick={() => handleTabChange('applications')}>
                      <HiExternalLink /> Manage All Applications
                    </button>
                  </div>
                  <div className={styles.tableResponsive}>
                    <table className={styles.adminTable}>
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>USN / Dept</th>
                          <th>Domain(s)</th>
                          <th>Status</th>
                          <th>Resume</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                              No candidate applications received yet.
                            </td>
                          </tr>
                        ) : (
                          applications.slice(0, 4).map(app => (
                            <tr key={getCandidateId(app)}>
                              <td className={styles.strongCell}>
                                <div className={styles.applicantCell}>
                                  <div className={styles.applicantAvatar}>
                                    {getCandidateName(app).charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div>{getCandidateName(app)}</div>
                                    <small style={{ color: 'var(--text-muted)' }}>{getCandidateEmail(app)}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>{getCandidateUsn(app)}</div>
                                <small style={{ color: 'var(--text-muted)' }}>{getCandidateBranch(app)}</small>
                              </td>
                              <td>
                                <div className={styles.domainChips}>
                                  {getCandidateDomains(app).slice(0, 2).map(d => (
                                    <span key={d} className={styles.domainChip}>{d}</span>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <span className={
                                  app.status === 'shortlisted' ? styles.statusShortlisted :
                                  app.status === 'accepted' ? styles.statusAccepted :
                                  app.status === 'reviewing' ? styles.statusReviewing :
                                  app.status === 'rejected' ? styles.statusRejected :
                                  styles.statusPending
                                }>
                                  {app.status || 'pending'}
                                </span>
                              </td>
                              <td>
                                {getCandidateResume(app) ? (
                                  <a 
                                    href={getCandidateResume(app)} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={styles.resumeBtn}
                                    title="Open resume in Google Drive"
                                  >
                                    <HiExternalLink /> Google Drive
                                  </a>
                                ) : (
                                  <span className={styles.resumeBtnDisabled}>No Resume</span>
                                )}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button 
                                  type="button" 
                                  className={styles.editBtn}
                                  onClick={() => setSelectedApplication(app)}
                                  title="View Full Application"
                                >
                                  <HiEye /> View Profile
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Events Card */}
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <h3>Recent Events</h3>
                    <button type="button" className={styles.panelActionBtn} onClick={() => openCreateModal('event')}>
                      <HiPlus /> Add Event
                    </button>
                  </div>
                  <div className={styles.tableResponsive}>
                    <table className={styles.adminTable}>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.slice(0, 5).map(e => (
                          <tr key={e.id}>
                            <td className={styles.strongCell}>{e.title}</td>
                            <td><span className={styles.badgeSm}>{e.type}</span></td>
                            <td>{e.date}</td>
                            <td>
                              <span className={e.status === 'upcoming' ? styles.statusUpcoming : styles.statusPast}>
                                {e.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Articles Card */}
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <h3>Recent Blog Articles</h3>
                    <button type="button" className={styles.panelActionBtn} onClick={() => openCreateModal('blog')}>
                      <HiPlus /> Write Article
                    </button>
                  </div>
                  <div className={styles.tableResponsive}>
                    <table className={styles.adminTable}>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Author</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.slice(0, 5).map(b => (
                          <tr key={b.id}>
                            <td className={styles.strongCell}>{b.title}</td>
                            <td>{b.author}</td>
                            <td>{b.date}</td>
                            <td>
                              <span className={b.status === 'published' ? styles.statusPublished : styles.statusDraft}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RECRUITMENT & APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className={styles.tabContent}>
              {/* Integration Status Banner */}
              <div className={styles.integrationBanner}>
                <div className={styles.bannerContent}>
                  <div className={styles.bannerBadge}>
                    <span className={styles.bannerDot}></span>
                    <span>API Ready</span>
                  </div>
                  <div>
                    <div className={styles.bannerTitle}>Join Us Recruitment API Integration Console</div>
                    <div className={styles.bannerSubtitle}>
                      Endpoints <code>/api/recruitment/applications</code> & <code>/api/applications</code> active · Connected to Admin JWT session · Google Drive & Supabase schema ready
                    </div>
                  </div>
                </div>
                <div className={styles.bannerActions}>
                  <button 
                    type="button" 
                    className={styles.bannerDocBtn}
                    onClick={() => loadAllData()}
                    title="Fetch latest candidate applications"
                  >
                    <HiClock /> Sync Now
                  </button>
                </div>
              </div>

              {/* Metrics Bar */}
              <div className={styles.metricsBar}>
                <div className={styles.metricItem}>
                  <div className={styles.metricValue}>{applications.length}</div>
                  <div className={styles.metricLabel}>Total Received</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricValue} style={{ color: '#fbbf24' }}>
                    {applications.filter(a => a.status === 'pending').length}
                  </div>
                  <div className={styles.metricLabel}>Pending Review</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricValue} style={{ color: '#60a5fa' }}>
                    {applications.filter(a => a.status === 'reviewing').length}
                  </div>
                  <div className={styles.metricLabel}>Under Review</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricValue} style={{ color: '#c084fc' }}>
                    {applications.filter(a => a.status === 'shortlisted').length}
                  </div>
                  <div className={styles.metricLabel}>Shortlisted</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricValue} style={{ color: '#34d399' }}>
                    {applications.filter(a => a.status === 'accepted').length}
                  </div>
                  <div className={styles.metricLabel}>Accepted</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricValue} style={{ color: '#f87171' }}>
                    {applications.filter(a => a.status === 'rejected').length}
                  </div>
                  <div className={styles.metricLabel}>Rejected</div>
                </div>
              </div>

              {/* Action Controls & Filters */}
              <div className={styles.actionHeader}>
                <div className={styles.filterControls}>
                  <div className={styles.searchBox}>
                    <HiSearch className={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search applicant name, USN, branch, skills..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <select 
                    className={styles.selectFilter}
                    value={appStatusFilter}
                    onChange={(e) => setAppStatusFilter(e.target.value)}
                  >
                    <option value="all">All Application Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="reviewing">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <select 
                    className={styles.selectFilter}
                    value={appDomainFilter}
                    onChange={(e) => setAppDomainFilter(e.target.value)}
                  >
                    <option value="all">All Domains</option>
                    <option value="web">Web Development</option>
                    <option value="app">App Development</option>
                    <option value="ai">AI / Machine Learning</option>
                    <option value="cloud">Cloud / DevOps</option>
                    <option value="design">UI/UX Design</option>
                    <option value="competitive">Competitive Programming</option>
                  </select>
                </div>
              </div>

              {/* Applications Table */}
              <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>USN / Dept</th>
                      <th>Year / Sem</th>
                      <th>Domains of Interest</th>
                      <th>Resume (Drive)</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications
                      .filter(app => {
                        const matchStatus = appStatusFilter === 'all' || app.status?.toLowerCase() === appStatusFilter.toLowerCase();
                        const domains = getCandidateDomains(app);
                        const matchDomain = appDomainFilter === 'all' || 
                          domains.some(d => d.toLowerCase().includes(appDomainFilter.toLowerCase()));
                        
                        const q = searchQuery.toLowerCase();
                        const name = getCandidateName(app).toLowerCase();
                        const email = getCandidateEmail(app).toLowerCase();
                        const usn = getCandidateUsn(app).toLowerCase();
                        const branch = getCandidateBranch(app).toLowerCase();
                        const skills = getCandidateSkills(app).toLowerCase();
                        const matchSearch = !q || name.includes(q) || email.includes(q) || usn.includes(q) || branch.includes(q) || skills.includes(q);

                        return matchStatus && matchDomain && matchSearch;
                      })
                      .map(app => {
                        const appId = getCandidateId(app);
                        const appName = getCandidateName(app);
                        const appEmail = getCandidateEmail(app);
                        const appPhone = getCandidatePhone(app);
                        const appUsn = getCandidateUsn(app);
                        const appBranch = getCandidateBranch(app);
                        const appSem = getCandidateSemester(app);
                        const appDomains = getCandidateDomains(app);
                        const appResume = getCandidateResume(app);
                        const appDate = getCandidateDate(app);

                        return (
                          <tr key={appId}>
                            <td>
                              <div className={styles.applicantCell}>
                                <div className={styles.applicantAvatar}>
                                  {appName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className={styles.strongCell}>{appName}</div>
                                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{appEmail}</div>
                                  {appPhone && (
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{appPhone}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={styles.applicantUsn}>{appUsn}</span>
                              <div className={styles.applicantBranch}>{appBranch}</div>
                            </td>
                            <td>
                              <div>{appSem}</div>
                            </td>
                            <td>
                              <div className={styles.domainChips}>
                                {appDomains.map(d => (
                                  <span key={d} className={styles.domainChip}>{d}</span>
                                ))}
                              </div>
                            </td>
                            <td>
                              {appResume ? (
                                <a 
                                  href={appResume} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className={styles.resumeBtn}
                                  title="Open resume file on Google Drive"
                                >
                                  <HiExternalLink /> Google Drive
                                </a>
                              ) : (
                                <span className={styles.resumeBtnDisabled}>Not Attached</span>
                              )}
                            </td>
                            <td>
                              <div style={{ fontSize: '0.82rem' }}>
                                {appDate ? new Date(appDate).toLocaleDateString() : 'Recent'}
                              </div>
                              <small className={styles.timeText}>
                                {appDate ? new Date(appDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </small>
                            </td>
                            <td>
                              <select 
                                className={styles.quickStatusSelect}
                                value={app.status || 'pending'}
                                onChange={(e) => handleUpdateAppStatus(appId, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className={styles.rowActions}>
                                <button 
                                  type="button"
                                  className={styles.editBtn} 
                                  onClick={() => setSelectedApplication(app)}
                                  title="View Full Application & Resume"
                                >
                                  <HiEye />
                                </button>
                                <button 
                                  type="button"
                                  className={styles.deleteBtn} 
                                  onClick={() => setDeleteTarget({ type: 'application', id: appId, title: `${appName} (${appUsn !== '—' ? appUsn : appEmail})` })}
                                  title="Delete Application Record"
                                >
                                  <HiTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                          No recruitment applications recorded. Once applicants submit via the Join Us portal, their metadata and Google Drive resumes will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBERS */}
          {activeTab === 'members' && (
            <div className={styles.tabContent}>
              <div className={styles.actionHeader}>
                <div className={styles.filterControls}>
                  <div className={styles.searchBox}>
                    <HiSearch className={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search member by name, role, dept..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <select 
                    className={styles.selectFilter}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="club-head">Club Head</option>
                    <option value="workbench-head">Workbench Head</option>
                    <option value="faculty-coordinator">Faculty Coordinator</option>
                    <option value="lead">Lead</option>
                    <option value="member">Member</option>
                  </select>
                </div>

                <button 
                  type="button" 
                  className={styles.createBtn} 
                  onClick={() => openCreateModal('member')}
                >
                  <HiPlus /> Add Member
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Trooper</th>
                      <th>Position</th>
                      <th>Category</th>
                      <th>Dept</th>
                      <th>Team</th>
                      <th>Email</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members
                      .filter(m => {
                        const matchCat = filterCategory === 'all' || m.category === filterCategory;
                        const q = searchQuery.toLowerCase();
                        const matchQ = !q || 
                          m.name.toLowerCase().includes(q) || 
                          (typeof m.position === 'string' && m.position.toLowerCase().includes(q)) ||
                          m.department?.toLowerCase().includes(q);
                        return matchCat && matchQ;
                      })
                      .map(m => (
                        <tr key={m.id}>
                          <td>
                            <div className={styles.memberCell}>
                              <img 
                                src={m.photo || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(m.name)} 
                                alt={m.name} 
                                className={styles.memberAvatar}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(m.name);
                                }}
                              />
                              <div>
                                <div className={styles.strongCell}>{m.name}</div>
                                {m.linkedin && (
                                  <a href={m.linkedin} target="_blank" rel="noreferrer" className={styles.linkSm}>LinkedIn</a>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {Array.isArray(m.position) ? m.position.join(', ') : m.position}
                          </td>
                          <td>
                            <span className={styles.badgeSm}>{m.category}</span>
                          </td>
                          <td>{m.department}</td>
                          <td>{Array.isArray(m.team) ? m.team.join(', ') : (m.team || '—')}</td>
                          <td className={styles.emailCell}>{m.email || '—'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className={styles.rowActions}>
                              <button 
                                type="button"
                                className={styles.editBtn} 
                                onClick={() => openEditModal('member', m)}
                                title="Edit Member"
                              >
                                <HiPencil />
                              </button>
                              <button 
                                type="button"
                                className={styles.deleteBtn} 
                                onClick={() => setDeleteTarget({ type: 'member', id: m.id, title: m.name })}
                                title="Delete Member"
                              >
                                <HiTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EVENTS */}
          {activeTab === 'events' && (
            <div className={styles.tabContent}>
              <div className={styles.actionHeader}>
                <div className={styles.filterControls}>
                  <div className={styles.searchBox}>
                    <HiSearch className={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search event title, organizer, venue..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <select 
                    className={styles.selectFilter}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="workshops">Workshops</option>
                    <option value="hackathons">Hackathons</option>
                    <option value="competitions">Competitions</option>
                    <option value="technical-talks">Technical Talks</option>
                    <option value="guest-lectures">Guest Lectures</option>
                  </select>
                </div>

                <button 
                  type="button" 
                  className={styles.createBtn} 
                  onClick={() => openCreateModal('event')}
                >
                  <HiPlus /> Add Event
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Date & Time</th>
                      <th>Venue</th>
                      <th>Organizer</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events
                      .filter(e => {
                        const matchType = filterCategory === 'all' || e.type === filterCategory;
                        const q = searchQuery.toLowerCase();
                        const matchQ = !q || e.title.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q);
                        return matchType && matchQ;
                      })
                      .map(ev => (
                        <tr key={ev.id}>
                          <td className={styles.strongCell}>
                            <div className={styles.eventTitleRow}>
                              {ev.banner && (
                                <img src={ev.banner} alt={ev.title} className={styles.thumbSm} />
                              )}
                              <span>{ev.title}</span>
                            </div>
                          </td>
                          <td><span className={styles.badgeSm}>{ev.type}</span></td>
                          <td>
                            <div>{ev.date}</div>
                            <small className={styles.timeText}>{ev.time}</small>
                          </td>
                          <td>{ev.venue}</td>
                          <td>{ev.organizer || '—'}</td>
                          <td>
                            <span className={ev.status === 'upcoming' ? styles.statusUpcoming : styles.statusPast}>
                              {ev.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className={styles.rowActions}>
                              <button 
                                type="button"
                                className={styles.editBtn} 
                                onClick={() => openEditModal('event', ev)}
                                title="Edit Event"
                              >
                                <HiPencil />
                              </button>
                              <button 
                                type="button"
                                className={styles.deleteBtn} 
                                onClick={() => setDeleteTarget({ type: 'event', id: ev.id, title: ev.title })}
                                title="Delete Event"
                              >
                                <HiTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className={styles.tabContent}>
              <div className={styles.actionHeader}>
                <div className={styles.filterControls}>
                  <div className={styles.searchBox}>
                    <HiSearch className={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search milestone title, tag..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="button" 
                  className={styles.createBtn} 
                  onClick={() => openCreateModal('achievement')}
                >
                  <HiPlus /> Add Achievement
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Tags</th>
                      <th>Description</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements
                      .filter(a => {
                        const q = searchQuery.toLowerCase();
                        return !q || a.title.toLowerCase().includes(q) || (a.tags && a.tags.some(t => t.toLowerCase().includes(q)));
                      })
                      .map(ach => (
                        <tr key={ach.id}>
                          <td className={styles.strongCell}>{ach.title}</td>
                          <td><span className={styles.badgeSm}>{ach.category}</span></td>
                          <td>{ach.date}</td>
                          <td>
                            <div className={styles.tagsSm}>
                              {(ach.tags || []).slice(0, 3).map(t => (
                                <span key={t} className={styles.tagChipSm}>#{t}</span>
                              ))}
                            </div>
                          </td>
                          <td className={styles.truncateCell}>{ach.description}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className={styles.rowActions}>
                              <button 
                                type="button"
                                className={styles.editBtn} 
                                onClick={() => openEditModal('achievement', ach)}
                                title="Edit Achievement"
                              >
                                <HiPencil />
                              </button>
                              <button 
                                type="button"
                                className={styles.deleteBtn} 
                                onClick={() => setDeleteTarget({ type: 'achievement', id: ach.id, title: ach.title })}
                                title="Delete Achievement"
                              >
                                <HiTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BLOGS */}
          {activeTab === 'blogs' && (
            <div className={styles.tabContent}>
              <div className={styles.actionHeader}>
                <div className={styles.filterControls}>
                  <div className={styles.searchBox}>
                    <HiSearch className={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search articles, author, tag..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <select 
                    className={styles.selectFilter}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <button 
                  type="button" 
                  className={styles.createBtn} 
                  onClick={() => openCreateModal('blog')}
                >
                  <HiPlus /> New Article
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Read Time</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs
                      .filter(b => {
                        const matchStatus = filterCategory === 'all' || b.status === filterCategory;
                        const q = searchQuery.toLowerCase();
                        const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
                        return matchStatus && matchQ;
                      })
                      .map(blog => (
                        <tr key={blog.id}>
                          <td className={styles.strongCell}>
                            <div className={styles.blogRowTitle}>
                              <Link to={`/blogs/${blog.id}`} target="_blank" className={styles.blogLink}>
                                {blog.title}
                              </Link>
                            </div>
                          </td>
                          <td><span className={styles.badgeSm}>{blog.category}</span></td>
                          <td>{blog.author}</td>
                          <td>{blog.date}</td>
                          <td>{blog.readTime}</td>
                          <td>
                            <span className={blog.status === 'published' ? styles.statusPublished : styles.statusDraft}>
                              {blog.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className={styles.rowActions}>
                              <Link 
                                to={`/blogs/${blog.id}`} 
                                target="_blank" 
                                className={styles.viewLinkBtn} 
                                title="View Live Article"
                              >
                                <HiEye />
                              </Link>
                              <button 
                                type="button"
                                className={styles.editBtn} 
                                onClick={() => openEditModal('blog', blog)}
                                title="Edit Blog"
                              >
                                <HiPencil />
                              </button>
                              <button 
                                type="button"
                                className={styles.deleteBtn} 
                                onClick={() => setDeleteTarget({ type: 'blog', id: blog.id, title: blog.title })}
                                title="Delete Blog"
                              >
                                <HiTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: GALLERY */}
          {activeTab === 'gallery' && (
            <div className={styles.tabContent}>
              <div className={styles.actionHeader}>
                <div className={styles.filterControls}>
                  <div className={styles.searchBox}>
                    <HiSearch className={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search gallery collection..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="button" 
                  className={styles.createBtn} 
                  onClick={() => openCreateModal('gallery')}
                >
                  <HiPlus /> Add Collection
                </button>
              </div>

              <div className={styles.galleryGrid}>
                {gallery
                  .filter(g => !searchQuery || g.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(g => (
                    <div key={g.id} className={styles.galleryCard}>
                      <img 
                        src={g.cover || (g.images && g.images[0]) || '/uploads/technical-talks/cover.jpg'} 
                        alt={g.title}
                        className={styles.galleryCardCover}
                      />
                      <div className={styles.galleryCardBody}>
                        <h4>{g.title}</h4>
                        <div className={styles.galleryMeta}>
                          <span className={styles.badgeSm}>{g.category}</span>
                          <span>{g.images?.length || 0} Photos</span>
                        </div>
                        <div className={styles.galleryActions}>
                          <button 
                            type="button"
                            className={styles.editBtn} 
                            onClick={() => openEditModal('gallery', g)}
                          >
                            <HiPencil /> Edit
                          </button>
                          <button 
                            type="button"
                            className={styles.deleteBtn} 
                            onClick={() => setDeleteTarget({ type: 'gallery', id: g.id, title: g.title })}
                          >
                            <HiTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 7: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className={styles.tabContent}>
              <div className={styles.actionHeader}>
                <div className={styles.filterControls}>
                  <div className={styles.searchBox}>
                    <HiSearch className={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search inquiries by sender, email, subject..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Received Date</th>
                      <th>Message Snippet</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                          No inquiries recorded yet. Messages sent via Contact form will appear here.
                        </td>
                      </tr>
                    ) : (
                      submissions
                        .filter(sub => {
                          const q = searchQuery.toLowerCase();
                          return !q || 
                            sub.name?.toLowerCase().includes(q) || 
                            sub.email?.toLowerCase().includes(q) || 
                            sub.subject?.toLowerCase().includes(q) ||
                            sub.message?.toLowerCase().includes(q);
                        })
                        .map(sub => (
                        <tr key={sub.id}>
                          <td className={styles.strongCell}>{sub.name}</td>
                          <td>{sub.email}</td>
                          <td>{sub.subject}</td>
                          <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                          <td className={styles.truncateCell}>{sub.message}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className={styles.rowActions}>
                              <button 
                                type="button"
                                className={styles.editBtn} 
                                onClick={() => setViewMessage(sub)}
                                title="View Message"
                              >
                                <HiEye />
                              </button>
                              <button 
                                type="button"
                                className={styles.deleteBtn} 
                                onClick={() => setDeleteTarget({ type: 'submission', id: sub.id, title: `${sub.name}'s Inquiry` })}
                                title="Delete Inquiry"
                              >
                                <HiTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: ROLES & USERS */}
          {activeTab === 'users' && (
            <div className={styles.tabContent}>
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <h3>Registered Accounts & Permissions</h3>
                    <p className={styles.panelDesc}>Promote trusted troopers to administrator clearance or adjust roles</p>
                  </div>
                </div>

                <div className={styles.actionHeader} style={{ padding: '0 0 1rem 0' }}>
                  <div className={styles.filterControls}>
                    <div className={styles.searchBox}>
                      <HiSearch className={styles.searchIcon} />
                      <input 
                        type="text" 
                        placeholder="Search trooper by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Clearance Role</th>
                        <th>Created</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList
                        .filter(u => {
                          const q = searchQuery.toLowerCase();
                          return !q || 
                            u.name?.toLowerCase().includes(q) || 
                            u.email?.toLowerCase().includes(q);
                        })
                        .map(u => (
                          <tr key={u.id}>
                            <td>
                              <div className={styles.memberCell}>
                                <img src={u.avatar} alt={u.name} className={styles.memberAvatar} />
                                <span className={styles.strongCell}>{u.name}</span>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span className={u.role === 'admin' ? styles.adminRoleBadge : styles.memberRoleBadge}>
                                {u.role.toUpperCase()}
                              </span>
                            </td>
                            <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                            <td style={{ textAlign: 'right' }}>
                              {u.id === user?.id ? (
                                <span className={styles.youBadge}>Active You</span>
                              ) : (
                                <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                                  <button
                                    type="button"
                                    className={u.role === 'admin' ? styles.demoteBtn : styles.promoteBtn}
                                    onClick={() => handleToggleUserRole(u)}
                                  >
                                    {u.role === 'admin' ? 'Demote to Member' : 'Promote to Admin'}
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.deleteBtn}
                                    onClick={() => setDeleteTarget({ type: 'user', id: u.id, title: `${u.name} (${u.email})` })}
                                    title="Delete User Account"
                                  >
                                    <HiTrash />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className={styles.tabContent}>
              <form onSubmit={handleUpdateSettings} className={styles.settingsForm}>
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <h3>Club Contact Information</h3>
                    <p className={styles.panelDesc}>Details rendered on public Contact page and footer</p>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Official Email</label>
                      <input 
                        type="email" 
                        value={contactData.info?.email || ''} 
                        onChange={(e) => setContactData({
                          ...contactData,
                          info: { ...(contactData.info || {}), email: e.target.value }
                        })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Campus Address</label>
                      <input 
                        type="text" 
                        value={contactData.info?.address || ''} 
                        onChange={(e) => setContactData({
                          ...contactData,
                          info: { ...(contactData.info || {}), address: e.target.value }
                        })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>LinkedIn URL</label>
                      <input 
                        type="url" 
                        value={contactData.info?.social?.linkedin || ''} 
                        onChange={(e) => setContactData({
                          ...contactData,
                          info: {
                            ...(contactData.info || {}),
                            social: { ...(contactData.info?.social || {}), linkedin: e.target.value }
                          }
                        })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>GitHub Organization URL</label>
                      <input 
                        type="url" 
                        value={contactData.info?.social?.github || ''} 
                        onChange={(e) => setContactData({
                          ...contactData,
                          info: {
                            ...(contactData.info || {}),
                            social: { ...(contactData.info?.social || {}), github: e.target.value }
                          }
                        })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Instagram Handle URL</label>
                      <input 
                        type="url" 
                        value={contactData.info?.social?.instagram || ''} 
                        onChange={(e) => setContactData({
                          ...contactData,
                          info: {
                            ...(contactData.info || {}),
                            social: { ...(contactData.info?.social || {}), instagram: e.target.value }
                          }
                        })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>X / Twitter URL</label>
                      <input 
                        type="url" 
                        value={contactData.info?.social?.twitter || ''} 
                        onChange={(e) => setContactData({
                          ...contactData,
                          info: {
                            ...(contactData.info || {}),
                            social: { ...(contactData.info?.social || {}), twitter: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className={styles.formActionsRight}>
                    <button type="submit" className={styles.saveSettingsBtn}>
                      Save Club Settings
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {modalType && (
          <div className={styles.modalOverlay} onClick={() => setModalType(null)}>
            <motion.div 
              className={styles.modalDialog}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
            >
              <div className={styles.modalHeader}>
                <h3>{editItem ? `Edit ${modalType}` : `Create New ${modalType}`}</h3>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setModalType(null)}>
                  <HiX />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className={styles.modalForm}>
                {/* MEMBER FORM */}
                {modalType === 'member' && (
                  <>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Full Name *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.name || ''} 
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Position / Role *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Club Head, Developer" 
                          value={formData.position || ''} 
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Category *</label>
                        <select 
                          value={formData.category || 'member'} 
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="club-head">Club Head</option>
                          <option value="workbench-head">Workbench Head</option>
                          <option value="faculty-coordinator">Faculty Coordinator</option>
                          <option value="lead">Lead</option>
                          <option value="member">Member</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Department</label>
                        <input 
                          type="text" 
                          value={formData.department || ''} 
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Team Allocation (Comma separated if multiple)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Workbench, Competitive Coding" 
                        value={formData.team || ''} 
                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Photo URL (Google Drive, Cloud, or /uploads)</label>
                      <input 
                        type="text" 
                        placeholder="https://..." 
                        value={formData.photo || ''} 
                        onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          placeholder="name@sode-edu.in" 
                          value={formData.email || ''} 
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>LinkedIn Profile URL</label>
                        <input 
                          type="url" 
                          placeholder="https://linkedin.com/in/..." 
                          value={formData.linkedin || ''} 
                          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* EVENT FORM */}
                {modalType === 'event' && (
                  <>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Event Title *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.title || ''} 
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Event Type *</label>
                        <select 
                          value={formData.type || 'workshops'} 
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                          <option value="workshops">Workshops</option>
                          <option value="hackathons">Hackathons</option>
                          <option value="competitions">Competitions</option>
                          <option value="technical-talks">Technical Talks</option>
                          <option value="guest-lectures">Guest Lectures</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Date (YYYY-MM-DD) *</label>
                        <input 
                          type="date" 
                          required 
                          value={formData.date || ''} 
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Time</label>
                        <input 
                          type="text" 
                          placeholder="09:00 AM - 04:00 PM" 
                          value={formData.time || ''} 
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Status</label>
                        <select 
                          value={formData.status || 'upcoming'} 
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="past">Past</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Venue</label>
                        <input 
                          type="text" 
                          value={formData.venue || ''} 
                          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Organizer</label>
                        <input 
                          type="text" 
                          value={formData.organizer || ''} 
                          onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Banner Image URL</label>
                      <input 
                        type="text" 
                        placeholder="/uploads/... or https://..." 
                        value={formData.banner || ''} 
                        onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea 
                        rows={3} 
                        value={formData.description || ''} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Gallery Photos (One image URL per line)</label>
                      <textarea 
                        rows={3} 
                        placeholder="/uploads/workshops/1.jpg&#10;/uploads/workshops/2.jpg" 
                        value={formData.galleryUrls || ''} 
                        onChange={(e) => setFormData({ ...formData, galleryUrls: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {/* ACHIEVEMENT FORM */}
                {modalType === 'achievement' && (
                  <>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Milestone Title *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.title || ''} 
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Category</label>
                        <input 
                          type="text" 
                          placeholder="e.g. community-impact, awards" 
                          value={formData.category || ''} 
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Date</label>
                        <input 
                          type="date" 
                          value={formData.date || ''} 
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Image URL</label>
                        <input 
                          type="text" 
                          value={formData.image || ''} 
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="Peer Learning, Hackathons, Cloud" 
                        value={formData.tags || ''} 
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea 
                        rows={3} 
                        value={formData.description || ''} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Key Highlights (One point per line)</label>
                      <textarea 
                        rows={3} 
                        placeholder="Conducted weekly peer learning sessions&#10;Over 150 student attendees" 
                        value={formData.highlights || ''} 
                        onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {/* BLOG FORM */}
                {modalType === 'blog' && (
                  <>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Article Title *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.title || ''} 
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Category</label>
                        <input 
                          type="text" 
                          placeholder="Architecture, AI, Competitions" 
                          value={formData.category || ''} 
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Author *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.author || ''} 
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Author Role</label>
                        <input 
                          type="text" 
                          value={formData.authorRole || ''} 
                          onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Date</label>
                        <input 
                          type="date" 
                          value={formData.date || ''} 
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Read Time</label>
                        <input 
                          type="text" 
                          placeholder="6 min read" 
                          value={formData.readTime || ''} 
                          onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Publication Status</label>
                        <select 
                          value={formData.status || 'published'} 
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Cover Image URL</label>
                      <input 
                        type="text" 
                        placeholder="/uploads/... or https://..." 
                        value={formData.coverImage || ''} 
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Short Summary</label>
                      <textarea 
                        rows={2} 
                        placeholder="A concise overview of the article..." 
                        value={formData.summary || ''} 
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Full Content (Markdown or Formatted Text)</label>
                      <textarea 
                        rows={7} 
                        placeholder="Write the article content..." 
                        value={formData.content || ''} 
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="WebDev, Architecture, Performance" 
                        value={formData.tags || ''} 
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {/* GALLERY FORM */}
                {modalType === 'gallery' && (
                  <>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Album Title *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.title || ''} 
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Category</label>
                        <select 
                          value={formData.category || 'workshops'} 
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="workshops">Workshops</option>
                          <option value="hackathons">Hackathons</option>
                          <option value="technical-talks">Technical Talks</option>
                          <option value="competitions">Competitions</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Album Cover Image URL</label>
                      <input 
                        type="text" 
                        value={formData.cover || ''} 
                        onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Collection Photos (One image URL per line)</label>
                      <textarea 
                        rows={4} 
                        placeholder="/uploads/image1.jpeg&#10;/uploads/image2.jpeg" 
                        value={formData.images || ''} 
                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className={styles.modalActions}>
                  <button 
                    type="button" 
                    className={styles.cancelBtn} 
                    onClick={() => setModalType(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    {editItem ? 'Save Modifications' : 'Create Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
            <motion.div 
              className={styles.deleteDialog}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
            >
              <div className={styles.deleteIconWrapper}>
                <HiTrash />
              </div>
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to permanently delete <strong>{deleteTarget.title}</strong>? 
                This action cannot be undone.
              </p>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn} 
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={styles.dangerBtn} 
                  onClick={confirmDelete}
                >
                  Yes, Delete Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW MESSAGE MODAL */}
      <AnimatePresence>
        {viewMessage && (
          <div className={styles.modalOverlay} onClick={() => setViewMessage(null)}>
            <motion.div 
              className={styles.modalDialog}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
            >
              <div className={styles.modalHeader}>
                <h3>Inquiry from {viewMessage.name}</h3>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setViewMessage(null)}>
                  <HiX />
                </button>
              </div>
              <div className={styles.inquiryBody}>
                <div className={styles.inquiryMetaRow}>
                  <strong>Email:</strong> <span>{viewMessage.email}</span>
                </div>
                <div className={styles.inquiryMetaRow}>
                  <strong>Subject:</strong> <span>{viewMessage.subject}</span>
                </div>
                <div className={styles.inquiryMetaRow}>
                  <strong>Date:</strong> <span>{new Date(viewMessage.submittedAt).toLocaleString()}</span>
                </div>
                <div className={styles.inquiryMessageBox}>
                  <p>{viewMessage.message}</p>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.submitBtn} 
                  onClick={() => setViewMessage(null)}
                >
                  Close Inquiry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW APPLICATION & RESUME MODAL */}
      <AnimatePresence>
        {selectedApplication && (() => {
          const selId = getCandidateId(selectedApplication);
          const selName = getCandidateName(selectedApplication);
          const selEmail = getCandidateEmail(selectedApplication);
          const selPhone = getCandidatePhone(selectedApplication);
          const selUsn = getCandidateUsn(selectedApplication);
          const selBranch = getCandidateBranch(selectedApplication);
          const selSem = getCandidateSemester(selectedApplication);
          const selSkills = getCandidateSkills(selectedApplication);
          const selMotivation = getCandidateMotivation(selectedApplication);
          const selResume = getCandidateResume(selectedApplication);
          const selDomains = getCandidateDomains(selectedApplication);
          const selDate = getCandidateDate(selectedApplication);

          return (
            <div className={styles.modalOverlay} onClick={() => setSelectedApplication(null)}>
              <motion.div 
                className={styles.modalDialog}
                style={{ maxWidth: '780px' }}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
              >
                <div className={styles.modalHeader}>
                  <div>
                    <h3 style={{ margin: 0 }}>Candidate Profile Review</h3>
                    <small style={{ color: 'var(--text-muted)' }}>
                      Application ID: {selId} · Applied {selDate ? new Date(selDate).toLocaleString() : 'Recently'}
                    </small>
                  </div>
                  <button 
                    type="button" 
                    className={styles.modalCloseBtn} 
                    onClick={() => setSelectedApplication(null)}
                    aria-label="Close modal"
                  >
                    <HiX />
                  </button>
                </div>

                <div className={styles.appModalBody}>
                  {/* Profile Header */}
                  <div className={styles.appProfileHeader}>
                    <div className={styles.appProfileUser}>
                      <div className={styles.appProfileAvatar}>
                        {selName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.appProfileName}>{selName}</div>
                        <div className={styles.appProfileUsn}>{selUsn !== '—' ? selUsn : 'No USN provided'}</div>
                      </div>
                    </div>
                    <div>
                      <span className={
                        selectedApplication.status === 'shortlisted' ? styles.statusShortlisted :
                        selectedApplication.status === 'accepted' ? styles.statusAccepted :
                        selectedApplication.status === 'reviewing' ? styles.statusReviewing :
                        selectedApplication.status === 'rejected' ? styles.statusRejected :
                        styles.statusPending
                      }>
                        {selectedApplication.status ? selectedApplication.status.toUpperCase() : 'PENDING'}
                      </span>
                    </div>
                  </div>

                  {/* Candidate Resume Highlight Box */}
                  <div className={styles.resumeCardHighlight}>
                    <div className={styles.resumeCardInfo}>
                      <h4>Candidate Resume (Google Drive)</h4>
                      <p>Uploaded via Join Us application portal</p>
                    </div>
                    {selResume ? (
                      <a 
                        href={selResume} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.resumePrimaryBtn}
                      >
                        <HiExternalLink /> Open Resume in Google Drive
                      </a>
                    ) : (
                      <span className={styles.resumeBtnDisabled}>Resume Not Attached</span>
                    )}
                  </div>

                  {/* Academic & Contact Details Grid */}
                  <div className={styles.appDetailsGrid}>
                    <div className={styles.appDetailCard}>
                      <div className={styles.appDetailCardLabel}>Email Address</div>
                      <div className={styles.appDetailCardValue}>
                        <a href={`mailto:${selEmail}`}>{selEmail}</a>
                      </div>
                    </div>

                    <div className={styles.appDetailCard}>
                      <div className={styles.appDetailCardLabel}>Phone Number</div>
                      <div className={styles.appDetailCardValue}>
                        {selPhone ? (
                          <a href={`tel:${selPhone}`}>{selPhone}</a>
                        ) : 'Not specified'}
                      </div>
                    </div>

                    <div className={styles.appDetailCard}>
                      <div className={styles.appDetailCardLabel}>Branch / Department</div>
                      <div className={styles.appDetailCardValue}>
                        {selBranch}
                      </div>
                    </div>

                    <div className={styles.appDetailCard}>
                      <div className={styles.appDetailCardLabel}>Academic Standing</div>
                      <div className={styles.appDetailCardValue}>
                        {selSem}
                      </div>
                    </div>

                    {selectedApplication.github && (
                      <div className={styles.appDetailCard}>
                        <div className={styles.appDetailCardLabel}>GitHub Profile</div>
                        <div className={styles.appDetailCardValue}>
                          <a href={selectedApplication.github} target="_blank" rel="noopener noreferrer">
                            {selectedApplication.github.replace('https://', '')}
                          </a>
                        </div>
                      </div>
                    )}

                    {selectedApplication.linkedin && (
                      <div className={styles.appDetailCard}>
                        <div className={styles.appDetailCardLabel}>LinkedIn Profile</div>
                        <div className={styles.appDetailCardValue}>
                          <a href={selectedApplication.linkedin} target="_blank" rel="noopener noreferrer">
                            {selectedApplication.linkedin.replace('https://', '')}
                          </a>
                        </div>
                      </div>
                    )}

                    {selectedApplication.portfolio && (
                      <div className={styles.appDetailCard}>
                        <div className={styles.appDetailCardLabel}>Portfolio / Works</div>
                        <div className={styles.appDetailCardValue}>
                          <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer">
                            {selectedApplication.portfolio.replace('https://', '')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Domains of Interest */}
                  <div className={styles.appSectionBox}>
                    <h4>Domains of Interest</h4>
                    <div className={styles.domainChips}>
                      {selDomains.map(d => (
                        <span key={d} className={styles.domainChip} style={{ fontSize: '0.82rem', padding: '0.25rem 0.65rem' }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Technical Skills */}
                  {selSkills && (
                    <div className={styles.appSectionBox}>
                      <h4>Technical Proficiencies & Tools</h4>
                      <p className={styles.appSectionContent}>{selSkills}</p>
                    </div>
                  )}

                  {/* Why Join Code Troopers */}
                  {selMotivation && (
                    <div className={styles.appSectionBox}>
                      <h4>Why Code Troopers?</h4>
                      <p className={styles.appSectionContent} style={{ fontStyle: 'italic' }}>
                        "{selMotivation}"
                      </p>
                    </div>
                  )}

                  {/* Change Status Decision Toolbar */}
                  <div className={styles.appSectionBox}>
                    <h4>Decision & Recruitment Status</h4>
                    <div className={styles.statusButtonToolbar}>
                      <button 
                        type="button" 
                        className={`${styles.actionStatusBtn} ${styles.btnPending}`}
                        onClick={() => handleUpdateAppStatus(selId, 'pending')}
                      >
                        <HiClock /> Mark Pending
                      </button>
                      <button 
                        type="button" 
                        className={`${styles.actionStatusBtn} ${styles.btnReviewing}`}
                        onClick={() => handleUpdateAppStatus(selId, 'reviewing')}
                      >
                        <HiEye /> Under Review
                      </button>
                      <button 
                        type="button" 
                        className={`${styles.actionStatusBtn} ${styles.btnShortlist}`}
                        onClick={() => handleUpdateAppStatus(selId, 'shortlisted')}
                      >
                        <HiSparkles /> Shortlist Candidate
                      </button>
                      <button 
                        type="button" 
                        className={`${styles.actionStatusBtn} ${styles.btnAccept}`}
                        onClick={() => handleUpdateAppStatus(selId, 'accepted')}
                      >
                        <HiCheckCircle /> Accept Candidate
                      </button>
                      <button 
                        type="button" 
                        className={`${styles.actionStatusBtn} ${styles.btnReject}`}
                        onClick={() => handleUpdateAppStatus(selId, 'rejected')}
                      >
                        <HiXCircle /> Reject
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button 
                    type="button" 
                    className={styles.cancelBtn} 
                    onClick={() => setSelectedApplication(null)}
                  >
                    Close Profile
                  </button>
                  <button 
                    type="button" 
                    className={styles.deleteBtn}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem' }}
                    onClick={() => {
                      setSelectedApplication(null);
                      setDeleteTarget({ type: 'application', id: selId, title: `${selName} (${selUsn !== '—' ? selUsn : selEmail})` });
                    }}
                  >
                    <HiTrash /> Delete Application
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
