import {Participant} from '@app/models';
import React, {useEffect, useMemo} from 'react';
import {Alert, SectionList, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {Avatar} from './Avatar';
import {Text} from './Text';

interface IParticipanModalProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  speakers: Participant[];
  viewers: Participant[];
  onFetchMore: () => void;
}

export const ParticipantsModal = (props: IParticipanModalProps) => {
  const {visible, onFetchMore, onHide, title, viewers, speakers} = props;

  console.log('refresh speakers', speakers, Date.now());

  const streamer = useMemo(
    () => speakers.find(speaker => speaker.role === 'streamer'),
    [speakers],
  );

  const data = [
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
    <Modal
      swipeDirection={['down']}
      swipeThreshold={0.3}
      animationIn="slideInUp"
      animationOut="slideInDown"
      onSwipeComplete={() => {
        onHide();
      }}
      hasBackdrop={false}
      style={styles.modalStyle}
      isVisible={visible}>
      <View style={styles.wrapper}>
        <Text style={styles.title} weight="bold" size="large">
          {title}
        </Text>
        <Text weight="bold">Stream by</Text>
        {streamer && <Avatar user={streamer} />}
        <SectionList
          sections={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => <Avatar user={item} />}
          renderSectionHeader={({section}) => (
            <Text weight="bold" style={styles.sectionHeader}>
              {section.title}
            </Text>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  wrapper: {
    backgroundColor: '#011A287A',
    height: '70%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  title: {
    marginBottom: 20,
  },
});
