import clsx from 'clsx';
import { urlMeta } from 'lib/fetcher';
import { isUrl } from 'lib/utils';
import Image from 'next/image';

/**
 * Url card previewer
 */
const UrlPreviewer = async ({
  url,
  className,
}: {
  url: string;
  className?: string;
}) => {
  if (!isUrl(url)) return null;

  const metadata = await urlMeta(url);
  const imageUrl =
    metadata?.links?.find((v) => v.type.startsWith('image/'))?.href ?? '';

  return (
    <a href={url} target="_blank" className={clsx(className, 'block')}>
      <div
        className={clsx(
          'rounded-lg h-40',
          'bg-white',
          'flex cursor-pointer dark:bg-rua-gray-700',
        )}
      >
        <Image
          alt=""
          src={imageUrl}
          width={160}
          height={160}
          className="object-cover"
        />
        <div className="py-4 px-5 md:p-7 overflow-hidden">
          <div className={clsx('text-xl mb-1 font-semibold')}>
            {metadata.meta?.title}
          </div>
          <div
            className={clsx(
              'overflow-hidden whitespace-nowrap text-ellipsis',
              'mb-1',
            )}
          >
            {metadata.meta?.description}
          </div>
          <div
            className={clsx(
              'overflow-hidden whitespace-nowrap text-ellipsis',
              'mb-1 text-gray-400 dark:text-gray-600',
            )}
          >
            {url}
          </div>
        </div>
      </div>
    </a>
  );
};

export default UrlPreviewer;
