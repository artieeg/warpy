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

  const [currentModal, setCurrentModal] = useState<
    | 'user-actions'
    | 'participant-info'
    | 'participants'
    | 'reactions'
    | 'chat'
    | null
  >(null);
  const [currentReaction, setCurrentReaction] = useState(reactionCodes[0]);

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
          visible={!currentModal}
          participantsCount={totalParticipantCount}
          onOpenParticipantsList={() => setCurrentModal('participants')}
          onOpenReactions={() => setCurrentModal('reactions')}
          micIsOn={!muted}
          reaction={currentReaction}
          onMicToggle={toggle}
        />
      )}

      {!isSpeaker && (
        <ViewerStreamPanel
          visible={!currentModal}
          reaction={currentReaction}
          participantsCount={totalParticipantCount}
          onOpenChat={() => setCurrentModal('chat')}
          onOpenParticipantsList={() => setCurrentModal('participants')}
          onOpenReactions={() => setCurrentModal('reactions')}
        />
      )}

      <ParticipantInfoModal
        onHide={() => setCurrentModal(null)}
        user={selectedUser}
        visible={currentModal === 'participant-info'}
      />

      <ParticipantsModal
        title={title}
        onHide={() => setCurrentModal(null)}
        visible={currentModal === 'participants'}
        onOpenActions={id => {
          setSelectedUser(id);
          setCurrentModal('user-actions');
        }}
        onSelectParticipant={id => {
          setSelectedUser(id);
          setCurrentModal('participant-info');
        }}
      />

      <Reactions
        onPickReaction={setCurrentReaction}
        visible={currentModal === 'reactions'}
        onHide={() => setCurrentModal(null)}
      />

      <ChatModal
        visible={currentModal === 'chat'}
        onHide={() => setCurrentModal(null)}
      />

      <UserActionSheet
        user={selectedUser}
        visible={currentModal === 'user-actions'}
        onHide={() => setCurrentModal(null)}
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
