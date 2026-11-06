import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiClock, 
  HiCalendar, 
  HiUser, 
  HiSearch, 
  HiTag, 
  HiArrowRight, 
  HiSparkles 
} from 'react-icons/hi';
import { getBlogs } from '../services/api';
import PageHeader from '../components/PageHeader';
import SEOHead from '../components/SEOHead';
import styles from './Blogs.module.css';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await getBlogs({ status: 'published' });
        setBlogs(res.data?.blogs || []);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const categories = ['all', ...Array.from(new Set(blogs.map(b => b.category).filter(Boolean)))];

  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedCategory === 'all' || b.category?.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery = !query || 
      b.title.toLowerCase().includes(query) || 
      b.summary?.toLowerCase().includes(query) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(query)));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className={styles.blogsPage}>
      <SEOHead 
        title="Blogs & Technical Articles — CodeTroopers"
        description="Explore in-depth technical writings, hackathon war stories, and system architecture deep-dives from CodeTroopers members and mentors."
      />

      <PageHeader 
        title="Dispatches & Insights" 
        subtitle="Technical treatises, engineering case studies, and field notes from the troopers"
      />

      <div className={styles.container}>
        {/* Filter & Search Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.categoryPills}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`${styles.pillBtn} ${selectedCategory === cat ? styles.activePill : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.searchWrapper}>
            <HiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search articles, tags, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content State */}
        {loading ? (
          <div className={styles.loadingGrid}>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className={styles.emptyState}>
            <HiSparkles className={styles.emptyIcon} />
            <h3>No Dispatches Found</h3>
            <p>Try refining your search terms or category filter to discover articles.</p>
          </div>
        ) : (
          <div className={styles.blogsGrid}>
            {filteredBlogs.map((blog, idx) => (
              <motion.article 
                key={blog.id} 
                className={styles.blogCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
              >
                <div className={styles.imageWrapper}>
                  <img 
                    src={blog.coverImage || '/uploads/technical-talks/cover.jpg'} 
                    alt={blog.title} 
                    className={styles.cardImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/uploads/technical-talks/cover.jpg';
                    }}
                  />
                  <span className={styles.categoryBadge}>{blog.category || 'Article'}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span><HiCalendar /> {blog.date}</span>
                    <span><HiClock /> {blog.readTime || '5 min read'}</span>
                  </div>

                  <h2 className={styles.cardTitle}>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </h2>

                  <p className={styles.cardSummary}>{blog.summary}</p>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className={styles.tagList}>
                      {blog.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.tagChip}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <div className={styles.authorInfo}>
                      <span className={styles.authorName}>{blog.author}</span>
                      <span className={styles.authorRole}>{blog.authorRole}</span>
                    </div>

                    <Link to={`/blogs/${blog.id}`} className={styles.readBtn}>
                      Read <HiArrowRight />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
