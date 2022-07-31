import {LoadingOverlay} from '@app/components';
import {useAppSetUp} from '@app/hooks';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

export const Splash = () => {
  const action = useAppSetUp();

  const [enabled, setEnabled] = useState(true);

  const navigator = useNavigation();

  useEffect(() => {
    if (!!action) {
      setTimeout(() => {
        setEnabled(false);

        setTimeout(() => {
          navigator.navigate(action === 'nav-feed' ? 'Feed' : 'SignUpName');
        }, 300);
      }, 300);
    }
  }, [action]);

  return (
    <View style={styles.screen}>
      <LoadingOverlay enabled={enabled} mode="splash" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#000',
  },
});
