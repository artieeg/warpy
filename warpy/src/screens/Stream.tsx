import {RemoteStream} from '@app/components';
import {useStore} from '@app/store';
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

export const Stream = (props: any) => {
  const {route} = props;
  const {stream} = route.params;

  useEffect(() => {
    useStore.setState({
      title: stream.title,
      stream: stream.id,
    });

    return () => {
      //close streams
      useStore.getState().dispatchMediaClose();

      //clear stream data
      useStore.setState({
        title: null,
        stream: null,
      });
    };
  }, []);

  //TODO: create remote stream slice, store title, id, etc. use in modals

  return (
    <View style={styles.wrapper}>
      <RemoteStream stream={stream} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
