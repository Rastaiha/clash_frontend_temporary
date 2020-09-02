import React, { useState, useEffect, useCallback } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import "./Fight.css";
import { getRequest, patchRequest } from "../utils.js";
import urls from '../Urls.js';
import FightCard from "./FightCard";
import FightRound from "./FightRound";

export default function Fight({ wsClient }) {
    // const { wsClient } = props;
    const username = localStorage.getItem('username');
    const [deck, setDeck] = useState([]);
    const [results, setResults] = useState([]);
    const [opponent, setOpponent] = useState({ username: "" });
    const [message, setMessage] = useState("");
    const [running, setRunning] = useState(false)

    useEffect(() => {
        getRequest(urls.defaultUrl + '/api/player/card'
        ).then(resp => {
            setDeck(resp.data);
        })
    }, []);

    const handleFightMsg = useCallback(({ host, guest, remained, message, fightRounds }) => {
        if (host) {
            setRunning(true);
            setOpponent(host.username === username ? guest : host);
        } else if (remained)
            setMessage(`${message} | ${remained}`);
        else if (fightRounds) {
            let newDeck = deck.map(card =>
                fightRounds.some(({ winnerCard, loserCard }) =>
                    winnerCard.id === card.id || loserCard.id === card.id)
                    ? { ...card, used: true }
                    : { ...card, used: false }
            );
            setDeck(newDeck);
            setResults(fightRounds);
        }
        else {
            setMessage(message);
            setInterval(() => setRunning(false), 1500);
        }
    }, [deck, username]);

    useEffect(() => {
        wsClient.subscribe('/user/queue/fight', message => {
            console.log(message);
            handleFightMsg(JSON.parse(message.body));
        });
    }, [handleFightMsg, wsClient]);

    const playCard = cardId => {
        patchRequest(urls.defaultUrl + '/api/playerfight', { id: cardId }).then(() => {
            const newDeck = deck.map(card => card.id === cardId
                ? { ...card, used: true } : card);
            setDeck(newDeck);
        })
    }

    return (
        <Modal show={running} size="lg">
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
                            <h4 class="text-center">{username} vs {opponent.username}</h4>
                            {results.map(round => (
                                <FightRound {...round} />
                            ))}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );

}