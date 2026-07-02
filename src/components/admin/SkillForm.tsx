"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin-client";
import type { Skill } from "@/types/database";

interface SkillFormProps {
  skill?: Skill;
}

export function SkillForm({ skill }: SkillFormProps) {
  const router = useRouter();
  const isEdit = !!skill;

  const [form, setForm] = useState({
    name:        skill?.name        ?? "",
    category:    skill?.category    ?? "Frontend",
    icon:        skill?.icon        ?? "",
    icon_size:   skill?.icon_size   ?? 70,
    order_index: skill?.order_index ?? 0,
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createAdminClient();
    const payload = {
      name:        form.name,
      category:    form.category,
      icon:        form.icon || null,
      icon_size:   Number(form.icon_size),
      order_index: Number(form.order_index),
      level:       0,
    };

    if (isEdit) {
      const { error } = await supabase.from("skills").update(payload).eq("id", skill.id);
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { error } = await supabase.from("skills").insert(payload);
      if (error) { setError(error.message); setLoading(false); return; }
    }

    router.push("/zhaorukou/dashboard/skills");
    router.refresh();
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-800 text-dark-200 placeholder-dark-700 text-sm focus:outline-none focus:border-blood-700 transition-colors";
  const labelClass = "block text-xs font-mono text-dark-500 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {/* Name */}
      <div>
        <label className={labelClass}>Nama Skill *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Next.js"
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          {["Frontend", "Backend", "Tools", "Creative", "Mobile", "Other"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Icon URL */}
      <div>
        <label className={labelClass}>Icon URL</label>
        <input
          name="icon"
          type="url"
          value={form.icon}
          onChange={handleChange}
          placeholder="https://cdn.simpleicons.org/nextdotjs/ffffff"
          className={inputClass}
        />
        <p className="text-[10px] text-dark-600 font-mono mt-1.5">
          {`// simpleicons.org — contoh: https://cdn.simpleicons.org/figma/F24E1E`}
        </p>

        {/* Icon preview */}
        {form.icon && (
          <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-dark-900 border border-dark-800">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-dark-950 rounded-lg border border-dark-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.icon}
                alt="preview"
                style={{ width: `${form.icon_size}%`, height: `${form.icon_size}%`, objectFit: "contain" }}
              />
            </div>
            <span className="text-xs text-dark-400 font-mono">{form.name || "preview"}</span>
          </div>
        )}
      </div>

      {/* Icon size */}
      <div>
        <label className={labelClass}>
          Ukuran Icon — <span className="text-blood-500">{form.icon_size}%</span>
        </label>
        <input
          name="icon_size"
          type="range"
          min={30}
          max={100}
          step={5}
          value={form.icon_size}
          onChange={handleChange}
          className="w-full accent-blood-600 cursor-pointer"
        />
        <div className="flex justify-between text-[9px] font-mono text-dark-700 mt-0.5">
          <span>Kecil (30%)</span>
          <span>Sedang (65%)</span>
          <span>Penuh (100%)</span>
        </div>
      </div>

      {/* Order */}
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
          {loading ? "Menyimpan..." : isEdit ? "Update Skill" : "Simpan Skill"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/zhaorukou/dashboard/skills")}
          className="px-6 py-2.5 rounded-lg border border-dark-700 hover:border-dark-600 text-dark-400 hover:text-dark-200 font-medium text-sm transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
