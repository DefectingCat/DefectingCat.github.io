import clsx from 'clsx';
import { Children, cloneElement, isValidElement, ReactElement } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { Project } from './content';

type ProjectCardProps = {
  project: Project;
  icon?: ReactElement<{ className?: string }>;
};

const ProjectCard = ({ project, icon }: ProjectCardProps) => {
  const Icon = Children.map(icon, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child, {
      className: 'w-8 h-8',
    });
  });

  return (
    <>
      <div
        className={clsx(
          'py-3 px-4 rounded-lg bg-slate-100',
          'hover:bg-slate-200',
          'transition-all duration-300',
          'flex items-center cursor-pointer',
          'justify-between dark:bg-rua-gray-800',
          'hover:dark:bg-rua-gray-700',
          'shadow-card',
        )}
      >
        {Icon ? Icon : <VscGithubInverted className="w-8 h-8" />}

        <a
          href={project.url}
          className="w-[calc(100%-40px)]"
          target="_blank"
          rel="noreferrer"
        >
          <h2
            className={clsx(
              'text-xl overflow-hidden',
              'text-ellipsis whitespace-nowrap',
            )}
          >
            {project.name}
          </h2>
          <span
            className={clsx(
              'overflow-hidden break-keep text-ellipsis',
              'whitespace-nowrap inline-block',
              'w-[inherit]',
            )}
          >
            {project.description}
          </span>
        </a>
      </div>
    </>
  );
};

export default ProjectCard;
