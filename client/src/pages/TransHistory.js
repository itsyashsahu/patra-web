import React from 'react'
import NavbarMobile from './NavbarMobile'
import QuickDashboard from './QuickDashboard'
import {useSelector} from 'react-redux';

export default function TransHistory() {
    const user = useSelector( (state)=> state.user.user )
    const originalTransHistory = useSelector( (state)=> state.transHistory.transHistoryArr )
    // reversing the holding array and creating a copy as i want to display it in reverse order 
    // newer item shold be on top 
    const transHistory = originalTransHistory.map(item => item).reverse();

    var userName;
    if(user.name){
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        userName = capitalizeFirstLetter(user.name);
    }
    // console.log("username",userName);

    return (
        <div className="holdings-transHistory-section">

            <div className="holdings-transHistory-username-col">
                <div className="">Transaction history</div>
                <div>{userName}</div>
            </div>

            <div className="transactions holdings-header">
                <div className="stockname salsa">Stock Name</div>
                <div className="salsa"></div>
                <div className="salsa">Qty.</div>
                <div className="salsa">Avg. Price</div>
                <div className="salsa">Trans. Val.</div>
                <div className="salsa">Date</div>
                <div className="salsa">Time</div>
            </div>
            <div className="holdings-page">
                {
                    (transHistory[0])?
                    transHistory.map( function (sname,index){
                        return(
                            <>
                                <div className="transactions">
                                    <div className="stockname">{transHistory[index]["stockName"]} </div>
                                    {
                                        (transHistory[index]["transType"]==='Bought')?
                                        <div className="transType transType-buy">Bought</div>:
                                        <div className="transType transType-sell">{transHistory[index]["transType"]} </div>
                                    }

                                    <div><p className="table-extra-text">Qty : &nbsp; </p>{transHistory[index]["qty"]} </div>
                                    <div><p className="table-extra-text">Transaction Price : &nbsp; </p>₹ &nbsp;{transHistory[index]["transPrice"]} </div>
                                    <div className="transValue">₹ &nbsp;{transHistory[index]["transPrice"]*transHistory[index]["qty"]}</div>
                                    <div >13/04/2020</div>
                                    <div>08:34:56:45</div>
                                </div>
                            </>
                        )
                    }):""
                }
            </div>
            <QuickDashboard/>
            <NavbarMobile/>
        </div>
    )
}
