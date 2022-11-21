import classNames from 'classnames';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import {
  SiGitea,
  SiNextdotjs,
  SiThreedotjs,
  SiTsnode,
  SiVim,
} from 'react-icons/si';
import { VscGithubInverted } from 'react-icons/vsc';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const ProjectCard = dynamic(() => import('components/pages/ProjectCard'));

const iconMap = {
  gitea: <SiGitea />,
  nextjs: <SiNextdotjs />,
  github: <VscGithubInverted />,
  vim: <SiVim />,
  tsnode: <SiTsnode />,
  three: <SiThreedotjs />,
};

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
              <ProjectCard
                icon={iconMap[item.icon ?? 'github']}
                key={item.id}
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
            className={classNames(
              'grid grid-cols-1 lg:grid-cols-3',
              'md:grid-cols-2 gap-5'
            )}
          >
            {selfHosts.map((item) => (
              <ProjectCard
                icon={iconMap[item.icon ?? 'github']}
                key={item.id}
                project={item}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export type Project = {
  id: number;
  icon?: keyof typeof iconMap;
  name: string;
  description: string;
  url: string;
};

export const getStaticProps: GetStaticProps<{
  projects: Project[];
  selfHosts: Project[];
}> = async () => {
  const projects: Project[] = [
    {
      id: 0,
      icon: 'three',
      name: '3d-globe',
      description: 'A 3d globe made by three.js.',
      url: 'https://github.com/DefectingCat/3d-globe',
    },
    {
      id: 1,
      icon: 'nextjs',
      name: 'Blog',
      description: 'This site.',
      url: 'https://github.com/DefectingCat/DefectingCat.github.io',
    },
    {
      id: 2,
      icon: 'tsnode',
      name: 'boring-avatars-services',
      description: 'Random avatars.',
      url: 'https://github.com/DefectingCat/boring-avatars-services',
    },
    {
      id: 3,
      icon: 'tsnode',
      name: 'RUA DDNS',
      description: 'DDNS Script for DNSPod',
      url: 'https://github.com/DefectingCat/rua-ddns',
    },
    {
      id: 4,
      icon: 'vim',
      name: 'Dotfiles',
      description: 'Some dotfiles.',
      url: 'https://github.com/DefectingCat/dotfiles',
    },
  ];
  const selfHosts: Project[] = [
    {
      id: 0,
      icon: 'gitea',
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