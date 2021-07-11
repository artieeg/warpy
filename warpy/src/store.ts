import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {createStore, applyMiddleware, AnyAction} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import rootReducer from './reducers/index';

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
