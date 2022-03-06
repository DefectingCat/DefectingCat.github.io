import dynamic from 'next/dynamic';
import { ReactElement, useState } from 'react';
import cn from 'classnames';
import Head from 'next/head';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const Button = dynamic(() => import('components/RUA/RUAButton'));
const Input = dynamic(() => import('components/RUA/RUAInput'));

const Admin = () => {
  const [showInput, setShowInput] = useState(false);
  const [showOverFlow, setShowOverFlow] = useState(true);
  const handleLoginClick = () => {
    if (!showInput) {
      setShowInput(true);
      setTimeout(() => {
        setShowOverFlow(false);
      }, 299);
    } else {
      // handle login
    }
  };

  return (
    <>
      <Head>
        <title>RUA - Tweets</title>
      </Head>

      <div className={cn('')}>
        <div
          className={cn(
            'flex flex-col mb-4',
            'text-sm md:w-1/2 transition-all'
          )}
        >
          <Input placeholder="Username" className="py-3 mb-4" />
          <Input placeholder="Password" className="py-3" type="password" />
        </div>
        <Button className="px-5 py-2" onClick={handleLoginClick}>
          Login{showInput ? '🚀' : '🤔'}
        </Button>
      </div>
    </>
  );
};

Admin.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Admin;
