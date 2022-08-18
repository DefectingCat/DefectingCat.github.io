import useMounted from 'lib/hooks/useMounted';

const SlideToc = () => {
  const { mounted } = useMounted();

  return (
    <>
      <div className="flex justify-end">
        <div className="toc"></div>
      </div>
    </>
  );
};

export default SlideToc;
