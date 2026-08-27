import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Global in-memory fallback for local development or when Vercel KV is not configured
const memoryPresenceStore = new Map<string, number>();

function cleanMemoryStore() {
  const now = Date.now();
  const threshold = now - 35000; // 35 seconds stale window
  for (const [clientId, timestamp] of memoryPresenceStore.entries()) {
    if (timestamp < threshold) {
      memoryPresenceStore.delete(clientId);
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const clientId = body.clientId;
    const isDisconnect = body.disconnect === true;
    const now = Date.now();

    if (!clientId) {
      cleanMemoryStore();
      return NextResponse.json({ success: true, count: Math.max(1, memoryPresenceStore.size) });
    }

    // Check if Vercel KV is configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        if (isDisconnect) {
          await kv.zrem("presence_users", clientId);
        } else {
          await kv.zadd("presence_users", { score: now, member: clientId });
        }
        await kv.zremrangebyscore("presence_users", 0, now - 35000);
        const count = await kv.zcard("presence_users");
        return NextResponse.json({ success: true, count: Math.max(1, count) });
      } catch (err) {
        console.warn("Vercel KV failed, using memory fallback:", err);
      }
    }

    // In-Memory fallback
    if (isDisconnect) {
      memoryPresenceStore.delete(clientId);
    } else {
      memoryPresenceStore.set(clientId, now);
    }

    cleanMemoryStore();
    const count = Math.max(1, memoryPresenceStore.size);

    return NextResponse.json({ success: true, count });
  } catch (error) {
    return NextResponse.json({ count: 1 });
  }
}

export async function GET() {
  try {
    const now = Date.now();

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        await kv.zremrangebyscore("presence_users", 0, now - 35000);
        const count = await kv.zcard("presence_users");
        return NextResponse.json({ count: Math.max(1, count) });
      } catch (err) {
        console.warn("Vercel KV failed on GET, using memory fallback:", err);
      }
    }

    cleanMemoryStore();
    const count = Math.max(1, memoryPresenceStore.size);
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 1 });
  }
}
