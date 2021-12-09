import { FC } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import useGetColors from 'lib/hooks/useGetColors';
import dynamic from 'next/dynamic';

const CustomSearchBox = dynamic(() => import('./CustomSearchBox'));
const CustomHits = dynamic(() => import('./CustomHits'));

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ?? '',
  {}
);

interface Props {
  isModalOpen: boolean;
  onModalClose: () => void;
}

const Search: FC<Props> = ({ isModalOpen, onModalClose }) => {
  const { bgColor } = useGetColors();

  return (
    <>
      <Modal
        size="3xl"
        isOpen={isModalOpen}
        onClose={onModalClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />

        <ModalContent
          my={['unset', '3.75rem']}
          maxH={['100vh', 'calc(100% - 7.5rem)']}
        >
          <ModalBody p="1rem" bg={bgColor} rounded="lg">
            <InstantSearch searchClient={searchClient} indexName="rua">
              <Flex justifyContent="space-between" alignItems="center">
                <CustomSearchBox />

                <ModalCloseButton
                  position="unset"
                  display={[null, null, 'none']}
                />
              </Flex>

              <CustomHits />
            </InstantSearch>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Search;
