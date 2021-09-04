import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {Speakers} from './Speakers';
import {Participant} from '@app/models';
import {ToggleControls} from './ToggleControls';
import {PanelButtonsHolder} from './PanelButtonsHolder';
import {ReactionEmitter} from './ReactionEmitter';

export interface IStreamPanelBase {
  visible: boolean;
  speakers: Participant[];
}

interface IStreamPanelBaseProps extends IStreamPanelBase {
  children: React.ReactChild[];
}

export const StreamPanelBase = (props: IStreamPanelBaseProps) => {
  const {visible, speakers, children} = props;

  const [showPanelItems, setShowPanelItems] = useState(true);

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
  }, [visible]);

  return (
    <Animated.View style={[styles.bottom, animatedStyle]}>
      <PanelButtonsHolder
        hideDirection="left"
        visible={showPanelItems}
        style={styles.participants}>
        <ReactionEmitter />
        <Speakers speakers={speakers} style={styles.speakers} />
        {children[2]}
      </PanelButtonsHolder>
      <View style={styles.buttons}>
        <PanelButtonsHolder hideDirection="bottom" visible={showPanelItems}>
          {children[0]}
          <View style={styles.space} />
          {children[1]}
          <View style={styles.space} />
        </PanelButtonsHolder>
        <ToggleControls
          show={showPanelItems}
          onPress={() => setShowPanelItems(prev => !prev)}
        />
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
  participants: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
    flexDirection: 'row',
  },
  title: {flex: 1},
  space: {
    height: 10,
  },
});
