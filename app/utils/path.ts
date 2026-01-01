/**
 * 路径拼接辅助函数
 * 用于处理生产环境下的 base URL 路径
 */
const BASE_URL = import.meta.env.BASE_URL;

export const asset = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}${cleanPath}`;
};
