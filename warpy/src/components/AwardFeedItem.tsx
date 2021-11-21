import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IAward} from '@warpy/lib';
import {Text} from './Text';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

interface AwardFeedItemProps {
  award: IAward;
}

export const AwardFeedItem = ({award}: AwardFeedItemProps) => {
  return (
    <View style={styles.award}>
      <FastImage source={{uri: award.award.media}} style={styles.media} />
      <View style={styles.info}>
        <Text>
          <Text color="yellow">{award.award.title}</Text> award{'\n'}from{' '}
          <Text color="yellow">@{award.sender.username}</Text>
        </Text>
        {award.message.length > 0 && (
          <Text size="small" color="white" italic>
            {award.message}
          </Text>
        )}
        <Text size="small" color="info">
          {moment(award.created_at).format('MMM. Do HH:MM')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  award: {
    flexDirection: 'row',
  },
  info: {
    marginLeft: 10,
  },
  media: {
    height: 80,
    aspectRatio: 1,
  },
});
