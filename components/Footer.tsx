import { FC } from 'react';

const nowDay = new Date().getFullYear();

const Footer: FC = () => {
  return (
    <>
      <footer className="max-w-6xl px-10 mx-auto lg:px-0">
        <div className="h-[2px] bg-slate-500"></div>
        <div className="py-4">
          &copy; 2022-{nowDay} Powered by Next.js 💙 xfy
        </div>
      </footer>
    </>
  );
};

export default Footer;
