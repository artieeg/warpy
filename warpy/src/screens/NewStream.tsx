import {
  useAppUser,
  useLocalStream,
  useParticipantsCount,
  useSpeakingRequests,
  useStreamSpeakers,
  useStreamViewers,
} from '@app/hooks';
import {createStream} from '@app/services';
import {RTCView} from 'react-native-webrtc';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {
  StopStream,
  Button,
  useMediaStreamingContext,
  useWebSocketContext,
  ParticipantsModal,
  ParticipantInfoModal,
} from '@app/components';
import {useRecvTransport} from '@app/hooks/useRecvTransport';
import {StreamerPanel} from '@app/components/StreamerPanel';

export const NewStream = () => {
  const [streamId, setStreamId] = useState<string>();
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [user] = useAppUser();
  const userId: string = user!.id;
  const [sendRoomData, setSendRoomData] = useState<any>();
  const [recvRoomData, setRecvRoomData] = useState<any>();

  //Display a participant info modal
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const ws = useWebSocketContext();
  const media = useMediaStreamingContext();

  const recvTransport = useRecvTransport({
    stream: streamId,
    recvTransportOptions: recvRoomData?.recvTransportOptions,
    routerRtpCapabilities: recvRoomData?.routerRtpCapabilities,
  });

  const {width, height} = useWindowDimensions();
  const localMediaStream = useLocalStream('video');

  useEffect(() => {
    ws.once('created-room', (data: any) => {
      setSendRoomData(data.media);
    });

    ws.once('@media/recv-connect-params', (data: any) => {
      setRecvRoomData(data);
    });
  }, [streamId, ws]);

  useEffect(() => {
    if (!recvTransport) {
      return;
    }

    const onNewTrack = (data: any) => {
      media.consumeRemoteStream(
        data.consumerParameters,
        data.user,
        recvTransport,
      );
    };

    ws.on('@media/new-track', onNewTrack);

    return () => {
      ws.off('@media/new-track', onNewTrack);
    };
  }, [recvTransport, media, ws]);

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
  }, [streamId, sendRoomData, localMediaStream, userId, media, ws]);

  const onStart = useCallback(async () => {
    const newStreamId = await createStream(title, hub);
    setStreamId(newStreamId);
  }, [title, hub]);

  const onStopStream = () => {
    ws.sendStopStream({
      stream: streamId,
    });
  };

  const participantsCount = useParticipantsCount();
  const speakers = useStreamSpeakers(streamId!);
  const [viewers, fetchViewers] = useStreamViewers(streamId!);
  const [panelVisible, setPanelVisible] = useState(true);
  const usersRaisingHand = useSpeakingRequests();
  const [micIsOn, setMicIsOn] = useState(true);

  const showPanel = panelVisible && !selectedUser;

  const localStreamStyle = {
    ...styles.localStream,
    width,
    height,
  };

  return (
    <View>
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
          title={title}
          visible={showPanel}
          speakers={speakers}
          participantsCount={participantsCount}
          onOpenParticipantsList={() => setPanelVisible(false)}
          micIsOn={micIsOn}
          onMicToggle={setMicIsOn}
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
        id={selectedUser}
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
});
