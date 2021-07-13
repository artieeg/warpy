import {useAppUser} from '@app/hooks';
import {createStream, onWebSocketEvent} from '@app/services';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Button} from 'react-native';

export const NewStream = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [user] = useAppUser();

  const [streamId, setStreamId] = useState<string>();

  useEffect(() => {
    onWebSocketEvent('created-room', (data: any) => {
      console.log('craeted room data', data);
    });
  }, []);

  const onStart = useCallback(async () => {
    const streamId = await createStream(title, hub);

    console.log('Created stream', streamId);

    setStreamId(streamId);
  }, [title, hub]);

  return (
    <View>
      <View />
      <Button onPress={onStart} title="Start" />
    </View>
  );
};
