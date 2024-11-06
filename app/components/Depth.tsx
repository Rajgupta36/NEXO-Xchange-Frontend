
import { useEffect, useState } from "react";
import { getDepth, getTicker, getTrades } from "../utils/httpClient";
import { AskTable } from "./AskTable";
import { BidTable } from "./BidTable";
import { SignalingManager } from "../utils/SignalingManager";
import { Ticker } from "../utils/types";

export default function Depth({market} : {market: string}){
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();

    useEffect(()=>{

        SignalingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>) => {
            setPrice(data?.lastPrice ?? '');
        }, market);
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`ticker.${market}`]}	);


       
        SignalingManager.getInstance().registerCallback("depth", (data: any) => {
            setBids((originalBids) => {
                const updatedBids = [...(originalBids || [])];
                data.bids.forEach(([price, size]:any) => {
                    const bidIndex = updatedBids.findIndex(bid => bid[0] === price);
                    if (Number(size) === 0) {
                        if (bidIndex !== -1) updatedBids.splice(bidIndex, 1);
                    } else {
                        if (bidIndex !== -1) {
                            updatedBids[bidIndex] = [price, size];
                        } else {
                            updatedBids.push([price, size]);
                        }
                    }
                });
            
                updatedBids.sort((a, b) => Number(b[0]) - Number(a[0]));
            
                return updatedBids;
            });
            
            setAsks((originalAsks) => {
                const updatedAsks = [...(originalAsks || [])];
                data.asks.forEach(([price, size]:any) => {
                    const askIndex = updatedAsks.findIndex(ask => ask[0] === price);
                    if (Number(size) === 0) {
                        if (askIndex !== -1) updatedAsks.splice(askIndex, 1);
                    } else {
                        if (askIndex !== -1) {
                            updatedAsks[askIndex] = [price, size];
                        } else {
                            updatedAsks.push([price, size]);
                        }
                    }
                });
                updatedAsks.sort((a, b) => Number(a[0]) - Number(b[0]));
                return updatedAsks;
            });
            
        }, `Depth-${market}`);


        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.200ms.${market}`]});
        getDepth(market).then((data)=>{
            setBids(data.bids.reverse());
            setAsks(data.asks);
        });
        getTicker(market).then(t => setPrice(t.lastPrice));
        getTrades(market).then(t => setPrice(t[0].price));
        return () => {
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth.200ms.${market}`]});
            SignalingManager.getInstance().deRegisterCallback("depth", `Depth-${market}`);
            SignalingManager.getInstance().deRegisterCallback("ticker", market);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`ticker.${market}`]}	);
        }
    },[]);



    return (
        <div className="border-2  border-gray-600 pl-2 pb-2">
          <TableHeader />
          {asks && <AskTable asks={asks} />}
          {price && <div >{price}</div>}
          {bids && <BidTable bids={bids} />}
        </div>
    )
}

function TableHeader() {
    return <div className="flex justify-between text-sm border-2 border-gray-900">
    <div className="text-white">Price</div>
    <div className="text-slate-500">Size</div>
    <div className="text-slate-500">Total</div>
</div>
}