import {ScreenHeader, textStyles} from '@app/components';
import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {Text, TextButton} from '@warpy/components';
import {useStore, useStoreShallow} from '@app/store';
import {useNavigation, useRoute} from '@react-navigation/native';

export const useInviteCodeInputController = () => {
  const screenMode = (useRoute().params as any)?.mode;

  const navigation = useNavigation();

  const [code, setCode] = useState('');
  const [api, dispatchToastMessage] = useStoreShallow(state => [
    state.api,
    state.dispatchToastMessage,
  ]);

  const set = useStore.use.set();

  const onSubmit = useCallback(async () => {
    const {status} = await api.app_invite.apply(code);

    if (status !== 'ok') {
      dispatchToastMessage(
        'please check if this invite code is correct',
        'LONG',
      );

      return;
    }

    if (screenMode === 'settings') {
      dispatchToastMessage(
        "you've applied the invite and received 3000 coins! yay",
        'LONG',
      );

      navigation.goBack();
    } else {
      dispatchToastMessage('invite activated');

      navigation.navigate('Loading');
    }

    set({
      hasActivatedAppInvite: true,
    });
  }, [code, api, navigation]);

  return {
    onSubmit,
    setCode,
    screenMode,
    mode: screenMode === 'signup' && code.length === 0 ? 'skip' : 'apply',
    disabled: screenMode === 'signup' ? false : code.length === 0,
  };
};

export const InviteCodeInput = () => {
  const {setCode, onSubmit, mode, disabled, screenMode} =
    useInviteCodeInputController();

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <View style={styles.content}>
        {screenMode === 'signup' && (
          <Text size="small" color="info">
            can be later added{'\n'}in the settings later
          </Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={setCode}
            placeholderTextColor={textStyles.info.color}
            style={styles.input}
            placeholder="your invite code"
          />
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <TextButton
          disabled={disabled}
          textonly={mode === 'skip'}
          title={mode === 'skip' ? 'skip' : 'apply'}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
    marginBottom: 100,
  },
  input: {
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    ...textStyles.medium,
    ...textStyles.bold,
    ...textStyles.info,
    color: '#ffffff',
  },
  buttonWrapper: {
    padding: 20,
  },
});
