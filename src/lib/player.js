import Tone from 'tone';
import mitt from 'mitt';

class Manager {
  playersBySlot = new Map();

  load(slotId, blob) {
    console.log('loaded slot ', slotId, blob);
    const url = URL.createObjectURL(blob);
    return new Promise(resolve => {
      new Tone.Player(url, player => {
        console.log('  with player', slotId, player);
        this.playersBySlot.set(slotId, player);
      }).toMaster();
    });
  }

  clear(slotId) {
    console.log('cleared slot ', slotId);
    const player = this.playersBySlot.get(slotId);
    if (player) {
      player.stop();
      player.dispose();
      console.log('  done');
    }
  }

  play(slotId) {
    console.log('play', slotId);
    const player = this.playersBySlot.get(slotId);
    if (player) {
      player.start();
      console.log('  with player', player);
    }
  }

  stop(slotId) {
    console.log('stop', slotId);
    const player = this.playersBySlot.get(slotId);
    if (player) {
      player.stop();
      console.log('  with player', player);
    }
  }

  isPlaying(slotId) {
    const player = this.playersBySlot.get(slotId);
    console.log('isPlaying', slotId, player);

    if (player) {
      return player.state === 'started';
    }

    return false;
  }

  isLooped(slotId) {
    console.log('isLooped', slotId);
    const player = this.playersBySlot.get(slotId);

    if (player) {
      console.log('  loop', player.loop);
      return player.loop;
    }

    return false;
  }

  loop(slotId, shouldLoop) {
    console.log('loop', slotId, shouldLoop);

    const player = this.playersBySlot.get(slotId);
    if (player) {
      console.log('  set', shouldLoop);
      player.loop = shouldLoop;
    }
  }
}

export default new Manager();
