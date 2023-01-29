import { useCallback, useState } from 'react';

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

/**
 * 使用 clipboard API writeText 写入字符到剪贴板
 * copy 方法为 memoized
 * @returns
 */
function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = useCallback(async (text) => {
    const copyWithOldWay = () => {
      try {
        const el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        return true;
      } catch (e) {
        console.warn('Copy failed', e);
        return false;
      }
    };

    const copyWithClipboardAPI = async () => {
      // Try to save to clipboard then save it in the state if worked
      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        return true;
      } catch (error) {
        console.warn('Copy failed', error);
        setCopiedText(null);
        return false;
      }
    };

    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return copyWithOldWay();
    } else {
      return await copyWithClipboardAPI();
    }
  }, []);

  return { copiedText, copy };
}

export default useCopyToClipboard;
