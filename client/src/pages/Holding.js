import React from 'react'
import NavbarMobile from './NavbarMobile'
import QuickDashboard from './QuickDashboard'
import {useSelector} from 'react-redux';

export const getPriceData = async (symbol) => {
        let url1 = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=ZTR22AB0MG26X48D`;
        let results = await fetch(url1);
        results = await results.json();
        var prices;
        if(results.Note){
            console.log("we exceded the limit");
        }else{

            const obj = results["Time Series (Daily)"];
            //accessing the first property or element of our object data
            const dayData = obj[Object.keys(obj)[0]];
            const closePrice = Math.round( ( dayData["4. close"]) * 100) / 100;
            const openPrice = dayData["1. open"];
            const change = Math.round( (closePrice-openPrice) * 100) / 100 ;
            const stockSymbol = results["Meta Data"]["2. Symbol"];
            var stockEndedIn;
            if(change>0){
                stockEndedIn = 'green'
            }else{
                stockEndedIn = 'red'
            }
            prices= { "stockSymbol":stockSymbol, "close": closePrice, "change": change,stockEndedIn}
        }
        return prices
}

export default function Holding() {

    var stockPnl;
    const { totalPnl , investedAmount } = useSelector((state)=> state.holding)
    const user = useSelector( (state)=> state.user.user )
    const originalHoldings = useSelector( (state)=> state.holding.holdingArr )
    // reversing the holding array and creating a copy as i want to display it in reverse order 
    // newer item shold be on top 
    const holdings = originalHoldings.map(item => item).reverse();
    var userName;
    if(user.name){
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        userName = capitalizeFirstLetter(user.name);
    }

    return (
            <div className="holdings-transHistory-section">

                <div className="holdings-transHistory-username-col">
                    <div className="">Holdings</div>
                    <div>{userName}</div>
                </div>

                <div className="holdings holdings-header">
                    <div className="stockname salsa">Stock Name</div>
                    <div className="salsa">Qty.</div>
                    <div className="salsa">Avg. Cost</div>
                    <div className="salsa">Cur. Val.</div>
                    <div className="salsa">LTP</div>
                    <div className="salsa">P&L</div>
                    <div className="salsa">Net Chg.</div>
                </div>
                <div className="holdings-page">
                    { (holdings[0])?
                        holdings.map( function (sname,index){

                            stockPnl = ( (holdings[index]["close"]- holdings[index]["price"] )*holdings[index]["qty"]  );
                            var currStockValue = holdings[index]["qty"]* holdings[index]["close"];
                            return(
                                <>
                                    <div className="holdings">
                                        <div className="stockname"> {holdings[index]["stockName"]} </div>
                                        <div><p className="table-extra-text">Qty. &nbsp;</p>{holdings[index]["qty"]}</div>
                                        <div><p className="table-extra-text">Buy : &nbsp;</p>{holdings[index]["price"]}</div>
                                        <div><p className="table-extra-text">Curr. Val. : &nbsp;</p>₹&nbsp;{  Math.round( ( currStockValue) * 100) / 100  }</div>
                                        <div><p className="table-extra-text">LTP : &nbsp;</p>₹&nbsp;{holdings[index]["close"]}</div>
                                        <div >₹&nbsp;{stockPnl}</div>
                                        <div>{( ( holdings[index]["close"]- holdings[index]["price"] ) / holdings[index]["price"] )*100 }%</div>
                                    </div>
                                </>
                            )
                        }):""
                    }
                    
                </div>
                <div className="holdings-totaldaypnl">
                    <div className="holdings-totaldaypnl-label">Today's P&L</div>
                    <div>{totalPnl}</div>
                    <div>{( ( totalPnl )/investedAmount )*100}%</div>
                </div>

                <QuickDashboard/>
                <NavbarMobile/>
                
            </div>
                        
    )
}
