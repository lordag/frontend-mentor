import { configureStore } from '@reduxjs/toolkit';
import tokenSliceReducer from './token-slice';
import repositoriesReducer from './repos-slice';

const store = configureStore({
    reducer: {
        token: tokenSliceReducer,
        repositories: repositoriesReducer
    }
})

export default store