import {useAppUser, useStreamParticipant} from '@app/hooks';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Avatar} from './Avatar';
import {BaseSlideModal} from './BaseSlideModal';

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

  const appUser = useAppUser();
  const appUserId = appUser!.id;

  const participant = useStreamParticipant(id!);
  const appUserParticipantData = useStreamParticipant(appUserId);

  const title = `${participant?.first_name} ${participant?.last_name}`;

  return (
    <BaseSlideModal
      style={{minHeight: 300, height: 300, maxHeight: 300}}
      visible={visible}
      onHide={onHide}
      title={title}>
      <View>{!!id && <Avatar user={participant!} />}</View>
    </BaseSlideModal>
  );
};
