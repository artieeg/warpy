import React from 'react';
import {FlatList, useWindowDimensions, View} from 'react-native';
import {ICandidate} from '@warpy/lib';
import {usePreviewDimensions} from '@app/hooks';
import {StreamPreview} from './StreamPreview';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

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

  const {height} = useWindowDimensions();

  const count = feed?.length ?? 0;

  const coverTranslateY = useDerivedValue(() => {
    return withTiming(count > 0 ? height : 0, {
      duration: 400,
      easing: Easing.ease,
    });
  }, [height, count]);

  const coverStyle = useAnimatedStyle(() => ({
    transform: [{translateY: coverTranslateY.value}],
    backgroundColor: '#ff3030',
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  }));

  return (
    <View style={{flex: 1}}>
      <FlatList data={feed} numColumns={2} renderItem={renderItem} />
      <Animated.View style={coverStyle} />
    </View>
  );
};
