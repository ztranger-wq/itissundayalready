import React from 'react';

const UploadArtwork = ({ artworkFile, setArtworkFile }) => {
  const handleFileChange = (e) => {
    setArtworkFile(e.target.files[0]);
  };

  return (
    <div className="customization-option upload-artwork">
      <label htmlFor="uploadArtwork">Upload Artwork</label>
      <input
        type="file"
        id="uploadArtwork"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
      />
      {artworkFile && <p>Selected file: {artworkFile.name}</p>}
    </div>
  );
};

export default UploadArtwork;
