import mitt from 'mitt';
import uuid from 'uuid/v4';

import config from '../config.js';

const sourceId = uuid();

const isOwnMessage = (message = {}) => message.sourceId === sourceId;

const send = ws => (topic, payload = {}) => {
  if (topic == null) {
    throw new Error(`'topic' is required in WebSocket message`);
  }

  console.log('Send %c%s', 'font-weight: bold', topic, payload);

  ws.send(
    JSON.stringify({
      topic,
      sourceId,
      payload,
    }),
  );
};

const addEventListener = emitter => (name, handler) => {
  emitter.on(name, handler);
};

const handleMessage = emitter => evt => {
  const message = JSON.parse(evt.data);

  if (isOwnMessage(message)) {
    return;
  }

  emitter.emit('message', message);
};

const connect = async (emitter, ws) =>
  new Promise(resolve => {
    ws.addEventListener('message', handleMessage(emitter));
    ws.addEventListener('open', resolve);
  });

export default async ({ host = config.webSocketHost } = {}) => {
  const wsPath = `ws://${host.hostname}:8000`;
  const ws = new WebSocket(wsPath);
  const emitter = mitt();

  await connect(emitter, ws);

  return {
    addEventListener: addEventListener(emitter),
    send: send(ws),
  };
};
