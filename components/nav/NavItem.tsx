import { Flex, Icon, Text } from '@chakra-ui/react';
import { FC, MouseEvent, useEffect } from 'react';
import { MenuItem } from 'components/NavBar';
import { useRouter } from 'next/router';

interface Props {
  handleMenuClick: (
    // eslint-disable-next-line no-unused-vars
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    // eslint-disable-next-line no-unused-vars
    path?: string
  ) => void;
  menuItem: MenuItem;
}

const NavItem: FC<Props> = ({ handleMenuClick, menuItem }) => {
  const { id, name, path, icon } = menuItem;
  const router = useRouter();

  useEffect(() => {
    path && router.prefetch(path);
  }, [path, router]);

  return (
    <>
      <Flex
        onClick={(e) => handleMenuClick(e, path)}
        href={path}
        key={id}
        as="a"
        alignItems="center"
        justifyContent={['unset', null, 'space-between']}
        fontSize={['18', null, '22']}
        my={['0.5rem', null, '0.5rem']}
        cursor="pointer"
      >
        <Icon as={icon} mr={['2.5rem', null, 'unset']} />
        <Text>{name}</Text>
      </Flex>
    </>
  );
};

export default NavItem;
