// Chat.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Stylesheets/Chat.css";
import db, { auth } from "../firebase";
import firebase from "firebase/app";
import Message from './Message';
import EmojiPicker from 'emoji-picker-react';

function Chat({ noneSelected }) {
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // Load room name and messages
  useEffect(() => {
    if (roomId) {
      db.collection("rooms").doc(roomId).onSnapshot(snapshot => {
        setRoomName(snapshot.data()?.name);
      });

      db.collection("rooms").doc(roomId).collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot(snapshot => {
          const msgs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setMessages(msgs);
        });
    }
  }, [roomId]);

  // Scroll to bottom
  function scrollIntoView(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    if (!noneSelected) scrollIntoView('.chatBottom');
  }, [messages, noneSelected]);

  // Send message
  function sendMessage(event) {
    event.preventDefault();
    if (!input.trim()) return;
    if (!user) return alert("User not authenticated!");

    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      scrollIntoView('.chatBottom');
    });

    setInput("");
  }

  // Emoji click
  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const randomNum = () => Math.floor(Math.random() * 255);

  // Delete room
  function deleteRoom() {
    if (window.confirm("Are you sure you want to delete this room?")) {
      db.collection("rooms").doc(roomId).delete().then(() => {
        window.location.href = "/";
      }).catch(() => {
        console.error('Unable to delete room.');
      });
    }
  }

  // Go back (for mobile)
  function goBack() {
    scrollIntoView('.sidebar__header');
  }

  return !noneSelected ? (
    <div className="chat">
      <div className="chat__header">
        <div className="IconButton chat__backBtn" onClick={goBack}>
          <i className="fas fa-arrow-left"></i>
        </div>
        <div className="sidebarRoom__avatar"
          style={{ backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})` }}>
          {roomName[0]}
        </div>
        <h3 className="chat__headerName">{roomName}</h3>
        <div className="IconButton" onClick={deleteRoom}>
          <i className="fas fa-trash"></i>
        </div>
      </div>

      <div className="chat__body">
        {messages.map(message => (
          <Message
            key={message.id}
            roomId={roomId}
            messageId={message.id}
            name={message.name}
            message={message.message}
            timestamp={message.timestamp}
            person={user && message.name === user.displayName ? "sender" : ""}
          />
        ))}
        <span className="chatBottom"></span>
      </div>

      <div className="chat__footer">
        <form>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="emoji-toggle-button"
          >
            😊
          </button>

          {showEmojiPicker && (
            <div className="emoji-picker">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className="chat">
      <div className="noneSelected">
        <h3>Select a Room to start Messaging</h3>
      </div>
    </div>
  );
}

export default Chat;
