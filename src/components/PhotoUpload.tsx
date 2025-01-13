import React, { useState, useRef } from 'react';
import { Photo } from '../types';

interface PhotoUploadProps {
  onUpload: (photo: Omit<Photo, 'id' | 'url'>) => void;
  type: Photo['type'];
  relatedId: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload, type, relatedId }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (preview) {
      onUpload({
        caption,
        uploadDate: new Date().toISOString(),
        type,
        relatedId
      });
      setPreview(null);
      setCaption('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Photo</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {preview && (
          <div>
            <img src={preview} alt="Preview" className="mt-2 max-h-48 rounded-lg" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!preview}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload Photo
        </button>
      </div>
    </div>
  );
};

export default PhotoUpload;