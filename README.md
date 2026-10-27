# Threadbase - Upload UI Starter

Starter repo for **LU 4.10 - React Upload UI**.

The server (multer upload endpoint from 4.9) is complete. The client has an `AvatarUploader.jsx` with a plain file input and a stub upload. Your job: add drag-and-drop, client validation, a local preview, and an Axios upload with a progress bar.

## Setup

```bash
# Terminal 1 - the upload server (do NOT edit)
cd server && cp .env.example .env && npm install && npm start   # http://localhost:3001

# Terminal 2 - the React app
cd client && cp .env.development.example .env.development && npm install && npm run dev
```

## The file to edit

`client/src/components/AvatarUploader.jsx` - follow the TODO comments:

1. **Drag-and-drop** - `onDragOver` / `onDragLeave` / `onDrop`, `e.preventDefault()` on dragOver and drop, read `e.dataTransfer.files[0]`, toggle `isDragging`.
2. **Validation** - check `file.type` and `file.size` (5MB) before uploading.
3. **Preview** - `URL.createObjectURL(file)` as `<img src>`, revoke in a `useEffect` cleanup.
4. **Upload** - `FormData` with field `avatar`, Axios `onUploadProgress`, no manual `Content-Type`.

Do **not** edit the `server/` folder.

## Test your work

Drag an image → previews (does not open in a new tab). Click Upload → progress bar fills 0 to 100, server returns a URL. Drop a PDF → client error, no upload. Network tab → the request `Content-Type` shows `multipart/form-data; boundary=...` (browser-set).

CSS classes provided in `index.css`: `drop-zone`, `dragging`, `preview`, `bar`, `fill`, `error`.
