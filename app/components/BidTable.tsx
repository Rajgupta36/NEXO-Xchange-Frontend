
export const BidTable = ({ bids }: {bids: [string, string][]}) => {
    let currentTotal = 0; 
    const relevantBids = bids.slice(0, 15);
    const bidsWithTotal: [string, string, number][] = relevantBids.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
    const maxTotal = relevantBids.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);

    return <div>
        {bidsWithTotal?.map(([price, quantity, total]) => <Bid maxTotal={maxTotal} total={total} key={price} price={price} quantity={quantity} />)}
    </div>
}

function Bid({ price, quantity, total, maxTotal }: { price: string, quantity: string, total: number, maxTotal: number }) {
    return (
        <div className="relative grid grid-cols-3 text-xs py-[2px] border-y-2 border-transparent">
            <div
                className="absolute right-0 top-0 bottom-0 bg-green-900/30"
                style={{
                    width: `${(100 * total) / maxTotal}%`,
                    transition: "width 0.3s ease-in-out",
                }}
            ></div>
            <div
                className="absolute right-0 top-0 bottom-0 bg-green-700/50"
                style={{
                    width: `${(100 * parseInt(quantity)) / maxTotal}%`,
                    transition: "width 0.3s ease-in-out",
                }}
            ></div>
            <div className="z-10 text-green-400">{price}</div>
            <div className="z-10 text-right">{quantity}</div>
            <div className="z-10 text-right">{total.toFixed(2)}</div>
        </div>
    );
}
