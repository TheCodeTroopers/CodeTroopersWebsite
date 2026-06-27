import { useState, useEffect, useMemo } from 'react';
import { HiSearch } from 'react-icons/hi';
import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import TeamCard from '../components/TeamCard';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animated';
import { teamCategories } from '../data/staticContent';
import { getTeam } from '../services/api';
import styles from './Team.module.css';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeam()
      .then(r => setMembers(r.data.members))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return members.filter(m => {
      const matchCategory = filter === 'all' || m.category === filter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        m.name.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q) ||
        (m.team && m.team.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [members, search, filter]);

  const grouped = useMemo(() => {
    const order = ['club-head', 'workbench-head', 'faculty-coordinator', 'team-lead', 'co-lead', 'member'];
    const groups = {};
    filtered.forEach(m => {
      const cat = m.category || 'member';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(m);
    });
    return order.filter(k => groups[k]?.length).map(k => ({
      category: k,
      label: teamCategories.find(c => c.slug === k)?.label || k,
      members: groups[k]
    }));
  }, [filtered]);

  return (
    <>
      <SEOHead title="Team" description="Meet the Code Troopers team — leaders, coordinators, and members." path="/team" />
      <PageHeader label="Our People" title="Meet the Team" subtitle="The passionate individuals driving Code Troopers forward." />

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className={styles.controls}>
              <div className={styles.searchBox}>
                <HiSearch />
                <input
                  type="text"
                  placeholder="Search by name, position, or department..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className={styles.filters}>
                {teamCategories.map(c => (
                  <button
                    key={c.slug}
                    className={`${styles.filterBtn} ${filter === c.slug ? styles.active : ''}`}
                    onClick={() => setFilter(c.slug)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {loading ? (
            <p className={styles.loading}>Loading team...</p>
          ) : filtered.length === 0 ? (
            <p className={styles.empty}>No members found matching your search.</p>
          ) : filter === 'all' ? (
            grouped.map(group => (
              <div key={group.category} className={styles.group}>
                <FadeIn>
                  <h2 className={styles.groupTitle}>{group.label}</h2>
                </FadeIn>
                <StaggerContainer className="grid-4">
                  {group.members.map(m => (
                    <StaggerItem key={m.id}><TeamCard member={m} /></StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            ))
          ) : (
            <StaggerContainer className="grid-4">
              {filtered.map(m => (
                <StaggerItem key={m.id}><TeamCard member={m} /></StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </>
  );
}
