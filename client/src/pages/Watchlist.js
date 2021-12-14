import React,{useEffect,useState} from 'react';
import {Link,useHistory,useLocation} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import { setWatchlist,setSearchStock,removeStockEntry,setShowOptions,setTransOption} from '../redux/watchlistReducer';
import {setHolding,calculateTotal} from '../redux/holdingReducer'
import { setTransHistory } from '../redux/transHistoryReducer';
import { setReport } from '../redux/reportReducer';
import {setUser } from '../redux/userReducer'
import axios from 'axios'
import NavbarMobile from './NavbarMobile'
// this set the authorization token for every axios request;
import setAuthToken from '../Components/setAuthToken';
// this is the function that returns the prices of the stock provided to it
// this also filters the stocks available in NSE or BSE
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


export default function Watchlist() {
    var history = useHistory();
    let location = useLocation();

    const dispatch = useDispatch();
    const [input, setInput] = useState('')

    // this mobile variable and useEffect is made to fix the watchlist in mobile view 
    // by dynamically applying the class watchlistMobile to watchlist div 
    // on a contition that if path is '/watchlist' then the class is applied  
    const [mobile, setMobile] = useState(history.location.pathname);
    useEffect(() => {
        // console.log("asdlkjfhasdjkj",window.location.pathname)
        // console.log("welcome to watchlist ")  
        if(window.location.pathname === '/watchlist'){
            setMobile("watchlistMobile")
        }else{
            setMobile('')
        }

    }, [location]);

    // this stockData hook contains the data of the stock clicked 
    const stockData = useSelector( (state)=> state.watchlist.showOptionsStock )

    // this is to check wether if user is already in 
    // buy option modal so that it is able to swtich dynamically between buy and sell modals 

    var option ;
    if(stockData){
        option = stockData.option;
    }

    // this contains the data of the watchlist held by user 
    var watchlistdata = useSelector( (state) => state.watchlist.watchlistArr )

    const setHoldingsData = () =>{
        // getting holdings data
        var resFinal;
        // axios.post('http://localhost:4000/holding/', uid)
        axios.get('api/holding/')
        .then( (res)=>{
            // console.log(res)
            res.data.map(async function (sname,index){
                var holdingsdata = res.data[index];
                await getPriceData( res.data[index].stockSymbol )
                .then( (res)=>{
                    resFinal = {  ...res , ...holdingsdata };
                    dispatch( setHolding(resFinal) ) ;
                    return res;
                })
                .then( () => {
                    dispatch(calculateTotal(resFinal));
                })
                .catch((err)=>console.log(err) );             
            })
        })
        .catch( (err) => console.log(err));

    }
    const setTransHistoryData =() =>{
        // axios.post('http://localhost:4000/transHistory/', uid)
        axios.get('api/transHistory/')
        .then( (res)=>{
            res.data.map(async function (sname,index){
                dispatch(setTransHistory(sname))                           
            })
        })
        .catch( (err) => console.log(err));
    }
    const setReportData =() =>{
        // axios.post('http://localhost:4000/report/', uid)
        axios.get('api/report/')
        .then( (res)=>{
            res.data.map(async function (sname,index){
                dispatch(setReport(sname))
            })
        })
        .catch( (err) => console.log(err));
    }
    const setUserData =() =>{
        // axios.post('http://localhost:4000/users/getinfo', uid)
        axios.get('api/users/getinfo')
        .then( (res)=>{
            // console.log(res);
            dispatch(setUser(res.data))
                 
        })
        .catch( (err) => console.log(err));
    }

    useEffect( () => {

        // setting auth token 
        const token = sessionStorage.getItem('jwtToken')
        setAuthToken(token); 

        // getting users watchlist stocks 
        axios.get('api/watchlist')
        .then( (res) => {

            res.data.map(async function (sname,index){
                    //getting the price data of those stocks which we get in the watchlist of the user 
                var stockName = res.data[index].stockName;

                await getPriceData( res.data[index].stockSymbol )
                .then( (res)=>{
                    var resFinal = { "stockName":stockName , ...res };
                    dispatch( setWatchlist(resFinal) ) ;
                    return res;
                })
                .catch((err)=>console.log(err) );
            })
        })
        .catch( (err) => console.log(err));
        
        //setting holdings
        setHoldingsData();
        setTransHistoryData();
        setReportData();
        setUserData();
    },[])

    function handleChange(e) {
        const search = e.target.value;
        setInput(search);
    }
    function handleSubmit(e) {
        e.preventDefault();
        dispatch(setSearchStock(input));
        history.push("./searchstock")
    }

    const removeStock = async (stockSymbol) =>{
        try{
            const removeStockData = {
                stockSymbol,
            }
            axios.post('api/watchlist/remove',removeStockData)
            .then( (res)=>{
                console.log("the stock got removed",res);
                dispatch(removeStockEntry(stockSymbol));
            })
            .catch((err)=>console.log(err))
        }catch(err){
            console.log(err)
        }
    }

    
    return (
        <div class = {`watchlist ${mobile}`}>
            
            <form method="POST" onSubmit={handleSubmit}>
            <div className="watchlist-item-header">

                <div className="">
                    <input type="input" className="form__field" 
                    value={input} onChange={handleChange}
                    placeholder="    Add Stocks" />
                </div>
                <div>
                    <Link onClick={handleSubmit} >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"/></svg>
                    </Link>
                </div>
            </div>    
            </form>
            <div className="watchlist-item-section">

            { (watchlistdata[0])?
                watchlistdata.map( function (sname,index){
                    return(
                        <>
                            <div className="watchlist-item">
                                <span className={`watchlist-items-label ${watchlistdata[index]["stockEndedIn"]}`}>{ watchlistdata[index]["stockName"]}</span>
                                <span className="watchlist-options" >

                                    
                                    {/* buy link  */}
                                    <Link onClick={ ()=>{

                                        if( option ==='sell'){
                                            dispatch(setTransOption());
                                        }
                                        else {
                                            var clickedStockData = {
                                                stockName:watchlistdata[index]["stockName"],
                                                stockSymbol:watchlistdata[index]["stockSymbol"],
                                                currPrice:watchlistdata[index]["close"],
                                                option:"buy"
                                            }
                                            dispatch(setShowOptions( clickedStockData ) )
                                            
                                        }
                                    } } to="#">                   
                                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M50 96C75.4051 96 96 75.4051 96 50C96 24.5949 75.4051 4 50 4C24.5949 4 4 24.5949 4 50C4 75.4051 24.5949 96 50 96Z" stroke="#81C384" strokeWidth="8"/>
                                        <path d="M55.4653 49.6909C58.9207 50.4966 61.3467 51.4723 62.7432 52.6182C64.7484 54.2474 65.751 56.36 65.751 58.9561C65.751 61.6953 64.6499 63.9601 62.4478 65.7505C59.7443 67.9168 55.8145 69 50.6582 69H32.1548V68.0063C33.8377 68.0063 34.9746 67.8542 35.5654 67.5498C36.1742 67.2275 36.5949 66.8158 36.8276 66.3145C37.0783 65.8132 37.2036 64.5778 37.2036 62.6084V38.9756C37.2036 37.0062 37.0783 35.7708 36.8276 35.2695C36.5949 34.7503 36.1742 34.3385 35.5654 34.0342C34.9567 33.7298 33.8198 33.5776 32.1548 33.5776V32.584H49.6108C53.7824 32.584 56.7365 32.96 58.4731 33.7119C60.2098 34.446 61.5794 35.556 62.582 37.042C63.5846 38.5101 64.0859 40.0767 64.0859 41.7417C64.0859 43.4963 63.4504 45.0628 62.1792 46.4414C60.908 47.8021 58.6701 48.8853 55.4653 49.6909ZM45.6899 48.9658C48.2323 48.9658 50.1032 48.6794 51.3027 48.1064C52.5202 47.5335 53.4512 46.7279 54.0957 45.6895C54.7402 44.651 55.0625 43.3262 55.0625 41.7148C55.0625 40.1035 54.7402 38.7876 54.0957 37.7671C53.4691 36.7287 52.5649 35.9409 51.3833 35.4038C50.2017 34.8667 48.3039 34.6071 45.6899 34.625V48.9658ZM45.6899 51.0605V62.7427L45.6631 64.0854C45.6631 65.0522 45.9048 65.7863 46.3882 66.2876C46.8895 66.771 47.6235 67.0127 48.5903 67.0127C50.0226 67.0127 51.3385 66.6994 52.5381 66.0728C53.7555 65.4282 54.6865 64.5062 55.3311 63.3066C55.9756 62.0892 56.2979 60.7375 56.2979 59.2515C56.2979 57.5506 55.904 56.0288 55.1162 54.686C54.3285 53.3254 53.2453 52.3765 51.8667 51.8394C50.4881 51.3022 48.4292 51.0426 45.6899 51.0605Z" fill="#81C384"/>
                                    </svg>
                                    </Link>
                                    {/* sell link  */}
                                    <Link to="#" onClick={ ()=>{
                                        if( option ==='buy'){
                                            dispatch(setTransOption());
                                        }
                                        else {
                                            var clickedStockData = {
                                                stockName:watchlistdata[index]["stockName"],
                                                stockSymbol:watchlistdata[index]["stockSymbol"],
                                                currPrice:watchlistdata[index]["close"],
                                                option:"sell"
                                            }
                                            dispatch(setShowOptions( clickedStockData ) )
                                            
                                        }
                                    } } >
                                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="50" cy="50" r="46" stroke="#E57373" strokeWidth="8"/>
                                        <path d="M59.835 31.7515L60.1304 43.8901H59.0293C58.5101 40.8465 57.23 38.4027 55.189 36.5586C53.1659 34.6966 50.9727 33.7656 48.6094 33.7656C46.7832 33.7656 45.333 34.258 44.2588 35.2427C43.2025 36.2095 42.6743 37.3285 42.6743 38.5996C42.6743 39.4053 42.8623 40.1214 43.2383 40.748C43.7575 41.5895 44.59 42.422 45.7358 43.2456C46.5773 43.8364 48.5199 44.8838 51.5635 46.3877C55.8245 48.4824 58.6981 50.4608 60.1841 52.3228C61.6522 54.1847 62.3862 56.3153 62.3862 58.7144C62.3862 61.758 61.1956 64.3809 58.8145 66.583C56.4512 68.7673 53.4434 69.8594 49.791 69.8594C48.6452 69.8594 47.562 69.743 46.5415 69.5103C45.521 69.2775 44.2409 68.8389 42.7012 68.1943C41.8418 67.8363 41.1346 67.6572 40.5796 67.6572C40.1141 67.6572 39.6217 67.8363 39.1025 68.1943C38.5833 68.5524 38.1626 69.0985 37.8403 69.8325H36.8467V56.0825H37.8403C38.6281 59.9497 40.141 62.9038 42.3789 64.9448C44.6348 66.9679 47.0607 67.9795 49.6567 67.9795C51.6619 67.9795 53.2554 67.4334 54.437 66.3413C55.6366 65.2492 56.2363 63.978 56.2363 62.5278C56.2363 61.6685 56.0036 60.8359 55.5381 60.0303C55.0905 59.2246 54.4012 58.4637 53.4702 57.7476C52.5392 57.0135 50.8921 56.0646 48.5288 54.9009C45.2166 53.2716 42.8354 51.8841 41.3853 50.7383C39.9351 49.5924 38.8161 48.3123 38.0283 46.8979C37.2585 45.4836 36.8735 43.9259 36.8735 42.2251C36.8735 39.3247 37.9388 36.854 40.0693 34.813C42.1999 32.772 44.8854 31.7515 48.126 31.7515C49.3076 31.7515 50.4535 31.8947 51.5635 32.1812C52.4049 32.396 53.4255 32.7988 54.625 33.3896C55.8424 33.9626 56.6929 34.249 57.1763 34.249C57.6418 34.249 58.0088 34.1058 58.2773 33.8193C58.5459 33.5329 58.7965 32.8436 59.0293 31.7515H59.835Z" fill="#E57373"/>
                                    </svg>
                                    </Link> 
                                </span>
                                <span className={` ${watchlistdata[index]["stockEndedIn"]}`}>₹{ watchlistdata[index]["close"]}</span>
                                <span className="watchlist-items-number">
                                    <span className={`watchlist-items-number-change ${watchlistdata[index]["stockEndedIn"]}`}>{ watchlistdata[index]["change"]}</span>
                                    <Link onClick={ () => removeStock(  watchlistdata[index]["stockSymbol"] ) } to="#"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="none" d="M0 0h24v24H0z"/>
                                        <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"/>
                                    </svg>                  
                                    </Link>
                                </span>
                            </div>
                        </>
                    )
                }):""
                
            }

            </div>
            <div>
            <div className="watchlist-item-caution numberFont">
                    The Api supports only 5 calls per minute please make sure your holdings and watchlist combined have 5 entries to ensure proper working. The Prices will update next working day.
            </div>
            <div className="watchlist-nav">
                <div className="watchlist-nav-items"><Link to="#">1</Link></div>
                <div className="watchlist-nav-items"><Link to="#">2</Link></div>
                <div className="watchlist-nav-items"><Link to="#">3</Link></div>
                <div className="watchlist-nav-items"><Link to="#">4</Link></div>
                <div className="watchlist-nav-items"><Link to="#">5</Link></div>
            </div>
            {(mobile==='watchlistMobile')?<NavbarMobile/>:null}
            </div>
        </div>
    )
}
