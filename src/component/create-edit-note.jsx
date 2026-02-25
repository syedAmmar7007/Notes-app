import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firbase-config";
import { useAuth } from "../store/notes-app-store";

const CLOUD_NAME = "dptzo2axj";
const UPLOAD_PRESET = "notes_app";

export default function CreateEditNote() {
  const { user } = useAuth();
  const { id } = useParams(); // edit id
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(""); // 🔹 store existing image
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    const fetchNote = async () => {
      const ref = doc(db, "users", user.uid, "notes", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setExistingImageUrl(data.imageUrl || ""); // 🔹 store previous image
      }
    };

    fetchNote();
  }, [id, user]);

  const uploadImage = async () => {
    if (!image) return "";
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!title || !content || !category) return;

    setLoading(true);
    try {
      const uploadedImage = await uploadImage();
      const imageUrlToSave = uploadedImage || existingImageUrl || ""; // 🔹 fallback to previous or empty

      if (id) {
        await updateDoc(doc(db, "users", user.uid, "notes", id), {
          title,
          content,
          category,
          imageUrl: imageUrlToSave,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "users", user.uid, "notes"), {
          title,
          content,
          category,
          imageUrl: imageUrlToSave,
          createdAt: serverTimestamp(),
        });
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-0px)] bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl animate-[fadeInUp_0.4s_ease-out]">
        <h2 className="text-2xl font-semibold mb-6 tracking-wide">
          {id ? "Edit Note" : "Create Note"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            required
          />

          <textarea
            placeholder="Write your note..."
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none resize-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            required
          >
            <option value="">Select category</option>
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-6 cursor-pointer text-sm text-slate-400 transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-500/5">
            <span>Click to upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </label>

          {existingImageUrl && !image && (
            <img
              src={existingImageUrl}
              alt="Existing Note"
              className="h-32 w-full object-cover rounded mb-3"
            />
          )}

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.97] transition-all duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Note"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
