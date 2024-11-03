import { configureStore } from '@reduxjs/toolkit';
import sectionsReducer from './features/sectionsSlice';

export const makeStore = () => configureStore({
  reducer: {
    sections: sectionsReducer,
  },
});

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
