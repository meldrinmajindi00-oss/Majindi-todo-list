# To-Do List App — MongoDB + Express + React Native + Node.js

This project is a simple CRUD activity with:

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React Native using Expo
- **CRUD:** Create, Read, Update/Complete, Delete
- **Code organization:** `pages`, `components`, and `services`

## 1. Backend setup

Open Terminal:

```bash
cd backend
npm install express mongoose cors dotenv
cp .env.example .env
npm start
```

The default `.env.example` uses local MongoDB:

```env
MONGO_URI=mongodb://127.0.0.1:27017/todo_app
PORT=5000
```

If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

You should see:

```text
MongoDB connected
Server running on http://localhost:5000
```

Test in a browser:

```text
http://localhost:5000/
```

You should get:

```json
{"message":"To-Do API is running."}
```

## 2. Frontend setup

From the project root, create a blank Expo app:

```bash
npx create-expo-app@latest frontend --template blank
```

Then replace the generated `frontend/App.js` with:

```text
frontend-source/App.js
```

And copy this folder:

```text
frontend-source/src
```

into:

```text
frontend/src
```

Then run:

```bash
cd frontend
npx expo start
```

Open it with Expo Go or an emulator/simulator.

## 3. IMPORTANT: API address

Open:

```text
frontend/src/services/api.js
```

For a physical phone, **do not use `localhost`**.

On a Mac connected to Wi-Fi, find the Mac's local IP:

```bash
ipconfig getifaddr en0
```

Example result:

```text
192.168.1.23
```

Then use:

```js
export const API_URL = "http://192.168.1.23:5000/api/todos";
```

Your Mac and phone should normally be connected to the same local network.

For iOS Simulator:

```js
export const API_URL = "http://localhost:5000/api/todos";
```

For the standard Android Emulator:

```js
export const API_URL = "http://10.0.2.2:5000/api/todos";
```

## 4. API routes

| Operation | Method | Route | Purpose |
|---|---|---|---|
| Create | POST | `/api/todos` | Add a to-do |
| Read | GET | `/api/todos` | View all to-dos |
| Update | PATCH | `/api/todos/:id` | Complete/uncomplete or edit |
| Delete | DELETE | `/api/todos/:id` | Delete a to-do |

### Example CREATE body

```json
{
  "title": "Finish React Native activity"
}
```

### Example UPDATE body

```json
{
  "completed": true
}
```

## 5. Project structure

```text
todo-mern-react-native/
├── backend/
│   ├── models/
│   │   └── Todo.js
│   ├── routes/
│   │   └── todos.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend-source/
│   ├── App.js
│   └── src/
│       ├── components/
│       │   ├── TodoForm.js
│       │   └── TodoItem.js
│       ├── pages/
│       │   └── HomeScreen.js
│       └── services/
│           └── api.js
└── README.md
```

## 6. What to demonstrate face-to-face

1. Start MongoDB.
2. Start the backend with `npm start`.
3. Start Expo with `npx expo start`.
4. Add a new task.
5. Show that it appears in the list.
6. Tap a task to mark it complete.
7. Tap again to mark it incomplete.
8. Delete a task.
9. Explain that MongoDB stores the data, Express/Node provides the API, and React Native displays and changes the data through HTTP requests.

## 7. Simple explanation for your instructor

**MongoDB** stores each to-do document.  
**Express and Node.js** provide the REST API.  
**React Native** is the mobile frontend.  
The frontend uses `fetch()` to send requests to the backend.

The `Todo` model has:

- `title`
- `completed`
- automatic `createdAt` and `updatedAt`

The frontend is organized into:

- `pages/HomeScreen.js` — main screen and state
- `components/TodoForm.js` — reusable add form
- `components/TodoItem.js` — reusable task row
- `services/api.js` — all backend requests
