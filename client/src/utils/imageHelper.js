export const formatImageUrl = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return url;
  if (url.includes('dummy')) {
    return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80';
  }
  if (url.includes('drive.google.com')) {
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch?.[1]) {
      return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w2000`;
    }
  }
  return url;
};
