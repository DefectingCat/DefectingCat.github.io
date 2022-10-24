import classNames from 'classnames';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { SiGitea } from 'react-icons/si';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const ProjectCard = dynamic(() => import('components/pages/ProjectCard'));

const Projects = ({
  projects,
  selfHosts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-4xl px-8 py-8 mx-auto lg:px-0">
        <div>
          {/* Git projects */}
          <div>
            <h1 className="mb-4 text-2xl">Projects</h1>
          </div>
          <div
            className={classNames(
              'grid grid-cols-1 lg:grid-cols-3',
              'md:grid-cols-2 gap-5'
            )}
          >
            {projects.map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div>
            <h1 className="mb-4 text-2xl">Seft Hosts</h1>
          </div>
          <div
            className={classNames(
              'grid grid-cols-1 lg:grid-cols-3',
              'md:grid-cols-2 gap-5'
            )}
          >
            {selfHosts.map((item) => (
              <ProjectCard icon={<SiGitea />} key={item.id} project={item} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export type Project = {
  id: number;
  name: string;
  description: string;
  url: string;
};

export const getStaticProps: GetStaticProps<{
  projects: Project[];
  selfHosts: Project[];
}> = async () => {
  const projects = [
    {
      id: 0,
      name: '3d-globe',
      description: 'A 3d globe made by three.js.',
      url: 'https://github.com/DefectingCat/3d-globe',
    },
  ];
  const selfHosts = [
    {
      id: 0,
      name: 'Gitea',
      description: 'Selfhost git.',
      url: 'https://git.rua.plus/',
    },
  ];

  return {
    props: {
      projects,
      selfHosts,
    },
  };
};

Projects.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Projects;
