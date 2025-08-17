import PostCardLoading from 'components/pages/blog/post-card-loading';

const Loading = () => {
  const num = Array(4).fill(1);

  return (
    <>
      {num.map((_, i) => (
        <PostCardLoading key={i} />
      ))}
    </>
  );
};

export default Loading;
