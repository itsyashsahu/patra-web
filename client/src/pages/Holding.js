import React,{useState,useEffect} from 'react'
import NavbarMobile from './NavbarMobile'
import QuickDashboard from './QuickDashboard'
import {useSelector} from 'react-redux';

export const getPriceData = async (symbol) => {
    // if(keyword.length>1){
        // var symbol = "IBM";
        let url1 = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=ZTR22AB0MG26X48D`;
        let results = await fetch(url1);
        results = await results.json();
        // console.log(results)
        var prices;
        if(results.Note){
            console.log("we exceded the limit");
            // return(results.Note)
        }else{

            // console.log(results["Meta Data"]["2. Symbol"]);
            const obj = results["Time Series (Daily)"];
            //accessing the first property or element of our object data
            // console.log("this is the obj",obj[Object.keys(obj)[0]]);
            const dayData = obj[Object.keys(obj)[0]];

            // const closePrice = dayData["4. close"];
            const closePrice = Math.round( ( dayData["4. close"]) * 100) / 100;

            const openPrice = dayData["1. open"];
            const change = Math.round( (closePrice-openPrice) * 100) / 100 ;
            // const change = closePrice-openPrice
            const stockSymbol = results["Meta Data"]["2. Symbol"];
            var stockEndedIn;
            if(change>0){
                stockEndedIn = 'green'
            }else{
                stockEndedIn = 'red'
            }
            // data = results.bestMatches; 
            // setData(rawdata);
            // }
            prices= { "stockSymbol":stockSymbol, "close": closePrice, "change": change,stockEndedIn}
            // console.log('get price data response',prices);
        }
        return prices
}

export default function Holding() {

    var stockPnl;
    // var totalPnl= 0 ;
    // // console.log("hellos starting default ",totalPnl)
    // var totalMoneyInvested = 0 ;
    // var moneyInvestedInStock = 0 ;

    // var count =0;
    const { totalPnl , investedAmount , currentValue } = useSelector((state)=> state.holding)
    // console.log(totalPnl,investedAmount,currentValue)
    const user = useSelector( (state)=> state.user.user )
    const originalHoldings = useSelector( (state)=> state.holding.holdingArr )
    // reversing the holding array and creating a copy as i want to display it in reverse order 
    // newer item shold be on top 
    const holdings = originalHoldings.map(item => item).reverse();
    // console.log(holdings)
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
                    {/* <div className="holdings">
                        <div className="stockname">Stock 1</div>
                        <div><p className="table-extra-text">Qty. &nbsp;</p> 100</div>
                        <div><p className="table-extra-text">Buy : &nbsp;</p>$123</div>
                        <div><p className="table-extra-text">Curr. Val. : &nbsp;</p> $143</div>
                        <div><p className="table-extra-text">LTP : &nbsp;</p>$143</div>
                        <div >$2000</div>
                        <div>34%</div>
                    </div> */}
                    
                    
                    {/* <!-- till here --> */}
                    {
                        // const callback = ()
                    }
                    
                    {/* <!-- Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit maiores tempore ex, natus quos magnam animi harum libero ut voluptate velit blanditiis ratione aliquid deserunt molestias incidunt porro necessitatibus aperiam dolor tenetur? --> */}
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
