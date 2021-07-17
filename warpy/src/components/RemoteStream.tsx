import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Stream} from '@app/models';
import {onWebSocketEvent, sendJoinStream, sendRaiseHand} from '@app/services';
import {consumeRemoteStream} from '@app/services/video';
import {useAppUser} from '@app/hooks';
import {MediaStream, RTCView} from 'react-native-webrtc';
import {Speakers} from './Speakers';
import {ClapButton} from './ClapsButton';
import {WarpButton} from './WarpButton';
import {RaiseHandButton} from './RaiseHandButton';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {stream} = props;
  const [user] = useAppUser();
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const id = stream.id;

  useEffect(() => {
    onWebSocketEvent('joined-room', async (data: any) => {
      const {routerRtpCapabilities, recvTransportOptions} = data;

      const track = await consumeRemoteStream(
        user.id,
        id,
        routerRtpCapabilities,
        recvTransportOptions,
      );

      setMediaStream(new MediaStream([track]));
    });

    sendJoinStream(id);
  }, [user?.id || null, id]);

  const {width, height} = useWindowDimensions();

  const raiseHand = useCallback(() => {
    console.log('sneding raise hand event');
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
