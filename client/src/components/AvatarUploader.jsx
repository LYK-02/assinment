import { useEffect, useRef, useState } from "react";
import apiClient from "../services/apiClient.js";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function AvatarUploader() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!preview) return undefined;

    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function selectFile(selectedFile) {
    if (!selectedFile) return;

    if (!ALLOWED.includes(selectedFile.type)) {
      setFile(null);
      setPreview("");
      setError("Only image files are allowed (JPEG, PNG, WebP, GIF)");
      return;
    }

    if (selectedFile.size > MAX_SIZE) {
      setFile(null);
      setPreview("");
      setError("File is too large (max 5MB)");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError("");
    setProgress(0);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    selectFile(e.dataTransfer.files[0]);
  }

  async function upload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    setError("");
    setProgress(0);

    try {
      await apiClient.post("/api/upload", formData, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });
    } catch (uploadError) {
      setError(
        uploadError.response?.data?.message ||
          "Upload failed. Please try again.",
      );
      setProgress(0);
    }
  }

  return (
    <div>
      <div
        className={isDragging ? "drop-zone dragging" : "drop-zone"}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>Drag an image here, or click to choose</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            selectFile(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {preview && <img src={preview} alt="Selected avatar preview" className="preview" />}
      {progress > 0 && progress < 100 && (
        <div className="bar">
          <div className="fill" style={{ width: `${progress}%` }} />
        </div>
      )}
      <button onClick={upload} disabled={!file || progress > 0 && progress < 100}>
        Upload
      </button>
    </div>
  );
}
