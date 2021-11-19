import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RouterState {
  fromPath: string;
}

const initialState: RouterState = {
  fromPath: '',
};

export const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    setFromPath: (state, action: PayloadAction<string>) => {
      state.fromPath = action.payload;
    },
    cleanFromPath: (state) => {
      state.fromPath = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFromPath, cleanFromPath } = routerSlice.actions;

export default routerSlice.reducer;
