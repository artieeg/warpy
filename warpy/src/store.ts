import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {createStore, applyMiddleware, AnyAction} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import rootReducer from './reducers/index';
import {IAppUserReducer} from './reducers/user';

interface IStore {
  user: IAppUserReducer;
}

export const store = createStore<IStore, any, any, any>(
  rootReducer,
  applyMiddleware(thunk),
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunk<ReturnType> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
