import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import Modal from 'react-native-modal';
import {Text} from './Text';

interface IParticipanModalProps extends ViewProps {
  title: string;
  visible: boolean;
  onHide: () => void;
  children: React.ReactChild;
}

export const BaseSlideModal = (props: IParticipanModalProps) => {
  const {visible, onHide, children, title, style} = props;

  return (
    <Modal
      removeClippedSubviews={false}
      propagateSwipe={true}
      onSwipeComplete={() => {
        onHide();
      }}
      swipeDirection={['down']}
      swipeThreshold={100}
      animationIn="slideInUp"
      animationOut="slideInDown"
      hasBackdrop={false}
      style={styles.modalStyle}
      isVisible={visible}>
      <View style={[styles.wrapper, style]}>
        <View style={styles.handler} />
        <Text
          color="dark"
          weight="bold"
          style={[styles.title, styles.horizontalPadding]}>
          {title}
        </Text>

        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
  },
  list: {
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  wrapper: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
  },
  horizontalPadding: {
    paddingHorizontal: 40,
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    marginBottom: 20,
  },
  handler: {
    position: 'absolute',
    alignSelf: 'center',
    width: 50,
    height: 5,
    top: 10,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
});
