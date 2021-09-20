import {User} from '@app/models';
import {useStore} from '@app/store';
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {Text} from './Text';

interface IUserActionSheetProps {
  user: string | null;
  visible: boolean;
  onHide: () => void;
}

export const UserActionSheet = (props: IUserActionSheetProps) => {
  const {visible, onHide, user} = props;

  const api = useStore.use.api();

  const isStreamOwner = useStore.use.isStreamOwner();

  return (
    <Modal
      isVisible={visible}
      onModalHide={onHide}
      style={styles.modal}
      statusBarTranslucent>
      <View style={[styles.background, styles.actions]}>
        <TouchableOpacity style={[styles.button, styles.bottomBorder]}>
          <Text size="small" color="alert" weight="bold">
            report
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.bottomBorder]}>
          <Text size="small" color="alert" weight="bold">
            block
          </Text>
        </TouchableOpacity>
        {isStreamOwner && (
          <TouchableOpacity
            onPress={() => {
              if (user) {
                api.stream.kickUser(user);
              }
            }}
            style={[styles.button, styles.bottomBorder]}>
            <Text size="small" color="alert" weight="bold">
              kick
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button}>
          <Text size="small" weight="bold">
            follow
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={onHide}
        style={[styles.background, styles.cancel, styles.button]}>
        <Text size="small" weight="bold">
          cancel
        </Text>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    borderRadius: 10,
    backgroundColor: '#000',
  },
  actions: {
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  cancel: {},
  modal: {
    padding: 30,
    margin: 0,
    justifyContent: 'flex-end',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#101010',
  },
});
