import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {Reaction} from './Reaction';
import {useWebSocketContext} from './WebSocketContext';

interface IReaction {
  reaction: string;
  key: number;
}

interface IEmittedReactionProps {
  reaction: string;
}

const EmittedReaction = React.memo((props: IEmittedReactionProps) => {
  const scale = useRef(new Animated.Value(0));
  const opacity = useRef(new Animated.Value(0));
  const translateX = useRef(new Animated.Value(0));
  const translateY = useRef(new Animated.Value(0));

  useEffect(() => {
    const translateDuration = 1800 + Math.random() * 400;

    Animated.sequence([
      Animated.delay(Math.random() * 800),
      Animated.parallel([
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scale.current, {
              toValue: 1.4,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity.current, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(scale.current, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity.current, {
            toValue: 0,
            duration: translateDuration * 0.6,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(translateY.current, {
          toValue: -200,
          duration: translateDuration,
          useNativeDriver: true,
        }),
        Animated.timing(translateX.current, {
          toValue: Math.random() * 90 - 45,
          duration: translateDuration / 1.3,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const style = {
    transform: [
      {translateX: translateX.current},
      {translateY: translateY.current},
      {scale: scale.current},
    ],
    opacity: opacity.current,
  };

  return (
    <View style={{position: 'absolute', bottom: 0}}>
      <Animated.View style={style}>
        <Reaction code={props.reaction} />
      </Animated.View>
    </View>
  );
});

export const ReactionEmitter = () => {
  const ws = useWebSocketContext();

  const [reactions, setReactions] = useState<IReaction[]>([]);

  useEffect(() => {
    const unsub = ws.stream.onReactionsUpdate(data => {
      setReactions(prev => [
        ...prev,
        ...data.reactions.map(reaction => ({
          reaction: reaction.emoji,
          key: Math.random(),
        })),
      ]);
    });

    const interval = setInterval(() => {
      setReactions(prev => prev.slice(10));
    }, 5000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [ws]);

  return (
    <View style={styles.wrapper}>
      {reactions.map(reaction => (
        <EmittedReaction reaction={reaction.reaction} key={reaction.key} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    bottom: 60,
    width: 30,
    height: 5,
  },
});
