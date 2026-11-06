import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiCalendar, 
  HiClock, 
  HiArrowLeft, 
  HiShare, 
  HiHeart, 
  HiSparkles 
} from 'react-icons/hi';
import { getBlogById, getBlogs } from '../services/api';
import SEOHead from '../components/SEOHead';
import styles from './BlogDetail.module.css';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getBlogById(id);
        setBlog(res.data);

        const listRes = await getBlogs({ status: 'published' });
        setRecentBlogs((listRes.data?.blogs || []).filter(b => b.id !== id).slice(0, 3));
      } catch (err) {
        console.error('Failed to load blog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading dispatch...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Article Not Found</h2>
        <p>The dispatch you requested could not be located in the archives.</p>
        <Link to="/blogs" className={styles.backBtn}><HiArrowLeft /> Back to Blogs</Link>
      </div>
    );
  }

  return (
    <article className={styles.detailPage}>
      <SEOHead 
        title={`${blog.title} — CodeTroopers Blog`}
        description={blog.summary || blog.title}
        image={blog.coverImage}
      />

      <div className={styles.heroSection}>
        <div className={styles.container}>
          <Link to="/blogs" className={styles.backLink}>
            <HiArrowLeft /> Back to all articles
          </Link>

          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>{blog.category || 'Article'}</span>
            <div className={styles.metaInfo}>
              <span><HiCalendar /> {blog.date}</span>
              <span><HiClock /> {blog.readTime || '5 min read'}</span>
            </div>
          </div>

          <h1 className={styles.mainTitle}>{blog.title}</h1>

          <p className={styles.leadSummary}>{blog.summary}</p>

          <div className={styles.authorBar}>
            <div className={styles.authorAvatar}>
              {blog.author?.charAt(0) || 'T'}
            </div>
            <div className={styles.authorDetails}>
              <span className={styles.authorName}>{blog.author}</span>
              <span className={styles.authorRole}>{blog.authorRole}</span>
            </div>

            <div className={styles.actionButtons}>
              <button 
                type="button" 
                className={`${styles.iconBtn} ${liked ? styles.liked : ''}`} 
                onClick={() => setLiked(!liked)}
                title="Applaud dispatch"
              >
                <HiHeart /> <span>{(blog.likes || 0) + (liked ? 1 : 0)}</span>
              </button>
              <button 
                type="button" 
                className={styles.iconBtn} 
                onClick={handleShare}
                title="Share article"
              >
                <HiShare /> <span>{copied ? 'Copied Link!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {blog.coverImage && (
        <div className={styles.coverWrapper}>
          <img 
            src={blog.coverImage} 
            alt={blog.title} 
            className={styles.coverImg}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/uploads/technical-talks/cover.jpg';
            }}
          />
        </div>
      )}

      {/* Main Content Body */}
      <div className={styles.container}>
        <div className={styles.articleContent}>
          {blog.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className={styles.subheading}>{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
              const items = paragraph.split('\n');
              return (
                <ul key={index} className={styles.contentList}>
                  {items.map((it, i) => (
                    <li key={i}>{it.replace(/^(\d+\. |-\s*)/, '')}</li>
                  ))}
                </ul>
              );
            }
            return <p key={index} className={styles.paragraph}>{paragraph}</p>;
          })}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className={styles.tagsContainer}>
            <span className={styles.tagsLabel}>Filed under:</span>
            <div className={styles.tagChips}>
              {blog.tags.map(tag => (
                <span key={tag} className={styles.tagChip}>#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {recentBlogs.length > 0 && (
          <div className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <HiSparkles className={styles.sparkle} />
              <h2>More from CodeTroopers</h2>
            </div>
            <div className={styles.relatedGrid}>
              {recentBlogs.map(rb => (
                <Link key={rb.id} to={`/blogs/${rb.id}`} className={styles.relatedCard}>
                  <img src={rb.coverImage || '/uploads/technical-talks/cover.jpg'} alt={rb.title} />
                  <div className={styles.relatedInfo}>
                    <span className={styles.relatedCat}>{rb.category}</span>
                    <h4>{rb.title}</h4>
                    <span className={styles.relatedDate}>{rb.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
