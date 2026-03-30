# 📚 Full Line-by-Line Project Deep Dive

As requested, here is a breakdown of literally every part of the website, explaining what each line does and how they all talk to each other.

---

## 🛠️ THE BACKEND (server.js)
This is where the actual "math" and "intelligence" happen.

### 1-13: The Setup
- `require("dotenv").config(...)`: Loads your API key from the `.env` file so the bot can think.
- `express`: The engine that runs the website.
- `multer`: The tool that handles image uploads so mentors can post photos.
- `GoogleGenerativeAI`: The link to the "Gemma 1B" brain.

### 15-29: Configuration constants
- `PORT = 3001`: Sets the "address" where the server listens.
- `DATA_DIR` & `UPLOAD_DIR`: Tells the computer exactly which folders to use for data and photos.
- `MENTORS`: Reads the `mentors.json` file into memory so the server knows who is allowed to log in.

### 176-213: The Chatbot logic
- `app.post("/api/chat")`: This "route" waits for a message from the website.
- `inappropriateKeywords`: A list of bad words. If the message has them, the server STOPS immediately to protect the school.
- `turnCount`: Calculates how many times you've spoken. It uses `Math.floor(length / 2)` because each "turn" is two messages (yours and the bot's).
- `systemPrompt`: This is the "God Mode" instruction for the AI. It tells it to be friendly, follow the "Books" cheat sheet, and ask exactly 3 questions.
- `chat.sendMessage()`: Sends the instruction + your message to the Google server and waits for the answer.

---

## 🎨 THE FRONTEND (main.js)
This controls what you see on the screen.

### 1-92: The Club Database
- Represents every club as an "Object" `{ name, category, desc, etc }`. This is where all the colors and descriptions are stored.

### 104-133: Generating the UI
- `clubs.forEach(...)`: This is a loop. For every club in the list, it creates a new "Card" on the website.
- `row.innerHTML`: This is the template. It puts the name, description, and "Learn More" button into the HTML automatically.

### 167-238: The Chat Pop-up
- `chatFab`: The floating button. When clicked, it toggles the `active` class on the panel to slide it up.
- `sendMessage()`: 
    - Takes what you typed in the box.
    - Adds it to the screen using `addMessage()`.
    - Uses `fetch('/api/chat')` to send it to our backend server.
    - Waits for the reply and adds the bot's response to the screen.

---

## 📂 THE DATABASE (data/)
No, we don't use a complex database like SQL. We use JSON files because they are simple and fast.

- `mentors.json`: Maps `clubId` (like "robotics") to a `passwordHash`. A "Hash" is a scrambled password that nobody can decode, but the server can check if it's correct.
- `activities.json`: A long list of every activity. 
    - `approved: false` means the admin hasn't seen it yet.
    - `approved: true` means it will now show up on that club's specific page!

---

## 🏗️ HOW THE CLUBS WORK (e.g., robotics.js)
When you click on a club like "Robotics," it loads a new page.
1. It looks at its `CLUB_ID`.
2. It calls `${API_BASE}/api/activities/robotics`.
3. The server looks in `activities.json`, finds only the approved ones for robotics, and sends them back.
4. The JavaScript then builds the **Image Carousel** and **Activity Cards** you see on that page.

---

## 🔒 SECURITY & SAFETY
- **JWT (JSON Web Tokens)**: When a mentor logs in, they get a "Key" (Token). They must show this key every time they upload a photo, or the server will reject them.
- **Safety Filters**: As you saw earlier, we have both a manual filter (keywords) and an AI filter (Google's safety settings) to make sure the site stays safe for students.
