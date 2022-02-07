import { FC } from 'react';
import { FiTag } from 'react-icons/fi';
import { Tags } from '@prisma/client';

interface Props {
  tags: Partial<Tags>[];
}

const PostCardTags: FC<Props> = ({ tags }) => {
  return (
    <>
      {tags.map((tag) => (
        <div key={tag.name} className="flex items-center mr-3">
          <FiTag className="mr-2" />
          {tag.name}
        </div>
      ))}
    </>
  );
};

export default PostCardTags;
