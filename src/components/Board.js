import React from 'react';
import axios from 'axios';
import urls from '../Urls';
import MapCell from './MapCell';


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
        row.push({ type: "EMPTY" });
      }
      map.push(row);
    }
    mapEntities.forEach(({ x, y, type }) => { map[x][y] = { type } });
    players.forEach(({ playerName, x, y }) => map[x][y] = { type: "PLAYER", playerName });
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
    const { wsClient } = this.props;
    wsClient.subscribe('/user/queue/team', messageOutput => {
      this.handlePlayerLoc(JSON.parse(messageOutput.body));
    });
  };

  // componentWillUnmount() {
  //   this.createdClient.deactivate();
  // }

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
              {row.map((data, jndex) =>
                (<MapCell key={jndex + data.type} data={data} onClick={() => this.moveTo(index, jndex)} />))}
            </tr>
          ))
        }
      </table>
    );
  }
}

export default Board;