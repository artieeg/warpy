import React from 'react';
import {View} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';

interface IParticipantInfoModal {
  participant: string;
}

export const ParticipantInfoModal = (props: IParticipantInfoModal) => {
  return (
    <BaseSlideModal visible onHide={() => {}} title="Some User">
      <View></View>
    </BaseSlideModal>
  );
};
