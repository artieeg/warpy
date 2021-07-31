import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {useStreamViewers} from '../useStreamViewers';
import {
  ProvidedWebSocket,
  WebSocketContext,
} from '@app/components/WebSocketContext';
import {createParticipantFixture} from '@app/__fixtures__/user';
import {useWebSocketHandler} from '../useWebSocketHandler';
import {useParticipantsStore} from '@app/stores';

jest.mock('@app/ws');
const initialStore = useParticipantsStore.getState();

describe('useStreamViewers hook', () => {
  const stream = 'test stream';
  const context = new ProvidedWebSocket();

  const wrapper = ({children}: any) => {
    useWebSocketHandler(context);

    return (
      <WebSocketContext.Provider value={context}>
        {children}
      </WebSocketContext.Provider>
    );
  };

  beforeEach(() => {
    useParticipantsStore.setState(initialStore, true);
  });

  it('requests viewers once joined the room', () => {
    context.requestViewers = jest.fn();

    renderHook(() => useStreamViewers(stream), {wrapper});

    act(() => {
      context.observer.emit('room-info', {
        speakers: [],
        raisedHands: [],
      });
    });

    expect(context.requestViewers).toBeCalled();
  });

  it('handles viewers page', async () => {
    const hook = renderHook(() => useStreamViewers(stream), {wrapper});

    const page0 = [createParticipantFixture(), createParticipantFixture()];
    const page1 = [createParticipantFixture(), createParticipantFixture()];

    act(() => {
      context.observer.emit('viewers', {viewers: page0, page: 0});
    });

    act(() => {
      context.observer.emit('viewers', {viewers: page1, page: 1});
    });

    expect(hook.result.current[0]).toEqual([...page0, ...page1]);
  });

  it('handles new viewer', async () => {
    const hook = renderHook(() => useStreamViewers(stream), {wrapper});

    const newViewer = createParticipantFixture();

    act(() => {
      context.observer.emit('new-viewer', {
        viewer: newViewer,
      });
    });

    expect(hook.result.current[0]).toEqual([newViewer]);
  });

  it('removes a user from viewers once they raise hand', () => {
    const hook = renderHook(() => useStreamViewers(stream), {wrapper});
    const userRaisingHand = createParticipantFixture();

    act(() => {
      context.observer.emit('new-viewer', {
        viewer: userRaisingHand,
      });
    });

    act(() => {
      context.observer.emit('raise-hand', {
        viewer: userRaisingHand,
      });
    });

    expect(hook.result.current[0]).toEqual([]);
  });

  it('removes viewers once they leave', async () => {
    const hook = renderHook(() => useStreamViewers(stream), {wrapper});
    const userThatLeft = createParticipantFixture({id: 'left'});
    const userThatStayed = createParticipantFixture({id: 'stayed'});

    const viewers = [userThatStayed, userThatLeft];

    act(() => {
      context.observer.emit('viewers', {viewers, page: 0});
    });

    act(() => {
      context.observer.emit('user-left', {user: userThatLeft.id});
    });

    expect(hook.result.current[0]).toEqual([userThatStayed]);
  });

  it.todo('removes viewers when they become speakers');
});
