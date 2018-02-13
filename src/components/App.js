import { h, Component } from 'preact';

import connect from '../lib/websocket.js';
import './App.css';

export default class extends Component {
  componentWillMount() {
    this.connect();
  }

  connect = async () => {
    this.connection = await connect();
    this.connection.addEventListener(
      'message',
      this.componentDidReceiveMessage,
    );

    this.connection.send('SYNC');
  };

  componentDidReceiveMessage = ({ topic, payload }) => {
    console.log('componentDidReceiveMessage', topic, payload);

    switch (topic) {
      case 'STATUS':
        this.setState({
          slots: payload.state,
        });
        break;
    }
  };

  state = {
    slots: {},
  };

  record = slotId => {
    this.connection.send('RECORD', { slotId });
  };

  togglePlay = slotId => {
    this.connection.send('TOGGLE_PLAY', { slotId });
  };

  toggleLooped = slotId => {
    this.connection.send('TOGGLE_LOOP', { slotId });
  };

  renderSlots = () => {
    const { slots } = this.state;

    const Slot = ({ id, loop }) => (
      <div class="slot">
        <div class="slot-buttons">
          <button
            class="slot-button slot-button-record"
            onClick={this.record.bind(null, id)}
          >
            R{id}
          </button>
          <button
            class="slot-button slot-button-play"
            onClick={this.togglePlay.bind(null, id)}
          >
            P{id}
          </button>
          <label class="slot-loop">
            <input
              type="checkbox"
              checked={loop}
              onChange={this.toggleLooped.bind(null, id)}
            />
            Loop
          </label>
        </div>
      </div>
    );

    return (
      <div class="slots">
        {Object.entries(slots).map(([id, slot = {}]) => (
          <Slot key={id} id={id} loop={slot.loop} />
        ))}
      </div>
    );
  };

  render(props, { currentState }) {
    return (
      <app>
        <p>State: {JSON.stringify(currentState)}</p>
        {this.renderSlots()}
      </app>
    );
  }
}
