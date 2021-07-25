import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Stream} from '@app/models';
import {useAppUser, useLocalStream} from '@app/hooks';
import {MediaStream, RTCView} from 'react-native-webrtc';
import {Speakers} from './Speakers';
import {ClapButton} from './ClapsButton';
import {WarpButton} from './WarpButton';
import {RaiseHandButton} from './RaiseHandButton';
import {useRecvTransport} from '@app/hooks/useRecvTransport';
import {useMediaStreamingContext} from './MediaStreamingContext';
import {useWebSocketContext} from './WebSocketContext';
import {Consumer} from 'mediasoup-client/lib/types';

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
  const id = stream.id;
  const ws = useWebSocketContext();
  const media = useMediaStreamingContext();

  const recvTransport = useRecvTransport({
    stream: id,
    recvTransportOptions: roomData?.recvTransportOptions,
    routerRtpCapabilities: roomData?.routerRtpCapabilities,
  });

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
    ws.on('@media/recv-connect-params', async (data: any) => {
      setRoomData(data);
    });

    ws.sendJoinStream(id);
  }, [userId, id, ws]);

  useEffect(() => {
    ws.on('speaking-allowed', async (options: any) => {
      await media.initSendDevice(options.media.rtpCapabilities);
      media.sendMediaStream(audioStream!, id, options.media, 'audio');
    });
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
      <View style={styles.bottom}>
        <Speakers speakers={stream.participants} style={styles.speakers} />
        <View style={styles.buttons}>
          <View style={[styles.buttonRow, styles.upperButtonRow]}>
            <WarpButton style={styles.spaceRight} />
            <ClapButton />
          </View>
          <View style={styles.buttonRow}>
            <RaiseHandButton onPress={raiseHand} />
          </View>
        </View>
      </View>
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
});
