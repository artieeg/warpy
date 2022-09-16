import React from 'react';
import {FlatList, FlatListProps, RefreshControl} from 'react-native';
import {Candidate} from '@warpy/lib';
import {usePreviewDimensions} from '@app/hooks';
import {StreamPreview} from './StreamPreview';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {colors} from '@app/theme';

interface StreamFeedViewProps
  extends Omit<FlatListProps<Candidate>, 'renderItem'> {
  isLoading?: boolean;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const StreamFeedView: React.FC<StreamFeedViewProps> = ({
  data,
  ...rest
}) => {
  const {previewHeight, previewWidth} = usePreviewDimensions();

  const renderItem = React.useCallback(
    ({item, index}: {item: Candidate; index: number}) => {
      let style: any = {
        maxWidth: previewWidth,
        width: previewWidth,
        marginLeft: index % 2 === 1 ? 5 : 0,
        marginRight: index % 2 === 0 ? 5 : 0,
      };

      if (index === 1) {
        style = {
          ...style,
          height: previewHeight - 100,
          maxHeight: previewHeight - 100,
        };
      } else {
        style = {
          ...style,
          width: previewWidth,
          height: previewHeight,
        };
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
    backgroundColor: colors.black,
    //marginLeft: 10,
  }));

  return (
    <RefreshControl
      style={{flex: 1}}
      refreshing={!!rest.refreshing}
      onRefresh={rest.onRefresh as any}>
      <AnimatedFlatList
        {...(rest as any)}
        refreshing={undefined}
        onRefresh={undefined}
        style={[wrapperStyle, rest.style]}
        data={data}
        numColumns={2}
        renderItem={renderItem as any}
      />
    </RefreshControl>
  );
};
//(props0, props1) => props0.data === props1.data && props1,
//);
