import React from 'react';
import {useStore} from '@app/store';
import {ParticipantsModal} from './ParticipantsModal';
import {UserInfoModal} from './UserInfoModal';
import {ReportActionSheet} from './ReportActionSheet';
import {ChatModal} from './ChatModal';
import {Reactions} from './Reactions';
import {InviteModal} from './InviteModal';
import {BotConfirmModal} from './BotConfirmModal';
import {InvitedToStreamModal} from './InvitedToStreamModal';
import {AwardPickerModal} from './AwardPickerModal';
import {AwardRecipentPicker} from './AwardRecipentPicker';
import {AwardVisualPickerModal} from './AwardVisualPickerModal';

export const ModalProvider = () => {
  const modal = useStore.use.modalCurrent();

  return (
    <>
      <BotConfirmModal />
      <UserInfoModal />
      <InvitedToStreamModal />
      <AwardPickerModal />
      <AwardRecipentPicker />
      <AwardVisualPickerModal />

      <ParticipantsModal
        onHide={() => useStore.getState().dispatchModalClose()}
        visible={modal === 'participants'}
        onSelectParticipant={user => {
          useStore
            .getState()
            .dispatchModalOpen('participant-info', {selectedUser: user});
        }}
      />

      <Reactions visible={modal === 'reactions'} />

      <ChatModal visible={modal === 'chat'} />

      <ReportActionSheet
        visible={modal === 'reports'}
        onHide={() => useStore.getState().dispatchModalClose()}
      />

      <InviteModal />
    </>
  );
};
