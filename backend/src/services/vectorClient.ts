export type VectorRecord = {
  id: string;
  embedding: number[];
  metadata?: Record<string, any>;
  text?: string;
};

export async function upsertVectors(indexName: string, records: VectorRecord[]) {
  console.log("Vector upsert stub:", indexName, records.length);
  return { success: true };
}

export async function queryVectors(indexName: string, embedding: number[], topK = 4) {
  return [];
}
