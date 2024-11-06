
export const AskTable = ({ asks }: { asks: [string, string][] }) => {
    let currentTotal = 0;
    const relevantAsks = asks.slice(0, 15);
    relevantAsks.reverse();
    let asksWithTotal: [string, string, number][]  = [];
    for (let i = relevantAsks.length-1; i >= 0; i--) {
        const [price, quantity] = relevantAsks[i];
        asksWithTotal.push([price, quantity, currentTotal+=Number(quantity)]);
    }
    const maxTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);
    asksWithTotal.reverse();

    return <div>
        {asksWithTotal.map(([price, quantity, total]) => <Ask maxTotal={maxTotal} key={price} price={price} quantity={quantity} total={total} />)}
    </div>
}
function Ask({ price, quantity, total, maxTotal }: { price: string, quantity: string, total: number, maxTotal: number }) {
    return (
        <div className="relative grid grid-cols-3 text-xs py-[2px] border-y-2 border-transparent">
            <div
                className="absolute right-0 top-0 bottom-0 bg-red-900/30"
                style={{
                    width: `${(100 * total) / maxTotal}%`,
                    transition: "width 0.3s ease-in-out",
                }}
            ></div>
            <div
                className="absolute right-0 top-0 bottom-0 bg-red-900/50"
                style={{
                    width: `${(100 * parseInt(quantity)) / maxTotal}%`,
                    transition: "width 0.3s ease-in-out",
                }}
            ></div>
            <div className="z-10 text-red-400">{price}</div>
            <div className="z-10 text-right">{quantity}</div>
            <div className="z-10 text-right">{total.toFixed(2)}</div>
        </div>
    );
}