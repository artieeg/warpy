import {useDispatcher, useStoreShallow} from '@app/store';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {Text} from './Text';
import {UserGeneralInfo} from './UserGeneralInfo';

export const InvitedToStreamModal = () => {
  const [visible, modalInviter, stream] = useStoreShallow(state => [
    state.modalCurrent === 'stream-invite',
    state.modalInvite?.inviter,
    state.modalInvite?.stream,
  ]);
  const dispatch = useDispatcher();

  return (
    <BaseSlideModal visible={visible} style={styles.wrapper}>
      <Text style={styles.title}>woah, new invite! 👋</Text>

      {modalInviter && (
        <UserGeneralInfo style={styles.info} user={modalInviter} />
      )}

      {stream?.title && (
        <>
          <Text size="small" color="boulder">
            invites you to join
          </Text>
          <Text>{stream.title}</Text>
        </>
      )}

      {!stream?.title && (
        <Text size="small" color="boulder">
          invites you to join their new room
        </Text>
      )}

      <View style={styles.actions}>
        <SmallTextButton
          onPress={() => dispatch(({invite}) => invite.accept())}
          style={styles.actionButtonSpace}
          title="accept"
        />
        <SmallTextButton
          onPress={() => dispatch(({invite}) => invite.decline())}
          title="decline"
          color="red"
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
    paddingBottom: 10,
  },
  actionButtonSpace: {
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 30,
  },
  title: {
    marginBottom: 30,
  },
});
