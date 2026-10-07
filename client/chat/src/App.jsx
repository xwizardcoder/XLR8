import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
      setTypingUser("");
    });

    socket.on("user_joined", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          system: true,
          message: `${data.username} joined the chat`,
        },
      ]);
    });

    socket.on("user_left", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          system: true,
          message: `${data.username} left the chat`,
        },
      ]);
    });

    socket.on("user_typing", (data) => {
      setTypingUser(data.username);
    });

    socket.on("user_stop_typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUser]);

  const joinChat = () => {
    if (!username.trim()) return;

    socket.emit("join_chat", username.trim());
    setJoined(true);
  };

  const handleTyping = (e) => {
    const value = e.target.value;

    setMessage(value);

    if (value.trim()) {
      socket.emit("typing");
    } else {
      socket.emit("stop_typing");
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", message.trim());
    socket.emit("stop_typing");

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              XLR8
            </h1>

            <p className="text-slate-500 mt-2">
              Real-time messaging
            </p>
          </div>

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your name
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                joinChat();
              }
            }}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            onClick={joinChat}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-6xl h-screen sm:h-[92vh] bg-white sm:rounded-2xl shadow-lg overflow-hidden flex">

        <aside className="hidden md:flex w-72 bg-slate-900 text-white flex-col">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-2xl font-bold">
              XLR8
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Real-time messaging
            </p>
          </div>

          <div className="p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
              Profile
            </p>

            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
                {username.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="font-medium truncate">
                  {username}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>

                  <span className="text-xs text-slate-400">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 mt-2">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
              Chat
            </p>

            <div className="p-3 bg-blue-600 rounded-xl">
              <p className="font-medium">
                General Chat
              </p>

              <p className="text-xs text-blue-200 mt-1">
                Live conversation
              </p>
            </div>
          </div>

          <div className="mt-auto p-6">
            <p className="text-xs text-slate-500">
              XLR8
            </p>
          </div>
        </aside>

        <main className="flex-1 min-w-0 flex flex-col">

          <header className="h-16 sm:h-20 border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">
                General Chat
              </h2>

              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>

                <span className="text-xs text-slate-500">
                  Live
                </span>
              </div>
            </div>

            <span className="text-xs text-slate-400 hidden sm:block">
              XLR8
            </span>
          </header>

          <section className="flex-1 overflow-y-auto scrollbar-hide bg-slate-50 p-4 sm:p-6">
            <div className="space-y-4">

              {messages.map((item, index) => {
                if (item.system) {
                  return (
                    <div
                      key={index}
                      className="flex justify-center py-2"
                    >
                      <span className="text-xs text-slate-400">
                        {item.message}
                      </span>
                    </div>
                  );
                }

                const isMe = item.socketId === socket.id;

                return (
                  <div
                    key={index}
                    className={`flex ${
                      isMe
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="max-w-[85%] sm:max-w-[70%]">

                      {!isMe && (
                        <p className="text-xs font-medium text-slate-500 mb-1 ml-1">
                          {item.username}
                        </p>
                      )}

                      <div
                        className={`px-4 py-3 rounded-2xl break-words text-sm sm:text-base ${
                          isMe
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-md"
                        }`}
                      >
                        {item.message}
                      </div>

                    </div>
                  </div>
                );
              })}

              {typingUser && (
                <div className="flex items-center gap-2">
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400">
                    {typingUser} is typing...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </section>

          <footer className="p-3 sm:p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2 bg-slate-100 p-2 rounded-xl">

              <input
                type="text"
                value={message}
                onChange={handleTyping}
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
                className="flex-1 min-w-0 bg-transparent outline-none px-2 sm:px-3 text-sm sm:text-base text-slate-700 placeholder:text-slate-400"
              />

              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Send
              </button>

            </div>

            <p className="hidden sm:block text-center text-[11px] text-slate-400 mt-2">
              Press Enter to send
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}

export default App;