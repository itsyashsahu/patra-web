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


    // code to get the next occuring friday 

    
    





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
                        // console.log(sname,sname.purchased_at)
                        const options = { hour: "numeric",minute: "numeric",second: "numeric" }
                        const dateAndTime = new Date(sname.purchased_at).toLocaleDateString('hi-IN', options)

                        let date = dateAndTime.slice(0,10)
                        let time = dateAndTime.slice(11)
                        // console.log(date,time)

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
                                    <div className="transValue">₹ &nbsp;{ Math.round( ( transHistory[index]["transPrice"]*transHistory[index]["qty"] ) * 100) / 100 }</div>
                                    <div >{date}</div>
                                    <div>{time}</div>
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
