import GistsCode from 'app/gists/gists-code';
import LinkAnchor from 'components/mdx/link-anchor';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getSignalGist } from 'lib/fetcher';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import avatar from 'public/images/img/avatar.svg';

export const revalidate = 600;

dayjs.extend(relativeTime);

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  if (typeof params.id !== 'string') notFound();
  const gist = await getSignalGist(params.id);
  if (!gist || !gist.files) notFound();

  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="pb-4 text-sm">
          <div className="flex items-center py-1 ">
            <Image
              src={avatar}
              alt="Avatar"
              priority
              width={32}
              height={32}
              className="rounded-full "
            />
            <h1 className="ml-2 overflow-hidden text-xl whitespace-nowrap overflow-ellipsis">
              <Link href="/gists">
                <LinkAnchor external={false}>{gist.login}</LinkAnchor>
              </Link>
              /{Object.keys(gist.files)[0]}
            </h1>
          </div>

          <p className="pl-10 text-gray-400 ">
            Last active: {dayjs(gist.updated_at).fromNow()}
          </p>

          <div className="py-4">
            <p className="pb-2 text-lg text-gray-500">{gist.description}</p>

            {Object.keys(gist.files).map((f) => (
              <GistsCode
                key={gist.files[f].raw_url}
                file={gist.files[f]}
                showFileName
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}