import React, { useState, useEffect, useCallback } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import "./Fight.css";
import { getRequest, patchRequest } from "../utils.js";
import urls from '../Urls.js';
import FightCard from "./FightCard";
import FightRound from "./FightRound";

import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';

export default function Fight(props) {
    // const { wsClient } = props;
    const username = localStorage.getItem('username');
    const [deck, setDeck] = useState([]);
    const [results, setResults] = useState([]);
    const [opponent, setOpponent] = useState(null);
    const [message, setMessage] = useState("")

    useEffect(() => {
        getRequest(urls.defaultUrl + '/api/player/card'
        ).then(resp => {
            setDeck(resp.data);
        })
    }, []);

    const handleFightMsg = useCallback(({ username, remained, message, fightRounds }) => {
        if (username)
            setOpponent(username);
        else if (remained)
            setMessage(`${message} | ${remained}`);
        else if (fightRounds) {
            let newDeck = deck.map(card =>
                fightRounds.some(({ cardsPlayed }) => cardsPlayed.some(({ id }) => id === card.id))
                    ? { ...card, used: true }
                    : { ...card, used: false }
            );
            setDeck(newDeck);
            setResults(fightRounds);
        }
        else
            setMessage(message, () => setInterval(() => setOpponent(null), 1000));
    }, [deck]);

    useEffect(() => {
        const socket = () => new SockJS(urls.socketUrl);
        const createdClient = new Client({
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
                console.log('shit: ' + frame);
                createdClient.subscribe('/user/queue/fight', message => {
                    console.log(message);
                    handleFightMsg(JSON.parse(message.body));
                });
            },
            onDisconnect: () => { },
            // onWebSocketClose,
        });
        createdClient.activate();
        return () => createdClient.deactivate();
    }, [handleFightMsg]);

    const playCard = cardId => {
        patchRequest(urls.defaultUrl + '/api/playerfight', { id: cardId }).then(() => {
            const newDeck = deck.map(card => card.id === cardId
                ? { ...card, used: true } : card);
            setDeck(newDeck);
        })
    }

    return (
        <Modal show={!!opponent} size="lg">
            <Modal.Header>
                <Modal.Title>{message}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col xs={4}>
                            {deck.map(card => (
                                <FightCard
                                    card={card}
                                    onClick={() => playCard(card.id)}
                                    key={card.id}
                                />
                            ))}
                        </Col>
                        <Col xs={8}>
                            <h4 class="text-center">{username} vs {opponent}</h4>
                            {results.map(round => (
                                <FightRound round={round} />
                            ))}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );

}