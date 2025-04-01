import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import '../../styles/Chat.css';
import HeaderPages from '../HeaderPages';
import { useLocation } from 'react-router-dom';
import NavigationBar from '../NavigationBar/NavigationBar'; // استيراد شريط التنقل
function Chat() {
  const { user } = useSelector((state) => state.user);
  const accessToken = localStorage.getItem('accessToken');
  const location = useLocation();
  const isChatbotMode = location.pathname === '/chat/bot'; // تحديد الوضع بناءً على المسار

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!user || !accessToken) return;

    const newSocket = io('http://localhost:8080', {
      auth: {
        token: accessToken,
        userId: user._id,
      },
    });

    setSocket(newSocket);

    newSocket.on("newMessage", ({ roomId, message }) => {
      if (message.userId === "chatbot") {
        const words = message.content.split(' ');
        let currentText = '';
        words.forEach((word, index) => {
          setTimeout(() => {
            currentText += (index > 0 ? ' ' : '') + word;
            setDisplayedMessages((prev) => {
              const updated = prev.filter((m) => m.timestamp !== message.timestamp || m.userId !== "chatbot");
              return [...updated, { ...message, content: currentText, roomId }];
            });
          }, index * 100);
        });
      } else {
        setMessages((prev) => [...prev, { ...message, roomId }]);
        setDisplayedMessages((prev) => [...prev, { ...message, roomId }]);
      }
    });

    newSocket.on("error", ({ message }) => {
      alert(`Error: ${message}`);
    });

    return () => {
      newSocket.off("newMessage");
      newSocket.off("error");
      newSocket.disconnect();
    };
  }, [user, accessToken]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    const userMessage = {
      userId: user._id,
      content: input,
      timestamp: new Date(),
      username: `${user.firstName} ${user.lastName}`,
      profileImage: user.profileImage || "https://via.placeholder.com/40",
      roomId: isChatbotMode ? `chatbot_${user._id}` : "liveChat",
    };

    if (isChatbotMode) {
      setDisplayedMessages((prev) => [...prev, userMessage]);
      socket.emit("chatbotMessage", { content: input });
    } else {
      socket.emit("sendMessage", {
        roomId: "liveChat",
        userId: user._id,
        content: input,
        username: `${user.firstName} ${user.lastName}`,
        profileImage: user.profileImage || "https://via.placeholder.com/40",
      });
    }
    setInput('');
  };

  if (!user) {
    return <div className="alert alert-warning text-center">Please log in to use the chat!</div>;
  }

  return (
    <>
      <HeaderPages title={isChatbotMode ? 'Chat with AI' : 'Live Chat'} />
      <NavigationBar /> 
      <div className="container mt-5 chat-page">
        <div className="chat-container card shadow-lg">
          {/* العنوان الثابت */}
          <div className="chat-header p-3 text-center">
            <h5 className="mb-0">
              {isChatbotMode ? 'Chatbot Assistant' : 'Public Chat Room'}
            </h5>
          </div>
          <div className="chat-window p-3">
            {displayedMessages
              .filter((msg) => (isChatbotMode ? msg.roomId.startsWith('chatbot_') : msg.roomId === 'liveChat'))
              .map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex mb-3 animate__animated animate__fadeInUp ${
                    msg.userId === user._id ? 'justify-content-end' : 'justify-content-start'
                  }`}
                >
                  {msg.userId !== user._id && (
                    <img
                      src={msg.profileImage}
                      alt="Profile"
                      className="rounded-circle me-2"
                      style={{ width: '40px', height: '40px' }}
                    />
                  )}
                  <div
                    className={`message-bubble p-3 rounded ${
                      msg.userId === user._id ? 'bg-primary text-white' : 'bg-light text-dark'
                    }`}
                  >
                    <strong>{msg.username}: </strong>{msg.content}
                  </div>
                  {msg.userId === user._id && (
                    <img
                      src={msg.profileImage}
                      alt="Profile"
                      className="rounded-circle ms-2"
                      style={{ width: '40px', height: '40px' }}
                    />
                  )}
                </div>
              ))}
            <div ref={chatEndRef} />
          </div>
          <div className="input-group p-3">
            <input
              type="text"
              className="form-control rounded-start"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isChatbotMode ? 'Ask the Chatbot...' : 'Type your message...'}
            />
            <button className="btn btn-success rounded-end" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;