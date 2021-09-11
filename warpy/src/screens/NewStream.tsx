import {
  useAppUser,
  useLocalVideoStream,
  useMediaStreaming,
  useParticipantsCount,
  useSpeakingRequests,
  useStreamSpeakers,
  useStreamViewers,
} from '@app/hooks';
import {RTCView} from 'react-native-webrtc';
import React, {useCallback, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {
  StopStream,
  Button,
  ParticipantsModal,
  ParticipantInfoModal,
} from '@app/components';
import {useRecvTransport} from '@app/hooks/useRecvTransport';
import {StreamerPanel} from '@app/components/StreamerPanel';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';

export const NewStream = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const user = useAppUser();
  const userId: string = user!.id;
  const [recvRoomData, streamId, createStream, api] = useStore(
    state => [state.recvMediaParams, state.stream, state.create, state.api],
    shallow,
  );

  //Display a participant info modal
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const recvTransport = useRecvTransport();

  const {width, height} = useWindowDimensions();
  const {
    stream: localMediaStream,
    switchCamera,
    toggle,
    muted,
  } = useLocalVideoStream();

  useMediaStreaming({stream: localMediaStream, kind: 'video'});
  useMediaStreaming({stream: localMediaStream, kind: 'audio'});

  const onStart = useCallback(() => {
    if (streamId) {
      return;
    }

    createStream(title, hub, recvTransport);
  }, [title, streamId, hub, api, recvTransport]);

  const onStopStream = () => {
    api.stream.stop(streamId!);
  };

  const participantsCount = useParticipantsCount();
  const speakers = useStreamSpeakers();
  const [viewers, fetchViewers] = useStreamViewers();
  const [panelVisible, setPanelVisible] = useState(true);
  const usersRaisingHand = useSpeakingRequests();

  const showPanel = panelVisible && !selectedUser;

  const localStreamStyle = {
    ...styles.localStream,
    width,
    height,
  };

  return (
    <View style={styles.wrapper}>
      {localMediaStream && (
        <RTCView
          style={localStreamStyle}
          objectFit="cover"
          streamURL={localMediaStream.toURL()}
        />
      )}
      {streamId && <StopStream onPress={onStopStream} />}
      {streamId && (
        <StreamerPanel
          visible={showPanel}
          micIsOn={!muted}
          participantsCount={participantsCount}
          onOpenParticipantsList={() => setPanelVisible(false)}
          onMicToggle={toggle}
          onFlipCamera={switchCamera}
        />
      )}
      <ParticipantsModal
        speakers={speakers}
        raisingHands={usersRaisingHand}
        title={title}
        onHide={() => setPanelVisible(true)}
        visible={!panelVisible}
        viewers={viewers}
        onFetchMore={fetchViewers}
        onSelectParticipant={setSelectedUser}
      />

      <ParticipantInfoModal
        onHide={() => setSelectedUser(null)}
        user={selectedUser}
      />

      {!streamId && (
        <View style={styles.startStreamButton}>
          <Button onPress={onStart} title="Start" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  localStream: {
    backgroundColor: '#303030',
  },
  allowSpeaking: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
  },
  startStreamButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#303030',
  },
});
