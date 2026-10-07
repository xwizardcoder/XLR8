# XLR8

XLR8 is a real-time chat application built with React and Socket.IO. It allows multiple users to join a common chat room, send messages instantly, see when another user is typing, and receive notifications when users join or leave the chat.

The application is designed with a responsive interface that works across desktop, tablet, and mobile devices.

## Features

* Real-time messaging
* Multiple users can chat simultaneously
* User name identification
* Join and leave notifications
* Real-time typing indicator
* Online status
* Automatic scrolling to the latest message
* Hidden chat scrollbar
* Enter key support for sending messages
* Responsive design
* Simple and clean chat interface
* Client-server communication using Socket.IO
* CORS enabled backend
* Express server for API and Socket.IO handling

## Tech Stack

### Frontend

* React.js
* JavaScript
* Tailwind CSS
* Socket.IO Client
* Vite

### Backend

* Node.js
* Express.js
* Socket.IO
* CORS

### Development Tools

* Visual Studio Code
* npm
* Git
* GitHub
* Browser Developer Tools

## Project Architecture

```text
XLR8
│
├── client
│   ├── src
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── ...
│
├── server
│   ├── server.js
│   ├── package.json
│   └── ...
│
└── README.md
```

The frontend and backend run as separate applications.

```text
React Client
     |
     | Socket.IO
     |
     v
Node.js + Express
     |
     v
Socket.IO Server
     |
     +----------------+
     |                |
     v                v
 Client 1          Client 2
```

## How Real-Time Messaging Works

XLR8 uses Socket.IO to establish a persistent connection between the browser and the server.

When a user sends a message:

```text
User types message
       |
       v
React
       |
       | socket.emit()
       v
Socket.IO Server
       |
       | io.emit()
       v
All Connected Clients
       |
       v
Message appears instantly
```

## Main Socket Events

### `join_chat`

Sent when a user enters their name and joins the application.

```js
socket.emit("join_chat", username);
```

The server stores the username on the user's socket connection.

```js
socket.username = username;
```

### `send_message`

Used when a user sends a message.

```js
socket.emit("send_message", message);
```

The server broadcasts the message to all connected users.

```js
io.emit("receive_message", {
  username: socket.username,
  message,
  socketId: socket.id
});
```

### `receive_message`

The frontend listens for new messages.

```js
socket.on("receive_message", (data) => {
  setMessages((prev) => [...prev, data]);
});
```

### `typing`

Sent when a user starts typing.

```js
socket.emit("typing");
```

The server broadcasts the event to other users.

```js
socket.broadcast.emit("user_typing", {
  username: socket.username
});
```

### `stop_typing`

Sent when the user clears the input or sends the message.

```js
socket.emit("stop_typing");
```

### `user_joined`

Used to notify connected users when someone joins the chat.

```js
io.emit("user_joined", {
  username
});
```

### `user_left`

Used when a user disconnects.

```js
io.emit("user_left", {
  username: socket.username
});
```

## Requirements

Before running the project, install:

* Node.js
* npm
* Git
* A modern web browser

Check Node.js:

```bash
node -v
```

Check npm:

```bash
npm -v
```

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd XLR8
```

## Frontend Setup

Move into the frontend directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Backend Setup

Open another terminal.

Move into the backend directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:8000
```

You should see:

```text
XLR8 server running on port 8000
```

## Required Backend Packages

The backend uses:

```bash
npm install express cors socket.io
```

### Express

Express is used to create and manage the Node.js HTTP server.

### Socket.IO

Socket.IO provides real-time bidirectional communication between the frontend and backend.

### CORS

CORS allows the React frontend and Node.js backend running on different ports to communicate.

## Required Frontend Packages

The frontend uses:

```bash
npm install socket.io-client
```

### React

React is used to build the user interface and manage application state.

### Socket.IO Client

The Socket.IO client connects the React application to the Socket.IO server.

### Tailwind CSS

Tailwind CSS is used to build the responsive user interface.

## How to Use

### Step 1

Start the backend:

```bash
node server.js
```

### Step 2

Start the frontend:

```bash
npm run dev
```

### Step 3

Open the application in your browser.

Enter a username:

```text
Saurabh
```

Click:

```text
Join Chat
```

### Step 4

Open another browser tab or another browser.

Enter another username:

```text
Rahul
```

Join the chat.

### Step 5

Send a message from either browser.

The message will appear immediately on both clients.

### Step 6

Start typing in one browser.

The other browser will display:

```text
Saurabh is typing...
```

## Responsive Design

XLR8 supports:

* Desktop
* Laptop
* Tablet
* Mobile

On larger screens, the application displays a sidebar containing the user's profile and chat information.

On smaller screens, the sidebar is hidden and the chat interface uses the available screen width.

## Automatic Scrolling

The chat automatically scrolls to the latest message.

React's `useRef` is used to keep a reference to the bottom of the message list.

```js
const messagesEndRef = useRef(null);
```

When a new message arrives:

```js
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [messages, typingUser]);
```

This keeps the latest conversation visible without requiring the user to manually scroll.

## Project Concepts Demonstrated

This project demonstrates several important frontend and backend concepts.

### React

* Components
* `useState`
* `useEffect`
* `useRef`
* Event handling
* Conditional rendering
* Rendering arrays with `map`
* Controlled inputs

### JavaScript

* Async/event-driven programming
* Objects
* Arrays
* Functions
* Template literals
* DOM-related concepts
* Event handling

### Node.js

* Server-side JavaScript
* HTTP server
* npm packages
* ES modules

### Express

* Server creation
* Routes
* Middleware
* CORS

### Socket.IO

* WebSocket-based communication
* Client-server events
* Broadcasting
* Connection handling
* Disconnect handling
* Real-time updates

### Tailwind CSS

* Responsive layouts
* Flexbox
* Spacing
* Typography
* Responsive breakpoints
* Component styling

## Folder Structure

A recommended structure is:

```text
XLR8/
│
├── client/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Environment

The current development configuration uses:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8000
```

If the frontend or backend port changes, update the Socket.IO connection accordingly.

Frontend:

```js
const socket = io("http://localhost:8000");
```

Backend CORS:

```js
cors: {
  origin: "http://localhost:5173"
}
```

## Troubleshooting

### Socket connection failed

Check that the backend is running:

```bash
node server.js
```

Then check:

```text
http://localhost:8000
```

You should see:

```text
XLR8 server is running
```

### CORS error

Make sure the frontend URL matches the backend CORS configuration.

```js
cors: {
  origin: "http://localhost:5173"
}
```

### Messages are not appearing

Check the browser console and backend terminal.

The server should display:

```text
Client connected: <socket-id>
```

### Port already in use

If port `8000` is already being used, change:

```js
const port = 8000;
```

Then update the frontend:

```js
const socket = io("http://localhost:YOUR_PORT");
```

## Future Improvements

Possible future versions of XLR8 can include:

* Private one-to-one messaging
* Multiple chat rooms
* Online users list
* Message timestamps
* Message history
* MongoDB integration
* User authentication
* JWT authentication
* User profiles
* Image/file sharing
* Message deletion
* Message editing
* Read receipts
* Notifications
* Better typing indicator with debounce
* Search messages
* Dark mode
* Production deployment

## Learning Outcomes

By building XLR8, developers can understand how a real-time application works from frontend to backend.

The project covers:

```text
React
  ↓
Socket.IO Client
  ↓
HTTP / WebSocket Connection
  ↓
Node.js
  ↓
Express
  ↓
Socket.IO Server
  ↓
Connected Clients
```

It is a good beginner-to-intermediate project for understanding real-time web applications.

## License

This project is available for learning and personal development purposes.

## Author

**Saurabh Vishwakarma**

GitHub: `https://github.com/xwizardcoder`

LinkedIn: `https://linkedin.com/in/saurabh-vishwakarma-227581226/`

---

## Quick Start

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>

cd XLR8

cd server
npm install
node server.js
```

Open another terminal:

```bash
cd XLR8/client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

Enter your name, join the chat, and start messaging in real time.
