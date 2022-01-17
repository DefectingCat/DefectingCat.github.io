import { FC } from 'react';
import { FiTag } from 'react-icons/fi';

interface Props {
  tags: string | string[];
}

const PostCardTags: FC<Props> = ({ tags }) => {
  return (
    <>
      {Array.isArray(tags) ? (
        tags.map((tag) => (
          <div key={tag} className="flex items-center">
            <FiTag className="mr-2" />
            {tag}
          </div>
        ))
      ) : (
        <div className="flex items-center">
          <FiTag className="mr-2" />
          {tags}
        </div>
      )}
    </>
  );
};

export default PostCardTags;
