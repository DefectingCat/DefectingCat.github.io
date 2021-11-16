import { FC } from 'react';
import { parseISO, format } from 'date-fns';
import { Box } from '@chakra-ui/react';

interface Props {
  dateString: string;
}

const Date: FC<Props> = ({ dateString }) => {
  const date = parseISO(dateString);
  return (
    <>
      <Box as="time" lineHeight="0" dateTime={dateString}>
        {format(date, 'yyyy/MM/dd')}
      </Box>
    </>
  );
};

export default Date;
