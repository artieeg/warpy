import {useLocalVideoStream, useMediaStreaming} from '@app/hooks';
import {RTCView} from 'react-native-webrtc';
import React, {useCallback, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {
  StopStream,
  Button,
  ParticipantsModal,
  ParticipantInfoModal,
  ReportActionSheet,
} from '@app/components';
import {useRecvTransport} from '@app/hooks/useRecvTransport';
import {StreamerPanel} from '@app/components/StreamerPanel';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';
import {UserActionSheet} from '@app/components/UserActionSheet';

export const NewStream = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [streamId, createStream, api] = useStore(
    state => [state.stream, state.create, state.api],
    shallow,
  );

  const [currentModal, setCurrentModal] = useState<
    | 'user-actions'
    | 'participant-info'
    | 'participants'
    | 'reports'
    | 'reactions'
    | 'chat'
    | null
  >(null);

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

  const [panelVisible, setPanelVisible] = useState(true);

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
          visible={!currentModal}
          micIsOn={!muted}
          onOpenParticipantsList={() => setCurrentModal('participants')}
          onMicToggle={toggle}
          onFlipCamera={switchCamera}
        />
      )}

      <ParticipantsModal
        title={title}
        onHide={() => setPanelVisible(true)}
        onOpenActions={user => {
          setSelectedUser(user);
          setCurrentModal('user-actions');
        }}
        visible={currentModal === 'participants'}
        onSelectParticipant={user => {
          setCurrentModal('participant-info');
          setSelectedUser(user);
        }}
      />

      <ParticipantInfoModal
        visible={currentModal === 'participant-info'}
        onHide={() => setSelectedUser(null)}
        user={selectedUser}
      />

      {!streamId && (
        <View style={styles.startStreamButton}>
          <Button onPress={onStart} title="Start" />
        </View>
      )}

      <UserActionSheet
        user={selectedUser}
        visible={currentModal === 'user-actions'}
        onHide={() =>
          setCurrentModal(prev => (prev === 'user-actions' ? null : prev))
        }
        onReportUser={() => setCurrentModal('reports')}
      />

      <ReportActionSheet
        user={selectedUser}
        visible={currentModal === 'reports'}
        onHide={() => setCurrentModal(null)}
      />
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
