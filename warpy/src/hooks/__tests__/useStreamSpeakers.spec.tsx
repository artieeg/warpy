import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {
  ProvidedWebSocket,
  WebSocketContext,
} from '@app/components/WebSocketContext';
import {createParticipantFixture} from '@app/__fixtures__/user';
import {useStreamSpeakers} from '../useStreamSpeakers';

jest.mock('@app/ws');

describe('useStreamSpeakers hook', () => {
  const stream = 'test stream';
  const context = new ProvidedWebSocket();

  const wrapper = ({children}: any) => (
    <WebSocketContext.Provider value={context}>
      {children}
    </WebSocketContext.Provider>
  );

  it('gets speakers from room-info event', () => {
    const hook = renderHook(() => useStreamSpeakers(stream), {wrapper});

    const speakers = [createParticipantFixture({role: 'speaker'})];

    act(() => {
      context.observer.emit('room-info', {
        speakers,
      });
    });

    expect(hook.result.current).toEqual(speakers);
  });

  it('adds new speaker', () => {
    const hook = renderHook(() => useStreamSpeakers(stream), {wrapper});

    const speaker = createParticipantFixture({role: 'speaker'});

    act(() => {
      context.observer.emit('new-speaker', {
        speaker,
      });
    });

    expect(hook.result.current).toEqual([speaker]);
  });

  it.todo('sorts by active speaker');
});
