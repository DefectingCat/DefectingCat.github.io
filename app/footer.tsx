import { memo } from 'react';
import { FiGithub } from 'react-icons/fi';

const nowDay = new Date().getFullYear();

const Footer = () => {
  return (
    <>
      <footer className="max-w-6xl px-4 mx-auto xl:px-0">
        <div className="h-[2px] bg-slate-500"></div>

        <div className="flex items-center justify-between py-4">
          <div>&copy; {nowDay} Powered by Next.js 💙 xfy</div>
          <div>
            <a
              href="https://github.com/DefectingCat"
              target="_blank"
              rel="noreferrer"
            >
              <FiGithub />
            </a>
          </div>
          <div>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer"
            >
              皖ICP备17017808号-2
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default memo(Footer);
