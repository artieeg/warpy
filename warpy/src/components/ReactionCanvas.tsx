import {useStore} from '@warpy/store';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {GivenReaction, CGivenReaction} from './GivenReaction';
import {List} from 'linked-list';

export const ReactionCanvas = () => {
  const reaction = useStore.use.reaction();
  const stream = useStore.use.stream();
  const api = useStore.use.api();

  const reactions = useRef(new List());
  const [rerender, setRerender] = useState(true);

  useEffect(() => {
    setInterval(() => {
      reactions.current = new List();
      setRerender(prev => !prev);
    }, 10000);
  }, []);

  const onTouchStart = useCallback(
    ({nativeEvent}: any) => {
      const maxAngle = 50;

      if (!stream) {
        return;
      }

      api.stream.react(stream, reaction);
      reactions.current.append(
        new CGivenReaction({
          x: nativeEvent.pageX,
          y: nativeEvent.pageY,
          key: nativeEvent.pageX + nativeEvent.pageY,
          timestamp: Date.now(),
          rotate: (Math.random() * maxAngle - maxAngle / 2).toString() + 'deg',
          reaction,
        }),
      );
      setRerender(prev => !prev);
    },
    [reaction, api, stream],
  );

  const renderReactions = () => {
    const components = [];

    for (const item of reactions.current) {
      components.push(<GivenReaction {...item} key={item.key} />);
    }

    return components;
  };

  return (
    <View onTouchStart={onTouchStart} style={styles.wrapper}>
      {renderReactions()}
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
    backgroundColor: 'transparent',
  },
});
