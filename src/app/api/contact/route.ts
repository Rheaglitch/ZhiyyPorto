import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

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
      // Don't block — still try to send notifications
    }

    // Get admin settings
    const { data: settings } = await sb
      .from("site_settings").select("value").eq("key", "contact_info").single();

    const adminEmail: string  = (settings?.value?.email      as string) ?? "ohmyliinnn@gmail.com";
    const adminPhone: string  = (settings?.value?.wa_number  as string) ?? "";

    // ── Send email via Resend ──────────────────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from:    "Portfolio Contact <onboarding@resend.dev>",  // sender (Resend sandbox)
          to:      adminEmail,
          subject: `[Portfolio] Pesan baru dari ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0a;color:#e8e8e8;border-radius:12px;border:1px solid #222">
              <h2 style="color:#c81c1c;margin-bottom:4px">Pesan Baru dari Portfolio</h2>
              <p style="color:#666;font-size:13px;margin-top:0">zhiyyporto.vercel.app</p>
              <hr style="border:none;border-top:1px solid #222;margin:20px 0"/>
              <table style="width:100%;font-size:14px">
                <tr><td style="color:#888;padding:4px 0;width:80px">Nama</td><td style="color:#e8e8e8;font-weight:600">${name}</td></tr>
                <tr><td style="color:#888;padding:4px 0">Email</td><td><a href="mailto:${email}" style="color:#c81c1c">${email}</a></td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #222;margin:20px 0"/>
              <p style="color:#888;font-size:13px;margin-bottom:8px">Pesan:</p>
              <div style="background:#141414;border-radius:8px;padding:16px;border:1px solid #1e1e1e;color:#d0d0d0;line-height:1.7;white-space:pre-wrap">${message}</div>
              <hr style="border:none;border-top:1px solid #222;margin:20px 0"/>
              <a href="mailto:${email}?subject=Re: Pesan dari Portfolio&body=%0A%0A----%0APesan asli:%0A${encodeURIComponent(message)}"
                style="display:inline-block;background:#c81c1c;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px">
                Balas Pesan
              </a>
            </div>
          `,
          replyTo: email,
        });
      } catch (e) {
        console.error("Resend error:", e);
      }
    }

    // ── Send WA via Fonnte ─────────────────────────────────────────────────
    const fonnteToken  = process.env.FONNTE_TOKEN;
    const fonnteTarget = adminPhone || process.env.FONNTE_TARGET;
    if (fonnteToken && fonnteTarget) {
      try {
        await fetch("https://api.fonnte.com/send", {
          method:  "POST",
          headers: { Authorization: fonnteToken, "Content-Type": "application/x-www-form-urlencoded" },
          body:    new URLSearchParams({
            target:  fonnteTarget,
            message: `*Pesan Baru Portfolio*\n\n*Nama:* ${name}\n*Email:* ${email}\n\n*Pesan:*\n${message}`,
          }),
        });
      } catch (e) {
        console.error("Fonnte error:", e);
      }
    }

    return NextResponse.json({ ok: true, message: "Pesan berhasil dikirim!" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
