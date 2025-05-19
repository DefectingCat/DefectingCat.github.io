import { Friend } from 'app/friends/page';
import clsx from 'clsx';
import Image from 'next/image';

const FriendCard = ({ friend }: { friend: Friend }) => {
  return (
    <a href={friend.link} target="_blank">
      <div
        className={clsx(
          'py-3 px-4 rounded-lg-xl bg-slate-100',
          'hover:bg-slate-200',
          'transition-all duration-300',
          'flex items-center cursor-pointer',
          'justify-between dark:bg-rua-gray-800',
          'hover:dark:bg-rua-gray-700',
          'shadow-card',
        )}
      >
        <div>
          <h2 className={clsx('text-xl font-semibold')}>{friend.name}</h2>
          <div className="text-sm text-subtext0">{friend.link}</div>
        </div>
        <div className="overflow-hidden rounded-lg w-14 h-14">
          <Image
            src={friend.avatar}
            alt="avatar"
            width={56}
            height={56}
            objectFit="contain"
          />
        </div>
      </div>
    </a>
  );
};

export default FriendCard;
