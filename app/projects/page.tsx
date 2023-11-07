import clsx from 'clsx';
import {
  iconMap,
  projects,
  selfHosts,
} from 'components/pages/projects/content';
import ProjectCard from 'components/pages/projects/project-card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RUA - Projects',
};

export default function Page() {
  return (
    <>
      <main className="flex-1 max-w-4xl px-8 py-8 mx-auto lg:px-0">
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
            {projects.map((item, i) => (
              <ProjectCard
                key={i}
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
              'md:grid-cols-2 gap-5',
            )}
          >
            {selfHosts.map((item, i) => (
              <ProjectCard
                key={i}
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
