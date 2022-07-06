import React, {useMemo} from 'react';
import {
  FlatList,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';
import {ParticipantDisplay} from './Participant';
import {UserWithRaisedHand} from './UserWithRaisedHand';
import {StreamerInfo} from './StreamerInfo';
import {Text} from './Text';
import {
  useSpeakingRequests,
  useStreamProducers,
  useStreamViewers,
} from '@app/hooks';
import {useStore} from '@app/store';
import {IBaseUser, IParticipant} from '@warpy/lib';
import {UserProducer} from './UserProducer';

interface IParticipanModalProps {
  visible: boolean;
  onHide: () => void;
  onSelectParticipant: (user: IBaseUser) => any;
}

export const ParticipantsModal = (props: IParticipanModalProps) => {
  const {onSelectParticipant} = props;
  const usersRaisingHand = useSpeakingRequests();
  const currentHostId = useStore(state => state.currentStreamHost);
  const producers = useStreamProducers();
  const [viewers, onFetchMore] = useStreamViewers();

  const host = useMemo(
    () => producers.find(streamer => streamer.id === currentHostId),
    [producers, currentHostId],
  );

  const data = useMemo(
    () =>
      getListData({
        viewers,
        speakers: producers,
        usersRaisingHand,
        host: host!,
      }),
    [viewers, producers, usersRaisingHand, host],
  );

  const columnWidth = (useWindowDimensions().width - 40) / 4;
  const columnWidthStyle = useMemo(() => ({width: columnWidth}), [columnWidth]);

  //TODO: Separate components
  const renderSection = (sectionData: any) => {
    const {item} = sectionData;

    const {kind} = item;

    if (kind === 'streamer') {
      if (!item.list[0]) {
        return (
          <Text
            size="xsmall"
            style={styles.hostReassignMessage}
            color="boulder">
            Host has left the stream.{'\n'}New host will be assigned soon
          </Text>
        );
      } else {
        return <StreamerInfo data={item.list[0]} />;
      }
    }

    if (kind === 'raised_hands') {
      return (
        <TouchableWithoutFeedback>
          <FlatList
            data={item.list}
            numColumns={4}
            renderItem={({item: flatListItem}) => (
              <TouchableOpacity
                onPress={() => {
                  onSelectParticipant(flatListItem.id);
                }}>
                <UserWithRaisedHand data={flatListItem} />
              </TouchableOpacity>
            )}
          />
        </TouchableWithoutFeedback>
      );
    }

    if (kind === 'speakers') {
      return (
        <TouchableWithoutFeedback>
          <FlatList
            data={item.list}
            renderItem={({item: flatListItem}) => (
              <TouchableOpacity
                onPress={() => {
                  onSelectParticipant(flatListItem.id);
                }}>
                <UserProducer data={flatListItem} />
              </TouchableOpacity>
            )}
          />
        </TouchableWithoutFeedback>
      );
    }

    if (kind === 'viewers') {
      return (
        <TouchableWithoutFeedback>
          <FlatList
            data={item.list}
            numColumns={4}
            renderItem={({item: flatListItem}) => (
              <TouchableOpacity
                style={columnWidthStyle}
                onPress={() => {
                  onSelectParticipant(flatListItem);
                }}>
                <ParticipantDisplay data={flatListItem} />
              </TouchableOpacity>
            )}
          />
        </TouchableWithoutFeedback>
      );
    }
  };

  return (
    <BaseSlideModal {...props} style={styles.modal}>
      <SectionList
        style={styles.horizontalPadding}
        sections={data}
        keyExtractor={item => item.kind}
        renderItem={renderSection as any}
        onEndReached={onFetchMore}
        renderSectionHeader={({section}) => {
          if (section.data[0].list.length === 0) {
            return null;
          }

          return (
            <TouchableWithoutFeedback>
              <Text
                size="small"
                color="boulder"
                weight="bold"
                style={styles.sectionHeader}>
                {section.title}
              </Text>
            </TouchableWithoutFeedback>
          );
        }}
      />
    </BaseSlideModal>
  );
};

const getListData = ({
  host,
  speakers,
  usersRaisingHand,
  viewers,
}: {
  host: IParticipant;
  speakers: IParticipant[];
  usersRaisingHand: IParticipant[];
  viewers: IParticipant[];
}) => [
  {
    title: 'Host',
    data: [
      {
        list: [host!],
        kind: 'streamer',
      },
    ],
  },
  {
    title: 'Raising hands',
    data: [
      {
        list: usersRaisingHand,

        kind: 'raised_hands',
      },
    ],
  },
  {
    title: 'Streamers',
    data: [
      {
        list: speakers,
        kind: 'speakers',
      },
    ],
  },
  {
    title: 'Viewers',
    data: [{list: viewers, kind: 'viewers'}],
  },
];

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
  },
  modal: {
    height: '70%',
  },
  horizontalPadding: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    marginBottom: 20,
  },
  handler: {
    position: 'absolute',
    alignSelf: 'center',
    width: 50,
    height: 5,
    top: 10,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  hostReassignMessage: {
    textAlign: 'center',
  },
});
