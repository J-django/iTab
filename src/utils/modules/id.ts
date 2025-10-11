import { nanoid } from "nanoid";

/**
 * 生成唯一 ID
 * @param length ID 长度，默认 21
 * @returns string
 */
export function generateId(length = 21): string {
  return nanoid(length);
}

/**
 * 批量生成 ID
 * @param count 生成数量
 * @param length 每个 ID 长度
 * @returns string[]
 */
export function generateIds(count: number, length = 21): string[] {
  return Array.from({ length: count }, () => nanoid(length));
}
