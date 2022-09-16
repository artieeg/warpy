import {LoadingOverlay, LoadingOverlayMode} from '@app/components';
import {useAppSetUp} from '@app/hooks';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

export const Splash = () => {
  const action = useAppSetUp();

  const [overlayMode, setOverlayMode] = useState<LoadingOverlayMode>('splash');
  const [enabled, setEnabled] = useState(true);

  const navigator = useNavigation();

  useEffect(() => {
    if (action) {
      setTimeout(() => {
        if (action === 'nav-feed') {
          setEnabled(false);

          setTimeout(() => {
            (navigator as any).replace(
              action === 'nav-feed' ? 'Feed' : 'SignUpName',
            );
          }, 100);
        } else if (action === 'nav-signup') {
          setOverlayMode('signup');
        }
      }, 1000);
    }
  }, [action]);

  return (
    <View style={styles.screen}>
      <LoadingOverlay enabled={enabled} mode={overlayMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#000',
    flex: 1,
  },
});
