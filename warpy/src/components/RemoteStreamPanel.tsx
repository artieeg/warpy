import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Speakers} from './Speakers';
import {ClapButton} from './ClapsButton';
import {WarpButton} from './WarpButton';
import {RaiseHandButton} from './RaiseHandButton';
import {ShowParticipantsButton} from './ShowParticipantsButton';
import {Participant} from '@app/models';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Text} from './Text';

interface IRemoteStreamPanel {
  title: string;
  visible: boolean;
  speakers: Participant[];
  participantsCount: number;
  onRaiseHand: () => any;
  onOpenParticipantsList: () => any;
}

export const RemoteStreamPanel = (props: IRemoteStreamPanel) => {
  const {
    title,
    visible,
    speakers,
    participantsCount,
    onRaiseHand,
    onOpenParticipantsList,
  } = props;

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 100,
      }),
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 100,
          }),
        },
      ],
    };
  });

  useEffect(() => {
    opacity.value = visible ? 1 : 0.0;
    scale.value = visible ? 1 : 0.9;
  }, [visible, opacity, scale]);

  return (
    <Animated.View style={[styles.bottom, animatedStyle]}>
      <View style={styles.speakersAndTitle}>
        <Text style={styles.title} size="large" weight="bold">
          {title}
        </Text>
        <View>
          <Speakers speakers={speakers} style={styles.speakers} />
        </View>
      </View>
      <View style={styles.buttons}>
        <View style={[styles.buttonRow, styles.upperButtonRow]}>
          <WarpButton style={styles.spaceRight} />
          <ClapButton />
        </View>
        <View style={styles.buttonRow}>
          <ShowParticipantsButton
            style={styles.spaceRight}
            count={participantsCount}
            onOpenParticipantsList={onOpenParticipantsList}
          />
          <RaiseHandButton onPress={onRaiseHand} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  speakersAndTitle: {
    flex: 1,
  },
  title: {flex: 1},
});
