import mitt from 'mitt';
import nextTick from 'next-tick';

const clone = obj => JSON.stringify(JSON.parse(obj));

const reducer = (currentState, event, payload) => {
  const state = clone(currentState);

  switch (event) {
    case 'LOADED':
      break;
    case 'PLAY':
      state.slots[payload.slotId].playing = true;

      return {
        actions: ['play'],
        state,
      };
  }

  return {
    actions: [],
    state,
  };
};

export default (ws, actions = {}) => {
  let currentState = {
    state: 'idle',
    slots: {
      1: { loop: false },
      2: { loop: false },
      3: { loop: false },
    },
  };
  const emitter = mitt();

  // Send status event on startup
  ws.send('status', { state: currentState });

  const stateFromPayload = payload => {
    currentState = payload.state;
    emitter.emit('transition', currentState);
  };

  const executeAction = name => console.log('would executeAction', name);

  const stateFromEvent = (event, payload) => {
    const { state, actions } = reducer(state, event, payload);
    currentState = state;
    actions.forEach(executeAction);
  };

  ws.addEventListener('message', ({ topic, payload }) => {
    switch (topic) {
      case 'status':
        stateFromPayload(payload);
        return;
      case 'sync':
        ws.send('status', { state: currentState });
        return;
      case 'transition':
        stateFromEvent(payload.event, payload.payload);
        // setStateFromEvent(payload.event, { payload: payload.payload });
        return;
    }
  });

  return {
    addEventListener: emitter.on,

    get state() {
      return currentState;
    },

    sync: () => {
      console.log('sync');
      ws.send('sync', {});
    },

    transition: (event, payload) => console.log('transition', event, payload),
  };
};
