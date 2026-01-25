# Blog CRUD Application

## Overview
A full-stack blog application with Create, Read, Update, and Delete (CRUD) functionality. Built with **Express.js** backend and **vanilla JavaScript** frontend, using **MongoDB** for data persistence.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Database**: MongoDB with Mongoose ODM
- **Tools**: Nodemon (dev), CORS, dotenv

## Project Structure
```
assignment3/
├── server.js              # Main backend server
├── models/
│   └── Blog.js            # MongoDB Blog schema
├── public/
│   ├── index.html         # Frontend UI
│   ├── app.js             # Frontend logic
│   └── styles.css         # Styling
├── package.json           # Dependencies
└── README.md              # Documentation
```

## Features Implemented

### Backend (server.js)
- **Express server** with CORS and JSON middleware
- **5 API endpoints** for blog management:
  - `POST /blogs` - Create a new blog post
  - `GET /blogs` - Fetch all blogs (sorted by newest first)
  - `GET /blogs/:id` - Fetch a specific blog by ID
  - `PUT /blogs/:id` - Update an existing blog
  - `DELETE /blogs/:id` - Delete a blog
- **Error handling** with validation and database error management
- **MongoDB connection** via Mongoose
- **Static file serving** from `public/` directory

### Data Model (Blog.js)
- **Title** (required, trimmed)
- **Body** (required, trimmed)
- **Author** (optional, defaults to "Anonymous", trimmed)
- **Timestamps** (createdAt, updatedAt auto-generated)

### Frontend (index.html + app.js)
- **Create/Update Form**: Input fields for ID (to update), title, author, and body
- **Posts List**: Dynamic display of all blogs with:
  - Post ID and creation timestamp
  - Title, author, and body content
  - Action buttons: Fill, Open, Delete
- **Status Panel**: Real-time feedback and API responses
- **Controls**:
  - **Save** - Create new or update existing blog
  - **Clear** - Reset form fields
  - **Refresh** - Reload all blogs
  - **Fill** - Populate form with selected blog data
  - **Open** - View blog details in status panel
  - **Delete** - Remove blog from database

### Frontend Logic (app.js)
- **Fetch wrapper** (`api()`) - Handles all HTTP requests with error management
- **Load function** - Fetches and renders all blogs with XSS protection
- **Form submission** - Creates new blogs or updates existing ones
- **HTML escaping** - Prevents XSS attacks
- **Event listeners** - Handles form submission, button clicks, and actions

## Setup & Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** (create `.env` file)
   ```
   MONGODB_URI=mongodb://localhost:27017/blog
   PORT=3000
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Or production:
   ```bash
   npm start
   ```

4. **Access the app**
   Open `http://localhost:3000` in your browser

## API Response Examples

**Create Blog:**
```json
POST /blogs
{
  "title": "My First Post",
  "body": "This is the content",
  "author": "John"
}
 201 Created
```

**Get All Blogs:**
```json
GET /blogs
 200 OK - Array of blog objects
```

**Update Blog:**
```json
PUT /blogs/:id
{
  "title": "Updated Title",
  "body": "Updated content"
}
 200 OK
```

**Delete Blog:**
```json
DELETE /blogs/:id
 204 No Content
```

## Error Handling
- Invalid MongoDB IDs return 400 Bad Request
- Missing required fields return 400 Bad Request
- Non-existent blogs return 404 Not Found
- Database errors return 500 Server Error
- Invalid routes return 404 Not Found
