import {ScreenHeader, textStyles} from '@app/components';
import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {Text, TextButton} from '@warpy/components';

export const InviteCodeInput = () => {
  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <View style={styles.content}>
        <Text size="small" color="info">
          can be later added{'\n'}in the settings later
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={textStyles.info.color}
            style={styles.input}
            placeholder="your invite code"
          />
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <TextButton title="skip" />
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
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
