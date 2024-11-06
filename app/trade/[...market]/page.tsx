"use client";
import Depth from "@/app/components/Depth";
import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUI";
import TradeView from "@/app/components/TradeView";
import { useParams } from "next/navigation";

export default function Page(){
  const market = useParams();
  const marketname = market.market[0];
   if (!market) {
    return <p>No market specified.</p>; // Or handle as needed
  }

  return (
    <div className=" flex flex-row flex-1">
      <div className="flex flex-col flex-1">
        <MarketBar market={marketname}/>
         <div className="flex flex-row h-[920px] border-y p-2 m-2  border-slate-800">
          <div className="flex flex-col flex-1">
            <TradeView market={marketname} />
          </div>
          <div className=" flex flex-col w-[290px] overflow-hidden">
              <Depth market={marketname} />
          </div>
         </div>
        </div>

        <div className="w-[10px] flex-col border-slate-800 border-l"></div>
        <div>
          <div className= "flex flex-col w-[320px]">
            <SwapUI market={marketname} />
          </div>
        </div>
        
    </div>
  )

}