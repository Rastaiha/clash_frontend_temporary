import React from 'react';
import axios from 'axios';
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import urls from './Urls';


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 5,
      height: 5,
      mapEntities: [],
      map: [],
      players: [],
    }
  }

  createMap = () => {
    let map = [];
    const { width, height, mapEntities, players } = this.state;
    for (let i = 0; i < width; i++) {
      let row = [];
      for (let j = 0; j < height; j++) {
        row.push({ type: " ", color: "cyan" });
      }
      map.push(row);
    }
    mapEntities.forEach(({ x, y, type }) => { map[x][y] = { type, color: "green" } });
    players.forEach(({ playerName, x, y }) => map[x][y] = { type: playerName, color: "red" });
    return map;
  }

  componentDidMount() {
    axios.get(urls.mapDataUrl, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200)
        this.setState({ ...res.data }, this.createMap);
    })
    this.connectWS();
  }

  connectWS = () => {
    const socket = () => new SockJS(urls.socketUrl);

    this.createdClient = new Client({
      webSocketFactory: socket,
      reconnectDelay: 0,
      connectHeaders: {
        login: {},
        passcode: localStorage.getItem('username'),
      },
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
      debug: (text) => console.log(text),
      onConnect: frame => {
        console.log('Connected: ' + frame);
        this.createdClient.subscribe('/user/queue/team', messageOutput => {
          this.handlePlayerLoc(JSON.parse(messageOutput.body));
        });
      },
      onDisconnect: this.setState({ subscribed: false }),
      // onWebSocketClose,
    });
    this.createdClient.activate();
  };

  componentWillUnmount() {
    this.createdClient.deactivate();
  }

  handlePlayerLoc = newPlayer => {
    console.log(newPlayer);
    const { players } = this.state;
    let newPlayers = [newPlayer];
    players.forEach(player => {
      if (player.playerName !== newPlayer.playerName)
        newPlayers.push(player);
    });
    this.setState({ players: newPlayers })
  }

  moveTo = (x, y) => {
    axios.post(urls.moveUrl,
      { x, y },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
  }

  render() {
    const map = this.createMap();
    return (
      <table>
        {
          map.map((row, index) => (
            <tr key={index}>
              {row.map(({ type, color }, jndex) =>
                (<th key={jndex} onClick={() => this.moveTo(index, jndex)} style={{ background: color, width: "50px", height: '50px' }}>{type[0]}</th>))}
            </tr>
          ))
        }
      </table>
    );
  }
}

export default Board;