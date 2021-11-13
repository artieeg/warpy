import React, {useEffect, useState} from 'react';
import {Text, textStyles} from './Text';
import {View, TextInput} from 'react-native';
import {IUser} from '@warpy/lib';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';
import {useDebounce} from 'use-debounce/lib';
import useAsyncEffect from 'use-async-effect/types';

interface SettingsTextEditProps {
  placeholder: string;
  field: keyof IUser;
}

export const SettingsTextEdit = (props: SettingsTextEditProps) => {
  const [user, api] = useStore(
    store => [store.user as IUser, store.api],
    shallow,
  );

  const [value, setValue] = useState(user[props.field] || '0');
  const [debouncedValue] = useDebounce(value, 400);
  const [error, setError] = useState<string>();

  useAsyncEffect(async () => {
    setError(undefined);

    const {status, message} = await api.user.update(
      props.field,
      debouncedValue,
    );

    if (status === 'error') {
      setError(message);
    }
  }, [debouncedValue, api]);

  return (
    <View>
      <Text color="info" size="small">
        {props.placeholder}
      </Text>
      <TextInput
        onChangeText={setValue}
        style={[
          textStyles.bold,
          textStyles.medium,
          error ? textStyles.alert : textStyles.bright,
        ]}
        defaultValue={value}
        placeholder={`enter ${props.field}`}
      />
    </View>
  );
};
