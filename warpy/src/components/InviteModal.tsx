import React from 'react';
import {FlatList} from 'react-native';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';

export const InviteModal = (props: IBaseModalProps) => {
  return (
    <BaseSlideModal {...props}>
      <FlatList renderItem={() => null} data={[]} />
    </BaseSlideModal>
  );
};
