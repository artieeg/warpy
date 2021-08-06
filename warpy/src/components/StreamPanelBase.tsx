import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {Speakers} from './Speakers';
import {Participant} from '@app/models';
import {Text} from './Text';

export interface IStreamPanelBase {
  title: string;
  visible: boolean;
  speakers: Participant[];
}

interface IStreamPanelBaseProps extends IStreamPanelBase {
  children: React.ReactChild[];
}

export const StreamPanelBase = (props: IStreamPanelBaseProps) => {
  const {title, visible, speakers, children} = props;

  const opacity = useRef(new Animated.Value(1));
  const scale = useRef(new Animated.Value(1));

  const animatedStyle = {
    opacity: opacity.current,
    transform: [
      {
        scale: scale.current,
      },
    ],
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity.current, {
        useNativeDriver: true,
        toValue: visible ? 1 : 0.0,
        duration: 300,
      }),
      Animated.timing(scale.current, {
        useNativeDriver: true,
        toValue: visible ? 1 : 0.9,
        duration: 300,
      }),
    ]).start();
    //opacity.value = visible ? 1 : 0.0;
    //scale.value = visible ? 1 : 0.9;
  }, [visible]);

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
          {children[0]}
          {children[1]}
        </View>
        <View style={styles.buttonRow}>
          {children[2]}
          {children[3]}
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
