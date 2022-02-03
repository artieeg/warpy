import React from 'react';
import {FlatList} from 'react-native';
import {ICandidate} from '@warpy/lib';
import {usePreviewDimensions} from '@app/hooks';
import {StreamPreview} from './StreamPreview';

export const StreamFeedView: React.FC<{feed: ICandidate[]}> = ({feed}) => {
  const {previewHeight, previewWidth} = usePreviewDimensions();

  const renderItem = React.useCallback(
    ({item, index}: {item: ICandidate; index: number}) => {
      let style: any = {
        maxWidth: previewWidth,
        width: previewWidth,
      };

      if (index === 1) {
        style = {
          ...style,
          height: previewHeight - 100,
        };
      } else {
        style = {...style, width: previewWidth, height: previewHeight};
      }

      if (index % 2 && index !== 1) {
        style = {...style, transform: [{translateY: -100}]};
      }

      return <StreamPreview stream={item} style={style} />;
    },
    [],
  );

  return <FlatList data={feed} numColumns={2} renderItem={renderItem} />;
};
