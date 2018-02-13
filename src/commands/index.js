import startRecording from '../lib/recorder.js';
import * as storage from '../lib/storage.js';
import players from '../lib/player.js';

export const state = async () => {
  return {
    1: { loop: await players.isLooped('1') },
    2: { loop: await players.isLooped('2') },
    3: { loop: await players.isLooped('3') },
    4: { loop: await players.isLooped('4') },
    5: { loop: await players.isLooped('5') },
  };
};

export const load = async () => {
  console.log('load');
  const samples = {
    1: await storage.fetchFromSlot('1'),
    2: await storage.fetchFromSlot('2'),
    3: await storage.fetchFromSlot('3'),
    4: await storage.fetchFromSlot('4'),
    5: await storage.fetchFromSlot('5'),
  };

  console.log('samples', samples);

  Object.entries(samples).forEach(([id, sample]) => {
    if (sample) {
      console.log('Load sample', id, sample);
      players.load(id, sample.blob);
    }
  });
};

export const record = () => {
  const time = Date.now();
  const recorder = startRecording();

  const stop = () => recorder.stop();
  const sample = async () => {
    const blob = await recorder.getData();
    return {
      time,
      blob,
    };
  };

  return {
    stop,
    sample,
  };
};

export const save = async sample => storage.save(sample);

export const saveToSlot = async (id, sample) => {
  storage.saveToSlot({ id, sample });
  players.load(id, sample.blob);
};

export const remove = async id => storage.removeById(id);

export const play = async id => {
  players.play(id);
};

export const togglePlayFromSlot = async slotId => {
  if (players.isPlaying(slotId)) {
    return players.stop(slotId);
  } else {
    return players.play(slotId);
  }
};

export const toggleLoopForSlot = async slotId => {
  return players.loop(slotId, !players.isLooped(slotId));
};

export const playFromSlot = async slotId => {
  players.play(slotId);
};
