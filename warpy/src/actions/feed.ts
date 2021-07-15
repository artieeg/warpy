import {IStream} from '@app/models';
import {getFeed} from '@app/services';
import {AppThunk} from '@app/store';

export const SET_FEED = 'SET_FEED';

export const setFeed = (feed: IStream[]) => {
  return {
    type: SET_FEED,
    payload: {
      feed,
    },
  };
};

export const fetchFeed = (): AppThunk<void> => {
  return async dispatch => {
    const feed = await getFeed();
    return dispatch(setFeed(feed));
  };
};
