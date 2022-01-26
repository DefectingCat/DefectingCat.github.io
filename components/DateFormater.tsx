import { FC } from 'react';
import { parseISO, format } from 'date-fns';
import cn from 'classnames';

interface Props {
  dateString: string;
  className?: string;
}

const DateFormater: FC<Props> = ({ dateString, className }) => {
  const date = parseISO(dateString);
  return (
    <>
      <time className={cn('leading-none', className)} dateTime={dateString}>
        {format(date, 'yyyy/MM/dd')}
      </time>
    </>
  );
};

export default DateFormater;
