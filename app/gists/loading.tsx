import FileContentLoading from './file-content-skeleton';

export default function Loading() {
  const num = Array(3).fill(null);

  return (
    <>
      {num.map((_, i) => (
        <FileContentLoading key={i} />
      ))}
    </>
  );
}