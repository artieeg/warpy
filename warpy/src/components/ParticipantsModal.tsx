import {Participant} from '@app/models';
import React, {useMemo, useState} from 'react';
import {
  FlatList,
  SectionList,
  SectionListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {BaseSlideModal} from './BaseSlideModal';
import {ParticipantDisplay} from './Participant';
import {Text} from './Text';

interface IParticipanModalProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  speakers: Participant[];
  viewers: Participant[];
  raisingHands: Participant[];
  onFetchMore: () => void;
  onSelectParticipant: (id: string) => any;
}

export const ParticipantsModal = (props: IParticipanModalProps) => {
  const {
    visible,
    onSelectParticipant,
    onFetchMore,
    onHide,
    title,
    viewers,
    speakers,
    raisingHands,
  } = props;

  const streamer = useMemo(
    () => speakers.find(speaker => speaker.role === 'streamer'),
    [speakers],
  );

  const data = [
    {
      title: 'Stream by',
      data: [{list: [streamer!]}],
      kind: 'streamer',
    },
    {
      title: 'Raising hands',
      data: [{list: raisingHands}],
      kind: 'raised_hands',
    },
    {
      title: 'Speakers',
      data: [
        {
          list: speakers,
        },
      ],
      kind: 'speakers',
    },
    {
      title: 'Viewers',
      data: [{list: viewers}],
      kind: 'viewers',
    },
  ];

  return (
    <BaseSlideModal {...props} style={styles.modal}>
      <SectionList
        style={styles.horizontalPadding}
        sections={data}
        keyExtractor={item => item.id}
        renderItem={({item, section}) => {
          const {kind} = section;

          if (kind === 'streamer') {
            return (
              <View
                style={{width: 100, height: 100, backgroundColor: '#ff3030'}}
              />
            );
          }

          if (kind === 'raised_hands') {
            return (
              <View
                style={{width: 100, height: 100, backgroundColor: '#30ff30'}}
              />
            );
          }

          if (kind === 'speakers' || kind === 'viewers') {
            return (
              <FlatList
                data={item.list}
                numColumns={4}
                renderItem={({item: flatListItem}) => (
                  <TouchableOpacity
                    onPress={() => {
                      onSelectParticipant(flatListItem.id);
                    }}>
                    <ParticipantDisplay data={flatListItem} />
                  </TouchableOpacity>
                )}
              />
            );
          }
        }}
        onEndReached={onFetchMore}
        renderSectionHeader={({section}) => (
          <TouchableOpacity>
            <Text
              size="small"
              color="info"
              weight="bold"
              style={styles.sectionHeader}>
              {section.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </BaseSlideModal>
  );
};

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
