/** 端点路径存储的纯函数，Map 的生命周期由文件传输工作区管理。 */
export function rememberEndpointPath(memory: Map<string, string>, endpointId: string, path: string): void {
  const id = endpointId.trim();
  const value = path.trim();
  if (id && value) memory.set(id, path);
}

/**
 * FilePane 会先上报 loading，再上报最终结果。只有成功完成的目录才能写入
 * 端点记忆，否则端点切换首帧里的旧路径会污染新集群。
 */
export function rememberResolvedEndpointPath(
  memory: Map<string, string>,
  endpointId: string,
  path: string,
  loading?: boolean,
  error?: string,
): void {
  if (loading || error) return;
  rememberEndpointPath(memory, endpointId, path);
}

export function endpointPathOrDefault(
  memory: Map<string, string>,
  endpointId: string,
  fallback: string,
): string {
  return memory.get(endpointId) || fallback;
}
