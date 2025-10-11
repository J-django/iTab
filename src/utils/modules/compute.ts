/**
 * 添加单位
 * @param value 值
 * @param unit 单位，默认为 ¥
 * @param isPrefix 是否在值前添加
 */
export function addUnit(
  value: number | string | null | undefined,
  unit: string = "¥",
  isPrefix: boolean = true,
): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const stringValue = typeof value === "number" ? value.toString() : value;

  return isPrefix ? `${unit}${stringValue}` : `${stringValue}${unit}`;
}

/**
 * 千位加逗号
 * @param value 值
 */
export function formatThousands(value: string | number | null | undefined) {
  // 判空
  if (value === null || value === undefined || value === "") return "";

  const raw = String(value).trim().replace(/,/g, "");

  const num = Number(raw);
  if (Number.isNaN(num)) {
    return raw;
  }

  if (num === 0) return value;

  const isNegative = raw.startsWith("-") && num < 0;
  const absStr = isNegative ? raw.slice(1) : raw;

  const [intPartRaw, fracPart] = absStr.split(".");

  const intPart = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (isNegative ? "-" : "") + intPart + (fracPart ? `.${fracPart}` : "");
}

/**
 * 补全小数点后位数
 * @param value 值
 * @param decimals 补全小数点位数
 */
export function padDecimal(
  value: string | number | null | undefined,
  decimals: number,
) {
  if (value === null || value === undefined || value === "") return "";

  const raw = String(value).trim();
  if (isNaN(Number(raw))) return raw;

  const isNegative = raw.startsWith("-");
  const absStr = isNegative ? raw.slice(1) : raw;

  const [intPart, fracPartRaw = ""] = absStr.split(".");
  let fracPart = fracPartRaw;

  if (fracPart.length > decimals) {
    fracPart = fracPart.slice(0, decimals);
  }

  fracPart = fracPart.padEnd(decimals, "0");

  return (
    (isNegative ? "-" : "") + intPart + (decimals > 0 ? `.${fracPart}` : "")
  );
}

/**
 * 值为空返回默认数据
 * @param value 值
 * @param defaultValue 默认值
 */
export function orDefault<T>(value: any, defaultValue: T): T {
  // NaN 需要单独判断，因为 NaN !== NaN
  const isNaNValue = typeof value === "number" && isNaN(value);

  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === 0 ||
    isNaNValue
  ) {
    return defaultValue;
  }

  return value;
}

export function getNextIndex(
  current: number,
  direction: "up" | "down",
  listLength: number,
): number {
  if (listLength === 0) return -1;

  if (direction === "down") {
    if (current === -1) {
      return 0;
    }
    if (current < listLength - 1) {
      return current + 1;
    }
    return -1;
  }

  if (direction === "up") {
    if (current === -1) {
      return listLength - 1;
    }
    if (current > 0) {
      return current - 1;
    }
    return -1;
  }

  return current;
}
