import React from 'react';
import {ClapButton} from './ClapsButton';
import {WarpButton} from './WarpButton';
import {RaiseHandButton} from './RaiseHandButton';
import {ShowParticipantsButton} from './ShowParticipantsButton';
import {IStreamPanelBase, StreamPanelBase} from './StreamPanelBase';

interface IRemoteStreamPanel extends IStreamPanelBase {
  participantsCount: number;
  onRaiseHand: () => any;
  onOpenReactions: () => any;
  onOpenParticipantsList: () => any;
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
      <WarpButton />
      <ClapButton reaction={reaction} onPress={onOpenReactions} />
      <ShowParticipantsButton
        count={participantsCount}
        onOpenParticipantsList={onOpenParticipantsList}
      />
      <RaiseHandButton onPress={onRaiseHand} />
    </StreamPanelBase>
  );
};
