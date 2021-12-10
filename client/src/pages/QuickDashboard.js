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
            <div className="quick-dashboard-numbers">
                <div className="">₹ &nbsp;{investedAmount}</div>
                <div>₹ &nbsp;{currentValue}</div>
                <div>₹ &nbsp;{totalPnl}</div>
                <div>{((totalPnl)/investedAmount)*100}%</div>
            </div>
        </div>
    )
}
