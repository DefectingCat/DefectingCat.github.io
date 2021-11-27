import { FC } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { SearchBoxProvided } from 'react-instantsearch-core';
import {
  InputGroup,
  Input,
  InputRightElement,
  CloseButton,
} from '@chakra-ui/react';

const SearchBox: FC<SearchBoxProvided> = ({ currentRefinement, refine }) => {
  return (
    <>
      <InputGroup>
        <Input
          value={currentRefinement}
          onChange={(event) => refine(event.currentTarget.value)}
          autoFocus
          placeholder="Seach posts..."
        />
        <InputRightElement>
          {currentRefinement && <CloseButton onClick={() => refine('')} />}
        </InputRightElement>
      </InputGroup>
    </>
  );
};

const CustomSearchBox = connectSearchBox(SearchBox);

export default CustomSearchBox;
