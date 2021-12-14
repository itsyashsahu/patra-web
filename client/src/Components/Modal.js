import React,{ useState,useEffect,useRef } from 'react'
import {useSelector,useDispatch} from 'react-redux';
import { setShowOptions } from '../redux/watchlistReducer';
import {updateHolding,updateSoldStock} from '../redux/holdingReducer'
import { setTransHistory } from '../redux/transHistoryReducer';
import { setReport } from '../redux/reportReducer';
import {updateUser} from '../redux/userReducer'
import lottie from "lottie-web";

import Draggable from 'react-draggable';
import axios from 'axios'


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


export default function Modal() {
    const [ isOrderExecuted , setisOrderExecuted ] = useState(false);
    // for setting up lotties 
    const container = useRef(null)
    useEffect( () => {
        lottie.loadAnimation({
            container: container.current,
            renderer:'svg',
            loop: true ,
            autoplay:true,
            animationData: require('../assests/lotties/80036-done.json')
        })
    },[isOrderExecuted])

    const container1 = useRef(null)
    useEffect( () => {
        lottie.loadAnimation({
            container: container1.current,
            renderer:'svg',
            loop: true ,
            autoplay:true,
            animationData: require('../assests/lotties/82611-done.json')
        })
    },[isOrderExecuted])


    const user = useSelector( (state)=> state.user.user );
    const [valueCheckbox , setValueCheckbox] = useState(false);
    const [ isFieldsSet, setIsFieldsSet ] = useState(false);
    // const value = false;
    const dispatch = useDispatch();
    // const showOptions = useSelector( (state)=> state.watchlist.showOptions )
    const stockData = useSelector( (state)=> state.watchlist.showOptionsStock )
    const holdings = useSelector( (state)=> state.holding.holdingArr )
    // console.log(holdings);
    const { option ,stockName, stockSymbol,currPrice } = stockData;
    // console.log("hellowasdlkfj",stockData,currPrice);
    const stock = holdings.find( (stock,index)=>{
        if(stock.stockSymbol===stockSymbol){
            // console.log(stockSymbol)
            return stock
        }
        return null;
    })
    

    const [inputs, setInputs] = useState({
        ordertypeMisCnc: '',
        ordertypeLimitMarket: '',
        setYourTarget:'',
        qty:'',
        // price:null
    });
    const {  qty } = inputs;

    function handleChange(e) {
        setIsFieldsSet(false);

        const { name, value } = e.target;

        if(name === "setYourTarget"){
            setValueCheckbox(valueCheckbox?false:true)
        }

        setInputs(inputs => ({ ...inputs, [name]: value }));

    }

    async function handleSubmit(e) {
        e.preventDefault();
        const {qty} = inputs;

        var transType = (option === 'buy')?"Bought":"Sold";
        const updateTransHistoryData ={
            stockName,
            transType,
            qty,
            "transPrice":currPrice,
            "purchased_at": new Date()
        }

        
        // since price is not set by user we are not checking it 
        // same goes for ordertypeLimitMarket
        if( (option==='buy' && qty>0 && user.fundsAvailable >= ((+qty)*currPrice) )  )
        {
            const finalInput = {...inputs,price: currPrice, option,stockSymbol ,stockName}
            // console.log("buy final inputs ",finalInput)
            const updateData= {
                stockName,
                "close":currPrice,
                stockSymbol,
                boughtQty:(+qty),
                buyPrice:currPrice
            }
            dispatch( updateHolding(updateData));
            
            // await axios.post('http://localhost:4000/holding/trans', finalInput)
            await axios.post('/api/holding/trans', finalInput)
            .then((res)=>{
                // console.log(res)
                if(res.status === 200){
                    console.log("Your Order has been Executed ")
                    setisOrderExecuted('buy');
                    dispatch(setTransHistory(updateTransHistoryData))

                    dispatch(updateUser(-(+qty)*currPrice))
                    const turnModalOff = () =>{
                        setisOrderExecuted(false);
                        dispatch( setShowOptions() )

                    }
                    setTimeout(turnModalOff, 1000);
                }
            })
            .catch((err)=>{
                console.log(err)
            })

        }else if ( ( option ==='sell' && qty <= ( (stock)?stock.qty:0 ) && qty ) ){
            const finalInput = {...inputs,price: currPrice, option,stockSymbol,stockName}
            console.log("sold final inputs ",finalInput)
            axios.post('api/holding/trans', finalInput)
            .then((res)=>{
                console.log(res)
                setisOrderExecuted('sell');
                const turnModalOff = () =>{
                    setisOrderExecuted(false);
                    dispatch( setShowOptions() )
                    dispatch(updateUser((+qty)*currPrice))
                    dispatch(setTransHistory(updateTransHistoryData))

                }
                setTimeout(turnModalOff, 1000);
                // turnModalOff()

            })
            .catch((err)=>{
                console.log(err)
            })
            const updateData= {
                stockSymbol,
                soldQuantity:(+qty),
                sellPrice:currPrice
            }
            dispatch( updateSoldStock(updateData));
            console.log("the qty and stock.qty is ",(+qty),stock.qty)
            if((+qty) === stock.qty ){
                const updateReportData = {
                    stockName,
                    "buyPrice":stock.price,
                    "sellPrice":currPrice,
                    qty
                }
                console.log("update reports data ",updateReportData,stock)
                dispatch(setReport(updateReportData))
            }


        }else{
            
            // when all the fields are not set 
            setIsFieldsSet(true)
            // console.log("baand baj gyi ")
        }

    }
    // if(showOptions){

    if(!isOrderExecuted){
        return(
            <>
            <Draggable handle="strong" cancel="strong2" >
            <div className="drag-wrapper">
            {
                <form method="POST" onSubmit={handleSubmit} >

                    <strong>
                    <div className={`orderType-header ${option}`} > 
                        <span>{stockName} <span>Qty : {qty} </span></span>
                        <strong2>
                        <span onClick={()=>{dispatch( setShowOptions() )}}>
                            <i className="ri-close-circle-line"></i>
                        </span>
                        </strong2>
                    </div>
                    </strong>
                    <div className="orderType-selection">
                        <span>
                                {/* NOTE I have Disaabled the limit order option */}
                            <input type="radio" name="ordertypeMisCnc" 
                                value="mis" onChange={handleChange} disabled/>Intraday MIS</span>  
                        <span><input type="radio" name="ordertypeMisCnc" 
                                value="cnc" onChange={handleChange} checked/>Longterm CNC</span>  
                    </div>
                    <div className="orderType">
                        <div className="orderTypeSection">
                            
                            <span> 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M7 5V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4zm8 2H9v12h6V7zM7 7H4v12h3V7zm10 0v12h3V7h-3zM9 3v2h6V3H9z"/></svg>
                                <input className="numberFont" type="Number" placeholder="Qty" name='qty' 
                                    onChange={handleChange}/> 
                            </span> 

                            {
                                (stockData.option==="buy")?
                                <>
                                <span>Margin Required : <p className='numberFont'>&nbsp;&nbsp;₹&nbsp;{Math.round( (qty*currPrice) * 100) / 100}</p> </span>
                                <span>funds Available : <p className='numberFont'>&nbsp;&nbsp;₹&nbsp;{ user.fundsAvailable }</p> </span>
                                <span>Balance After transaction:<p className='numberFont'>&nbsp;&nbsp;₹&nbsp;{user.fundsAvailable - (Math.round( (qty*currPrice) * 100) / 100)}</p>  </span>
                                </>
                                :null 
                            }
                            {
                                (stockData.option==="sell")?
                                <>
                                <span>Stocks Hold : <p className='numberFont'>{(stock)?stock.qty:'0 You Cannot Execute This Transaction'}</p> </span> 
                                <span>Ttl. Sell Value : <p className='numberFont'>{Math.round( (qty*currPrice) * 100) / 100}</p> </span>
                                {/* <span>Balance After transaction:funds+Ttl Sold Value </span> */}
                                <span>Balance After transaction:&nbsp;&nbsp;₹&nbsp;{user.fundsAvailable + (Math.round( (qty*currPrice) * 100) / 100)} </span>
                                
                                </>
                                :null 
                            }

                        </div>
                        <div className="orderTypeSection ">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {/* NOTE I have Disaabled the price option */}
                                <input className="numberFont" type="Number" placeholder={`Price : ${currPrice}`} name="price"
                                    onChange={handleChange} disabled /></span>  
                            <span className="ordertypeLimitMarket">

                                <span><input type="radio" name="ordertypeLimitMarket"
                                        value='market' onChange={handleChange} checked />Market</span>
                                        {/* NOTE I have Disaabled the limit order option */}
                                <span><input type="radio" name="ordertypeLimitMarket" 
                                        value='limit' onChange={handleChange} disabled/>Limit</span>
                            </span>    
                            <button className={option}>{option.toUpperCase()}</button>
                            <span className='orderType-extras'>
                                {
                                    (!isFieldsSet) &&  
                                    <>
                                    <span >
                                        <input type="checkbox" name="setYourTarget" 
                                                value={valueCheckbox?false:true}  onChange={handleChange} disabled/>      
                                        {/* <span>Set Your Target</span>  */}
                                    </span>
                                    <span>Set Your Target</span> 
                                    </>
                                }
                                {
                                    isFieldsSet && 
                                    <span className= "orderType-fill-all-fields" >
                                        <i className="ri-error-warning-line"></i>Please fill all Fields Correctly
                                    </span>
                                }
                                
                            </span>
                        </div>
                    </div>
                    {
                        // this code never gets executed because i have disabled the setYour Target Option 
                        valueCheckbox?
                        <div className="setTargetOptions">
                            <div className="setTargetOptions-section">
                                <span>
                                    <span>1st</span>
                                    <input type="Number" placeholder="Qty" />
                                </span>
                                <span>
                                    <span>2nd</span>
                                    <input type="Number" placeholder="Qty" />
                                </span>
                                <span>
                                    <span>3rd</span>
                                    <input type="Number" placeholder="Qty" />
                                </span>
                            </div>
                            <div className="setTargetOptions-section">
                                <input type="Number" placeholder="Price" />
                                <input type="Number" placeholder="Price" />
                                <input type="Number" placeholder="Price" />
                            </div>
                        </div>:null
                    }
                
                </form>

            }

            </div>
            </Draggable>
            </>
        )
    }else if(isOrderExecuted ==='buy'){
        return(
            <Draggable>
                <div className="drag-wrapper">
                    <div className="lottie-modal-buy" ref={container} ></div>
                </div>
            </Draggable>
            )
    }else if(isOrderExecuted==='sell'){
        return (
            <Draggable>
                <div className="drag-wrapper">
                    <div className="lottie-modal-buy" ref={container1} >
                    </div>
                </div>
            </Draggable>
        )
    }
}