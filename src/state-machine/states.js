const Recorder = () => ({
  initial: 'recording',
  states: {
    recording: {
      on: {
        SAVE: {
          saving: {
            actions: ['save'],
          },
        },
      },
      onEntry: ['recordingStart'],
    },
    saving: {},
  },
});

const Slot = id => ({
  initial: 'idle',
  states: {
    idle: {
      on: {
        [`PLAY_${id}`]: {
          playing: {
            actions: ['play'],
          },
        },
      },
    },
    playing: {
      on: {
        [`END_${id}`]: 'idle',
      },
    },
  },
});

export default {
  initial: 'loading',
  states: {
    loading: {
      on: {
        LOADED: 'idle',
      },
    },
    idle: {
      on: {
        RECORD: 'recording',
        PLAY: 'playing',
      },
    },
    recording: {
      ...Recorder(),
      on: {
        SAVED: 'idle',
      },
    },
    playing: {
      parallel: true,
      states: {
        slot_1: Slot(1),
        slot_2: Slot(2),
        slot_3: Slot(3),
      },
      on: {
        RECORD: 'recording',
      },
      onExit: ['stopAll'],
    },
  },
};
