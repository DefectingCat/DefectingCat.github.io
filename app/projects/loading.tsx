import clsx from 'clsx';
import { projects, selfHosts } from 'components/pages/projects/content';
import PojectCardSkeleton from 'components/pages/projects/project-card-skeleton';
import { Metadata } from 'next';

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
              'md:grid-cols-2 gap-5',
            )}
          >
            {projects.map((_, i) => (
              <PojectCardSkeleton key={i} />
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
              'md:grid-cols-2 gap-5',
            )}
          >
            {selfHosts.map((_, i) => (
              <PojectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Loading;
