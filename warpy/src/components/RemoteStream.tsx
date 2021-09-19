import React, {useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Stream} from '@app/models';
import {useLocalAudioStream, useRemoteStream} from '@app/hooks';
import {RTCView} from 'react-native-webrtc';
import {ParticipantsModal} from './ParticipantsModal';
import {ViewerStreamPanel} from './ViewerStreamPanel';
import {ParticipantInfoModal} from './ParticipantInfoModal';
import {SpeakerStreamPanel} from './SpeakerStreamPanel';
import {Reactions} from './Reactions';
import {reactionCodes} from './Reaction';
import {ReactionCanvas} from './ReactionCanvas';
import {useMediaStreaming} from '@app/hooks/useMediaStreaming';
import {ChatModal} from './ChatModal';
import {UserActionSheet} from './UserActionSheet';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {id, title} = props.stream;

  //Display a participant info modal
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [showUserActions, setShowUserActions] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);
  const [showReactions, setReactionsVisible] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(reactionCodes[0]);
  const [showChat, setShowChat] = useState(false);

  const {stream: audioStream, toggle, muted} = useLocalAudioStream();
  const {totalParticipantCount, videoStreams, isSpeaker} = useRemoteStream(id);

  useMediaStreaming({
    stream: audioStream,
    kind: 'audio',
  });

  const {width, height} = useWindowDimensions();

  const wrapperStyle = {
    ...styles.wrapper,
    height,
    width,
  };

  const mediaStyle = {
    ...styles.media,
    height,
    width,
  };

  const showParticipantsModal =
    !panelVisible && !selectedUser && !showUserActions;

  return (
    <View style={wrapperStyle}>
      {videoStreams[0] && (
        <RTCView
          objectFit="cover"
          style={mediaStyle}
          streamURL={videoStreams[0].toURL()}
        />
      )}

      <ReactionCanvas stream={id} reaction={currentReaction} />

      {isSpeaker && (
        <SpeakerStreamPanel
          visible={panelVisible}
          participantsCount={totalParticipantCount}
          onOpenParticipantsList={() => setPanelVisible(false)}
          onOpenReactions={() => setReactionsVisible(true)}
          micIsOn={!muted}
          reaction={currentReaction}
          onMicToggle={toggle}
        />
      )}

      {!isSpeaker && (
        <ViewerStreamPanel
          visible={panelVisible}
          reaction={currentReaction}
          participantsCount={totalParticipantCount}
          onOpenChat={() => setShowChat(true)}
          onOpenReactions={() => setReactionsVisible(true)}
          onOpenParticipantsList={() => setPanelVisible(false)}
        />
      )}

      <ParticipantInfoModal
        onHide={() => setSelectedUser(null)}
        user={selectedUser}
        visible={!!selectedUser}
      />

      <ParticipantsModal
        title={title}
        onHide={() => setPanelVisible(true)}
        visible={showParticipantsModal}
        onSelectParticipant={setSelectedUser}
      />

      <Reactions
        onPickReaction={setCurrentReaction}
        visible={showReactions}
        onHide={() => setReactionsVisible(false)}
      />

      <ChatModal visible={showChat} onHide={() => setShowChat(false)} />

      <UserActionSheet
        visible={showUserActions}
        onHide={() => setShowUserActions(prev => !prev)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ff3030',
  },
  wrapper: {
    backgroundColor: '#30ff30',
  },
});
