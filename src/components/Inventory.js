import React from "react";
import InventoryCard from "./InventoryCard.js";
import axios from 'axios';
import urls from '../Urls';

export default class Inventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            armory: [],
            backpack: [],
            cardtypes: [],
        }
    }

    getCardTypes = () => {
        axios.get(urls.defaultUrl + '/api/armory/cardtype',
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(resp => {
                this.setState({ cardtypes: resp.data });
            })
    }

    componentDidMount() {
        this.getCardTypes();
        this.getData();
    }

    getData = () => {
        this.getCivilCards();
        this.getPlayerCards();
    }

    getCivilCards = () => {
        axios.get(urls.defaultUrl + '/api/civilization/card',
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(resp => {
                this.setState({ armory: resp.data });
            })
    }

    getPlayerCards = () => {
        axios.get(urls.defaultUrl + '/api/player/card',
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(resp => {
                this.setState({ backpack: resp.data });
            });
    }

    pickup = cardId => {
        axios.post(`${urls.defaultUrl}/api/armory/card/${cardId}/pickup`, {},
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(this.getData);
    }

    discard = cardId => {
        axios.post(`${urls.defaultUrl}/api/armory/card/${cardId}/discard`, {},
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(this.getData);
    }

    sell = cardId => {
        axios.post(`${urls.defaultUrl}/api/armory/card/${cardId}/sell`, {},
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(this.getData);
    }

    buy = cardtypeId => {
        axios.post(`${urls.defaultUrl}/api/armory/cardtype/${cardtypeId}/buy`, {},
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(this.getData);
    }

    render() {
        const { armory, backpack, cardtypes } = this.state;
        return (
            <div className="w-100">
                <div className="overflow-auto">
                    <div class="d-flex flex-row flex-nowrap">
                        {cardtypes.map(card => (
                            <InventoryCard
                                title={card.name}
                                onBuy={() => this.buy(card.id)}
                            />
                        ))}
                    </div>
                </div>
                <div className="overflow-auto">
                    <div class="d-flex flex-row flex-nowrap">
                        {armory.filter(card => !card.picked).map(card => (
                            <InventoryCard
                                title={card.cardType.name}
                                onPickup={() => this.pickup(card.id)}
                                onSell={() => this.sell(card.id)}
                            />
                        ))}
                    </div>
                </div>
                <div className="overflow-auto">
                    <div class="d-flex flex-row flex-nowrap">
                        {backpack.map(card => (
                            <InventoryCard
                                title={card.cardType.name}
                                onDiscard={() => this.discard(card.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}