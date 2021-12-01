import { FC } from 'react';
import { Link } from '@chakra-ui/react';

interface Props {
  href: string;
}

const PostAnchor: FC<Props> = ({ href, children }) => {
  return (
    <>
      <Link display="inline-flex" alignItems="center" href={href}>
        {children}
      </Link>
    </>
  );
};

export default PostAnchor;
