import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "./database";
import { Response } from "./types";

type Methods = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

export function validateMethodMiddleware(
  method: Methods,
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== method) {
    res.status(405).json({ error: "method not allowed", message: "error" });
    throw new Error("method not allowed");
  }
}

export async function validateAuthMiddleware(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (
    !("authorization" in req.headers) ||
    req.headers.authorization?.length === 0
  ) {
    res.status(401).json({ error: "missing token!", message: "error" });
    throw new Error("missing token");
  }
  const db = await getDatabase();
  if (!(await db.isTokenValid(req.headers.authorization!))) {
    res.status(401).json({ error: "invalid token!", message: "error" });
    throw new Error("invalid token");
  }
}
