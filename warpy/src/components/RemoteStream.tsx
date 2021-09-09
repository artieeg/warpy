import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {IParticipant, Participant, Stream} from '@app/models';
import {
  useAppUser,
  useLocalStream,
  useStreamSpeakers,
  useStreamViewers,
  useParticipantsCount,
  useSpeakingRequests,
  useEffectOnce,
} from '@app/hooks';
import {MediaStream, RTCView} from 'react-native-webrtc';
import {useRecvTransport} from '@app/hooks/useRecvTransport';
import {useMediaStreamingContext} from './MediaStreamingContext';
import {Consumer} from 'mediasoup-client/lib/types';
import {ParticipantsModal} from './ParticipantsModal';
import {ViewerStreamPanel} from './ViewerStreamPanel';
import {ParticipantInfoModal} from './ParticipantInfoModal';
import {SpeakerStreamPanel} from './SpeakerStreamPanel';
import {useParticipantStore} from '@app/stores';
import {Reactions} from './Reactions';
import {reactionCodes} from './Reaction';
import {ReactionCanvas} from './ReactionCanvas';
import {useAPIStore} from '@app/stores/useAPIStore';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {stream} = props;
  const user = useAppUser();
  const userId = user!.id;
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const audioStream = useLocalStream('audio');
  const [roomData, setRoomData] = useState<any>(null);
  const [panelVisible, setPanelVisible] = useState(true);
  const id = stream.id;
  const {api} = useAPIStore();
  const media = useMediaStreamingContext();
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [micIsOn, setMicIsOn] = useState(true);
  const [speakerOptions, setSpeakerOptions] = useState<any>();
  const [showReactions, setReactionsVisible] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(reactionCodes[0]);

  //Display a participant info modal
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const recvTransport = useRecvTransport({
    stream: id,
    recvTransportOptions: roomData?.recvTransportOptions,
    routerRtpCapabilities: roomData?.routerRtpCapabilities,
  });

  const participantsCount = useParticipantsCount();
  const speakers = useStreamSpeakers();
  const [viewers, fetchViewers] = useStreamViewers();
  const usersRaisingHand = useSpeakingRequests();

  useEffect(() => {
    audioStream?.getAudioTracks().forEach(audio => (audio.enabled = micIsOn));
  }, [audioStream, micIsOn]);

  useEffect(() => {
    console.log(
      'params',
      `recv transport: ${!!recvTransport}, permission token: ${!!media.permissionsToken}`,
    );

    if (mediaStream) {
      return;
    }

    if (recvTransport && media.permissionsToken) {
      media
        .consumeRemoteStreams(userId, id, recvTransport)
        .then((consumers: Consumer[]) => {
          const track = consumers[0].track;

          setMediaStream(new MediaStream([track]));
        });
    }
  }, [
    recvTransport,
    roomData,
    userId,
    id,
    media,
    media.permissionsToken,
    mediaStream,
  ]);

  useEffectOnce(() => {
    api.stream.join(id).then(data => {
      fetchViewers();

      media.setPermissionsToken(data.mediaPermissionsToken);
      setRoomData(data.recvMediaParams);

      const fetchedSpeakers: Record<string, IParticipant> = {};
      data.speakers.forEach(speaker => {
        fetchedSpeakers[speaker.id] = Participant.fromJSON(speaker);
      });

      const fetchedRaisedHands: Record<string, IParticipant> = {};
      data.raisedHands.forEach(viewer => {
        fetchedRaisedHands[viewer.id] = Participant.fromJSON(viewer);
      });

      useParticipantStore.getState().set({
        viewersWithRaisedHands: fetchedRaisedHands,
        speakers: fetchedSpeakers,
        count: data.count,
        page: -1,
      });
    });
  });

  useEffect(() => {
    const unsub = api.stream.onSpeakingAllowed(async options => {
      await media.initSendDevice(options.media.rtpCapabilities);
      media.setPermissionsToken(options.mediaPermissionToken);
      setIsSpeaker(true);
      setSpeakerOptions(options);
    });

    return unsub;
  }, [id, audioStream, api, media]);

  useEffect(() => {
    if (speakerOptions && audioStream) {
      media.sendMediaStream(audioStream, id, speakerOptions.media, 'audio');
    }
  }, [media, speakerOptions, id, audioStream]);

  const onOpenReactions = () => {
    setReactionsVisible(true);
  };

  const {width, height} = useWindowDimensions();

  const raiseHand = useCallback(() => {
    api.stream.raiseHand();
  }, [api]);

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

      <ReactionCanvas stream={id} reaction={currentReaction} />

      {isSpeaker && (
        <SpeakerStreamPanel
          visible={panelVisible}
          participantsCount={participantsCount}
          onOpenParticipantsList={() => setPanelVisible(false)}
          onOpenReactions={onOpenReactions}
          micIsOn={micIsOn}
          reaction={currentReaction}
          onMicToggle={() => setMicIsOn(prev => !prev)}
        />
      )}

      {!isSpeaker && (
        <ViewerStreamPanel
          visible={panelVisible}
          reaction={currentReaction}
          participantsCount={participantsCount}
          onRaiseHand={raiseHand}
          onOpenReactions={onOpenReactions}
          onOpenParticipantsList={() => setPanelVisible(false)}
        />
      )}

      <ParticipantInfoModal
        onHide={() => setSelectedUser(null)}
        user={selectedUser}
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

      <Reactions
        onPickReaction={setCurrentReaction}
        visible={showReactions}
        onHide={() => setReactionsVisible(false)}
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
