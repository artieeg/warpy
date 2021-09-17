import React from 'react';
import {ClapButton} from './ClapsButton';
import {WarpButton} from './WarpButton';
import {RaiseHandButton} from './RaiseHandButton';
import {ShowParticipantsButton} from './ShowParticipantsButton';
import {IStreamPanelBase, StreamPanelBase} from './StreamPanelBase';
import {ChatButton} from './ChatButton';

interface IRemoteStreamPanel extends IStreamPanelBase {
  participantsCount: number;
  onRaiseHand: () => any;
  onOpenParticipantsList: () => any;
  onOpenReactions: () => any;
  onOpenChat: () => void;
  reaction: string;
}

export const ViewerStreamPanel = (props: IRemoteStreamPanel) => {
  const {
    participantsCount,
    onOpenReactions,
    onRaiseHand,
    onOpenParticipantsList,
    reaction,
    onOpenChat,
  } = props;

  return (
    <StreamPanelBase {...props}>
      <ChatButton onPress={onOpenChat} />
      <ClapButton reaction={reaction} onPress={onOpenReactions} />
      <RaiseHandButton onPress={onRaiseHand} />
      <ShowParticipantsButton
        count={participantsCount}
        onOpenParticipantsList={onOpenParticipantsList}
      />
    </StreamPanelBase>
  );
};
