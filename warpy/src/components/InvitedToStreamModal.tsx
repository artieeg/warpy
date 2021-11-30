import {useStore} from '@warpy/store';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import shallow from 'zustand/shallow';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {Text} from './Text';
import {UserGeneralInfo} from './UserGeneralInfo';

export const InvitedToStreamModal = () => {
  const [visible, modalInviter, stream, dispatchInviteAction] = useStore(
    state => [
      state.modalCurrent === 'stream-invite',
      state.modalInvite?.inviter,
      state.modalInvite?.stream,
      state.dispatchInviteAction,
    ],
    shallow,
  );

  return (
    <BaseSlideModal visible={visible} style={styles.wrapper}>
      <Text>invitation from</Text>

      {modalInviter && (
        <UserGeneralInfo style={styles.info} user={modalInviter} />
      )}

      {stream?.title && (
        <>
          <Text size="small" color="info">
            to join the room
          </Text>
          <Text>{stream.title}</Text>
        </>
      )}

      {!stream?.title && <Text color="info">to join their new room</Text>}

      <View style={styles.actions}>
        <SmallTextButton
          onPress={() => dispatchInviteAction('accept')}
          style={styles.actionButtonSpace}
          title="accept"
        />
        <SmallTextButton
          onPress={() => dispatchInviteAction('decline')}
          title="decline"
          color="important"
        />
      </View>
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 30,
  },
  info: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  actionButtonSpace: {
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 10,
  },
});
