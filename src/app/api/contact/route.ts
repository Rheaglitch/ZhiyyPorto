import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // Validate
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }
    if (message.trim().length < 10) {
      return NextResponse.json({ error: "Pesan terlalu pendek (min 10 karakter)." }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = (await createClient()) as any;

    // Save to Supabase
    const { error: dbError } = await sb.from("messages").insert({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      message: message.trim(),
    });
    if (dbError) {
      console.error("DB error:", dbError.message);
      return NextResponse.json({ error: "Gagal menyimpan pesan." }, { status: 500 });
    }

    // Get admin contact settings
    const { data: settings } = await sb
      .from("site_settings")
      .select("value")
      .eq("key", "contact_info")
      .single();

    const adminPhone: string = (settings?.value?.wa_number as string) ?? "";

    // Send WA notification via Fonnte (if configured)
    const fonnteToken  = process.env.FONNTE_TOKEN;
    const fonnteTarget = adminPhone || process.env.FONNTE_TARGET;

    if (fonnteToken && fonnteTarget) {
      const waMsg = `*Pesan Baru dari Portfolio*\n\n*Nama:* ${name}\n*Email:* ${email}\n\n*Pesan:*\n${message}`;
      try {
        await fetch("https://api.fonnte.com/send", {
          method:  "POST",
          headers: {
            Authorization: fonnteToken,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            target:  fonnteTarget,
            message: waMsg,
          }),
        });
      } catch (e) {
        console.error("Fonnte error:", e); // Don't fail the request if WA fails
      }
    }

    return NextResponse.json({ ok: true, message: "Pesan berhasil dikirim!" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
