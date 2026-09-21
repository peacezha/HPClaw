export interface ChatKeyEventLike {
  key: string;
  shiftKey: boolean;
  isComposing?: boolean;
}

/** Enter 发送；Shift+Enter 换行；中文输入法组合期间（isComposing）不发送。 */
export function shouldSubmitOnKey(e: ChatKeyEventLike): boolean {
  return e.key === 'Enter' && !e.shiftKey && !e.isComposing;
}
