import { FC } from 'react';
import { getHeadings } from 'lib/utils';
import Anchor from 'components/mdx/Anchor';

interface Props {
  headings: ReturnType<typeof getHeadings>;
}

const PostTOC: FC<Props> = ({ headings }) => {
  return (
    <>
      <h2>What&apos;s inside?</h2>

      <ul className="pl-4 border-l-4 border-gray-300 toc">
        {headings?.map((h) => (
          <li key={h.link}>
            <Anchor href={h.link} external={false}>
              {h.text}
            </Anchor>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PostTOC;
