
"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { isValidElement } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Plus,
  MessageSquare,
  Menu,
  X,
  Pencil,
  Check,
  PanelLeftClose,
  Loader2,
  Copy,
  RefreshCw,
  Square,
} from "lucide-react";
import Link from "next/link";

type Conversation = {
  id: string;
  title: string;
  messages: UIMessage[];
  updatedAt: number;
};

// Extract code text from Markdown code blocks
function extractCodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractCodeText).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractCodeText(node.props.children);
  }

  return "";
}

// Custom code block with copy button
function MarkdownCodeBlock({
  children,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const code = extractCodeText(children);

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border border-white/10 bg-[#080b14]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs text-gray-400">
          Code
        </span>

        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(code).catch(console.error)
          }
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
        >
          <Copy size={14} />
          Copy code
        </button>
      </div>

      <pre
        {...props}
        className="overflow-x-auto p-4 text-sm leading-6"
      >
        {children}
      </pre>
    </div>
  );
}

const STORAGE_KEY = "oneatlas-chat-history";

function createConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: "New Chat",
    messages: [],
    updatedAt: Date.now(),
  };
}

export default function Playground() {
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const skipSaveRef = useRef(false);

  const {
    messages,
    sendMessage,
    status,
    setMessages,
    error,
    stop,
    regenerate,
  } = useChat();

  const loading = status === "submitted" || status === "streaming";

  const activeConversation = conversations.find(
    (chat) => chat.id === activeId
  );

  // Load saved conversations
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: Conversation[] = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setConversations(parsed);

          if (parsed.length > 0) {
            setActiveId(parsed[0].id);
          } else {
            const chat = createConversation();
            setConversations([chat]);
            setActiveId(chat.id);
          }

          setHydrated(true);
          return;
        }
      }
    } catch (err) {
      console.error("Unable to load chat history:", err);
    }

    const chat = createConversation();
    setConversations([chat]);
    setActiveId(chat.id);
    setHydrated(true);
  }, []);

  // Switch conversations
  useEffect(() => {
    if (!hydrated || !activeId) return;

    const chat = conversations.find(
      (item) => item.id === activeId
    );

    skipSaveRef.current = true;
    setMessages(chat?.messages ?? []);
  }, [activeId, hydrated]);

  // Save chat history
  useEffect(() => {
    if (!hydrated) return;

    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }

    setConversations((previous) =>
      previous.map((chat) =>
        chat.id === activeId
          ? {
              ...chat,
              messages,
              updatedAt: Date.now(),
            }
          : chat
      )
    );
  }, [messages, activeId, hydrated]);

  // Persist conversations in browser
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(conversations)
      );
    } catch (err) {
      console.error("Unable to save chat history:", err);
    }
  }, [conversations, hydrated]);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Copy AI response
  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Copy failed:", err);
    });
  }

  // Create new conversation
  function handleNewChat() {
    if (loading) return;

    const chat = createConversation();

    setConversations((previous) => [
      chat,
      ...previous,
    ]);

    setActiveId(chat.id);
    setSidebarOpen(false);
  }

  // Select previous conversation
  function handleSelectChat(id: string) {
    if (loading) return;

    setActiveId(id);
    setSidebarOpen(false);
  }

  // Send message to Gemini
  async function handleSend(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const text = input.trim();

    if (!text || loading || !activeId) return;

    const currentId = activeId;

    setInput("");

    setConversations((previous) =>
      previous.map((chat) =>
        chat.id === currentId
          ? {
              ...chat,
              title:
                chat.messages.length === 0
                  ? text.slice(0, 40)
                  : chat.title,
              updatedAt: Date.now(),
            }
          : chat
      )
    );

    try {
      await sendMessage({ text });
    } catch (err) {
      console.error("OneAtlas chat error:", err);
    }
  }

  // Delete conversation
  function handleDeleteChat(id: string) {
    if (loading) return;

    const remaining = conversations.filter(
      (chat) => chat.id !== id
    );

    if (remaining.length === 0) {
      const newChat = createConversation();
      setConversations([newChat]);
      setActiveId(newChat.id);
    } else {
      setConversations(remaining);

      if (activeId === id) {
        setActiveId(remaining[0].id);
      }
    }

    setEditingId(null);
  }

  // Rename conversation
  function handleRenameChat(id: string) {
    const title = editTitle.trim();

    if (!title) return;

    setConversations((previous) =>
      previous.map((chat) =>
        chat.id === id
          ? { ...chat, title, updatedAt: Date.now() }
          : chat
      )
    );

    setEditingId(null);
    setEditTitle("");
  }

  // Clear current conversation
  function handleClearChat() {
    if (loading || !activeId) return;

    setMessages([]);

    setConversations((previous) =>
      previous.map((chat) =>
        chat.id === activeId
          ? {
              ...chat,
              messages: [],
              title: "New Chat",
              updatedAt: Date.now(),
            }
          : chat
      )
    );
  }

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b14] text-white">
        <Loader2 className="animate-spin text-violet-400" size={30} />
      </main>
    );
  }

  return (
    <main className="flex h-[100dvh] overflow-hidden bg-[#080b14] text-white">

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "flex" : "hidden"
        } fixed inset-y-0 left-0 z-40 w-[280px] flex-col border-r border-white/10 bg-[#0d1120] md:relative md:flex`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-violet-600 p-2">
              <Sparkles size={20} />
            </div>
            <span className="text-lg font-bold">
              OneAtlas
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 md:hidden"
          >
            <X size={19} />
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="hidden rounded-lg p-2 text-gray-400 hover:bg-white/10 md:block"
            title="Close sidebar"
          >
            <PanelLeftClose size={19} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={handleNewChat}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:opacity-50"
          >
            <Plus size={19} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Recent Conversations
          </p>

          <div className="space-y-2">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2 rounded-xl px-3 py-3 ${
                  activeId === chat.id
                    ? "bg-violet-500/15 text-white"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <MessageSquare size={17} className="shrink-0" />

                {editingId === chat.id ? (
                  <form
                    className="flex min-w-0 flex-1 gap-1"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRenameChat(chat.id);
                    }}
                  >
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(e.target.value)
                      }
                      className="min-w-0 w-full rounded bg-[#080b14] px-2 py-1 text-xs text-white outline-none"
                    />
                    <button type="submit">
                      <Check size={15} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => handleSelectChat(chat.id)}
                    className="min-w-0 flex-1 truncate text-left text-sm"
                    title={chat.title}
                  >
                    {chat.title}
                  </button>
                )}

                <div className="flex shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                  <button
                    title="Rename chat"
                    onClick={() => {
                      setEditingId(chat.id);
                      setEditTitle(chat.title);
                    }}
                    className="rounded p-1 hover:text-violet-400"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    title="Delete chat"
                    onClick={() => handleDeleteChat(chat.id)}
                    className="rounded p-1 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="rounded-full bg-violet-600 p-2">
              <Bot size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">
                OneAtlas AI
              </p>
              <p className="text-xs text-green-400">
                Gemini Connected
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      {/* Main Chat */}
      <section className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/10 bg-[#0d1120] px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/10"
              title="Open sidebar"
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold md:text-base">
                {activeConversation?.title || "OneAtlas AI"}
              </h1>
              <p className="text-xs text-green-400">
                Powered by Google Gemini
              </p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-400 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">
              Clear chat
            </span>
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-6 md:px-8">

            {messages.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 rounded-3xl border border-violet-500/20 bg-violet-500/10 p-6">
                  <Sparkles size={42} className="text-violet-400" />
                </div>

                <h2 className="text-2xl font-bold md:text-3xl">
                  Welcome to OneAtlas AI
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
                  Your intelligent AI assistant. Ask questions,
                  write code, explore ideas and learn something new.
                </p>

                <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    "Explain Python in simple words",
                    "Write a JavaScript program",
                    "Give me project ideas",
                    "Explain machine learning",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="rounded-xl border border-white/10 bg-[#151b2b] p-4 text-left text-sm text-gray-300 transition hover:border-violet-500/50 hover:bg-violet-500/10"
                    >
                      <Sparkles size={16} className="mb-2 text-violet-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-7">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="h-9 shrink-0 rounded-xl bg-violet-600 p-2">
                      <Bot size={20} />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 md:max-w-[80%] ${
                      message.role === "user"
                        ? "bg-violet-600 text-white"
                        : "border border-white/10 bg-[#151b2b] text-gray-200"
                    }`}
                  >
                    <div className="markdown-content">
                      {message.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            pre: MarkdownCodeBlock,
                          }}
                        >
                          {message.parts
                            .filter((part) => part.type === "text")
                            .map((part) => part.text)
                            .join("\n")}
                        </ReactMarkdown>
                      ) : (
                        message.parts.map((part, index) =>
                          part.type === "text" ? (
                            <span key={index}>{part.text}</span>
                          ) : null
                        )
                      )}
                    </div>

                    {message.role === "assistant" && (
                      <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-2">
                        <button
                          onClick={() =>
                            handleCopy(
                              message.parts
                                .filter((part) => part.type === "text")
                                .map((part) => part.text)
                                .join("\n")
                            )
                          }
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                          title="Copy response"
                        >
                          <Copy size={14} />
                          Copy
                        </button>

                        {message.id === messages[messages.length - 1]?.id && (
                          <button
                            onClick={() => regenerate()}
                            disabled={loading}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-violet-400 disabled:opacity-40"
                            title="Regenerate response"
                          >
                            <RefreshCw size={14} />
                            Regenerate
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="h-9 shrink-0 rounded-xl bg-gray-700 p-2">
                      <User size={20} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="ml-12 flex items-center gap-2 text-sm text-violet-400">
                  <Loader2 size={17} className="animate-spin" />
                  OneAtlas AI is thinking...
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  Unable to get an AI response. Please try again.
                  Check the development server for details.
                </div>
              )}
            </div>

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="shrink-0 border-t border-white/10 bg-[#0d1120] p-4">
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={handleSend}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#151b2b] p-2 focus-within:border-violet-500/50"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message OneAtlas AI..."
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-gray-500"
              />

              {loading ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  className="rounded-xl bg-red-600 p-3 text-white hover:bg-red-500"
                  title="Stop generating"
                >
                  <Square size={19} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-xl bg-violet-600 p-3 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Send message"
                >
                  <Send size={19} />
                </button>
              )}
            </form>

            <p className="mt-3 text-center text-xs text-gray-600">
              OneAtlas AI uses Google Gemini. AI responses may contain mistakes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
