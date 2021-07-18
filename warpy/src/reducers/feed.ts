import {SET_FEED} from '@app/actions';
import {IStream} from '@app/models';
import {Reducer} from 'redux';

export interface IFeedsReducer {
  feed: IStream[];
  page: number;
}

export const feed: Reducer<IFeedsReducer> = (
  state: IFeedsReducer | undefined,
  action: any,
) => {
  const {type, payload} = action;

  switch (type) {
    case SET_FEED: {
      const currentFeed = state?.feed || [];
      const currentPage = state?.page || 0;
      return {
        feed: [...currentFeed, ...payload.feed],
        page: currentPage + 1,
      };
    }
    default: {
      return {
        feed: [],
        page: 0,
      };
    }
  }
};
