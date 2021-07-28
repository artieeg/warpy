import React from 'react';
import {StyleSheet} from 'react-native';
import {ClapButton} from './ClapsButton';
import {WarpButton} from './WarpButton';
import {RaiseHandButton} from './RaiseHandButton';
import {ShowParticipantsButton} from './ShowParticipantsButton';
import {IStreamPanelBase, StreamPanelBase} from './StreamPanelBase';

interface IRemoteStreamPanel extends IStreamPanelBase {
  participantsCount: number;
  onRaiseHand: () => any;
  onOpenParticipantsList: () => any;
}

export const ViewerStreamPanel = (props: IRemoteStreamPanel) => {
  const {participantsCount, onRaiseHand, onOpenParticipantsList} = props;

  return (
    <StreamPanelBase {...props}>
      <WarpButton style={styles.spaceRight} />
      <ClapButton />
      <ShowParticipantsButton
        style={styles.spaceRight}
        count={participantsCount}
        onOpenParticipantsList={onOpenParticipantsList}
      />
      <RaiseHandButton onPress={onRaiseHand} />
    </StreamPanelBase>
  );
};

const styles = StyleSheet.create({
  spaceRight: {
    marginRight: 10,
  },
});
