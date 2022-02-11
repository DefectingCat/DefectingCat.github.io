import { FC } from 'react';
import dynamic from 'next/dynamic';

const Link = dynamic(() => import('components/PathLink'));

const NotFound: FC = () => {
  return (
    <>
      <div className="h-[100vh] flex justify-center items-center">
        <div>
          <p className="italic text-gray-500">{'// 404 page not found.'}</p>
          <p>
            <span
              style={{
                color: '#d65562',
              }}
            >
              if
            </span>
            <span style={{ color: '#9a9a9a' }} className="ml-2 mr-1">
              (
            </span>

            <span style={{ color: '#4ca8ef' }}>!</span>
            <span style={{ fontStyle: 'italic', color: '#bdbdbd' }}>found</span>
            <span style={{ color: '#9a9a9a' }} className="ml-1 mr-2">
              )
            </span>
            <span style={{ color: '#9a9a9a' }}>{'{'}</span>
          </p>

          <p>
            <span style={{ paddingLeft: '15px', color: '#2796ec' }}>
              <i style={{ width: '10px', display: 'inline-block' }}></i>throw
            </span>
            <span>
              <span style={{ color: '#9a9a9a' }} className="ml-2 mr-1">
                (
              </span>
              <span style={{ color: '#a6a61f' }}>{'"(╯°□°)╯︵ ┻━┻"'}</span>
              <span style={{ color: '#9a9a9a' }} className="ml-1">
                )
              </span>
              ;
            </span>
            <p style={{ color: '#9a9a9a' }}>{'}'}</p>

            <span className="italic text-gray-500">
              {'// '}
              <Link href="/" className="hover:text-gray-400">
                Go home!
              </Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
