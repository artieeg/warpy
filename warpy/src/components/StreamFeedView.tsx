import React from 'react';
import {FlatList, FlatListProps} from 'react-native';
import {ICandidate} from '@warpy/lib';
import {usePreviewDimensions} from '@app/hooks';
import {StreamPreview} from './StreamPreview';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

interface StreamFeedViewProps
  extends Omit<FlatListProps<ICandidate>, 'renderItem'> {}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const StreamFeedView: React.FC<StreamFeedViewProps> = ({
  data,
  ...rest
}) => {
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
          maxHeight: previewHeight - 100,
        };
      } else {
        style = {...style, width: previewWidth, height: previewHeight};
      }

      if (index % 2 && index !== 1) {
        style = {...style, transform: [{translateY: -100}]};
      }

      return <StreamPreview key={item.id} stream={item} style={style} />;
    },
    [],
  );

  const count = data?.length ?? 0;

  const opacity = useDerivedValue(() => {
    return withTiming(count > 0 ? 1 : 0, {
      duration: 300,
      easing: Easing.ease,
    });
  }, [count]);

  const wrapperStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: opacity.value,
  }));

  return (
    <AnimatedFlatList
      style={wrapperStyle}
      {...(rest as any)}
      data={
        data && [
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
        ]
      }
      numColumns={2}
      renderItem={renderItem as any}
    />
  );
};
