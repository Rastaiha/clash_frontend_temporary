import React from "react";

export default function InventoryCard(props) {
    const { onBuy, onSell, onPickup, onDiscard, title } = props;
    return (
        <div className="card m-2" style={{ width: "200px" }} >
            <div className="card-body">
                <h4 className="card-title">{title}</h4>
                <h5 className="card-text">Power: 100</h5>
                <div class="btn-group" role="group" aria-label="Basic example">
                    {onSell &&
                        (<button onClick={onSell} type="button" class="btn btn-primary">Sell</button>)}
                    {onPickup &&
                        (<button onClick={onPickup} type="button" class="btn btn-primary">Pickup</button>)}
                    {onBuy &&
                        (<button onClick={onBuy} type="button" class="btn btn-primary">Buy</button>)}
                    {onDiscard &&
                        (<button onClick={onDiscard} type="button" class="btn btn-primary">Discard</button>)}
                </div>
            </div>
        </div>
    );
}