import React from 'react';
import {View, StyleSheet} from 'react-native';

interface IStreamPreviewProps {
  style: any;
}

export const StreamPreview = (props: IStreamPreviewProps) => {
  const {style} = props;

  return (
    <View style={[styles.wrapper, style]}>
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ACC3FD',
    flex: 1,
    margin: 10,
    borderRadius: 30,
  },
});
