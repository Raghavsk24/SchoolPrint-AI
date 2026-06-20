import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY = "compost:trigger";

export async function POST() {
  await redis.set(KEY, "1", { ex: 30 }); // expires after 30s so stale triggers don't pile up
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const fired = await redis.getdel(KEY); // atomic get-and-delete
  return NextResponse.json({ triggered: fired === "1" });
}
