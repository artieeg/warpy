import {useAPIStore} from '@app/stores/useAPIStore';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {GivenReaction, IGivenReaction} from './GivenReaction';

interface IReactionCanvasProps {
  reaction: string;
  stream: string;
}

export const ReactionCanvas = (props: IReactionCanvasProps) => {
  const {reaction, stream} = props;
  const {api} = useAPIStore();

  const [reactions, setReactions] = useState<IGivenReaction[]>([]);

  useEffect(() => {
    setInterval(() => {
      //const date = Date.now();
      setReactions([]);
      //      setReactions(prev => prev.filter(item => date - item.timestamp < 2000));
    }, 10000);
  }, []);

  const onTouchStart = useCallback(
    ({nativeEvent}: any) => {
      const maxAngle = 50;

      api.stream.react(stream, reaction);
      setReactions(prev => [
        ...prev,
        {
          x: nativeEvent.pageX,
          y: nativeEvent.pageY,
          key: nativeEvent.pageX + nativeEvent.pageY,
          timestamp: Date.now(),
          rotate: (Math.random() * maxAngle - maxAngle / 2).toString() + 'deg',
          reaction,
        },
      ]);
    },
    [reaction, api, stream],
  );

  return (
    <View onTouchStart={onTouchStart} style={styles.wrapper}>
      {reactions.map(item => (
        <GivenReaction {...item} key={item.key} />
      ))}
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3030ff10',
  },
});
