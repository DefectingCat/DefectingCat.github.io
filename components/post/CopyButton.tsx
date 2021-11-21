import { Button, useClipboard, useColorModeValue } from '@chakra-ui/react';
import { FC, MouseEventHandler, useEffect, useState } from 'react';

const CopyButton: FC = ({ children }) => {
  const copyButtonTheme = useColorModeValue('teal', 'pink');

  // Copy code
  const [codeContent, setCodeContent] = useState('');
  const { hasCopied, onCopy } = useClipboard(codeContent);

  const copyCode: MouseEventHandler<HTMLButtonElement> = (e) => {
    const target = e.target as HTMLButtonElement;
    // Button is sibling with Code tag
    const codeToCopy = target.nextElementSibling?.textContent;
    codeToCopy && setCodeContent(codeToCopy);
  };
  useEffect(() => {
    codeContent && onCopy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeContent]);

  return (
    <>
      <pre>
        <Button
          size="xs"
          colorScheme={copyButtonTheme}
          position="absolute"
          top="5px"
          right="5px"
          onClick={copyCode}
        >
          {hasCopied ? 'COPYIED' : 'COPY'}
        </Button>
        {children}
      </pre>
    </>
  );
};

export default CopyButton;
