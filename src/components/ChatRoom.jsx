import { useState, useEffect } from "react";
import { auth, loginWithGoogle, logout, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export default function ChatRoom() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Cek login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Ambil pesan real-time
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Kirim pesan
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp()
    });
    setMessage("");
  };

  const openWhatsApp = () => {
    try {
      const text = `Hi, I found you on your portfolio! I'm on ${window.location.href}`;
      const url = `https://wa.me/9779761727883?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Unable to open WhatsApp', err);
    }
  };

  return (
    <div className="bg-zinc-900 border border-gray-700 p-6 rounded-xl shadow-lg max-w-xl mx-auto mt-5">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">💬 Chat Room</h2>

      {/* Header user */}
      {user && (
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <div className="flex items-center gap-3">
            <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full" />
            <span className="text-white font-semibold">{user.displayName}</span>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 px-4 py-1 rounded-full text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}

      {/* Area pesan */}
      <div className="h-72 overflow-y-auto border border-gray-700 p-3 rounded-lg bg-zinc-800 mb-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.uid === user?.uid ? "justify-end" : "justify-start"}`}
          >
            {msg.uid !== user?.uid && (
              <img
                src={msg.photoURL || "https://via.placeholder.com/40"}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div
              className={`p-3 rounded-lg max-w-[75%] ${
                msg.uid === user?.uid
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              <div className="text-xs opacity-70 mb-1">{msg.displayName}</div>
              <div>{msg.text}</div>
            </div>
            {msg.uid === user?.uid && (
              <img
                src={msg.photoURL || "https://via.placeholder.com/40"}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        ))}
      </div>

      {/* Form login / kirim pesan */}
      {user ? (
        <form onSubmit={sendMessage} className="flex gap-2 flex-wrap sm:flex-nowrap w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 min-w-0 p-2 rounded-lg bg-zinc-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded-lg text-white hover:bg-green-700 w-full sm:w-auto"
          >
            Send
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
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
          <p className="text-sm text-gray-400">Open WhatsApp to message me directly</p>
        </div>
      )}
    </div>
  );
}
