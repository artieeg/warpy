import {Participant} from '@app/models';
import React, {useMemo, useState} from 'react';
import {SectionList, StyleSheet, TouchableOpacity, View} from 'react-native';
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
}

export const ParticipantsModal = (props: IParticipanModalProps) => {
  const {visible, onFetchMore, onHide, title, viewers, speakers, raisingHands} =
    props;

  const streamer = useMemo(
    () => speakers.find(speaker => speaker.role === 'streamer'),
    [speakers],
  );

  const data = [
    {
      title: 'Stream by',
      data: [streamer!],
    },
    {
      title: 'Raising hands',
      data: raisingHands,
    },
    {
      title: 'Speakers',
      data: speakers,
    },
    {
      title: 'Viewers',
      data: viewers,
    },
  ];

  return (
    <BaseSlideModal {...props} style={styles.modal}>
      <SectionList
        style={[styles.list, styles.horizontalPadding]}
        sections={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity>
            <ParticipantDisplay data={item} />
          </TouchableOpacity>
        )}
        onEndReached={onFetchMore}
        renderSectionHeader={({section}) => (
          <TouchableOpacity>
            <Text size="small" color="dark" style={styles.sectionHeader}>
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
  list: {
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  modal: {
    height: '70%',
  },
  horizontalPadding: {
    paddingHorizontal: 40,
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
