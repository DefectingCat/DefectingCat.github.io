import classNames from 'classnames';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const Projects = ({
  projects,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-4xl py-8 mx-auto">
        <div className="flex">
          {projects.map((item) => (
            <>
              <div
                key={item.id}
                className={classNames(
                  'py-3 px-4 rounded-lg bg-slate-100',
                  'hover:bg-slate-200',
                  'transition-all duration-300',
                  'flex items-center cursor-pointer'
                )}
              >
                <VscGithubInverted className="w-8 h-8 mr-2" />

                <a
                  href={item.url}
                  className="w-56"
                  target="_blank"
                  rel="noreferrer"
                >
                  <h2 className="text-xl">{item.name}</h2>
                  <span
                    className={classNames(
                      'overflow-hidden break-keep text-ellipsis',
                      'whitespace-nowrap inline-block',
                      'w-[inherit]'
                    )}
                  >
                    {item.description}
                  </span>
                </a>
              </div>
            </>
          ))}
        </div>
        <div></div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<{
  projects: {
    id: number;
    name: string;
    description: string;
    url: string;
  }[];
}> = async () => {
  const projects = [
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
