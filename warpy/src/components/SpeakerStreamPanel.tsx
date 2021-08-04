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
}

export const SpeakerStreamPanel = (props: ISpeakerStreamPanel) => {
  const {participantsCount, onOpenParticipantsList, micIsOn, onMicToggle} =
    props;

  return (
    <StreamPanelBase {...props}>
      <StopSpeakingButton style={styles.spaceRight} onPress={() => {}} />
      <ClapButton />
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