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
import {InviteUserButton} from './InviteUserButton';
import {useStore} from '@warpy/store';
import {IParticipant} from '@warpy/lib';
import {UserProducer} from './UserProducer';

interface IParticipanModalProps {
  visible: boolean;
  onHide: () => void;
  onSelectParticipant: (id: string) => any;
  onOpenActions: (id: string) => any;
}

export const ParticipantsModal = (props: IParticipanModalProps) => {
  const {onSelectParticipant, onOpenActions} = props;
  const usersRaisingHand = useSpeakingRequests();
  const producers = useStreamProducers();
  const [viewers, onFetchMore] = useStreamViewers();
  const dispatchModalOpen = useStore.use.dispatchModalOpen();

  const streamer = useMemo(
    () => producers.find(speaker => speaker.role === 'streamer'),
    [producers],
  );

  const data = useMemo(
    () =>
      getListData({
        viewers,
        speakers: producers,
        usersRaisingHand,
        streamer: streamer!,
      }),
    [viewers, producers, usersRaisingHand, streamer],
  );

  const columnWidth = (useWindowDimensions().width - 40) / 4;
  const columnWidthStyle = useMemo(() => ({width: columnWidth}), [columnWidth]);

  //TODO: Separate components
  const renderSection = (sectionData: any) => {
    const {item} = sectionData;

    const {kind} = item;

    if (kind === 'streamer') {
      return <StreamerInfo data={item.list[0]} />;
    }

    if (kind === 'raised_hands') {
      return (
        <TouchableWithoutFeedback>
          <FlatList
            data={item.list}
            numColumns={4}
            renderItem={({item: flatListItem}) => (
              <TouchableOpacity
                onLongPress={() => {
                  onOpenActions(flatListItem.id);
                }}
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
                onLongPress={() => {
                  onOpenActions(flatListItem.id);
                }}
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
                onLongPress={() => {
                  onOpenActions(flatListItem.id);
                }}
                onPress={() => {
                  onSelectParticipant(flatListItem.id);
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
                color="info"
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
  streamer,
  speakers,
  usersRaisingHand,
  viewers,
}: {
  streamer: IParticipant;
  speakers: IParticipant[];
  usersRaisingHand: IParticipant[];
  viewers: IParticipant[];
}) => [
  {
    title: 'Host',
    data: [
      {
        list: [streamer!],
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
});
