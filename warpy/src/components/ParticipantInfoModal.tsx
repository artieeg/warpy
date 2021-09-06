import {useAppUser, useStreamParticipant} from '@app/hooks';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {Avatar} from './Avatar';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';

interface IParticipantInfoModal {
  id: string | null;
  onHide: () => any;
}

export const ParticipantInfoModal = (props: IParticipantInfoModal) => {
  const {id, onHide} = props;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (id) {
      setTimeout(() => {
        setVisible(true);
      }, 300);
    } else {
      setVisible(false);
    }
  }, [id]);

  //const appUser = useAppUser();
  //const appUserId = appUser!.id;
  //const appUserParticipantData = useStreamParticipant(appUserId);

  const participant = useStreamParticipant(id!);

  const userFullName = `${participant?.first_name} ${participant?.last_name}`;

  const renderParticipantInfo = () => {
    if (!participant) {
      return null;
    }

    return (
      <View style={styles.wrapper}>
        <View style={styles.avatarAndUserInfo}>
          {<Avatar size="large" user={participant} />}
          <View style={styles.userInfo}>
            <Text weight="bold">{participant.username}</Text>
            <Text weight="bold" size="small">
              {userFullName}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <SmallTextButton style={styles.followButton} title="follow" />
          <SmallTextButton color="important" title="report" />
        </View>
      </View>
    );
  };

  return (
    <BaseSlideModal style={styles.modal} visible={visible} onHide={onHide}>
      {renderParticipantInfo()}
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
  avatarAndUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    paddingLeft: 20,
  },
  actions: {
    marginVertical: 20,
    flexDirection: 'row',
  },
  followButton: {
    marginRight: 10,
  },
});
