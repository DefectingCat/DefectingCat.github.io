import { FC, useEffect } from 'react';
import {
  Box,
  Image,
  Text,
  Heading,
  Flex,
  Icon,
  useDisclosure,
  Collapse,
  useMediaQuery,
} from '@chakra-ui/react';
import UseAnimations from 'react-useanimations';
import menu2 from 'react-useanimations/lib/menu2';
import { FiHome, FiArchive, FiTag, FiUser } from 'react-icons/fi';
import Link from 'next/link';

const menu = [
  {
    id: 0,
    name: '首页',
    path: '/',
    icon: FiHome,
  },
  {
    id: 1,
    name: '归档',
    path: '/archive',
    icon: FiArchive,
  },
  {
    id: 2,
    name: '标签',
    path: '/tags',
    icon: FiTag,
  },
  {
    id: 3,
    name: '关于',
    path: '/about',
    icon: FiUser,
  },
];

const NavBar: FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    isLargerThan768 ? onToggle() : void 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLargerThan768]);

  return (
    <>
      <Box
        color={'gray.700'}
        w={[null, null, '120px']}
        p={['3rem 1rem 1rem 1rem', null, 'unset']}
        position={'relative'}
        flex={[1, 1, 'unset']}
      >
        <Box position={'relative'} boxSize="120px">
          {/* avatar */}
          <Image
            borderRadius="full"
            src="/images/img/avatar.svg"
            boxSize="120px"
            boxShadow={'card'}
            objectFit={'cover'}
            alt="Avatar"
            fallbackSrc="https://via.placeholder.com/150"
          />
          {/* emoji on avatar */}
          <Flex
            boxShadow={'card'}
            position={'absolute'}
            bottom={0}
            right={0}
            rounded={'full'}
            bg="white"
            h="40px"
            w="40px"
            justify="center"
            alignItems={'center'}
          >
            ❤️
          </Flex>
        </Box>

        <Heading size={'lg'} mt="0.8rem" mb="0.5rem">
          肥羊
        </Heading>
        <Text color={'gray.400'}>This is bio.</Text>

        {/* Menu */}
        <Box mx={['-2rem', '-4rem', 'unset']}>
          <Collapse in={isOpen} animateOpacity>
            <Flex
              as="nav"
              mt={['1.5rem', null, '2.5rem']}
              flexFlow={['column']}
              py={['1rem', null, 'unset']}
              px={['2rem', '4rem', 'unset']}
              bg={['white', null, 'unset']}
              shadow={['card', null, 'unset']}
            >
              {menu.map((item) => {
                return (
                  <Link passHref href={item.path} key={item.id}>
                    <Flex
                      alignItems="center"
                      justifyContent={['unset', null, 'space-between']}
                      fontSize={['18', null, '22']}
                      color="gray.600"
                      my={['0.5rem', null, '0.5rem']}
                      cursor="pointer"
                    >
                      <Icon as={item.icon} mr={['2.5rem', null, 'unset']} />
                      <Text>{item.name}</Text>
                    </Flex>
                  </Link>
                );
              })}
            </Flex>
          </Collapse>
        </Box>

        <Box
          display={[null, null, 'none']}
          position={'absolute'}
          top={'1.5rem'}
          right={'1rem'}
          onClick={onToggle}
        >
          <UseAnimations
            reverse={isOpen}
            size={40}
            animation={menu2}
            speed={1.5}
          />
        </Box>
      </Box>
    </>
  );
};

export default NavBar;
