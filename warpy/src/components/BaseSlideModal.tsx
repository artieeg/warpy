import {useDispatcher} from '@app/store';
import React, {useImperativeHandle} from 'react';
import {StyleSheet, useWindowDimensions, View, ViewProps} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  Layout,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';
import {Text} from './Text';
import {colors} from '../../colors';

export interface IBaseModalProps extends ViewProps {
  title?: string;
  subtitle?: string;
  disableHideHandler?: boolean;
  children?: React.ReactNode;
  onClose?: () => any;
}

const upSpringConfig: WithSpringConfig = {
  damping: 20,
  mass: 0.3,
  stiffness: 100,
  velocity: 10,
};

export type BaseSlideModalRefProps = {
  open: () => void;
  close: () => void;
};

export const BaseSlideModal = React.forwardRef<
  BaseSlideModalRefProps,
  IBaseModalProps
>((props, ref) => {
  const {subtitle, onClose, disableHideHandler, children, title, style} = props;
  const dispatch = useDispatcher();

  const window = useWindowDimensions();

  const max_ty = useSharedValue(window.height);
  const ty = useSharedValue(max_ty.value);

  const open = React.useCallback(() => {
    ty.value = withSpring(0, upSpringConfig);
  }, []);

  const close = React.useCallback(() => {
    ty.value = withSpring(max_ty.value);
    dispatch(({modal}) => modal.close());
    onClose?.();
  }, [max_ty, onClose]);

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const rBackdropStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    backgroundColor: interpolateColor(
      ty.value / max_ty.value,
      [1, 0],
      ['#30303000', '#30303090'],
    ),
  }));

  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {startY: number}
  >(
    {
      onStart(_, ctx) {
        ctx.startY = ty.value;
      },
      onActive(ev, ctx) {
        if (ev.translationY + ctx.startY < 0) {
          return;
        }

        ty.value = ev.translationY + ctx.startY;
      },
      onEnd() {
        if (ty.value > window.height / 10) {
          runOnJS(close)();
        } else {
          ty.value = withSpring(0, upSpringConfig, () => {});
        }
      },
    },
    [max_ty, ty],
  );

  const rModalStyle = useAnimatedStyle(
    () => ({
      transform: [{translateY: ty.value}],
      zIndex: 2,
    }),
    [],
  );

  return (
    <View
      pointerEvents="box-none"
      style={{
        left: 0,
        bottom: 0,
        right: 0,
        top: 0,
        position: 'absolute',
      }}
    >
      <Animated.View pointerEvents="none" style={rBackdropStyle} />
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View
          layout={Layout.duration(300)}
          onLayout={e => {
            max_ty.value = e.nativeEvent.layout.height;
          }}
          style={[styles.wrapper, styles.handlerPadding, rModalStyle, style]}
        >
          {!disableHideHandler && <View style={styles.handler} />}
          {title && (
            <Text
              weight="bold"
              style={[styles.title, styles.horizontalPadding]}
            >
              {title}
            </Text>
          )}

          {subtitle && (
            <Text
              weight="bold"
              size="small"
              color="boulder"
              style={[styles.subtitle, styles.horizontalPadding]}
            >
              {subtitle}
            </Text>
          )}

          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );

  /*
  return (
    <Modal
      backdropColor="#303030"
      backdropOpacity={0.6}
      removeClippedSubviews={false}
      hideModalContentWhileAnimating
      onSwipeMove={(_, state) => {
        if (state.dx >= 0) {
          translate.current.setValue(state.dx);
        }
      }}
      useNativeDriverForBackdrop
      propagateSwipe={true}
      onSwipeComplete={() => {
        dispatch(({modal}) => modal.close());
        onClose && onClose();
      }}
      swipeDirection={['down']}
      swipeThreshold={100}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      hasBackdrop
      statusBarTranslucent
      style={styles.modalStyle}
      isVisible={visible}
    >
      <Animated.View
        style={[
          {transform: [{translateY: translate.current}]},
          styles.wrapper,
          styles.handlerPadding,
          style,
        ]}
      >
        {!disableHideHandler && <View style={styles.handler} />}
        {title && (
          <Text weight="bold" style={[styles.title, styles.horizontalPadding]}>
            {title}
          </Text>
        )}

        {subtitle && (
          <Text
            weight="bold"
            size="small"
            color="boulder"
            style={[styles.subtitle, styles.horizontalPadding]}
          >
            {subtitle}
          </Text>
        )}

        {children}
      </Animated.View>
    </Modal>
  );
   */
});

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
  },
  noHandlerPadding: {},
  handlerPadding: {
    paddingTop: 30,
  },
  wrapper: {
    //backgroundColor: colors.cod_gray,
    backgroundColor: colors.black,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  horizontalPadding: {
    paddingHorizontal: 30,
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    marginTop: 3,
  },
  title: {},
  handler: {
    position: 'absolute',
    alignSelf: 'center',
    width: 50,
    height: 5,
    top: 8,
    //top: -12,
    borderRadius: 12,
    backgroundColor: '#909090CC',
  },
});
