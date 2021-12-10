import React from 'react';
import NavbarMobile from './NavbarMobile';
import {useSelector,useDispatch} from 'react-redux';

export default function Dashboard() {
    const { totalPnl , investedAmount , currentValue } = useSelector((state)=> state.holding)
    const user = useSelector( (state)=> state.user.user );
    const originalReports = useSelector( (state)=> state.report.reportArr )
    // reversing the reports array and creating a copy as i want to display it in reverse order 
    // newer item shold be on top 
    const reports = originalReports.map(item => item).reverse();

    var userName;
    if(user.name){
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        userName = capitalizeFirstLetter(user.name);
    }
    // console.log("username",userName);

    return (
            <div className="dashboard">
                <div className="dashboard-text salsa name">
                    Hey {userName}
                </div>
                <div className="pnl">
                    <span className="">Your Current P&L</span>
                    <span className="greenColor">₹ &nbsp;{totalPnl}</span>
                </div>
                <div className="pnlinfo">
                    <div className="pnl-info-label">
                        <span className="">Money Invested</span>
                        <span className="greenColor">₹ &nbsp;{investedAmount}</span>
                    </div>
                    <div className="pnl-info-numbers">
                        <span className="">Percentage of Return</span>
                        <span className="greenColor">{(totalPnl/investedAmount)*100}%</span>
                    </div>
                </div>

                <div className="dashboard-text salsa">
                    Reports for Your recent Transactions 
                </div>

                <div className="recent-reports-header">
                    <div className="stockname salsa">Stock Name</div>
                    <div className="salsa">Avg. Buy Price</div>
                    <div className="salsa">Avg. Sell Price</div>
                    <div className="salsa">Qty.</div>
                    <div className="salsa">P&L</div>
                    <div className="salsa">% Return</div>
                </div>

                <div className="recent-reports-section">

                {/* <!-- <div className="recent-reports-area"> --> */}
                    {
                        (reports[0])?
                        reports.map( function (sname,index){
                            
                            if(index==9){
                                console.log(index)
                                return(<></>)
                            }else{

                                return(
                                    <>
                                        <div className="recent-reports">
                                            <div className="stockname">{reports[index]["stockName"]}</div>
                                            <div><p className="table-extra-text">Buy : &nbsp; </p>₹ &nbsp;{reports[index]["buyPrice"]}</div>
                                            <div><p className="table-extra-text">Sell : &nbsp; </p>₹ &nbsp;{reports[index]["sellPrice"]}</div>
                                            <div><p className="table-extra-text">Qty. &nbsp;</p>{reports[index]["qty"]}</div>
                                            <div >₹ &nbsp; {((reports[index]["sellPrice"]-reports[index]["buyPrice"])*reports[index]["qty"] ) }</div>
                                            <div>{((reports[index]["sellPrice"]-reports[index]["buyPrice"])/reports[index]["buyPrice"])*100}%</div>
                                        </div>
                                    </>
                                )
                            }
                        }):""
                    }

                   
                    {/* <div className="recent-reports">
                        <div className="stockname">Stock 1</div>
                        <div><p className="table-extra-text">Buy : &nbsp;</p> $123</div>
                        <div><p className="table-extra-text">Sell : &nbsp;</p> $143</div>
                        <div><p className="table-extra-text">Qty. &nbsp;</p>100</div>
                        <div >+$2000</div>
                        <div>+34%</div>
                    </div> */}
                    
                    
                    {/* <!-- till here  --> */}
                {/* <!-- </div> --> */}
                </div>

                <NavbarMobile/>

                {/* <!-- Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit maiores tempore ex, natus quos magnam animi harum libero ut voluptate velit blanditiis ratione aliquid deserunt molestias incidunt porro necessitatibus aperiam dolor tenetur? --> */}
            </div>
    )
}
