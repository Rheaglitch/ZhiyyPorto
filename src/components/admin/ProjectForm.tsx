"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin-client";
import type { Project } from "@/types/database";

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!project;

  const [form, setForm] = useState({
    title: project?.title ?? "",
    description: project?.description ?? "",
    long_description: project?.long_description ?? "",
    tech_stack: project?.tech_stack?.join(", ") ?? "",
    image_url: project?.image_url ?? "",
    live_url: project?.live_url ?? "",
    github_url: project?.github_url ?? "",
    featured: project?.featured ?? false,
    order_index: project?.order_index ?? 0,
    category: project?.category ?? "Web",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createAdminClient();

    const payload = {
      title: form.title,
      description: form.description,
      long_description: form.long_description || null,
      tech_stack: form.tech_stack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image_url: form.image_url || null,
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      featured: form.featured,
      order_index: Number(form.order_index),
      category: form.category,
    };

    if (isEdit) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", project.id);
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) { setError(error.message); setLoading(false); return; }
    }

    router.push("/zhaorukou/dashboard/projects");
    router.refresh();
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-800 text-dark-200 placeholder-dark-700 text-sm focus:outline-none focus:border-blood-700 transition-colors";
  const labelClass = "block text-xs font-mono text-dark-500 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className={labelClass}>Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Nama project"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={2}
            placeholder="Deskripsi singkat (tampil di card)"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Long Description</label>
          <textarea
            name="long_description"
            value={form.long_description}
            onChange={handleChange}
            rows={4}
            placeholder="Detail lengkap project (opsional)"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Tech Stack</label>
          <input
            name="tech_stack"
            value={form.tech_stack}
            onChange={handleChange}
            placeholder="Next.js, TypeScript, Tailwind CSS"
            className={inputClass}
          />
          <p className="text-xs text-dark-600 mt-1 font-mono">
            Pisahkan dengan koma
          </p>
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            {["Web", "Mobile", "Backend", "UI/UX", "Other"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Order Index</label>
          <input
            name="order_index"
            type="number"
            value={form.order_index}
            onChange={handleChange}
            min={0}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Live URL</label>
          <input
            name="live_url"
            type="url"
            value={form.live_url}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>GitHub URL</label>
          <input
            name="github_url"
            type="url"
            value={form.github_url}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Image URL</label>
          <input
            name="image_url"
            type="url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://... (dari Supabase Storage atau URL lain)"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2 flex items-center gap-3">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 accent-blood-600 rounded"
          />
          <label htmlFor="featured" className="text-sm text-dark-300 cursor-pointer">
            Featured — tampilkan di homepage
          </label>
        </div>
      </div>

      {error && (
        <p className="text-xs text-blood-400 font-mono bg-blood-950/50 border border-blood-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-blood-700 hover:bg-blood-600 disabled:opacity-50 text-white font-medium text-sm transition-colors"
        >
          {loading ? "Menyimpan..." : isEdit ? "Update Project" : "Simpan Project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/zhaorukou/dashboard/projects")}
          className="px-6 py-2.5 rounded-lg border border-dark-700 hover:border-dark-600 text-dark-400 hover:text-dark-200 font-medium text-sm transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
