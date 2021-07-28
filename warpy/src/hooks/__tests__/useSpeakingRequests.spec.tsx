import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {useSpeakingRequests} from '../useSpeakingRequests';
import {
  ProvidedWebSocket,
  WebSocketContext,
} from '@app/components/WebSocketContext';
import {createParticipantFixture} from '@app/__fixtures__/user';

jest.mock('@app/ws');

describe('useStreamViewers hook', () => {
  const stream = 'test stream';
  const context = new ProvidedWebSocket();

  const wrapper = ({children}: any) => (
    <WebSocketContext.Provider value={context}>
      {children}
    </WebSocketContext.Provider>
  );

  it('adds new speaking requests', () => {
    const hook = renderHook(() => useSpeakingRequests(stream), {wrapper});

    const viewer = createParticipantFixture();

    act(() => {
      context.observer.emit('raise-hand', {
        viewer,
      });
    });

    expect(hook.result.current).toEqual([viewer]);
  });

  it('gets speaking requests on join', () => {
    const hook = renderHook(() => useSpeakingRequests(stream), {wrapper});
    const raisingHands = [
      createParticipantFixture(),
      createParticipantFixture(),
      createParticipantFixture(),
      createParticipantFixture(),
    ];

    act(() => {
      context.observer.emit('room-info', {
        raisingHands,
      });
    });

    expect(hook.result).toEqual(raisingHands);
  });
});
