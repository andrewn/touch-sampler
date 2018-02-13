// import createMachine from '../state-machine/index.js';
import connect from '../lib/websocket.js';
import * as commands from '../commands/index.js';

const TOUCH_SENSITIVITY_LEVEL = 4;

const delay = (delayMs = 0) =>
  new Promise(resolve => setTimeout(resolve, delayMs));

const withoutBlob = item => ({ ...item, blob: undefined });

const actions = {
  sendStatus: async (dispatch, { ws }) => {
    const state = await commands.state();
    ws.send('STATUS', { state });
  },
  load: async dispatch => {
    commands.load();
  },
  recordingStart: async (dispatch, { slotId }) => {
    const recorder = commands.record();
    await delay(5000);

    recorder.stop();

    const sample = await recorder.sample();

    console.log('sample', sample);

    dispatch('SAVE', {
      sample,
      slotId,
    });
  },
  save: async (dispatch, { slotId, sample = {} }) => {
    console.log('SAVE', slotId, sample);
    await commands.saveToSlot(slotId, sample);
    dispatch('SAVED');
  },
  fetchSamples: async dispatch => {
    const samples = (await commands.load()).map(withoutBlob);
    dispatch('FETCHED', { samples });
  },
  play: async (dispatch, { slotId }) => {
    console.log('action.play', slotId);
    await commands.playFromSlot(slotId);
    // dispatch('END');
  },
  togglePlay: async (display, { slotId }) =>
    commands.togglePlayFromSlot(slotId),
  toggleLoop: async (display, { slotId }) => commands.toggleLoopForSlot(slotId),
  stop: () => console.log('stop'),
  stopAll: async dispatch => {
    await commands.stopAll();
  },
  removeSample: async (dispatch, { sampleId }) => {
    await commands.remove(sampleId);
    dispatch('REMOVED');
  },
};

const actionForMessage = ws => async (topic, payload) => {
  console.log('actionForMessage', topic, payload);
  const dispatch = async (...params) => actionForMessage(ws)(...params);

  switch (topic) {
    case 'SYNC':
      actions.sendStatus(dispatch, { ws });
      break;
    case 'LOAD':
      actions.load(dispatch);
      dispatch('SYNC');
      break;
    case 'RECORD':
      actions.recordingStart(dispatch, payload);
      break;
    case 'SAVE':
      actions.save(dispatch, payload);
      break;
    case 'SAVED':
      actions.load(dispatch);
      break;
    case 'PLAY':
      actions.play(dispatch, payload);
      break;
    case 'TOGGLE_PLAY':
      await actions.togglePlay(dispatch, payload);
      dispatch('SYNC');
      break;
    case 'TOGGLE_LOOP':
      await actions.toggleLoop(dispatch, payload);
      dispatch('SYNC');
      break;
    default:
      console.warn('Action handler for ', topic, ' not found');
  }
};

const init = async () => {
  console.log('init internal');
  const ws = await connect();
  const actionHandler = actionForMessage(ws);

  // Reset the touch board
  ws.send(
    JSON.stringify({
      topic: 'Capacitive/cap/resetRequest',
      payload: {},
    }),
  );

  ws.send(
    JSON.stringify({
      topic: 'Capacitive/cap/sensitivity',
      payload: { params: { level: TOUCH_SENSITIVITY_LEVEL } },
    }),
  );

  ws.addEventListener('message', ({ topic, payload }) =>
    actionHandler(topic, payload),
  );

  actionHandler('LOAD');
};

init();
