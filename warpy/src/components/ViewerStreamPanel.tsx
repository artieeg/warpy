import React, {useCallback} from 'react';
import {ClapButton} from './ClapsButton';
import {WarpButton} from './WarpButton';
import {RaiseHandButton} from './RaiseHandButton';
import {ShowParticipantsButton} from './ShowParticipantsButton';
import {IStreamPanelBase, StreamPanelBase} from './StreamPanelBase';
import {ChatButton} from './ChatButton';
import {useStore} from '@app/store';

interface IRemoteStreamPanel extends IStreamPanelBase {
  participantsCount: number;
  onOpenParticipantsList: () => any;
  onOpenReactions: () => any;
  onOpenChat: () => void;
}

export const ViewerStreamPanel = (props: IRemoteStreamPanel) => {
  const {
    participantsCount,
    onOpenReactions,
    onOpenParticipantsList,
    onOpenChat,
  } = props;

  const api = useStore.use.api();

  const onRaiseHand = useCallback(() => {
    api.stream.raiseHand();
  }, [api]);

  return (
    <StreamPanelBase {...props}>
      <ChatButton onPress={onOpenChat} />
      <ClapButton onPress={onOpenReactions} />
      <RaiseHandButton onPress={onRaiseHand} />
    </StreamPanelBase>
  );
};
