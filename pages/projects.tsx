import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const ProjectCard = dynamic(() => import('components/pages/ProjectCard'));

const Projects = ({
  projects,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-4xl py-8 mx-auto">
        <div>
          {/* Git projects */}
          <div>
            <h1 className="text-2xl mb-4">Projects</h1>
          </div>
          <div className="grid grid-cols-3 gap-5 justify-between">
            {projects.map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
        </div>
        <div></div>
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
}> = async () => {
  const projects = [
    {
      id: 0,
      name: '3d-globe',
      description: 'A 3d globe made by three.js.',
      url: 'https://github.com/DefectingCat/3d-globe',
    },
    {
      id: 0,
      name: '3d-globe',
      description: 'A 3d globe made by three.js.',
      url: 'https://github.com/DefectingCat/3d-globe',
    },
    {
      id: 0,
      name: '3d-globe',
      description: 'A 3d globe made by three.js.',
      url: 'https://github.com/DefectingCat/3d-globe',
    },
    {
      id: 0,
      name: '3d-globe',
      description: 'A 3d globe made by three.js.',
      url: 'https://github.com/DefectingCat/3d-globe',
    },
  ];

  return {
    props: {
      projects,
    },
  };
};

Projects.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Projects;
