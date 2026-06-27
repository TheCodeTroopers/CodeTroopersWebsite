import { useEffect } from 'react';

export default function SEOHead({ title, description, path = '' }) {
  const fullTitle = title ? `${title} | Code Troopers` : 'Code Troopers — Learn. Build. Lead.';
  const desc = description || 'Code Troopers — Transforming Students into Industry-Ready Developers. Join our technical club for workshops, hackathons, and project-based learning.';

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', desc);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', desc, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', `https://codetroopers.club${path}`, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
  }, [fullTitle, desc, path]);

  return null;
}
