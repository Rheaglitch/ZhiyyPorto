"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { isValidYouTubeUrl } from "@/types/database";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CategoryCombobox } from "@/components/admin/CategoryCombobox";
import type { ProjectWithRelations, ProjectCategory, ProjectImage } from "@/types/database";

interface ProjectFormProps {
  project?: ProjectWithRelations;
  categories: ProjectCategory[];
  existingImages?: ProjectImage[];
}

export function ProjectForm({ project, categories, existingImages = [] }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!project;

  const [form, setForm] = useState({
    title: project?.title ?? "",
    description: project?.description ?? "",
    long_description: project?.long_description ?? "",
    tech_stack: project?.tech_stack?.join(", ") ?? "",
    live_url: project?.live_url ?? "",
    github_url: project?.github_url ?? "",
    video_url: project?.video_url ?? "",
    featured: project?.featured ?? false,
    order_index: project?.order_index ?? 0,
  });

  const [categoryId, setCategoryId] = useState<string | null>(
    project?.category_id ?? null
  );
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    if (name === "video_url") setVideoError(null);
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleVideoBlur() {
    if (form.video_url && !isValidYouTubeUrl(form.video_url)) {
      setVideoError("URL video tidak valid. Gunakan format YouTube: watch?v=... atau youtu.be/...");
    } else {
      setVideoError(null);
    }
  }

  async function uploadFiles(projectId: string, files: File[]) {
    const supabase = createAdminClient();
    const uploaded: Array<{ storage_path: string; url: string }> = [];

    for (const file of files) {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `projects/${projectId}/${timestamp}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(storagePath, file, { upsert: true });

      if (uploadError) { console.error("Upload error:", uploadError.message); continue; }

      const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(storagePath);
      uploaded.push({ storage_path: storagePath, url: urlData.publicUrl });
    }
    return uploaded;
  }

  async function callApi(action: string, payload: Record<string, unknown>) {
    const res = await fetch("/api/project-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "API error");
    return json;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.video_url && !isValidYouTubeUrl(form.video_url)) {
      setVideoError("URL video tidak valid. Gunakan format YouTube: watch?v=... atau youtu.be/...");
      return;
    }
    if (!categoryId) {
      setError("Pilih atau buat category terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);

    const projectData = {
      title:            form.title,
      description:      form.description,
      long_description: form.long_description || null,
      tech_stack:       form.tech_stack.split(",").map((t: string) => t.trim()).filter(Boolean),
      live_url:         form.live_url   || null,
      github_url:       form.github_url || null,
      video_url:        form.video_url  || null,
      featured:         form.featured,
      order_index:      Number(form.order_index),
      category_id:      categoryId,
    };

    try {
      let projectId = project?.id ?? "";

      if (isEdit && project) {
        // Update via server API
        await callApi("upsert_project", { projectId: project.id, projectData });

        // Delete images via server API
        for (const img of imagesToDelete) {
          await callApi("delete_image", { imageId: img.id, storagePath: img.storage_path });
        }
      } else {
        // Insert via server API — returns new id
        const result = await callApi("upsert_project", { projectId: null, projectData });
        projectId = result.id;
      }

      // Upload files directly (storage upload from client is fine)
      if (pendingFiles.length > 0 && projectId) {
        const uploaded = await uploadFiles(projectId, pendingFiles);
        for (const u of uploaded) {
          await callApi("insert_image", {
            projectId,
            storagePath: u.storage_path,
            url: u.url,
          });
        }
      }

      router.push("/zhaorukou/dashboard/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-800 text-dark-200 placeholder-dark-700 text-sm focus:outline-none focus:border-blood-700 transition-colors";
  const labelClass = "block text-xs font-mono text-dark-500 mb-1.5";

  // Compute displayed existing images (minus marked-for-deletion)
  const deleteIds = new Set(imagesToDelete.map((i) => i.id));
  const displayedExisting = existingImages.filter((img) => !deleteIds.has(img.id));

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
          <label className={labelClass}>Category *</label>
          <CategoryCombobox
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
          />
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
          <label className={labelClass}>Video URL (YouTube)</label>
          <input
            name="video_url"
            type="text"
            value={form.video_url}
            onChange={handleChange}
            onBlur={handleVideoBlur}
            placeholder="https://www.youtube.com/watch?v=... (opsional)"
            className={`${inputClass}${videoError ? " border-blood-700" : ""}`}
          />
          {videoError && (
            <p className="text-xs text-blood-400 font-mono mt-1">{videoError}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <ImageUploader
            projectId={project?.id}
            existingImages={displayedExisting}
            onPendingFilesChange={setPendingFiles}
            onDeleteExisting={(img) =>
              setImagesToDelete((prev) => [...prev, img])
            }
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
          <label
            htmlFor="featured"
            className="text-sm text-dark-300 cursor-pointer"
          >
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
