import {useStoreShallow} from '@app/store';
import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import FastImage from 'react-native-fast-image';

interface UserAwardsPreviewProps extends ViewProps {
  user: string;
}

//const AWARDS_TO_DISPLAY = 5;

export const UserAwardsPreview = ({user, style}: UserAwardsPreviewProps) => {
  const [awards, dispatchFetchReceivedAwards] = useStoreShallow(state => [
    state.awards[user],
    state.dispatchFetchReceivedAwards,
  ]);

  useEffect(() => {
    dispatchFetchReceivedAwards(user);
  }, []);

  const lastFiveAwards = useMemo(() => awards?.slice(0, 5), [awards]);

  return (
    <View style={[styles.row, style]}>
      {lastFiveAwards &&
        lastFiveAwards.map(award => (
          <FastImage
            key={award.id}
            source={{uri: award.award.media}}
            style={styles.item}
          />
        ))}

      {/*issue #156*/}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  item: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
});
