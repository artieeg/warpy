import React from 'react';
import {useDispatcher, useStoreShallow} from '@app/store';
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
import {AwardMessageInputModal} from './AwardMessageInputModal';
import {HostReassignModal} from './HostReassignModal';
import {AvatarPickerModal} from './AvatarPickerModal';

export const ModalProvider = () => {
  return (
    <>
      <UserInfoModal />
      <BotConfirmModal />
      <InvitedToStreamModal />
      {/*
      <AwardPickerModal />
      <AwardRecipentPicker />
      <AwardVisualPickerModal />
      <AwardMessageInputModal />
        */}
      <HostReassignModal />
      <InviteModal />
      <AvatarPickerModal />
      <ParticipantsModal />

      <Reactions />

      <ChatModal />

      <ReportActionSheet />
    </>
  );
};
