import {Participant} from '@app/models';
import React, {useMemo, useState} from 'react';
import {SectionList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
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
    <Modal
      removeClippedSubviews={false}
      propagateSwipe={true}
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
        <View style={styles.handler} />

        <Text
          color="dark"
          weight="bold"
          style={[styles.title, styles.horizontalPadding]}>
          {title}
        </Text>
        <SectionList
          style={[styles.list, styles.horizontalPadding]}
          sections={data}
          onScroll={e => {
            setScrollOffset(e.nativeEvent.contentOffset.y);
          }}
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
      </View>
    </Modal>
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
  wrapper: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 40,
  },
  horizontalPadding: {
    paddingHorizontal: 30,
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
    width: 80,
    height: 8,
    top: 10,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
});
