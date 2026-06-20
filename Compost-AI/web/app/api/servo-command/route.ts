import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY = "compost:servo";

export async function POST(req: Request) {
  const { command } = await req.json();
  await redis.set(KEY, command, { ex: 30 });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const cmd = await redis.getdel(KEY);
  return NextResponse.json({ command: cmd ?? null });
}
