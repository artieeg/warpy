import React, {useEffect, useMemo, useState} from 'react';
import {useStoreShallow} from '@app/store';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import FadeInOut from 'react-native-fade-in-out';
import FastImage from 'react-native-fast-image';
import {Text} from './Text';

export const AwardDisplay = () => {
  const [queue, current, next] = useStoreShallow(state => [
    state.awardDisplayQueue,
    state.awardDisplayCurrent,
    state.dispatchAwardDisplayQueueNext,
  ]);

  const award = useMemo(() => queue[current], [queue, current]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!award) {
      return;
    }

    setVisible(true);

    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        next();
      }, 1100);
    }, 8000);
  }, [award]);

  const {height} = useWindowDimensions();

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <FadeInOut duration={1000} visible={visible}>
        {award && (
          <View
            style={[
              styles.awardContainer,
              {
                top: height * 0.3,
              },
            ]}>
            <FastImage
              style={styles.awardMedia}
              source={{uri: award.award.media}}
            />
            <Text style={{textAlign: 'center'}}>
              <Text color="yellow">@{award.sender.username}</Text> sent{' '}
              <Text color="yellow">@{award.award.title}</Text> award to{' '}
              <Text color="yellow">@{award.recipent.username}</Text>
            </Text>
            {award.message.length > 0 && <Text italic>{award.message}</Text>}
          </View>
        )}
      </FadeInOut>
    </View>
  );
};

const styles = StyleSheet.create({
  awardMedia: {
    height: 100,
    width: 100,
  },
  awardContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 128,
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
  },
});
