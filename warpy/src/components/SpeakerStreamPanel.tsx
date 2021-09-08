import React from 'react';
import {StyleSheet} from 'react-native';
import {ClapButton} from './ClapsButton';
import {StopSpeakingButton} from './StopSpeakingButton';
import {ShowParticipantsButton} from './ShowParticipantsButton';
import {IStreamPanelBase, StreamPanelBase} from './StreamPanelBase';
import {ToggleMicButton} from './ToggleMicButton';

interface ISpeakerStreamPanel extends IStreamPanelBase {
  micIsOn: boolean;
  onMicToggle: () => any;
  participantsCount: number;
  onOpenParticipantsList: () => any;
  onOpenReactions: () => any;
  reaction: string;
}

export const SpeakerStreamPanel = (props: ISpeakerStreamPanel) => {
  const {
    participantsCount,
    reaction,
    onOpenReactions,
    onOpenParticipantsList,
    micIsOn,
    onMicToggle,
  } = props;

  return (
    <StreamPanelBase {...props}>
      <StopSpeakingButton style={styles.spaceRight} onPress={() => {}} />
      <ClapButton reaction={reaction} onPress={onOpenReactions} />
      <ShowParticipantsButton
        style={styles.spaceRight}
        count={participantsCount}
        onOpenParticipantsList={onOpenParticipantsList}
      />
      <ToggleMicButton on={micIsOn} onPress={onMicToggle} />
    </StreamPanelBase>
  );
};

const styles = StyleSheet.create({
  spaceRight: {
    marginRight: 10,
  },
});
