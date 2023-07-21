import { BiPlanet } from 'react-icons/bi';
import { HiPhoto } from 'react-icons/hi2';
import {
  PiGitlabLogoSimpleDuotone,
  PiPlanetDuotone,
  PiPlanetLight,
} from 'react-icons/pi';
import {
  SiNextdotjs,
  SiRedux,
  SiThreedotjs,
  SiTsnode,
  SiVim,
} from 'react-icons/si';
import { TbBrandRust } from 'react-icons/tb';
import { VscGithubInverted } from 'react-icons/vsc';

export const iconMap = {
  gitlab: <PiGitlabLogoSimpleDuotone />,
  nextjs: <SiNextdotjs />,
  github: <VscGithubInverted />,
  vim: <SiVim />,
  tsnode: <SiTsnode />,
  three: <SiThreedotjs />,
  photos: <HiPhoto />,
  redux: <SiRedux />,
  venus: <BiPlanet />,
  pluto: <PiPlanetDuotone />,
  mercury: <PiPlanetLight />,
  rust: <TbBrandRust />,
};

export type Project = {
  icon?: keyof typeof iconMap;
  name: string;
  description: string;
  url: string;
};

export const projects: Project[] = [
  {
    icon: 'venus',
    name: 'Venus',
    description: 'A tiny GUI for network tool.',
    url: 'https://github.com/DefectingCat/venus',
  },
  {
    icon: 'pluto',
    name: 'Pluto',
    description: 'Tcping tool',
    url: 'https://github.com/DefectingCat/pluto',
  },
  {
    icon: 'mercury',
    name: 'Mercury',
    description: 'A network tool backend',
    url: 'https://github.com/DefectingCat/mercury',
  },
  {
    icon: 'three',
    name: '3d-globe',
    description: 'A 3d globe made by three.js.',
    url: 'https://github.com/DefectingCat/3d-globe',
  },
  {
    icon: 'nextjs',
    name: 'Blog',
    description: 'This site.',
    url: 'https://github.com/DefectingCat/DefectingCat.github.io',
  },
  {
    icon: 'tsnode',
    name: 'Simply FaaS',
    description: 'A simply FaaS built with Node.js',
    url: 'https://github.com/DefectingCat/simply-fass',
  },
  {
    icon: 'tsnode',
    name: 'boring-avatars-services',
    description: 'Random avatars.',
    url: 'https://github.com/DefectingCat/boring-avatars-services',
  },
  {
    icon: 'tsnode',
    name: 'RUA DDNS',
    description: 'DDNS Script for DNSPod',
    url: 'https://github.com/DefectingCat/rua-ddns',
  },
  {
    icon: 'rust',
    name: 'Candy',
    description: 'Tiny web server.',
    url: 'https://github.com/DefectingCat/candy',
  },
  {
    icon: 'vim',
    name: 'Dotfiles',
    description: 'Some dotfiles.',
    url: 'https://github.com/DefectingCat/dotfiles',
  },
  {
    icon: 'redux',
    name: 'RUA-Context',
    description: 'A global store for React.',
    url: 'https://github.com/rua-plus/rua-context',
  },
  {
    icon: 'three',
    name: 'RUA-Three',
    description: 'A three.js hooks for React.',
    url: 'https://github.com/rua-plus/rua-three',
  },
];
export const selfHosts: Project[] = [
  {
    icon: 'gitlab',
    name: 'Gitlab',
    description: 'Selfhost git.',
    url: 'https://git.rua.plus/',
  },
  {
    icon: 'photos',
    name: 'Photos',
    description: 'Some photos.',
    url: 'https://photos.rua.plus/browse',
  },
];
