import React from 'react';
import {useStore} from '@app/store';
import {ParticipantsModal} from './ParticipantsModal';
import {ParticipantInfoModal} from './ParticipantInfoModal';
import {ReportActionSheet} from './ReportActionSheet';
import {ChatModal} from './ChatModal';
import {Reactions} from './Reactions';
import {UserActionSheet} from './UserActionSheet';
import {InviteModal} from './InviteModal';

export const ModalProvider = () => {
  const modal = useStore.use.modalCurrent();
  const modalSelectedUser = useStore.use.modalSelectedUser();
  const dispatchModalOpen = useStore.use.dispatchModalOpen();
  const dispatchModalClose = useStore.use.dispatchModalClose();

  return (
    <>
      <ParticipantInfoModal
        onHide={() => dispatchModalClose()}
        user={modalSelectedUser}
        visible={modal === 'participant-info'}
      />

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

      <Reactions
        visible={modal === 'reactions'}
        onHide={() => dispatchModalClose()}
      />

      <ChatModal
        visible={modal === 'chat'}
        onHide={() => dispatchModalClose()}
      />

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

      <InviteModal
        visible={modal === 'invite'}
        onHide={() => dispatchModalClose()}
      />
    </>
  );
};
