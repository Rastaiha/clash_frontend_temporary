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
      map: []
    }
  }

  createMap = () => {
    let map = [];
    const { width, height, mapEntities } = this.state;
    for (let i = 0; i < width; i++) {
      let row = [];
      for (let j = 0; j < height; j++) {
        row.push({ type: "E", color: "red" });
      }
      map.push(row);
    }
    mapEntities.forEach(({ x, y, type }) => { map[x][y] = { type, color: "blue" } });
    this.setState({ map });
  }

  componentDidMount() {
    this.createMap();
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
      onConnect: this.refreshGroups,
      onDisconnect: this.setState({ subscribed: false }),
      // onWebSocketClose,
    });
    this.createdClient.activate();
    // var socket = new SockJS(urls.socketUrl);
    // var username = localStorage.getItem('username');
    // this.stompClient = Stomp.over(socket);
    // this.stompClient.connect({}, username, frame => {
    //   console.log('Connected: ' + frame);
    //   this.stompClient.subscribe('/user/queue/team', messageOutput => {
    //     console.log(JSON.parse(messageOutput.body));
    //   });
    // });
  };

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
    const { map } = this.state
    return (
      <table>
        {
          map.map((row, index) => (
            <tr key={index}>
              {row.map(({ type, color }, jndex) =>
                (<th key={jndex} onClick={() => this.moveTo(index, jndex)} style={{ background: color, width: "50px", height: '50px' }}>{type}</th>))}
            </tr>
          ))
        }
      </table>
    );
  }
}

export default Board;