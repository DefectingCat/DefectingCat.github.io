import classNames from 'classnames';
import { GetUser } from 'lib/fetcher';
import Image from 'next/image';
import avatar from 'assets/images/img/avatar.svg';
import { FiLink, FiMail, FiTwitter } from 'react-icons/fi';

type Props = {
  user: GetUser;
};

const UserInfo = ({ user }: Props) => {
  return (
    <>
      <div
        className={classNames(
          'flex md:items-center flex-1',
          'max-w-[280px] md:block',
          'mb-4 flex-col md:flex-row'
        )}
      >
        <div className="flex md:flex-col">
          <div
            className={classNames(
              'w-16 h-16 mr-4 overflow-hidden',
              'md:w-auto h-auto'
            )}
          >
            <Image
              src={avatar}
              alt="Avatar"
              priority
              className="rounded-full"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold font-Barlow md:text-2xl">
              {user.name}
            </h1>

            <h2 className="text-xl text-gray-400 font-Barlow md:text-2xl">
              {user.login}
            </h2>
          </div>
        </div>

        <div className="my-4">{user.bio}</div>

        <div>
          <div className="flex items-center mb-1">
            <FiMail className="mr-2" />
            <span>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </span>
          </div>
          {user.blog && (
            <div className="flex items-center mb-1">
              <FiLink className="mr-2" />
              <a href={user.blog} target="_blank" rel="noreferrer">
                {user.blog}
              </a>
            </div>
          )}
          {user.twitter_username && (
            <div className="flex items-center mb-1">
              <FiTwitter className="mr-2" />
              <a
                rel="noreferrer"
                target="_blank"
                href={`https://twitter.com/${user.twitter_username}`}
              >
                @{user.twitter_username}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserInfo;
