import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {useParticipantModalController} from '@app/hooks/useParticipantModalController';
import {IconButton} from './IconButton';
import {UserGeneralInfo} from './UserGeneralInfo';

export const ParticipantInfoModal = () => {
  const {participant, onOpenProfile, visible, isFollowing, onToggleFollow} =
    useParticipantModalController();

  return (
    <BaseSlideModal style={styles.modal} visible={visible}>
      {participant && (
        <View style={styles.wrapper}>
          <UserGeneralInfo style={styles.generalInfo} user={participant} />
          <View style={styles.actionsRow}>
            <SmallTextButton
              onPress={onToggleFollow}
              style={styles.margin}
              title={isFollowing ? 'unfollow' : 'follow'}
            />
            <SmallTextButton
              style={styles.margin}
              color="important"
              title="report"
            />
            <IconButton
              color="#fff"
              style={styles.more}
              name="dots-horizontal"
              size={20}
            />
          </View>
          <View style={styles.actionsRow}>
            <SmallTextButton
              onPress={onOpenProfile}
              style={styles.margin}
              title="open profile"
            />
          </View>
        </View>
      )}
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  modal: {
    minHeight: 300,
    height: 300,
    maxHeight: 300,
  },
  actionsRow: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  margin: {
    marginRight: 10,
  },
  more: {
    height: 42,
    width: 42,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  generalInfo: {
    marginBottom: 20,
  },
});
