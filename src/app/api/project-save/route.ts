import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = (await createClient()) as any;

    // Verify authenticated
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action, payload } = body;

    if (action === "upsert_project") {
      const { projectData, projectId } = payload;
      if (projectId) {
        const { error } = await sb.from("projects").update(projectData).eq("id", projectId);
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      } else {
        const { data, error } = await sb.from("projects").insert(projectData).select("id").single();
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ ok: true, id: data.id });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "insert_image") {
      const { projectId, storagePath, url } = payload;
      const { error } = await sb.from("project_images").insert({
        project_id: projectId,
        storage_path: storagePath,
        url,
        order_index: 0,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    if (action === "delete_image") {
      const { imageId, storagePath } = payload;
      // Delete from storage
      await sb.storage.from("project-images").remove([storagePath]);
      // Delete from DB
      const { error } = await sb.from("project_images").delete().eq("id", imageId);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
