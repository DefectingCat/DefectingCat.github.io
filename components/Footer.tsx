import { FC } from 'react';

const nowDay = new Date().getFullYear();

const Footer: FC = () => {
  return (
    <>
      <footer className="px-10">
        <div className="h-[2px] bg-slate-500"></div>
        <div className="py-4">
          &copy; 2022-{nowDay} Powered by Next.js 💙 xfy
        </div>
      </footer>
    </>
  );
};

export default Footer;
