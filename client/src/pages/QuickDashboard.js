import React from 'react';
import {useSelector} from 'react-redux';


export default function QuickDashboard() {
    const { totalPnl , investedAmount , currentValue } = useSelector((state)=> state.holding)
    return (
        <div className="quick-dashboard">
            <div className="quick-dashboard-header">
                <div className="">Invested Amt.</div>
                <div>Current Val.</div>
                <div>P&L</div>
                <div>% Return</div>
            </div> 
            <div className="quick-dashboard-numbers numberFont">
                <div className="numberFont">₹ &nbsp;{investedAmount}</div>
                <div className="numberFont" >₹ &nbsp;{currentValue}</div>
                <div className="numberFont" >₹ &nbsp;{totalPnl}</div>
                <div className="numberFont" >{  Math.round( ( ( (totalPnl)/investedAmount)*100 ) * 100) / 100   }%</div>
            </div>
        </div>
    )
}
