import React from 'react';
import classNames from 'classnames';
import loadingImage from 'public/images/img/mona-loading-default.gif';
import Image from 'next/image';

const RUALoading = () => {
  return (
    <div
      className={classNames(
        'h-[300px] flex loading',
        'flex-col items-center justify-center'
      )}
    >
      <Image width={50} height={50} src={loadingImage} alt="Loading" />

      <span className="my-4">rua rua rua...</span>
    </div>
  );
};

export default RUALoading;
