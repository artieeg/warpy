import React, {createContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';

enum DURATION {
  LONG,
  SHORT,
}

type ToastMessage = {
  duration: DURATION;
  text: string;
};

interface IToastContext {
  show: (message: ToastMessage) => void;
}

const ToastContext = createContext<IToastContext | null>(null);

export const ToastProvider = (props: any) => {
  const [message, setMessage] = useState<ToastMessage>();

  return (
    <>
      <ToastContext.Provider
        {...props}
        value={{
          show(message) {
            setMessage(message);
          },
        }}
      />

      <View style={styles.toast}>
        <Text size="xsmall" color="dark" weight="bold">
          asldfhakldsjf askjdfh laskdf
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
