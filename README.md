README.md
#  Real-Time Chat Application

A full-stack **real-time chat application** built using the **MERN Stack (MongoDB, Express, React, Node.js)** and **Socket.IO** for bidirectional communication between clients and the server.  
Includes **JWT authentication**, **online/offline tracking**, **typing indicators**, and **notifications**.

---

##  Features

###  Core Chat Functionality
- User authentication with JWT (register & login)
- Global chat room where all users can send and receive messages
- Display sender name and message timestamp
- Online/offline user status updates
- Typing indicator when a user is composing a message

###  Advanced Chat Features
- Private (1-on-1) messaging
- Multiple chat rooms (join/leave functionality)
- File & image sharing
- Read receipts for messages
- Message reactions (👍 ❤️ 😂 etc.)

###  Real-Time Notifications
- New message notifications (sound + browser notifications)
- “User joined” and “User left” room updates
- Unread message count per chat
- Real-time message delivery acknowledgments

###  Performance & UX Optimization
- Message pagination (load older messages)
- Auto-reconnect on connection loss
- Optimized Socket.IO with rooms/namespaces
- Works smoothly on both desktop and mobile devices

---

##  Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Vite + TailwindCSS + ShadCN UI |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Atlas or Local) |
| **Real-Time Engine** | Socket.IO |
| **Auth** | JWT (JSON Web Token) |

---

##  Project Structure



chat-app/
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/ # Chat UI components
│ │ ├── pages/ # Login / Register / Home pages
│ │ ├── context/ # AuthContext & Socket setup
│ │ └── App.jsx
│ └── package.json
│
├── server/ # Express + Socket.IO Backend
│ ├── models/ # Mongoose Schemas (User, Message)
│ ├── routes/ # Auth & Message APIs
│ ├── server.js # Main server file
│ └── package.json
│
└── README.md


---

##  Setup Instructions

### Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

#  Install dependencies
# Backend
cd server
npm install

# Frontend
cd ../client
npm install

#   Environment Variables

Create a .env file inside the server directory:

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
CLIENT_ORIGIN=http://localhost:5173
PORT=5000

# Run the application
Start backend server
cd server
npm run dev

Start frontend app
cd ../client
npm run dev


Frontend → http://localhost:5173

Backend → http://localhost:5000 