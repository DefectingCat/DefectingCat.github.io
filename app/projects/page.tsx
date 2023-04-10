import clsx from 'clsx';
import ProjectCard from './project-card';
import { Metadata } from 'next';
import { projects, iconMap, selfHosts } from './content';

export const metadata: Metadata = {
  title: 'RUA - Projects',
};

export default function Page() {
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
              <ProjectCard
                key={item.id}
                icon={iconMap[item.icon ?? 'github']}
                project={item}
              />
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
              <ProjectCard
                key={item.id}
                icon={iconMap[item.icon ?? 'github']}
                project={item}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
