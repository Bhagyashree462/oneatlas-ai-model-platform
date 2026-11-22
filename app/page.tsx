
"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  BrainCircuit,
  MessageSquare,
  Boxes,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  Zap,
  Activity,
  Cpu,
  Menu,
  X,
} from "lucide-react";

const models = [
  {
    name: "GPT Models",
    provider: "OpenAI",
    description: "Advanced reasoning, writing and coding.",
    category: "Language",
    status: "Available",
  },
  {
    name: "Claude Models",
    provider: "Anthropic",
    description: "Intelligent AI for complex tasks.",
    category: "Language",
    status: "Available",
  },
  {
    name: "Gemini Models",
    provider: "Google",
    description: "Multimodal AI for text and images.",
    category: "Multimodal",
    status: "Available",
  },
];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "AI Models", icon: BrainCircuit },
    { name: "AI Playground", icon: MessageSquare },
    { name: "Model Library", icon: Boxes },
    { name: "Settings", icon: Settings },
  ];

  const filteredModels = models.filter((model) =>
    `${model.name} ${model.provider}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      <div className="flex min-h-screen">

        <aside className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-white/10 bg-[#0d1120] p-6 transition-transform lg:static lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-600 p-2">
                <BrainCircuit size={25} />
              </div>
              <span className="text-xl font-bold">OneAtlas</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="lg:hidden">
              <X />
            </button>
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActive(item.name);
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    active === item.name
                      ? "bg-violet-600 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="mt-16 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
            <Zap className="mb-3 text-violet-400" />
            <h3 className="font-semibold">OneAtlas Pro</h3>
            <p className="mt-2 text-xs leading-5 text-gray-400">
              Explore powerful AI models in one unified platform.
            </p>
          </div>
        </aside>

        {menuOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          />
        )}

        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-white/10 px-5 md:px-10">
            <div className="flex items-center gap-3">
              <button className="lg:hidden" onClick={() => setMenuOpen(true)}>
                <Menu />
              </button>
              <div>
                <h1 className="text-lg font-semibold">{active}</h1>
                <p className="hidden text-xs text-gray-500 sm:block">
                  Welcome to your AI workspace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button aria-label="Notifications" className="text-gray-400 hover:text-white">
                <Bell size={20} />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 font-bold">
                B
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-5 md:p-10">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="mb-2 text-sm text-violet-400">
                  AI MANAGEMENT PLATFORM
                </p>
                <h2 className="text-3xl font-bold md:text-4xl">
                  Your AI universe, <span className="text-violet-400">unified.</span>
                </h2>
                <p className="mt-3 text-sm text-gray-400">
                  Discover, manage and explore AI models from one place.
                </p>
              </div>

              <button
                onClick={() => setActive("AI Models")}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
              >
                <Plus size={18} />
                Explore Models
              </button>
            </div>

            <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { title: "AI Models", value: "03", icon: BrainCircuit },
                { title: "Platform Status", value: "Online", icon: Activity },
                { title: "AI Categories", value: "02", icon: Cpu },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-[#111728] p-6">
                    <div className="mb-5 flex justify-between">
                      <span className="text-sm text-gray-400">{item.title}</span>
                      <Icon className="text-violet-400" size={21} />
                    </div>
                    <h3 className="text-3xl font-bold">{item.value}</h3>
                  </div>
                );
              })}
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">AI Model Marketplace</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Explore popular AI model providers.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111728] px-4 py-3">
                <Search size={18} className="text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search models..."
                  className="w-36 bg-transparent text-sm outline-none placeholder:text-gray-500 sm:w-52"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredModels.map((model) => (
                <div
                  key={model.name}
                  className="rounded-2xl border border-white/10 bg-[#111728] p-6 transition hover:border-violet-500/50"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="rounded-xl bg-violet-500/15 p-3 text-violet-400">
                      <BrainCircuit size={25} />
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                      {model.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold">{model.name}</h3>
                  <p className="mt-1 text-xs text-violet-400">{model.provider}</p>
                  <p className="my-5 text-sm leading-6 text-gray-400">
                    {model.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xs text-gray-500">
                      {model.category}
                    </span>
                    <button
                      onClick={() => setActive("AI Playground")}
                      className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
                    >
                      Explore <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredModels.length === 0 && (
              <p className="mt-8 text-center text-gray-400">
                No matching models found.
              </p>
            )}

            <footer className="mt-12 border-t border-white/10 py-6 text-center text-xs text-gray-500">
              © 2026 OneAtlas AI Model Platform. All rights reserved.
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
