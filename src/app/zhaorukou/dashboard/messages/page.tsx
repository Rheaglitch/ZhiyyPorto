import { createClient } from "@/lib/supabase/server";
import { MessagesInbox } from "@/components/admin/MessagesInbox";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = (await createClient()) as any;

  const { data: messages } = await sb
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  const unread = (messages ?? []).filter((m: { read: boolean }) => !m.read).length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-100 flex items-center gap-3">
            Pesan Masuk
            {unread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-blood-700 text-white">
                {unread} baru
              </span>
            )}
          </h1>
          <p className="text-sm text-dark-500 mt-1 font-mono">
            {`// pesan dari form contact di website`}
          </p>
        </div>
      </div>
      <MessagesInbox messages={messages ?? []} />
    </div>
  );
}
