import {useStore} from '@warpy/store';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {Reaction} from './Reaction';
import {Item, List} from 'linked-list';

interface IReaction {
  reaction: string;
  key: number;
}

class CReaction extends Item implements IReaction {
  reaction!: string;
  key!: number;

  constructor(props: IReaction) {
    super();

    Object.assign(this, props);
  }
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
          toValue: -130,
          duration: translateDuration,
          useNativeDriver: true,
        }),
        Animated.timing(translateX.current, {
          toValue: Math.random() * 60 - 30,
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
        <Reaction size={25} code={props.reaction} />
      </Animated.View>
    </View>
  );
});

interface IReactionEmitterProps {
  disabled?: boolean;
}

export const ReactionEmitter = (props: IReactionEmitterProps) => {
  const {disabled} = props;

  const api = useStore.use.api();

  const [rerender, setRerender] = useState(false);

  const reactions = useRef(new List());

  useEffect(() => {
    if (disabled) {
      return;
    }

    const unsub = api.stream.onReactionsUpdate(data => {
      data.reactions.forEach(reaction =>
        reactions.current.prepend(
          new CReaction({
            reaction: reaction.emoji,
            key: Math.random(),
          }),
        ),
      );
      setRerender(prev => !prev);
    });

    const interval = setInterval(() => {
      reactions.current = new List();
      setRerender(prev => !prev);
    }, 20000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [api, disabled]);

  const renderReactions = useCallback(() => {
    const components = [];

    for (const reaction of reactions.current) {
      components.push(
        <EmittedReaction reaction={reaction.reaction} key={reaction.key} />,
      );
    }

    return components;
  }, [rerender]);

  return <View style={styles.wrapper}>{renderReactions()}</View>;
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
