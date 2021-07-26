import {Participant} from '@app/models';
import React, {useEffect} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {Text} from './Text';

interface IParticipanModalProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  viewers: Participant[];
  onFetchMore: () => void;
}

export const ParticipantsModal = (props: IParticipanModalProps) => {
  const {visible, onFetchMore, onHide, title} = props;

  useEffect(() => {
    onFetchMore();
  }, [onFetchMore]);

  return (
    <Modal
      swipeDirection={['down']}
      swipeThreshold={0.3}
      animationIn="slideInUp"
      animationOut="slideInDown"
      onSwipeComplete={() => {
        onHide();
      }}
      hasBackdrop={false}
      style={styles.modalStyle}
      isVisible={visible}>
      <View style={styles.wrapper}>
        <Text weight="bold" size="large">
          {title}
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  wrapper: {
    backgroundColor: '#011A287A',
    height: '70%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 40,
    paddingTop: 40,
  },
});
