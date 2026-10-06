export const formatImageUrl = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return url;
  if (url.includes('drive.google.com')) {
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch?.[1]) {
      return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
    }
  }
  return url;
};
