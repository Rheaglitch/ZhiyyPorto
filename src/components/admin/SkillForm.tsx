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
    name: skill?.name ?? "",
    category: skill?.category ?? "Frontend",
    level: skill?.level ?? 80,
    order_index: skill?.order_index ?? 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      name: form.name,
      category: form.category,
      level: Number(form.level),
      order_index: Number(form.order_index),
    };

    if (isEdit) {
      const { error } = await supabase
        .from("skills")
        .update(payload)
        .eq("id", skill.id);
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

      <div>
        <label className={labelClass}>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          {["Frontend", "Backend", "Tools", "Mobile", "Other"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>
          Level — <span className="text-blood-500">{form.level}%</span>
        </label>
        <input
          name="level"
          type="range"
          min={0}
          max={100}
          value={form.level}
          onChange={handleChange}
          className="w-full accent-blood-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs font-mono text-dark-700 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
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
