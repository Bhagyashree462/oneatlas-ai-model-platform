# OneAtlas – AI Model Platform

OneAtlas is an AI-powered conversational platform built using Next.js and Google Gemini. It provides an interactive AI Playground where users can ask questions, receive AI-generated responses, and manage conversations.

## 🚀 Live Demo

**Live Website:** https://oneatlas-ai-model-platform-2oj2-aim88fa2q-bhagyashree6.vercel.app/

**GitHub Repository:** https://github.com/Bhagyashree462/oneatlas-ai-model-platform

## ✨ Features

- User registration and login using Supabase Authentication.
- AI-powered conversations using Google Gemini.
- Interactive AI Playground.
- Streaming AI responses.
- Conversation history stored in browser local storage.
- Create multiple conversations.
- Rename and delete conversations.
- Copy AI-generated responses.
- Regenerate AI responses.
- Stop response generation.
- Markdown rendering.
- Code syntax highlighting.
- Responsive user interface.

## 🛠️ Technologies Used

**Frontend**
- Next.js
- React.js
- TypeScript
- Tailwind CSS

**AI Integration**
- Google Gemini API
- AI SDK

**Authentication**
- Supabase
- Supabase SSR

**Libraries**
- React Markdown
- Remark GFM
- Rehype Highlight

**Tools**
- Node.js
- npm
- Git and GitHub
- Vercel
- Visual Studio Code

## 📂 Project Structure

```text
oneatlas-platform/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── playground/
│   │   └── page.tsx
│   ├── globals.css
│   └── page.tsx
├── lib/
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── proxy.ts
├── public/
├── package.json
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Bhagyashree462/oneatlas-ai-model-platform.git
```

### 2. Open the project folder

```bash
cd oneatlas-ai-model-platform
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory.

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GEMINI_API_KEY=your_gemini_api_key
```

Replace the example values with your actual credentials.

**Important:** Never upload API keys or `.env.local` to GitHub.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🔐 Authentication

OneAtlas uses Supabase Authentication.

- Users can create an account.
- Existing users can log in.
- Protected Playground routes require authentication.
- User sessions are managed through Supabase.

## 🤖 AI Playground

The AI Playground integrates Google Gemini to generate responses.

Users can:
- Ask questions.
- Receive streaming AI responses.
- Copy responses.
- Regenerate answers.
- Stop response generation.
- Manage conversation history.

## 🌐 Deployment

The application is deployed using Vercel.

**Live Application:**

https://oneatlas-ai-model-platform-2oj2-aim88fa2q-bhagyashree6.vercel.app/

## 👩‍💻 Developer

**Bhagyashree Kalavant**

B.Tech Computer Science and Engineering Student

GitHub: https://github.com/Bhagyashree462

LinkedIn: https://www.linkedin.com/in/bhagyashree-kalavant-02659a349/

## 📄 License

This project was developed as an internship project for educational and learning purposes.