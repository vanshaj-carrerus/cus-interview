import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getUserAttemptsPage } from "@/lib/learning/service";
import type { AttemptTableSortField } from "@/types/learning/progress";

const SORT_FIELDS: AttemptTableSortField[] = [
  "attemptedAt",
  "levelNumber",
  "entityType",
  "outcome",
  "isCorrect",
];

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const url = new URL(request.url);
    const sortRaw = url.searchParams.get("sort") ?? "attemptedAt";
    const sort: AttemptTableSortField = SORT_FIELDS.includes(sortRaw as AttemptTableSortField)
      ? (sortRaw as AttemptTableSortField)
      : "attemptedAt";
    const dir = url.searchParams.get("dir") === "asc" ? "asc" : "desc";
    const pageRaw = Number(url.searchParams.get("page") ?? "1");
    const pageSizeRaw = Number(url.searchParams.get("pageSize") ?? "10");
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
    const pageSize = Number.isFinite(pageSizeRaw) && pageSizeRaw > 0 ? Math.min(50, Math.floor(pageSizeRaw)) : 10;
    const q = url.searchParams.get("q") ?? "";

    const result = await getUserAttemptsPage(sessionUser.id, { page, pageSize, sort, dir, q });
    if (!result) {
      return NextResponse.json({ items: [], total: 0, page, pageSize });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("learning/me/attempts", error);
    return NextResponse.json({ error: "Failed to fetch attempts." }, { status: 500 });
  }
}
