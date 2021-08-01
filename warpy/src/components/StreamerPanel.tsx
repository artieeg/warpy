import React from 'react';
import {StyleSheet} from 'react-native';
import {ClapButton} from './ClapsButton';
import {WarpButton} from './WarpButton';
import {ShowParticipantsButton} from './ShowParticipantsButton';
import {IStreamPanelBase, StreamPanelBase} from './StreamPanelBase';
import {ToggleMicButton} from './ToggleMicButton';

interface IStreamerPanel extends IStreamPanelBase {
  participantsCount: number;
  onOpenParticipantsList: () => any;
  micIsOn: boolean;
  onMicToggle: (on: boolean) => any;
}

export const StreamerPanel = (props: IStreamerPanel) => {
  const {participantsCount, onOpenParticipantsList, onMicToggle, micIsOn} =
    props;

  return (
    <StreamPanelBase {...props}>
      <WarpButton style={styles.spaceRight} />
      <ClapButton />
      <ShowParticipantsButton
        style={styles.spaceRight}
        count={participantsCount}
        onOpenParticipantsList={onOpenParticipantsList}
      />
      <ToggleMicButton onPress={() => onMicToggle(!micIsOn)} on={micIsOn} />
    </StreamPanelBase>
  );
};

const styles = StyleSheet.create({
  speakers: {
    flex: 1,
  },
  bottom: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  upperButtonRow: {
    paddingBottom: 10,
  },
  spaceRight: {
    marginRight: 10,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttons: {
    alignItems: 'flex-end',
  },
  speakersAndTitle: {
    flex: 1,
  },
  title: {flex: 1},
});
