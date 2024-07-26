import GistCode from 'components/common/gist-code';
import Anchor from 'components/mdx/anchor';
import Image from 'components/mdx/image';
import Paragraph from 'components/mdx/paragraph';
import Pre from 'components/mdx/pre';
import RUACodeSandbox from 'components/rua/rua-code-sandbox';
import RUACodepen from 'components/rua/rua-codepen';
import RUASandpack from 'components/rua/rua-sandpack';
import Tab from 'components/rua/tab';
import TabItem from 'components/rua/tab/tab-item';

const components = {
  RUASandpack,
  a: Anchor,
  pre: Pre,
  p: Paragraph,
  Image,
  Tab,
  TabItem,
  RUACodeSandbox,
  RUACodepen,
  GistCode,
};

export default components;
