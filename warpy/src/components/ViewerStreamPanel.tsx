import React from 'react';
import {ClapButton} from './ClapsButton';
import {WarpButton} from './WarpButton';
import {RaiseHandButton} from './RaiseHandButton';
import {ShowParticipantsButton} from './ShowParticipantsButton';
import {IStreamPanelBase, StreamPanelBase} from './StreamPanelBase';

interface IRemoteStreamPanel extends IStreamPanelBase {
  participantsCount: number;
  onRaiseHand: () => any;
  onOpenParticipantsList: () => any;
  onOpenReactions: () => any;
  reaction: string;
}

export const ViewerStreamPanel = (props: IRemoteStreamPanel) => {
  const {
    participantsCount,
    onOpenReactions,
    onRaiseHand,
    onOpenParticipantsList,
    reaction,
  } = props;

  return (
    <StreamPanelBase {...props}>
      <ClapButton reaction={reaction} onPress={onOpenReactions} />
      <RaiseHandButton onPress={onRaiseHand} />
      <ShowParticipantsButton
        count={participantsCount}
        onOpenParticipantsList={onOpenParticipantsList}
      />
    </StreamPanelBase>
  );
};
