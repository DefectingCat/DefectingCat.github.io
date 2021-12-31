import { Button, useClipboard, useColorModeValue } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';

const CopyButton: FC = ({ children }) => {
  const copyButtonTheme = useColorModeValue('teal', 'pink');

  const preRef = useRef<HTMLPreElement>(null);

  // Set code text content to state.
  useEffect(() => {
    const children = preRef.current?.children[1];
    if (children && children.tagName === 'CODE') {
      setCodeContent(children.textContent ?? '');
    }
  }, []);

  // Copy code
  const [codeContent, setCodeContent] = useState('');
  const { hasCopied, onCopy } = useClipboard(codeContent);

  return (
    <>
      <pre ref={preRef}>
        <Button
          size="xs"
          colorScheme={copyButtonTheme}
          position="absolute"
          top="5px"
          right="5px"
          onClick={onCopy}
        >
          {hasCopied ? 'COPYIED' : 'COPY'}
        </Button>
        {children}
      </pre>
    </>
  );
};

export default CopyButton;
