import React, {useEffect, useRef, useState} from 'react';
import {Text, textStyles} from './Text';
import {View, StyleSheet, TextInput} from 'react-native';
import {User, UserUpdateResponse} from '@warpy/lib';
import {useDispatcher, useStore} from '@app/store';
import shallow from 'zustand/shallow';
import {useDebounce} from 'use-debounce/lib';
import FadeInOut from 'react-native-fade-in-out';
import useAsyncEffect from 'use-async-effect';
import {Icon} from './Icon';
import {colors} from '../../colors';

interface SettingsTextEditProps {
  placeholder: string;
  multiline?: boolean;
  field: keyof User;
}

export const SettingsTextEdit = (props: SettingsTextEditProps) => {
  const dispatch = useDispatcher();

  const [user, api] = useStore(
    store => [store.user as User, store.api],
    shallow,
  );

  const [value, setValue] = useState(user[props.field] || '');
  const [debouncedValue] = useDebounce(value, 2000);
  const [response, setResponse] = useState<UserUpdateResponse>();

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

    const response = await api.user.update(
      props.field,
      debouncedValue as string,
    );

    setResponse(response);

    if (response.status === 'ok') {
      dispatch(({toast}) =>
        toast.showToastMessage('field updated successfully', 'LONG'),
      );
    } else {
      dispatch(({toast}) =>
        toast.showToastMessage(
          'error while updating: ' + response.message,
          'LONG',
        ),
      );
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
    <View style={styles.wrapper}>
      <Text color="boulder" size="small">
        {props.placeholder}
      </Text>
      <View style={styles.row}>
        <TextInput
          multiline={props.multiline}
          onChangeText={v => setValue(v)}
          style={[
            styles.input,
            textStyles.bold,
            textStyles.small,
            {color: response?.status === 'error' ? colors.red : colors.green},
            {fontWeight: '300'},
          ]}
          defaultValue={value as string}
          placeholder={`enter ${props.field}`}
          placeholderTextColor={colors.boulder}
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
    backgroundColor: colors.red,
  },
  check: {
    backgroundColor: colors.green,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    padding: 0,
    flex: 1,
    //fontWeight: 'bold',
    justifyContent: 'flex-start',
  },
  wrapper: {
    marginBottom: 20,
  },
});
