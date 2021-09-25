import React from 'react';
import {useStore} from '@app/store';
import {ParticipantsModal} from './ParticipantsModal';
import {ParticipantInfoModal} from './ParticipantInfoModal';
import {ReportActionSheet} from './ReportActionSheet';
import {ChatModal} from './ChatModal';
import {Reactions} from './Reactions';
import {UserActionSheet} from './UserActionSheet';

export const ModalProvider = () => {
  const modal = useStore.use.modalCurrent();
  const modalSelectedUser = useStore.use.modalSelectedUser();
  const openNewModal = useStore.use.openNewModal();
  const closeCurrentModal = useStore.use.closeCurrentModal();
  const setCurrentReaction = useStore.use.setCurrentReaction();

  return (
    <>
      <ParticipantInfoModal
        onHide={() => closeCurrentModal()}
        user={modalSelectedUser}
        visible={modal === 'participant-info'}
      />

      <ParticipantsModal
        onHide={() => closeCurrentModal()}
        visible={modal === 'participants'}
        onOpenActions={id => {
          openNewModal('user-actions', {selectedUser: id});
        }}
        onSelectParticipant={id => {
          openNewModal('participant-info', {selectedUser: id});
        }}
      />

      <Reactions
        onPickReaction={setCurrentReaction}
        visible={modal === 'reactions'}
        onHide={() => closeCurrentModal()}
      />

      <ChatModal
        visible={modal === 'chat'}
        onHide={() => closeCurrentModal()}
      />

      <UserActionSheet
        user={modalSelectedUser}
        visible={modal === 'user-actions'}
        onHide={() => closeCurrentModal()}
        onReportUser={() => openNewModal('reports')}
      />

      <ReportActionSheet
        user={modalSelectedUser}
        visible={modal === 'reports'}
        onHide={() => closeCurrentModal()}
      />
    </>
  );
};
