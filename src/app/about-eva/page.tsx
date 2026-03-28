"use client";

export default function AboutEVAPage() {
  return (
    <div className="min-h-screen bg-white p-8 font-mono dark:bg-black dark:text-white">
      <span className="text-sm text-red-400">
        [this site its not a oficial EVA product, just a fun project to explore
        the ecosystem and learn more about it]
      </span>

      <h1 className="mt-4 mb-2 text-2xl font-bold">About EVA</h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        Learn more about EVA and its features.
      </p>

      <ul className="space-y-2"></ul>
    </div>
  );
}
