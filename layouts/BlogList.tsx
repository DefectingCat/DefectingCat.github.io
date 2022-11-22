import clsx from 'clsx';

type Props = {
  children: React.ReactElement | React.ReactElement[];
};

const BlogList = ({ children }: Props) => {
  return (
    <>
      <h1
        className={clsx(
          'text-5xl font-bold text-center font-Barlow',
          'mt-8 mb-20 text-gray-800 dark:text-gray-200'
        )}
      >
        Blog posts
      </h1>

      <div className="px-4 lg:px-0">{children}</div>
    </>
  );
};

export default BlogList;
