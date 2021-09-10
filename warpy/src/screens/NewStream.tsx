import {
  useAppUser,
  useLocalVideoStream,
  useParticipantsCount,
  useSpeakingRequests,
  useStreamSpeakers,
  useStreamViewers,
} from '@app/hooks';
import {RTCView} from 'react-native-webrtc';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {
  StopStream,
  Button,
  useMediaStreamingContext,
  ParticipantsModal,
  ParticipantInfoModal,
} from '@app/components';
import {useRecvTransport} from '@app/hooks/useRecvTransport';
import {StreamerPanel} from '@app/components/StreamerPanel';
import {useStreamStore} from '@app/stores';
import {useAPIStore} from '@app/stores/useAPIStore';
import {Participant} from '@app/models';
import shallow from 'zustand/shallow';

export const NewStream = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const user = useAppUser();
  const userId: string = user!.id;
  const [sendRoomData, recvRoomData, streamId, createStream] = useStreamStore(
    state => [
      state.sendMediaParams,
      state.recvMediaParams,
      state.stream,
      state.create,
    ],
    shallow,
  );

  const [userFacingMode, setUserFacingMode] = useState(true);

  //Display a participant info modal
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const {api} = useAPIStore();
  const media = useMediaStreamingContext();

  const recvTransport = useRecvTransport({
    stream: streamId,
    recvTransportOptions: recvRoomData?.recvTransportOptions,
    routerRtpCapabilities: recvRoomData?.routerRtpCapabilities,
  });

  const {width, height} = useWindowDimensions();
  const {stream: localMediaStream} = useLocalVideoStream();

  useEffect(() => {
    const videoTrack = localMediaStream?.getVideoTracks()[0];
    if (videoTrack) {
      (videoTrack as any)._switchCamera();
    }
  }, [userFacingMode, localMediaStream]);

  useEffect(() => {
    if (!recvTransport) {
      return;
    }

    const newTrackUnsub = api.media.onNewTrack(data => {
      media.consumeRemoteStream(
        data.consumerParameters,
        data.user,
        recvTransport,
      );
    });

    return () => {
      newTrackUnsub();
    };
  }, [recvTransport, media, api]);

  useEffect(() => {
    if (sendRoomData && streamId && localMediaStream) {
      media
        .initSendDevice(sendRoomData.routerRtpCapabilities)
        .then(async () => {
          await Promise.all([
            media.sendMediaStream(
              localMediaStream,
              streamId,
              sendRoomData,
              'video',
            ),

            media.sendMediaStream(
              localMediaStream,
              streamId,
              sendRoomData,
              'audio',
            ),
          ]);
        });
    }
  }, [streamId, sendRoomData, localMediaStream, userId, media, api]);

  const onStart = useCallback(() => {
    createStream(title, hub);
  }, [title, hub, api]);

  const onStopStream = () => {
    api.stream.stop(streamId!);
  };

  const participantsCount = useParticipantsCount();
  const speakers = useStreamSpeakers();
  const [viewers, fetchViewers] = useStreamViewers();
  const [panelVisible, setPanelVisible] = useState(true);
  const usersRaisingHand = useSpeakingRequests();
  const [micIsOn, setMicIsOn] = useState(true);

  const showPanel = panelVisible && !selectedUser;

  const localStreamStyle = {
    ...styles.localStream,
    width,
    height,
  };

  useEffect(() => {
    localMediaStream
      ?.getAudioTracks()
      .forEach(audio => (audio.enabled = micIsOn));
  }, [micIsOn, localMediaStream]);

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
          participantsCount={participantsCount}
          onOpenParticipantsList={() => setPanelVisible(false)}
          micIsOn={micIsOn}
          onMicToggle={setMicIsOn}
          onFlipCamera={() => setUserFacingMode(prev => !prev)}
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
