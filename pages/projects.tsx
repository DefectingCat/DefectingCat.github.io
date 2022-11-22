import clsx from 'clsx';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import {
  SiGitea,
  SiNextdotjs,
  SiRedux,
  SiThreedotjs,
  SiTsnode,
  SiVim,
} from 'react-icons/si';
import { VscGithubInverted } from 'react-icons/vsc';
import { HiPhoto } from 'react-icons/hi2';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const ProjectCard = dynamic(() => import('components/pages/ProjectCard'));

const iconMap = {
  gitea: <SiGitea />,
  nextjs: <SiNextdotjs />,
  github: <VscGithubInverted />,
  vim: <SiVim />,
  tsnode: <SiTsnode />,
  three: <SiThreedotjs />,
  photos: <HiPhoto />,
  redux: <SiRedux />,
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
            className={clsx(
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
            className={clsx(
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
    {
      id: 5,
      icon: 'redux',
      name: 'RUA-Context',
      description: 'A global store for React.',
      url: 'https://github.com/rua-plus/rua-context',
    },
    {
      id: 6,
      icon: 'three',
      name: 'RUA-Three',
      description: 'A three.js hooks for React.',
      url: 'https://github.com/rua-plus/rua-three',
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
    {
      id: 1,
      icon: 'photos',
      name: 'Photos',
      description: 'Some photos.',
      url: 'https://photos.rua.plus/browse',
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