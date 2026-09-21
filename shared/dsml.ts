/**
 * 部分模型（如 deepseek 系在工具调用失配时）会把 DSML 工具标记直接写进正文：
 *   <｜｜DSML｜｜ calls> <｜｜DSML｜｜ invoke name="..."> ... </｜｜DSML｜｜ invoke> </｜｜DSML｜｜ calls>
 * 这些标记不是给用户看的内容（且从未被真正执行），展示前剥离。
 * 兼容完整块与流式截断的未闭合块。
 */
export function stripDsmlMarkup(text: string): string {
  if (!text || !text.includes('DSML')) return text;
  return text
    // 完整的 calls 块
    .replace(/\s*<｜+DSML｜+\s*calls>[\s\S]*?<\/｜+DSML｜+\s*calls>/g, '')
    // 未闭合的 calls 块（流式截断）
    .replace(/\s*<｜+DSML｜+\s*calls>[\s\S]*$/g, '')
    // 残留的单个 DSML 开/闭标签（顺带吃掉一个相邻空格）
    .replace(/\s?<\/?｜+DSML｜+[^>]*>/g, '')
    // 清理剥离后留下的多余空行
    .replace(/\n{3,}/g, '\n\n');
}
