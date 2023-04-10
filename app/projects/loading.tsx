import clsx from 'clsx';
import { Metadata } from 'next';
import { projects, selfHosts } from './content';
import PojectCardSkeleton from './project-card-skeleton';

export const metadata: Metadata = {
  title: 'RUA - Projects',
};

const Loading = () => {
  return (
    <>
      <main className="max-w-4xl px-8 py-8 mx-auto lg:px-0">
        <div>
          {/* Git projects */}
          <div>
            <h1 className="mb-4 text-2xl">Projects</h1>
          </div>
          <div
            className={clsx(
              'grid grid-cols-1 lg:grid-cols-3',
              'md:grid-cols-2 gap-5'
            )}
          >
            {projects.map((item) => (
              <PojectCardSkeleton key={item.id} />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div>
            <h1 className="mb-4 text-2xl">Seft Hosts</h1>
          </div>
          <div
            className={clsx(
              'grid grid-cols-1 lg:grid-cols-3',
              'md:grid-cols-2 gap-5'
            )}
          >
            {selfHosts.map((item) => (
              <PojectCardSkeleton key={item.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Loading;
