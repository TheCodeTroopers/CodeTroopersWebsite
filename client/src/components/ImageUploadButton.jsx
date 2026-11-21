import { useRef, useState } from 'react';
import { compressImage } from '../utils/compressImage';
import { uploadImage } from '../services/api';
import styles from './ImageUploadButton.module.css';

/**
 * "Upload from device" button for admin forms.
 * Compresses each chosen photo in the browser, uploads it, and returns the public URLs
 * through onUploaded(urls). The URL text fields keep working, so pasting a link still works.
 */
export default function ImageUploadButton({ folder = 'misc', multiple = false, onUploaded, label }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = ''; // allow choosing the same file again
    if (!files.length) return;

    setBusy(true);
    setError('');
    const urls = [];
    const failed = [];

    for (let i = 0; i < files.length; i++) {
      setStatus(`Uploading ${i + 1} of ${files.length}…`);
      try {
        const compressed = await compressImage(files[i]);
        const res = await uploadImage(compressed, folder);
        urls.push(res.data.url);
      } catch (err) {
        failed.push(err.response?.data?.error || err.message || `Could not upload ${files[i].name}`);
      }
    }

    if (urls.length) onUploaded(urls);
    setStatus(urls.length ? `${urls.length} uploaded` : '');
    if (failed.length) setError(failed[0] + (failed.length > 1 ? ` (+${failed.length - 1} more failed)` : ''));
    setBusy(false);
  };

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        onChange={handleFiles}
        className={styles.hiddenInput}
      />
      <button
        type="button"
        className={styles.uploadBtn}
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? status : label || (multiple ? 'Upload photos' : 'Upload photo')}
      </button>
      {!busy && status && !error && <span className={styles.ok}>{status}</span>}
      {error && <span className={styles.err} role="alert">{error}</span>}
    </div>
  );
}
