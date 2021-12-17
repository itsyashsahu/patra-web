import React,{useState} from 'react';
import NavbarMobile from './NavbarMobile';
import {useSelector} from 'react-redux';
import Fade from 'react-reveal/Fade';

export const getWeekPriceData = async (symbol,dateInputGiven) => {
    
    // let url1 = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=ZTR22AB0MG26X48D`;
    let url1 = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=ZTR22AB0MG26X48D`;
    let results = await fetch(url1);
    results = await results.json();
    // console.log(results);
    // var prices;
    if(results.Note){
        console.log("we exceded the limit");
    }else{
        const obj = results["Weekly Adjusted Time Series"];

        // check if we have the data from this given date 
        // const lastDataEntry = Object.values(obj)[Object.values(obj).length - 1];
        const lastDataEntry = Object.keys(obj)[Object.values(obj).length - 1];
        var firstEntryDate = Object.keys(obj)[0];
        // console.log("the last enrty available i ",lastDataEntry, dateInputGiven)
        const lastDataEntryDate = new Date ( lastDataEntry )
        const dateprovided = new Date ( dateInputGiven );

        // console.log("lastdate",lastDataEntryDate, firstEntryDate);
        const doWeHaveDataForwardThisDate = ( dateprovided >= lastDataEntryDate )

        // function to get next friday of date given 
        function getNextDayOfWeek(datepassed,day) {
            datepassed = new Date(datepassed.getTime ());
            datepassed.setDate(datepassed.getDate() + (day + 7 - datepassed.getDay() ) % 7);
            return datepassed;
        }

        const IsoDateToFormatRequired=(date)=>{
            var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
            return dateString
        }

        const formatter = (ddate,day)=>{
            var dateInput = new Date ( ddate )
            const nextFridayOfInputDate = new Date ( getNextDayOfWeek(dateInput,day).toISOString() )
            const nextFridayOfInputDateFormatted = IsoDateToFormatRequired(nextFridayOfInputDate );
            // now the Date is ready to get input data from respose json file
            return nextFridayOfInputDateFormatted
        }

        if( !doWeHaveDataForwardThisDate ){
            const lastDataEntryDateFormatted = IsoDateToFormatRequired(lastDataEntryDate)
            const errMessage = "Sorry We have data from Date : "+ lastDataEntryDateFormatted

            return { errMessage}
        }
        
        

        const nextFridayOfInputDateFormatted = formatter(dateInputGiven,5);
        // console.log("trying the formatter",formatter(dateInputGiven,1))

        // console.log("get date is ",nextFridayOfInputDateFormatted )
        // console.log("today ",nextFridayFromTodayFormatted)

        var givenWeekLastDay ;
        var givenWeekData = obj[nextFridayOfInputDateFormatted]
        // console.log(givenWeekData,nextFridayOfInputDateFormatted)
        // what if the friday was holiday then givenWeekData Would be undefined so 
        if(givenWeekData){
            givenWeekLastDay = nextFridayOfInputDateFormatted;
            // console.log("hello")

        }else{
            var datesWeekData = null;
            // check for the data in last 10 days 
            for( var i = 0 ; i < 10 ; i++){
                var today = new Date(dateInputGiven);
                
                today.setTime(today.getTime() - i* 24 * 60 * 60 * 1000);
                var dates = today.getFullYear() + "-" + (today.getMonth()+1) + "-" +today.getDate()  ;
                
                // console.log("pastdata",today,dates)
                datesWeekData = obj[ dates ]
                // console.log("i should be inside loop ",i,dates,datesWeekData)
                if(datesWeekData){
                    givenWeekLastDay = dates;
                    // console.log("the loop breaked ",i)
                    break;}
            }
            // console.log("data after week search ",datesWeekData)
            givenWeekData = datesWeekData
            // console.log("givenWeekDatae",givenWeekData)
            
            
        }
        console.log("givenWeekDatae",givenWeekLastDay)

        //accessing the first property or element of our object data
        const lastUpdatedData = obj[Object.keys(obj)[0]];
        // console.log("lastUpdatedData",lastUpdatedData)
        givenWeekLastDay = new Date (givenWeekLastDay).toDateString();
        // firstEntryDate = firstEntryDate.toISOString().split("T")[0] ;
        var givenDate = new Date( dateInputGiven.split("T")[0] ).toDateString();
        // var inkj = dateInputGiven.toISOString();
        firstEntryDate = new Date(firstEntryDate).toDateString()
        // console.log("hello me ",givenWeekLastDay)
        const givenWeekClose = Math.round( ( givenWeekData["4. close"]) * 100) / 100;
        const updatedClose = Math.round( ( lastUpdatedData["4. close"]) * 100) / 100;
        // const openPrice = dayData["1. open"];
        const change = updatedClose - givenWeekClose ;
        const percentageChange = Math.round( ((change/givenWeekClose)*100 ) * 100) / 100 ;
        // const stockSymbol = results["Meta Data"]["2. Symbol"];
        var dataSended = {
            givenDate,
            givenWeekLastDay,
            givenWeekClose,
            firstEntryDate,
            updatedClose,
            percentageChange
        }
        // console.log(dataSended)
        return dataSended;
    }
    return null 
}

export default function Dashboard() {
    const { totalPnl , investedAmount } = useSelector((state)=> state.holding)
    const user = useSelector( (state)=> state.user.user );
    // const originalReports = useSelector( (state)=> state.report.reportArr )
    var watchlistdata = useSelector( (state) => state.watchlist.watchlistArr )

    const [ExploreResults , setExploreResults ] = useState('')
    const [showExploreResults , setShowExploreResults ] = useState(false)
    const [ displayErr , setDisplayErr ] = useState(false);
    const [ errMessage , setErrMessage ] = useState("");
    var [ isLoading , setIsLoading ] = useState(false);

    // reversing the reports array and creating a copy as i want to display it in reverse order 
    // newer item shold be on top 
    // const reports = originalReports.map(item => item).reverse();

    var userName;
    if(user.name){
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        userName = capitalizeFirstLetter(user.name);
    }

    const WeekPrice = async(stock,date)=>{
        // const results = await getWeekPriceData("519126.BSE" ,"2011-11-01")
        const results = await getWeekPriceData(stock  , date )
        .then( (res)=>{
            console.log("week price data",res)
            return res;
        })
        .catch( (err)=> console.log(err) )
        return results;
    }
    
    const [inputs, setInputs] = useState({
        stockName: null,
        desiredInvestedAmt: null,
        date:null
    });
    const { desiredInvestedAmt } = inputs;
    
    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
        setDisplayErr(false)
    }
    // var resultExplore ;
    async function handleSubmit (e) {
        e.preventDefault();
        // take data from on click
        // console.log(inputs, inputs.stockName,inputs.date )
        // WeekPrice(inputs.stockName,inputs.date);

        //get week Price information 
        if(!(inputs.stockName && inputs.date  && inputs.desiredInvestedAmt) ){
            console.log("these are inputs ",inputs)
            setErrMessage("Please Fill all the Fields")
            setDisplayErr(true)
            
        }else{
            console.log("these are inputs ",inputs)
            const [stockSymbol,stockname] = inputs.stockName.split("and");
            console.log("this is stockData",stockSymbol,stockname)
            const resultOfExplore = await WeekPrice( stockSymbol , inputs.date )
            console.log("indside handle submit",resultOfExplore);
            if(resultOfExplore){
                if(resultOfExplore.errMessage){
                    // errMessage = resultOfExplore.errMessage;
                    setErrMessage(resultOfExplore.errMessage);
                    setDisplayErr(true)
                }
                else{
                    // currently setting only results
                    const [stockSymbol,stockname] = inputs.stockName.split("and");
                    const formatResults = { stockSymbol,stockname, ...resultOfExplore }
                    setExploreResults(formatResults);
                    setIsLoading(false);
                    // resultExplore = resultOfExplore;
                    // console.log(resultOfExplore)
                    // console.log(formatResults)
                    // console.log(ExploreResults)
                    setShowExploreResults(!showExploreResults);
                }
            }

        }
    }

    return (
        <div className="dashboard">
                {/* <form  method="POST" onSubmit={handleSubmit} > */}
                <Fade right>
                <div className='dashboard-area'>

                    <div className="dashboard-text salsa name">
                        Hey {userName}
                    </div>
                    {
                        (showExploreResults)?null :
                        <>
                        <div className="pnl">
                            <span className="">Your Current P&L</span>
                            <span className="greenColor numberFont">₹ &nbsp;{totalPnl}</span>
                        </div>
                        <div className="pnlinfo">
                            <div className="pnl-info-label">
                                <span className="">Money Invested</span>
                                <span className="greenColor numberFont">₹ &nbsp;{investedAmount}</span>
                            </div>
                            <div className="pnl-info-numbers">
                                <span className="">Percentage of Return</span>
                                <span className="greenColor numberFont">{ Math.round( ( ( (totalPnl)/investedAmount)*100 ) * 100) / 100 }%</span>
                            </div>
                        </div>
                        </>
                    }
                

                    <div className="dashboard-text salsa dashboard-explore-text-wrapper">
                        <span className="salsa">
                            Explore the beauty of Investing      
                        </span>
                        
                        {
                            displayErr?<div className= "wrong-credentials-signup" >
                                        {/* <i className="ri-error-warning-line"></i> */}
                                            {errMessage} 
                                        </div>:null
                        }
                        {
                            showExploreResults &&
                            <span onClick={()=>{setShowExploreResults(!showExploreResults); setDisplayErr(false) }}>
                                <i className="ri-close-circle-line"></i>
                            </span>
                        }
                    </div>

                    {
                        (showExploreResults)?
                        <>
                            <div className="dashboard-text salsa dashboard-explore-text-stockName">
                                <span className="salsa">
                                    {/* Explore the beauty of Investing */}
                                    {/* {resultExplore}      */}
                                    {ExploreResults.stockname}
                                </span>
                            </div>
                            <div className=" dashboard-explore-notice">
                                <span className="">
                                    {/* Explore the beauty of Investing */}
                                    {/* {resultExplore}      */}
                                    The Data can be a bit tentitive, This is to estimate the % Returns for Long-term Investments.
                                </span>
                            </div>
                            <div className="explore-data-Wrapper">
                                <div>
                                    <div>Price on&nbsp; <p>{ExploreResults.firstEntryDate}</p>&nbsp; : </div>
                                    <div className="numberFont " >₹ &nbsp;{ExploreResults.updatedClose}</div>
                                </div>
                                <div>
                                    <div>Price on&nbsp; <p>{ExploreResults.givenWeekLastDay}</p>&nbsp; : </div>
                                    <div className="numberFont" >₹ &nbsp;{ExploreResults.givenWeekClose}</div>
                                </div>
                                <div>
                                    <div>Invested Amt&nbsp; :&nbsp; </div>
                                    <div className="numberFont" >₹ &nbsp;{inputs.desiredInvestedAmt}</div>
                                </div>
                                <div>
                                    <div>Estimated Curr. Value&nbsp; : &nbsp;</div>
                                    <div className="numberFont" >{`₹ \u00A0${ Math.round( ( inputs.desiredInvestedAmt* (1+ (ExploreResults.percentageChange /100) ) ) * 100) / 100 }` }</div>
                                </div>
                                <div>
                                    <div>P & L : </div>
                                    <div className="numberFont" >{`₹ \u00A0${ Math.round( ( inputs.desiredInvestedAmt* ((ExploreResults.percentageChange /100) ) ) * 100) / 100 }` }</div>
                                </div>
                                <div>
                                    <div>Percentage Change : </div>
                                    <div className="numberFont" >{`${ExploreResults.percentageChange } %`}</div>
                                </div>
                            </div>
                        </> :
                        <>
                            <form  method="POST" onSubmit={handleSubmit} >
                                <div class="dashboard-explore">
                                    <div class="dashboard-stock">
                                        <div class="dashboard-stock-text">
                                            If You Would have Invested A Total Of Rupees :
                                        </div>
                                        <div class="dashboard-stock-selectfield">
                                            <div class="form-credentials signup-form-input">
                                                <div>
                                                    {/* <i class="ri-user-fill"></i> */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <input type="number" name="desiredInvestedAmt" 
                                                    onChange={handleChange} value={desiredInvestedAmt} placeholder="Desired Invested Amount" required="true" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="dashboard-stock">
                                        <div class="dashboard-stock-text">
                                            In A Stock Named :
                                        </div>
                                        <div class="dashboard-stock-selectfield">
                                            <div class="form-credentials signup-form-input">
                                                <div>
                                                    {/* <i class="ri-user-fill"></i> */}
                                                    <i class="ri-bookmark-line"></i>
                                                    {/* <input type="text" name="name" placeholder="Choose Stock Name" /> */}
                                                    <select name="stockName" placeholder="Choose Stock Name"
                                                    onChange={handleChange}>
                                                    {/* <option value="Male">
                                                        Select an option
                                                    </option> */}
                                                    <option disabled selected hidden>Choose Stock Name</option>
                                                    {
                                                        (watchlistdata[0])?
                                                        watchlistdata.map( function (sname,index){
                                                            return(
                                                                <>
                                                                    <option value={`${watchlistdata[index]["stockSymbol"]}and${watchlistdata[index]["stockName"]} ` } >
                                                                        {watchlistdata[index]["stockName"]}
                                                                    </option>
                                                                </>
                                                            )
                                                        }):null
                                                    }

                                                    {/* <option value="Female">
                                                        Female
                                                    </option> */}
                                                </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="dashboard-date">
                                        <div class="dashboard-date-input">
                                            {/* <!-- <div class="dashboard-date-wrapper"> --> */}

                                                <div class="dashboard-date-text">
                                                    Around The Date : 
                                                </div>
                                                
                                                <div class="dashboard-date-selection">
                                                    <div class="form-credentials signup-form-input">
                                                        <div>
                                                            {/* <!-- <i>DOB</i> --> */}
                                                            <input type="date" name="date"
                                                            onChange={handleChange} placeholder="DOB" required/>
                                                        </div>
                                                    </div>
                                                </div>
                                            {/* <!-- </div> --> */}

                                        </div>
                                        <div class="dashboard-submit">
                                            <div class="form-credentials signup-submit ">
                                                <div>
                                                    {/* set errMessage codition set handle submit done */}
                                                    <button onClick={(e)=>{ handleSubmit(e); setIsLoading(true); } } 
                                                    type="submit" name="signup" id="signup" 
                                                    value="Register">
                                                        {
                                                            (isLoading)?
                                                            <>
                                                                <p>Please Wait</p>
                                                                <div className="loader" ></div> 
                                                            </>:
                                                            `Click Me to get the Results`

                                                        }
                                                    
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </>
                    }


                </div>

            </Fade>
                <NavbarMobile/>
            </div>
    )
}
