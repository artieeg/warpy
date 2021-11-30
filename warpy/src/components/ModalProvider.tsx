import React from 'react';
import {useStore} from '@warpy/store';
import {ParticipantsModal} from './ParticipantsModal';
import {ParticipantInfoModal} from './ParticipantInfoModal';
import {ReportActionSheet} from './ReportActionSheet';
import {ChatModal} from './ChatModal';
import {Reactions} from './Reactions';
import {UserActionSheet} from './UserActionSheet';
import {InviteModal} from './InviteModal';
import {BotConfirmModal} from './BotConfirmModal';
import {InvitedToStreamModal} from './InvitedToStreamModal';
import {AwardPickerModal} from './AwardPickerModal';
import {AwardRecipentPicker} from './AwardRecipentPicker';

export const ModalProvider = () => {
  const modal = useStore.use.modalCurrent();
  const modalSelectedUser = useStore.use.modalSelectedUser();
  const dispatchModalOpen = useStore.use.dispatchModalOpen();
  const dispatchModalClose = useStore.use.dispatchModalClose();

  return (
    <>
      <BotConfirmModal />
      <ParticipantInfoModal />
      <InvitedToStreamModal />
      <AwardPickerModal />
      <AwardRecipentPicker />

      <ParticipantsModal
        onHide={() => dispatchModalClose()}
        visible={modal === 'participants'}
        onOpenActions={id => {
          dispatchModalOpen('user-actions', {selectedUser: id});
        }}
        onSelectParticipant={id => {
          dispatchModalOpen('participant-info', {selectedUser: id});
        }}
      />

      <Reactions visible={modal === 'reactions'} />

      <ChatModal visible={modal === 'chat'} />

      <UserActionSheet
        user={modalSelectedUser}
        visible={modal === 'user-actions'}
        onHide={() => dispatchModalClose()}
        onReportUser={() => dispatchModalOpen('reports')}
      />

      <ReportActionSheet
        user={modalSelectedUser}
        visible={modal === 'reports'}
        onHide={() => dispatchModalClose()}
      />

      <InviteModal />
    </>
  );
};
