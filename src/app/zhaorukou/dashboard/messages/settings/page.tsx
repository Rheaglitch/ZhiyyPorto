import { MessageSettings } from "@/components/admin/MessageSettings";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Message Settings" };

export default async function MessageSettingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = (await createClient()) as any;
  const { data } = await sb.from("site_settings").select("value").eq("key", "contact_info").single();
  const ci = (data?.value ?? {}) as Record<string, string>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-100">Message Settings</h1>
        <p className="text-sm text-dark-500 mt-1 font-mono">
          {`// konfigurasi notifikasi email & WhatsApp`}
        </p>
      </div>
      <MessageSettings
        initialEmail={ci.email ?? "ohmyliinnn@gmail.com"}
        initialWa={ci.wa_number ?? ""}
      />
    </div>
  );
}
