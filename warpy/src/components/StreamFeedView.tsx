import React, {useState} from 'react';
import {
  FlatList,
  FlatListProps,
  LayoutRectangle,
  useWindowDimensions,
} from 'react-native';
import {ICandidate} from '@warpy/lib';
import {usePreviewDimensions} from '@app/hooks';
import {StreamPreview} from './StreamPreview';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {colors} from '../../colors';
import {useNavigation} from '@react-navigation/native';

interface StreamFeedViewProps
  extends Omit<FlatListProps<ICandidate>, 'renderItem'> {
  onStartCover?: (x: number, y: number, w: number, h: number) => any;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const StreamFeedView: React.FC<StreamFeedViewProps> = ({
  data,
  onStartCover,
  ...rest
}) => {
  const {previewHeight, previewWidth} = usePreviewDimensions();

  const [layout, setLayout] = useState<LayoutRectangle>();

  const {width: screenWidth, height: screenHeight} = useWindowDimensions();

  const navigation = useNavigation();

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

      return (
        <StreamPreview
          onPress={(x, y, w, h) => {
            let dy = 0;

            if (index % 2 && index !== 1) {
              dy = 100;
            }

            onStartCover?.(x, y - dy, w, h - (index === 1 ? 100 : 0));
          }}
          key={item.id}
          stream={item}
          style={style}
        />
      );
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
  }));

  return (
    <>
      <AnimatedFlatList
        {...(rest as any)}
        style={[wrapperStyle, rest.style]}
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
    </>
  );
};
//(props0, props1) => props0.data === props1.data && props1,
//);
