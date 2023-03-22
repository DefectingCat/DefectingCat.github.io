import LinkAnchor from 'components/mdx/link-anchor';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { GistData } from 'lib/fetcher';
import Link from 'next/link';
import { memo } from 'react';
import GistsCode from './gists-code';

dayjs.extend(relativeTime);

type Props = {
  gists: GistData[];
};

const FileContent = ({ gists }: Props) => {
  return (
    <>
      <div className="overflow-hidden">
        {gists.map((g) => (
          <div key={g.id}>
            {Object.keys(g.files).map((f) => (
              <div key={g.files[f].raw_url} className="pb-4 ">
                {/* Username and file name */}
                <h1 className="md:text-lg">
                  {g.login} /
                  <Link href={`/g/${g.id}`}>
                    <LinkAnchor external={false}>
                      {g.files[f].filename}
                    </LinkAnchor>
                  </Link>
                </h1>
                {/* Time */}
                <p className="text-gray-400">
                  Last active: {dayjs(g.updated_at).fromNow()}
                </p>
                {/* Description */}
                <p className="text-gray-500">{g.description}</p>

                <GistsCode file={g.files[f]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(FileContent);
