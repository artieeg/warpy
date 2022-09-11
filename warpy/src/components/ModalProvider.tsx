import React from 'react';
import {ParticipantsModal} from './ParticipantsModal';
import {UserInfoModal} from './UserInfoModal';
import {ReportActionSheet} from './ReportActionSheet';
import {ChatModal} from './ChatModal';
import {Reactions} from './Reactions';
import {InviteModal} from './InviteModal';
import {BotConfirmModal} from './BotConfirmModal';
import {InvitedToStreamModal} from './InvitedToStreamModal';
import {HostReassignModal} from './HostReassignModal';
import {AvatarPickerModal} from './AvatarPickerModal';

export const ModalProvider = () => {
  return (
    <>
      <UserInfoModal />
      <BotConfirmModal />
      <InvitedToStreamModal />
      <HostReassignModal />
      <InviteModal />
      <AvatarPickerModal />
      <ParticipantsModal />
      <Reactions />
      <ChatModal />
      <ReportActionSheet />

      {/*
      <AwardPickerModal />
      <AwardRecipentPicker />
      <AwardVisualPickerModal />
      <AwardMessageInputModal />
        */}
    </>
  );
};
