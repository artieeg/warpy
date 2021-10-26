import {useStore} from '@app/store';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, useWindowDimensions, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AwardButton} from './AwardButton';
import {ChatButton} from './ChatButton';
import {ClapButton} from './ClapsButton';
import {IconButton} from './IconButton';
import {InviteButton} from './InviteButton';
import {RaiseHandButton} from './RaiseHandButton';
import {ReactionCanvas} from './ReactionCanvas';
import {ReactionEmitter} from './ReactionEmitter';
import {ShowParticipantsButton} from './ShowParticipantsButton';
import {Speakers} from './Speakers';
import {StopStream} from './StopStream';
import {SwitchCameraButton} from './SwitchCameraButton';
import {ToggleCameraButton} from './ToggleCameraButton';
import {ToggleMicButton} from './ToggleMicButton';

const EmptyItem = () => <View style={{width: 50, height: 50}} />;

export const StreamOverlay = () => {
  const [isVisible, setVisible] = useState(true);

  const gradientHeightStyle = {height: useWindowDimensions().height / 3.4};
  const role = useStore.use.role();

  const opacity = useRef(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const wrapperAnimatedStyle = {
    opacity: opacity.current,
  };

  const getPanelContent = useCallback(() => {
    if (role === 'streamer') {
      return {
        top: [
          <ClapButton />,
          <InviteButton />,
          <SwitchCameraButton />,
          <AwardButton />,
          <StopStream />,
        ],
        bottom: [
          <ReactionEmitter disabled={false} />,
          <ToggleCameraButton />,
          <ToggleMicButton />,
          <ChatButton />,
          <ShowParticipantsButton style={styles.transparent} />,
          <EmptyItem />,
        ],
      };
    } else if (role === 'speaker') {
      return {
        top: [
          <EmptyItem />,
          <InviteButton />,
          <AwardButton />,
          <StopStream />,
          <EmptyItem />,
        ],
        bottom: [
          <ReactionEmitter disabled={false} />,
          <ClapButton />,
          <ToggleMicButton />,
          <ChatButton />,
          <ShowParticipantsButton style={styles.transparent} />,
          <EmptyItem />,
        ],
      };
    } else {
      return {
        top: [
          <EmptyItem />,
          <InviteButton />,
          <AwardButton />,
          <StopStream />,
          <EmptyItem />,
        ],
        bottom: [
          <ReactionEmitter disabled />,
          <ClapButton />,
          <RaiseHandButton />,
          <ChatButton />,
          <ShowParticipantsButton style={styles.transparent} />,
          <EmptyItem />,
        ],
      };
    }
  }, [role]);

  const {top, bottom} = useMemo(() => getPanelContent(), [getPanelContent]);

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.wrapper, wrapperAnimatedStyle]}>
        <ReactionCanvas />
        <LinearGradient
          style={[styles.gradientBottom, gradientHeightStyle]}
          start={{x: 0, y: 0.8}}
          end={{x: 0, y: 0}}
          colors={['#050505fa', '#05050500']}
        />

        <LinearGradient
          style={[styles.gradientTop, gradientHeightStyle]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 0.8}}
          colors={['#050505fa', '#05050500']}
        />

        <View style={styles.topButtons}>{top.map(item => item)}</View>
        <View style={styles.bottomButtons}>{bottom.map(item => item)}</View>

        <Speakers />
      </Animated.View>
      <IconButton
        style={styles.visibility}
        onPress={() => setVisible(prev => !prev)}
        color="#ffffff"
        name={isVisible ? 'eye-off' : 'eye'}
        size={30}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  visibility: {
    position: 'absolute',
    right: 20,
    bottom: 12,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  topButtons: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
