import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {useSpeakingRequests} from '../useSpeakingRequests';
import {
  ProvidedWebSocket,
  WebSocketContext,
} from '@app/components/WebSocketContext';
import {createParticipantFixture} from '@app/__fixtures__/user';
import {useWebSocketHandler} from '../useWebSocketHandler';

jest.mock('@app/ws');

describe('useStreamRequests hook', () => {
  const context = new ProvidedWebSocket();

  const wrapper = ({children}: any) => {
    useWebSocketHandler(context);

    return (
      <WebSocketContext.Provider value={context}>
        {children}
      </WebSocketContext.Provider>
    );
  };

  it('adds new speaking requests', () => {
    const hook = renderHook(() => useSpeakingRequests(), {wrapper});

    const viewer = createParticipantFixture({isRaisingHand: true});

    act(() => {
      context.observer.emit('raise-hand', {
        viewer,
      });
    });

    expect(hook.result.current).toEqual([viewer]);
  });

  it('removes users from the list once they become speakers', () => {
    const hook = renderHook(() => useSpeakingRequests(), {wrapper});
    const raisedHands = [
      createParticipantFixture({id: 'speaker'}),
      createParticipantFixture(),
      createParticipantFixture(),
      createParticipantFixture(),
    ];

    const newSpeaker = createParticipantFixture({
      id: 'speaker',
      role: 'speaker',
    });

    act(() => {
      context.observer.emit('room-info', {
        raisedHands,
        speakers: [],
      });
    });

    act(() => {
      context.observer.emit('new-speaker', {
        speaker: newSpeaker,
      });
    });

    expect(hook.result.current.find(user => user.id === 'speaker')).toBeFalsy();
  });

  it.todo('removes users if their speaking requests were denied');

  it('gets speaking requests on join', async () => {
    const hook = renderHook(() => useSpeakingRequests(), {wrapper});
    const raisedHands = [
      createParticipantFixture({isRaisingHand: true}),
      createParticipantFixture({isRaisingHand: true}),
      createParticipantFixture({isRaisingHand: true}),
      createParticipantFixture({isRaisingHand: true}),
    ];

    act(() => {
      context.observer.emit('room-info', {
        raisedHands,
        speakers: [],
      });
    });

    expect(hook.result.current).toEqual(raisedHands);
  });
});
