import clsx from 'clsx';
import { projects, selfHosts } from 'components/pages/projects/content';
import PojectCardSkeleton from 'components/pages/projects/project-card-skeleton';

const Loading = () => {
  return (
    <>
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
    </>
  );
};

export default Loading;
