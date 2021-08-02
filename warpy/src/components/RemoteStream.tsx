import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Stream} from '@app/models';
import {
  useAppUser,
  useLocalStream,
  useStreamSpeakers,
  useStreamViewers,
  useParticipantsCount,
  useSpeakingRequests,
} from '@app/hooks';
import {MediaStream, RTCView} from 'react-native-webrtc';
import {useRecvTransport} from '@app/hooks/useRecvTransport';
import {useMediaStreamingContext} from './MediaStreamingContext';
import {useWebSocketContext} from './WebSocketContext';
import {Consumer} from 'mediasoup-client/lib/types';
import {ParticipantsModal} from './ParticipantsModal';
import {ViewerStreamPanel} from './ViewerStreamPanel';
import {ParticipantInfoModal} from './ParticipantInfoModal';
import {SpeakerStreamPanel} from './SpeakerStreamPanel';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {stream} = props;
  const [user] = useAppUser();
  const userId = user!.id;
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const audioStream = useLocalStream('audio');
  const [roomData, setRoomData] = useState<any>(null);
  const [panelVisible, setPanelVisible] = useState(true);
  const id = stream.id;
  const ws = useWebSocketContext();
  const media = useMediaStreamingContext();
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [micIsOn, setMicIsOn] = useState(true);

  //Display a participant info modal
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const recvTransport = useRecvTransport({
    stream: id,
    recvTransportOptions: roomData?.recvTransportOptions,
    routerRtpCapabilities: roomData?.routerRtpCapabilities,
  });

  const participantsCount = useParticipantsCount();
  const speakers = useStreamSpeakers(stream.id);
  const [viewers, fetchViewers] = useStreamViewers(stream.id);
  const usersRaisingHand = useSpeakingRequests();

  useEffect(() => {
    if (recvTransport) {
      media
        .consumeRemoteStreams(userId, id, recvTransport)
        .then((consumers: Consumer[]) => {
          const track = consumers[0].track;

          setMediaStream(new MediaStream([track]));
        });
    }
  }, [recvTransport, roomData, userId, id, media]);

  useEffect(() => {
    ws.once('@media/recv-connect-params', async (data: any) => {
      setRoomData(data);
    });

    ws.sendJoinStream(id);
  }, [userId, id, ws]);

  useEffect(() => {
    const onSpeakingAllowed = async (options: any) => {
      setIsSpeaker(true);
      await media.initSendDevice(options.media.rtpCapabilities);
      media.sendMediaStream(audioStream!, id, options.media, 'audio');
    };

    ws.on('speaking-allowed', onSpeakingAllowed);

    return () => {
      ws.off('speaking-allowed', onSpeakingAllowed);
    };
  }, [id, audioStream, ws, media]);

  const {width, height} = useWindowDimensions();

  const raiseHand = useCallback(() => {
    ws.sendRaiseHand();
  }, [ws]);

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

  const showParticipantsModal = !panelVisible && !selectedUser;

  return (
    <View style={wrapperStyle}>
      {mediaStream && (
        <RTCView
          objectFit="cover"
          style={mediaStyle}
          streamURL={mediaStream.toURL()}
        />
      )}

      {isSpeaker && (
        <SpeakerStreamPanel
          title={stream.title}
          visible={panelVisible}
          speakers={speakers}
          participantsCount={participantsCount}
          onOpenParticipantsList={() => setPanelVisible(false)}
          micIsOn={micIsOn}
          onMicToggle={() => setMicIsOn(prev => !prev)}
        />
      )}

      {!isSpeaker && (
        <ViewerStreamPanel
          title={stream.title}
          visible={panelVisible}
          speakers={speakers}
          participantsCount={participantsCount}
          onRaiseHand={raiseHand}
          onOpenParticipantsList={() => setPanelVisible(false)}
        />
      )}

      <ParticipantInfoModal
        onHide={() => setSelectedUser(null)}
        id={selectedUser}
      />
      <ParticipantsModal
        raisingHands={usersRaisingHand}
        speakers={speakers}
        title={stream.title}
        onHide={() => setPanelVisible(true)}
        visible={showParticipantsModal}
        viewers={viewers}
        onSelectParticipant={setSelectedUser}
        onFetchMore={fetchViewers}
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
