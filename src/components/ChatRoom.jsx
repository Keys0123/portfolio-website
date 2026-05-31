import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export default function ChatRoom() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Ambil pesan real-time
  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Kirim komentar
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !name.trim()) return;

    await addDoc(collection(db, "comments"), {
      text: message,
      name: name,
      createdAt: serverTimestamp()
    });
    setMessage("");
  };

  return (
    <div className="bg-zinc-900 border border-gray-700 p-6 rounded-xl shadow-lg max-w-xl mx-auto mt-5">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">💬 Chat Room</h2>

      {/* Area pesan */}
      <div className="h-72 overflow-y-auto border border-gray-700 p-3 rounded-lg bg-zinc-800 mb-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-2 justify-start">
              <div className="p-3 rounded-lg max-w-[75%] bg-gray-700 text-white">
                <div className="text-sm font-semibold mb-1 text-blue-300">{msg.name}</div>
                <div className="text-sm">{msg.text}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form komentar */}
      <form onSubmit={sendMessage} className="flex flex-col gap-3 w-full mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          maxLength="30"
          className="w-full p-2 rounded-lg bg-zinc-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a comment..."
            maxLength="200"
            className="flex-1 min-w-0 p-2 rounded-lg bg-zinc-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!message.trim() || !name.trim()}
            className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto transition"
          >
            Post
          </button>
        </div>
      </form>

      {/* WhatsApp Option */}
      <div className="flex flex-col items-center justify-center gap-4 pt-4 border-t border-gray-700">
        <p className="text-sm text-gray-400">Or reach out directly:</p>
        <a
          href="https://wa.me/9779761727883?text=Hi%2C%20I%20found%20you%20on%20your%20portfolio!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-green-600 text-white px-5 py-2 rounded-full shadow hover:bg-green-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.52 3.48A11.88 11.88 0 0012 .5 11.85 11.85 0 003.48 3.48 11.86 11.86 0 000 12c0 2.09.55 4.14 1.6 5.95L0 24l6.38-1.65A11.9 11.9 0 0012 24c3.18 0 6.17-1 8.52-2.92A11.86 11.86 0 0024 12a11.86 11.86 0 00-3.48-8.52z"/>
            <path d="M17.6 14.47c-.27-.13-1.61-.79-1.86-.88-.25-.09-.43-.13-.61.13-.18.26-.7.88-.86 1.06-.16.18-.33.21-.6.07a6.24 6.24 0 01-1.86-1.15c-.34-.34-.63-.76-.9-1.39-.1-.23 0-.34.07-.45.07-.1.16-.24.24-.36.08-.12.11-.2.17-.33.06-.13.03-.24-.01-.34-.07-.19-.61-1.5-.84-2.07-.22-.54-.45-.46-.62-.47-.15-.01-.33-.01-.5-.01-.18 0-.46.07-.7.34-.23.26-.89.87-.89 2.13 0 1.26.91 2.48 1.03 2.65.12.18 1.78 2.78 4.32 3.9 3.02 1.4 3.02.93 3.57.87.55-.06 1.79-.73 2.04-1.44.25-.71.25-1.31.18-1.44-.06-.13-.23-.2-.49-.33z"/>
          </svg>
          Message on WhatsApp
        </a>
      </div>
    </div>
  );
}

