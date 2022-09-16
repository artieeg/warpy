import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {IconButton} from './IconButton';
import {useDispatcher, useStore} from '@app/store';
import {colors} from '@app/theme';

export const HostNewStreamButton = () => {
  const isStarting = useStore(state => state.isStartingNewStream);

  const dispatch = useDispatcher();

  if (isStarting) {
    return (
      <View style={styles.button}>
        <ActivityIndicator size="small" color={colors.black} />
      </View>
    );
  } else {
    return (
      <IconButton
        name="plus"
        size={24}
        style={styles.button}
        onPress={() => dispatch(({stream}) => stream.create())}
      />
    );
  }
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
