import { FC } from 'react';
import dynamic from 'next/dynamic';
import { Box, Flex, Heading, Tag, Icon } from '@chakra-ui/react';
import useGetColors from 'lib/hooks/useGetColors';
import { FiCalendar } from 'react-icons/fi';

const Date = dynamic(() => import('components/DateFormater'));

interface Props {
  title: string;
  tags: string[] | string;
  date: string;
}

const PostHead: FC<Props> = ({ title, tags, date }) => {
  const { headingColor } = useGetColors();

  return (
    <>
      <Box as="header">
        <Heading as="h1" mb="1rem" color={headingColor}>
          {title}
        </Heading>

        {/* Post tags */}
        <Box mb="1rem">
          {Array.isArray(tags)
            ? // Mutil tags
              tags.map((item) => (
                <Tag key={item} mr="0.5rem">
                  {item}
                </Tag>
              ))
            : // Signal tags
              tags && <Tag>{tags}</Tag>}
        </Box>

        {/* Date */}
        <Flex alignItems="center" color="gray.600">
          <Icon as={FiCalendar} mr="0.5rem" />
          <Date dateString={date} />
        </Flex>
      </Box>
    </>
  );
};

export default PostHead;
