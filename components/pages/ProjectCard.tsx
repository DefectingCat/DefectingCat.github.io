import classNames from 'classnames';
import { Project } from 'pages/projects';
import { Children, cloneElement, isValidElement } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';

type ProjectCardProps = {
  project: Project;
  icon?: React.ReactElement<{ className?: string }>;
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
        className={classNames(
          'py-3 px-4 rounded-lg bg-slate-100',
          'hover:bg-slate-200',
          'transition-all duration-300',
          'flex items-center cursor-pointer',
          'justify-between dark:bg-rua-gray-800',
          'hover:dark:bg-rua-gray-700'
        )}
      >
        {Icon ? Icon : <VscGithubInverted className="w-8 h-8" />}

        <a
          href={project.url}
          className="w-[calc(100%_-_40px)]"
          target="_blank"
          rel="noreferrer"
        >
          <h2
            className={classNames(
              'text-xl overflow-hidden',
              'text-ellipsis whitespace-nowrap'
            )}
          >
            {project.name}
          </h2>
          <span
            className={classNames(
              'overflow-hidden break-keep text-ellipsis',
              'whitespace-nowrap inline-block',
              'w-[inherit]'
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