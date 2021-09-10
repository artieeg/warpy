import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Stream} from '@app/models';
import {
  useStreamSpeakers,
  useStreamViewers,
  useSpeakingRequests,
  useEffectOnce,
  useLocalAudioStream,
} from '@app/hooks';
import {RTCView} from 'react-native-webrtc';
import {useRecvTransport} from '@app/hooks/useRecvTransport';
import {useMediaStreamingContext} from './MediaStreamingContext';
import {ParticipantsModal} from './ParticipantsModal';
import {ViewerStreamPanel} from './ViewerStreamPanel';
import {ParticipantInfoModal} from './ParticipantInfoModal';
import {SpeakerStreamPanel} from './SpeakerStreamPanel';
import {useStore} from '@app/store';
import {Reactions} from './Reactions';
import {reactionCodes} from './Reaction';
import {ReactionCanvas} from './ReactionCanvas';
import {useRemoteStreams} from '@app/hooks/useRemoteStreams';
import shallow from 'zustand/shallow';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {stream} = props;
  const {stream: audioStream, toggle, muted} = useLocalAudioStream();
  const [panelVisible, setPanelVisible] = useState(true);
  const id = stream.id;
  const api = useStore(state => state.api);
  const media = useMediaStreamingContext();
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [speakerOptions, setSpeakerOptions] = useState<any>();
  const [showReactions, setReactionsVisible] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(reactionCodes[0]);

  const [roomData, join, totalParticipantCount] = useStore(
    state => [state.recvMediaParams, state.join, state.totalParticipantCount],
    shallow,
  );

  //Display a participant info modal
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const recvTransport = useRecvTransport({
    stream: id,
    recvTransportOptions: roomData?.recvTransportOptions,
    routerRtpCapabilities: roomData?.routerRtpCapabilities,
  });

  const speakers = useStreamSpeakers();
  const [viewers, fetchViewers] = useStreamViewers();
  const usersRaisingHand = useSpeakingRequests();

  const {videoStreams} = useRemoteStreams(id, recvTransport);

  useEffectOnce(() => {
    join(id);
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
      {videoStreams[0] && (
        <RTCView
          objectFit="cover"
          style={mediaStyle}
          streamURL={videoStreams[0].toURL()}
        />
      )}

      <ReactionCanvas stream={id} reaction={currentReaction} />

      {isSpeaker && (
        <SpeakerStreamPanel
          visible={panelVisible}
          participantsCount={totalParticipantCount}
          onOpenParticipantsList={() => setPanelVisible(false)}
          onOpenReactions={onOpenReactions}
          micIsOn={!muted}
          reaction={currentReaction}
          onMicToggle={toggle}
        />
      )}

      {!isSpeaker && (
        <ViewerStreamPanel
          visible={panelVisible}
          reaction={currentReaction}
          participantsCount={totalParticipantCount}
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
