import avatarPoccur from 'assets/images/avatar-poccur.webp';
import clsx from 'clsx';
import FriendCard from 'components/pages/friends/friend-card';
import { StaticImageData } from 'next/image';

export type Friend = {
  id: number;
  name: string;
  avatar: StaticImageData;
  link: string;
  desc: string;
};

const friends = [
  {
    id: 0,
    name: 'Poccur',
    avatar: avatarPoccur,
    link: 'https://poccur.top',
    desc: '',
  },
];

const Page = () => {
  return (
    <>
      <div
        className={clsx(
          'grid grid-cols-1 lg:grid-cols-3',
          'md:grid-cols-2 gap-5',
        )}
      >
        {friends.map((f) => (
          <FriendCard friend={f} key={f.id} />
        ))}
      </div>
    </>
  );
};

export default Page;
