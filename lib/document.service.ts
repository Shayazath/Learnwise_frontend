
import { api } from "@/lib/api";
import type { DocumentItem } from "@/types";

export async function getDocuments(): Promise<DocumentItem[]> {
  const { data } = await api.get<DocumentItem[]>("/api/documents");
  return data;
}
