import mitt from 'mitt';
import connect from './websocket';

export default async ({ host }) => {
  const connection = await connect({ host });
  const emitter = mitt();

  connection.addEventListener('message', evt => {
    const message = JSON.parse(evt.data);
  });

  const send = (topic, payload = {}) => {
    connection.send(JSON.stringify({ topic, payload }));
  };

  return {
    addEventListener: addEventListener(emitter),
    send: send(ws),
  };
};
