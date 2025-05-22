import { create } from 'zustand';

// type NavbarHoverItemsKey = ['blog', 'projects', 'tags', 'friends', 'about'];

interface MainStore {
  /** Loading state of the model */
  modelLoading: boolean;
  toggleLoading: (loaded: boolean) => void;

  /** mouse hover on navbar */
  navbarHoverItems: {
    blog: boolean;
    projects: boolean;
    tags: boolean;
    friends: boolean;
    about: boolean;
  };
  toggleNavbarHoverItems: (item: string) => void;
  resetNavbarHoverItems: () => void;
}

const useStore = create<MainStore>()((set) => ({
  modelLoading: true,
  toggleLoading: (loaded) =>
    set(() => ({
      modelLoading: loaded,
    })),

  navbarHoverItems: {
    blog: false,
    projects: false,
    tags: false,
    friends: false,
    about: false,
  } as const,
  toggleNavbarHoverItems: (item) =>
    set((state) => ({
      navbarHoverItems: {
        ...state.navbarHoverItems,
        [item as unknown as string]:
          /** @ts-expect-error */
          !state.navbarHoverItems[item],
      },
    })),
  resetNavbarHoverItems: () =>
    set(() => ({
      navbarHoverItems: {
        blog: false,
        projects: false,
        tags: false,
        friends: false,
        about: false,
      },
    })),
}));

export default useStore;
