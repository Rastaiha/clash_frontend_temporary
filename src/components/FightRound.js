import React from "react";

import { Card, CardGroup } from "react-bootstrap";

export default function FightRound({ winner, winnerCard, loserCard }) {
    const myUsername = localStorage.getItem("username");
    const iWon = myUsername === winner.username;
    const [myCard, opCard] = iWon ? [winnerCard, loserCard] : [loserCard, winnerCard];


    return (
        <CardGroup>
            <Card className={iWon ? "bg-success" : "bg-danger"}>
                <Card.Body>{myCard.cardType.name}</Card.Body>
            </Card>
            <Card className={!iWon ? "bg-success" : "bg-danger"}>
                <Card.Body>{opCard.cardType.name}</Card.Body>
            </Card>
        </CardGroup>
    );
}