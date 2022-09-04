import {useDispatcher} from '@app/store';
import React, {useRef} from 'react';
import {Animated, StyleSheet, View, ViewProps} from 'react-native';
import Modal from 'react-native-modal';
import {colors} from '../../colors';
import {Text} from './Text';

export interface IBaseModalProps extends ViewProps {
  title?: string;
  subtitle?: string;
  visible?: boolean;
  disableHideHandler?: boolean;
  children?: React.ReactNode;
  onClose?: () => any;
}

export const BaseSlideModal = (props: IBaseModalProps) => {
  const {
    visible,
    subtitle,
    onClose,
    disableHideHandler,
    children,
    title,
    style,
  } = props;
  const dispatch = useDispatcher();

  const translate = useRef(new Animated.Value(0));

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
};

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
