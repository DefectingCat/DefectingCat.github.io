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
  useColorMode,
  Button,
} from '@chakra-ui/react';
import UseAnimations from 'react-useanimations';
import menu2 from 'react-useanimations/lib/menu2';
import { FiHome, FiArchive, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import Link from 'next/link';
import useGetColors from '../lib/hooks/useGetColors';

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
    id: 3,
    name: '关于',
    path: '/about',
    icon: FiUser,
  },
];

const NavBar: FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });

  const { colorMode, toggleColorMode } = useColorMode();

  const { boxBg, bioColor, textColor, headingColor } = useGetColors();

  useEffect(() => {
    if (!isOpen && isLargerThan768) onToggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLargerThan768]);

  return (
    <>
      <Box
        color={textColor}
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
            bg={boxBg}
            h="40px"
            w="40px"
            justify="center"
            alignItems={'center'}
          >
            ❤️
          </Flex>
        </Box>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt="0.8rem"
          mb="0.5rem"
        >
          <Heading color={headingColor} size={'lg'}>
            肥羊
          </Heading>
          <Button
            background="transparent"
            fontSize={['18', null, '22']}
            onClick={toggleColorMode}
          >
            {colorMode === 'light' ? <Icon as={FiSun} /> : <Icon as={FiMoon} />}
          </Button>
        </Flex>

        <Text color={bioColor}>一条咸鱼.</Text>

        {/* Menu */}
        <Box mx={['-2rem', '-4rem', 'unset']}>
          <Collapse in={isOpen} animateOpacity>
            <Flex
              as="nav"
              mt={['1.5rem', null]}
              flexFlow={['column']}
              py={['1rem', null, 'unset']}
              px={['2rem', '4rem', 'unset']}
              bg={[boxBg, null, 'unset']}
              shadow={['card', null, 'unset']}
            >
              {menu.map((item) => {
                return (
                  <Link passHref href={item.path} key={item.id}>
                    <Flex
                      as="a"
                      alignItems="center"
                      justifyContent={['unset', null, 'space-between']}
                      fontSize={['18', null, '22']}
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
