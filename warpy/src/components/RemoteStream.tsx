import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Stream} from '@app/models';
import {onWebSocketEvent, sendJoinStream, sendRaiseHand} from '@app/services';
import {
  consumeRemoteStreams,
  initSendDevice,
  sendMediaStream,
} from '@app/services/video';
import {useAppUser, useLocalStream} from '@app/hooks';
import {MediaStream, RTCView} from 'react-native-webrtc';
import {Speakers} from './Speakers';
import {ClapButton} from './ClapsButton';
import {WarpButton} from './WarpButton';
import {RaiseHandButton} from './RaiseHandButton';
import {useRecvTransport} from '@app/hooks/useRecvTransport';

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

  const recvTransport = useRecvTransport({
    stream: id,
    recvTransportOptions: roomData?.recvTransportOptions,
    routerRtpCapabilities: roomData?.routerRtpCapabilities,
  });

  useEffect(() => {
    if (recvTransport) {
      consumeRemoteStreams(userId, id, recvTransport).then(consumers => {
        const track = consumers[0].track;

        setMediaStream(new MediaStream([track]));
      });
    }
  }, [recvTransport, roomData, userId, id]);

  useEffect(() => {
    onWebSocketEvent('@media/recv-connect-params', async (data: any) => {
      setRoomData(data);
    });

    sendJoinStream(id);
  }, [userId, id]);

  useEffect(() => {
    onWebSocketEvent('speaking-allowed', async (options: any) => {
      await initSendDevice(options.media.rtpCapabilities);
      sendMediaStream(audioStream!, id, options.media, 'audio');
    });
  }, [id, audioStream]);

  const {width, height} = useWindowDimensions();

  const raiseHand = useCallback(() => {
    sendRaiseHand();
  }, []);

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
