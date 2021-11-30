import React, {useEffect, useRef, useState} from 'react';
import {Text, textStyles} from './Text';
import {View, StyleSheet, TextInput} from 'react-native';
import {IUser, IUserUpdateResponse} from '@warpy/lib';
import {useStore} from '@warpy/store';
import shallow from 'zustand/shallow';
import {useDebounce} from 'use-debounce/lib';
import FadeInOut from 'react-native-fade-in-out';
import useAsyncEffect from 'use-async-effect';
import {Icon} from './Icon';

interface SettingsTextEditProps {
  placeholder: string;
  field: keyof IUser;
}

export const SettingsTextEdit = (props: SettingsTextEditProps) => {
  const [user, api, dispatchToastMessage] = useStore(
    store => [store.user as IUser, store.api, store.dispatchToastMessage],
    shallow,
  );

  const [value, setValue] = useState(user[props.field] || '');
  const [debouncedValue] = useDebounce(value, 2000);
  const [response, setResponse] = useState<IUserUpdateResponse>();

  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const mounted = useRef(false);

  useAsyncEffect(async () => {
    if (!mounted.current) {
      mounted.current = true;

      return;
    }

    setResponse(undefined);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    const response = await api.user.update(props.field, debouncedValue);

    setResponse(response);

    if (response.status === 'ok') {
      dispatchToastMessage('field updated successfully', 'LONG');
    } else {
      dispatchToastMessage('error while updating: ' + response.message, 'LONG');
    }
  }, [debouncedValue, api]);

  useEffect(() => {
    if (response?.status === 'ok') {
      timeout.current = setTimeout(() => {
        setResponse(undefined);
      }, 2000);
    }
  }, [response]);

  return (
    <View>
      <Text color="info" size="small">
        {props.placeholder}
      </Text>
      <View style={styles.row}>
        <TextInput
          onChangeText={v => setValue(v)}
          style={[
            textStyles.bold,
            textStyles.medium,
            response?.status === 'error' ? textStyles.alert : textStyles.bright,
          ]}
          defaultValue={value}
          placeholder={`enter ${props.field}`}
        />

        <FadeInOut duration={400} visible={!!response}>
          <Icon
            name="check"
            color="#000"
            style={[
              styles.result,
              response?.status === 'ok' && styles.check,
              response?.status === 'error' && styles.fail,
            ]}
            size={20}
          />
        </FadeInOut>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  result: {
    borderRadius: 30,
    padding: 5,
  },
  fail: {
    backgroundColor: textStyles.alert.color,
  },
  check: {
    backgroundColor: textStyles.bright.color,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
