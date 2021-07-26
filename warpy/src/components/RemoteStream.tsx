import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Stream} from '@app/models';
import {
  useAppUser,
  useLocalStream,
  useStreamSpeakers,
  useStreamViewers,
  useParticipantsCount,
} from '@app/hooks';
import {MediaStream, RTCView} from 'react-native-webrtc';
import {useRecvTransport} from '@app/hooks/useRecvTransport';
import {useMediaStreamingContext} from './MediaStreamingContext';
import {useWebSocketContext} from './WebSocketContext';
import {Consumer} from 'mediasoup-client/lib/types';
import {RemoteStreamPanel} from './RemoteStreamPanel';
import {ParticipantsModal} from './ParticipantsModal';

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

  const recvTransport = useRecvTransport({
    stream: id,
    recvTransportOptions: roomData?.recvTransportOptions,
    routerRtpCapabilities: roomData?.routerRtpCapabilities,
  });

  const participantsCount = useParticipantsCount();
  const speakers = useStreamSpeakers(stream.id);
  const [viewers, fetchViewers] = useStreamViewers(stream.id);

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

  return (
    <View style={wrapperStyle}>
      {mediaStream && (
        <RTCView
          objectFit="cover"
          style={mediaStyle}
          streamURL={mediaStream.toURL()}
        />
      )}
      <RemoteStreamPanel
        title={stream.title}
        visible={panelVisible}
        speakers={speakers}
        participantsCount={participantsCount}
        onRaiseHand={raiseHand}
        onOpenParticipantsList={() => setPanelVisible(false)}
      />
      <ParticipantsModal
        title={stream.title}
        onHide={() => setPanelVisible(true)}
        visible={!panelVisible}
        viewers={viewers}
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
