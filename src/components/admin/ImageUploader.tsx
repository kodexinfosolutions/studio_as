'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

/**
 * Drag & drop uploader. Uploads directly to /api/admin/upload (server-side
 * Cloudinary upload), which validates file type/size, stores the asset, and
 * returns { url, publicId }. Supports single or multiple file upload.
 */
export default function ImageUploader({
  folder,
  multiple = false,
  onUploaded,
  currentUrl,
}: {
  folder: string;
  multiple?: boolean;
  onUploaded: (files: { url: string; publicId: string }[]) => void;
  currentUrl?: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return;
      setUploading(true);
      setProgress(0);
      try {
        const results: { url: string; publicId: string }[] = [];
        for (let i = 0; i < accepted.length; i++) {
          const file = accepted[i];
          if (file.size > 20 * 1024 * 1024) {
            toast.error(`${file.name} exceeds 20MB limit`);
            continue;
          }
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', folder);
          const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Upload failed');
          }
          const data = await res.json();
          results.push(data);
          setProgress(Math.round(((i + 1) / accepted.length) * 100));
        }
        onUploaded(results);
        toast.success(`Uploaded ${results.length} file(s)`);
      } catch (e: any) {
        toast.error(e.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [folder, onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: { 'image/*': [], 'video/*': [] },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed p-8 text-center transition ${
          isDragActive ? 'border-black bg-black/5' : 'border-black/20 hover:border-black/40'
        }`}
      >
        <input {...getInputProps()} />
        {currentUrl && !uploading && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="current" className="mb-4 h-32 w-auto object-cover" />
        )}
        {uploading ? (
          <p className="text-sm text-black/60">Uploading… {progress}%</p>
        ) : (
          <p className="text-sm text-black/60">
            Drag & drop {multiple ? 'images' : 'an image'} here, or click to browse
          </p>
        )}
      </div>
    </div>
  );
}
