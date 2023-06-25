import { create } from 'zustand';

interface MainStore {
  modelLoading: boolean;
  toggleLoading: (loaded: boolean) => void;
}

const useStore = create<MainStore>()((set) => ({
  modelLoading: true,
  toggleLoading: (loaded) =>
    set(() => ({
      modelLoading: loaded,
    })),
}));

export default useStore;
