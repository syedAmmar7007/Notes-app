import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firbase-config";
import { useAuth } from "../store/notes-app-store";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "notes"),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      setNotes(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    });

    return () => unsub();
  }, [user]);

  const categories = ["all", "Work", "Personal", "Other"];

  const filteredNotes = notes.filter((note) => {
    const matchTitle = note.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || note.category === category;
    return matchTitle && matchCategory;
  });

  const handleDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    await deleteDoc(doc(db, "users", user.uid, "notes", id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">My Notes</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/create")}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium"
          >
            + New Note
          </button>
          <button
            onClick={logout}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="col-span-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="
              group relative
              bg-slate-900/90
              border border-slate-800
              rounded-2xl
              overflow-hidden
              transition-all duration-300 ease-out
              hover:-translate-y-2 hover:scale-[1.02]
              hover:shadow-2xl hover:shadow-indigo-500/10
              hover:ring-1 hover:ring-indigo-500/40
            "
          >
            {note.imageUrl && (
              <div className="overflow-hidden">
                <img
                  src={note.imageUrl}
                  alt="note"
                  className="
                    w-full h-44 object-cover
                    transition-transform duration-500
                    group-hover:scale-110
                  "
                />
              </div>
            )}

            <div className="p-5 space-y-3">
              <h3 className="text-lg font-semibold tracking-wide line-clamp-1">
                {note.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                {note.content}
              </p>

              <span
                className="
                  inline-flex items-center
                  text-xs font-medium
                  px-3 py-1
                  rounded-full
                  bg-indigo-500/10
                  text-indigo-400
                  border border-indigo-500/20
                "
              >
                {note.category}
              </span>
            </div>

            <div
              className="
                flex gap-3 px-5 pb-5
                opacity-90
                translate-y-2
                transition-all duration-300
                group-hover:opacity-100 group-hover:translate-y-0
              "
            >
              <button
                onClick={() => navigate(`/edit/${note.id}`)}
                className="
                  flex-1 py-2 rounded-xl
                  bg-slate-800
                  hover:bg-indigo-600
                  transition-all duration-200
                  text-sm font-medium
                "
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(note.id)}
                className="
                  flex-1 py-2 rounded-xl
                  bg-red-600/90
                  hover:bg-red-600
                  transition-all duration-200
                  text-sm font-medium
                "
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <p className="text-center text-slate-500 mt-16">No notes found</p>
      )}
    </div>
  );
}
