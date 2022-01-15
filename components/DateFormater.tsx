import { FC } from 'react';
import { parseISO, format } from 'date-fns';

interface Props {
  dateString: string;
}

const DateFormater: FC<Props> = ({ dateString }) => {
  const date = parseISO(dateString);
  return (
    <>
      <time className="leading-none" dateTime={dateString}>
        {format(date, 'yyyy/MM/dd')}
      </time>
    </>
  );
};

export default DateFormater;
