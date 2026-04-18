"use client";

import { useState } from "react";

export default function HomePage() {
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const endpoints = [
    { method: "GET", path: "/api/home", desc: "Get homepage data" },
    { method: "GET", path: "/api/anime", desc: "List all anime" },
    { method: "GET", path: "/api/anime/[slug]", desc: "Get anime detail" },
    { method: "GET", path: "/api/anime/[slug]/episodes", desc: "Get episode list" },
    { method: "GET", path: "/api/anime/[slug]/episodes/[episode]", desc: "Get episode detail" },
    { method: "GET", path: "/api/ongoing-anime", desc: "Get ongoing anime" },
    { method: "GET", path: "/api/complete-anime", desc: "Get completed anime" },
    { method: "GET", path: "/api/schedule", desc: "Get anime schedule" },
    { method: "GET", path: "/api/search/[keyword]", desc: "Search anime" },
    { method: "GET", path: "/api/genre", desc: "List genres" },
    { method: "GET", path: "/api/genre/[slug]", desc: "Get anime by genre" },
  ];

  const [copiedIndex, setCopiedIndex] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeUrl, setActiveUrl] = useState("");

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleFetch = async (url) => {
    try {
      setLoading(true);
      setActiveUrl(url);
      const res = await fetch(url);
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Lunarianime API</h1>
          <p className="text-gray-400 mt-2">
            Interactive API playground
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl mb-6">
          <p className="text-sm text-gray-400">Base URL</p>
          <div className="flex items-center justify-between mt-2">
            <code className="text-blue-400 text-sm">{baseUrl}</code>
            <button
              onClick={() => copyToClipboard(baseUrl, "base")}
              className="text-xs bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600"
            >
              {copiedIndex === "base" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">📡 Endpoints</h2>

          <div className="space-y-3">
            {endpoints.map((ep, i) => {
              const fullUrl =
                baseUrl +
                ep.path
                  .replace("[slug]", "naruto")
                  .replace("[episode]", "1")
                  .replace("[keyword]", "naruto");

              return (
                <div key={i} className="bg-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 text-sm font-semibold">
                        {ep.method}
                      </span>
                      <code className="text-blue-400 text-sm">
                        {ep.path}
                      </code>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFetch(fullUrl)}
                        className="text-xs bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
                      >
                        Try
                      </button>

                      <button
                        onClick={() => copyToClipboard(fullUrl, i)}
                        className="text-xs bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600"
                      >
                        {copiedIndex === i ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm">{ep.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📦 Response</h2>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : response ? (
            <pre className="text-sm text-green-400 overflow-auto max-h-[400px]">
              {JSON.stringify(response, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500 text-sm">
              Click "Try" to see response
            </p>
          )}

          {activeUrl && (
            <p className="text-xs text-gray-600 mt-4 break-all">
              {activeUrl}
            </p>
          )}
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Built with ❤️ using Next.js
        </p>
      </div>
    </main>
  );
            }
