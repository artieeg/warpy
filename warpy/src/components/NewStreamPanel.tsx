import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {HostNewStreamButton} from './HostNewStreamButton';
import {InviteButton} from './InviteButton';
import {SwitchCameraButton} from './SwitchCameraButton';
import {ToggleCameraButton} from './ToggleCameraButton';
import {ToggleMicButton} from './ToggleMicButton';

export const useNewStreamPanelController = () => {
  const gradientHeightStyle = {height: useWindowDimensions().height / 3.4};

  return {
    gradientHeightStyle,
  };
};

export const NewStreamPanel = () => {
  const {gradientHeightStyle} = useNewStreamPanelController();

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        pointerEvents="none"
        style={[styles.gradientBottom, gradientHeightStyle]}
        start={{x: 0, y: 0.8}}
        end={{x: 0, y: 0}}
        colors={['#050505fa', '#05050500']}
      />

      <LinearGradient
        pointerEvents="none"
        style={[styles.gradientTop, gradientHeightStyle]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.8}}
        colors={['#050505fa', '#05050500']}
      />

      <View pointerEvents="box-none" style={styles.bottomButtons}>
        <ToggleCameraButton />
        <ToggleMicButton />
        <HostNewStreamButton />
        <SwitchCameraButton />
        <InviteButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
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
});
