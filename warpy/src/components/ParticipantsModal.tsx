import {Participant} from '@app/models';
import React, {useMemo, useState} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {ParticipantDisplay} from './Participant';
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
  const [scrollOffset, setScrollOffset] = useState(0);

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
      scrollOffset={scrollOffset}
      propagateSwipe
      onSwipeComplete={() => {
        onHide();
      }}
      swipeDirection={['down']}
      swipeThreshold={100}
      animationIn="slideInUp"
      animationOut="slideInDown"
      hasBackdrop={false}
      style={styles.modalStyle}
      isVisible={visible}>
      <View style={styles.wrapper}>
        <Text style={styles.title} weight="bold" size="large">
          {title}
        </Text>
        <SectionList
          sections={data}
          onScroll={e => {
            setScrollOffset(e.nativeEvent.contentOffset.y);
          }}
          keyExtractor={item => item.id}
          renderItem={({item}) => <ParticipantDisplay data={item} />}
          onEndReached={onFetchMore}
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
    marginTop: 20,
  },
  title: {
    marginBottom: 20,
  },
});
