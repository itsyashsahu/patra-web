import React from 'react'
import NavbarMobile from './NavbarMobile'
import {useSelector} from 'react-redux';
import QuickDashboard from './QuickDashboard';

export default function Reports() {
    const user = useSelector( (state)=> state.user.user )
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

        <div className="holdings-transHistory-section">

        <div className="holdings-transHistory-username-col">
            <div className="">Reports</div>
            <div>{userName}</div>
        </div>

        <div className=" recent-reports reports-header">
            <div className="stockname salsa">Stock Name</div>
            <div className="salsa">Avg. Buy Price</div>
            <div className="salsa">Avg. Sell Price</div>
            <div className="salsa">Qty.</div>
            <div className="salsa">P&L</div>
            <div className="salsa">%Return</div>
        </div>
        <div className="holdings-page">

            {/* <div className="recent-reports">
                <div className="stockname">Stock 1</div>
                <div><p className="table-extra-text">Buy : &nbsp; </p>$123</div>
                <div><p className="table-extra-text">Sell : &nbsp; </p>$143</div>
                <div><p className="table-extra-text">Qty. &nbsp;</p>100</div>
                <div >$2000</div>
                <div>34%</div>
            </div> */}

            {
                (reports[0])?
                reports.map( function (sname,index){
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
                }):""
            }

           
        </div>

        <QuickDashboard/>
        <NavbarMobile/>

        </div>
    )
}
