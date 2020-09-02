import React from "react";
import { Card } from "react-bootstrap";

export default function FightCard(props) {
    const { card: { cardType, power, used }, onClick } = props;
    return (
        <Card
            className={`mt-2  ${used ? "bg-secondary" : "bg-primary"}`}
            onClick={onClick}
        >
            <Card.Body>
                <Card.Title>
                    {cardType.name}
                </Card.Title>
                <Card.Text>
                    {power}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}