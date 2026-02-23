import { configureStore } from '@reduxjs/toolkit';
import kanbanReducer from './kanbanSlice';

/**
 * Redux Store Configuration.
 * Combines the kanban slice reducer into the global store.
 */
export const store = configureStore({
    reducer: {
        kanban: kanbanReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
