import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    // other reducers can go here
});

export default rootReducer;
