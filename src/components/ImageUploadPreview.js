import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import FirebaseStorageService from "../FirebaseStorageService";
import { upload } from "@testing-library/user-event/dist/upload";

function ImageUploadPreview({
  basePath,
  existingImageURL,
  handleUploadFinish,
  handleUploadCancel,
}) {
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [imageURL, setImageURL] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    if (existingImageURL) {
      setImageURL(existingImageURL);
    } else {
      setUploadProgress(-1);
      setImageURL("");
      fileInputRef.current.value = null;
    }
  }, [existingImageURL]);

  async function handleFileChange(event) {
    const files = event.target.files;
    const file = files[0];
    if (!file) {
      alert("No Files Selected!");
      return;
    }
    const generatedFileID = uuidv4();
    try {
      const downloadURL = await FirebaseStorageService.uploadFile(
        file,
        `${basePath}/${generatedFileID}`,
        setUploadProgress
      );
      setImageURL(downloadURL);
      handleUploadFinish(downloadURL);
    } catch (error) {
      setUploadProgress(-1);
      fileInputRef.current.value = null;
      alert(error.message);
      throw error;
    }
  }

  function handleCancelImageClick() {
    FirebaseStorageService.deleteFile(imageURL);
    fileInputRef.current.value = null;
    setImageURL("");
    setUploadProgress(-1);
    handleUploadCancel();
  }

  return (
    <div className="image-upload-preview-container">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        hidden={uploadProgress > -1 || imageURL}
      />
      {!imageURL && uploadProgress > -1 ? (
        <div>
          <label htmlFor="file">UploadProgress:</label>
          <progress id="file" value={uploadProgress} max="100">
            {uploadProgress}&
          </progress>
          <span>{uploadProgress}%</span>
        </div>
      ) : null}
      {imageURL ? (
        <div className="image-preview">
          <img src={imageURL} alt={imageURL} className="image" />
          <button
            type="button"
            onClick={handleCancelImageClick}
            className="pripary-button"
          >
            Cancel Image
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ImageUploadPreview;
