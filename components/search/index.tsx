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
import CustomSearchBox from './CustomSearchBox';
import CustomHits from './CustomHits';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ?? ''
);

interface Props {
  isModalOpen: boolean;
  onModalClose: () => void;
}

const Search: FC<Props> = ({ isModalOpen, onModalClose }) => {
  return (
    <>
      <Modal size="xl" isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="0.5rem">
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
