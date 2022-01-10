import { FC } from 'react';
import { Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface Props {
  href: string;
  isExternal?: boolean;
}

const PostAnchor: FC<Props> = ({ href, children, isExternal }) => {
  return (
    <>
      <Link
        display="inline-flex"
        alignItems="center"
        href={href}
        isExternal={isExternal}
      >
        {children}
        {isExternal && <ExternalLinkIcon mx="2px" />}
      </Link>
    </>
  );
};

export default PostAnchor;
