import {RemoteStream} from '@app/components';
import {useDispatcher, useStore} from '@app/store';
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

export const Stream = (props: any) => {
  const {route} = props;
  const {stream} = route.params;
  const dispatch = useDispatcher();

  useEffect(() => {
    useStore.setState({
      title: stream.title,
      stream: stream.id,
    });

    return () => {
      //close streams
      dispatch(({media}) => media.close());

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
