import { randomUUID } from "crypto";
import add from "date-fns/add";
import compareAsc from "date-fns/compareAsc";

export interface Token {
  token: string;
  issuedAt: number;
}

export function newToken(): Token {
  const newToken = randomUUID();
  return {
    token: newToken,
    issuedAt: Math.floor(Date.now() / 1000),
  };
}

export function isIssuedInLastHour(token: Token): boolean {
  const validUntil = add(new Date(token.issuedAt * 1000), { hours: 1 });
  return compareAsc(validUntil, Date.now()) === 1;
}
