import React,{useState,useEffect,useRef} from 'react'
import {Link, useHistory } from 'react-router-dom'
import NavbarMobile from './NavbarMobile'
import QuickDashboard from './QuickDashboard'
import {useSelector} from 'react-redux';
import axios from 'axios'
import {useDispatch} from 'react-redux';
import { setWatchlist,removeStockEntry} from '../redux/watchlistReducer';
import { getPriceData } from './Watchlist';
import Fade from 'react-reveal/Fade';
// import {getPriceData} 
import lottie from "lottie-web";


export default function SearchStock() {

    const container = useRef(null)
    useEffect( () => {
        lottie.loadAnimation({
            container: container.current,
            renderer:'svg',
            loop: true ,
            autoplay:true,
            animationData: require('../assests/lotties/79796-loader.json')
        })
    },[])

    const dispatch = useDispatch();
    const history = useHistory();

    var addStockData ;
    var [ addStockDataState , setAddStockDataState ] = useState()
    var watchlistdata = useSelector( (state) => state.watchlist.watchlistArr )
    
    var isFound;
    var isStockFound = false;
    
    var stock = useSelector( (state) => state.watchlist.searchStock );

    const [stockSearched,setStockSearched ] = useState("");
    const [ searchResults, setSearchResults ] = useState( [] );
    var [ isLoading , setIsLoading ] = useState(false);
    
    //searched results are stored in searchResults array hook
    async function search(keyword) {

        try{

            if(keyword.length>1){
                let url1 = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=ZTR22AB0MG26X48D`;
                let results = await fetch(url1);
                results = await results.json();
                console.log("Now Searched gets Called");
                let rawdata = [];
                if(results.bestMatches){
                    rawdata = results.bestMatches.filter( function(el) {
                        return el["4. region"] === "India/Bombay"; 
                    } );
                }else{
                    rawdata= [results]
                    console.log(rawdata[0].Note);
                }
                setSearchResults(rawdata);
            }

        }catch(err){
            console.log(err);
        }
    }
    
    useEffect( () => {

        setStockSearched(stock);    
        // console.log("search keyword final thourg useEffect ::",stock);
        search(stock);
        return () => null
    }, [ stock , addStockData]);

    function handleChange(e) {
        const searched = e.target.value;
        setStockSearched(searched);
        console.log("This is the lenght",searched.length);
        if(searched.length>3){
            search(stockSearched);
        }
    }
    function handleSubmit(e) {
        e.preventDefault();
        console.log("search keyword final",stockSearched);
        search(stockSearched);

    }

    const userId = useSelector( (state) =>{
        // console.log('this is the sate',state.user.user.userId);
        return state.user.user.userId;
    })
    // const uid = { "userId": userId };

    const addStock = async (stockSymbol,stockName) =>{
        // setAddStockData({ 
        //     stockName,
        //     stockSymbol
        // })
        addStockData = { 
            stockName,
            stockSymbol
        }
        setAddStockDataState(addStockData)
        watchlistdata.find( (stock,index)=>{
            if(stock.stockName === stockName ){
                isFound = true;
            }
            return null;
        })

        if(!isFound){

            try{
                axios.post('api/watchlist/add', addStockData)
                .then(async (res)=>{
                    if(res.status === 200){
    
                        // dispatch( setWatchlist( ...addStockData ) ) 
                        var addStockArr= { ...addStockData }
                        // console.log(addStockData,"arr",addStockArr)
    
                        await getPriceData(stockSymbol)
                        .then( (res)=>{
                            // console.log("this it result of get price data of add stock ",res);
                            addStockArr={ ...addStockArr,...res}
                            setIsLoading(false)
                            history.push('./watchlist');
                        })
                        
                        dispatch( setWatchlist( addStockArr ) )
                    }
                })
                .catch((err)=>console.log(err) );
    
            }catch(err){
                console.log(err);
            }
        }
    }

    const removeStock = async (stockSymbol) =>{
        try{
            const removeStockData = {
                userId,
                stockSymbol,
            }
            console.log("this is removeSotkc ",removeStockData)
            axios.post('api/watchlist/remove',removeStockData)
            .then( (res)=>{
                console.log("the stock got removed",res);
                // watchlistdata.pull
                // console.log(watchlistdata , stockSymbol)
                dispatch(removeStockEntry(stockSymbol));
                
                setIsLoading(false)
                // watchlistdata.splice( watchlistdata.findIndex(item => item.stockSymbol === stockSymbol), 1);
                // console.log(watchlistdata)
            })
            .catch((err)=>console.log(err))
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="searchStock">
        <Fade right >
        <form onSubmit={handleSubmit}>
        <div className="searchStock-text">
            <div>Search Results</div>
            <div>
                <input type="input" className="form__field" 
                value={stockSearched} onChange={handleChange}
                placeholder="Add Stock" />
                <div onClick={handleSubmit} >
                <Link to="#" >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"/></svg>
                </Link>
                </div>
            </div>
        </div>
        </form>
        <div className="searchresSection">

            {
                searchResults.map(function (sname,index){
                    // means when our API gave use the Data 
                    if(!searchResults[0].Note){
                        isStockFound= false;
                        watchlistdata.find( (stock,indexArr)=>{
                            // console.log(watchlistdata)
                            if(stock.stockName === searchResults[index]["2. name"] ){
                                // console.log(stock.stockName, "and ",searchResults[index]["2. name"])
                                isStockFound = true;
                                return null;
                            }
                            return null;
                        })

                        // console.log("the stock ",searchResults[index]["2. name"],"and the result ",isStockFound)
                        console.log("the results is ",addStockDataState)
                        return(
                            <>
                            <Fade top>
                            <div className="searchresItem">
                                <div>{ searchResults[index]["2. name"]}</div>
                                {
                                    
                                    isStockFound?
                                    <div onClick={ () => removeStock(  searchResults[index]["1. symbol"] ) } >
                                        {/* \onClick={() => { setEntrydata( data[index]["1. symbol"] ); }  */}
                                        <Link to="#" >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                            <path fill="none" d="M0 0h24v24H0z"/>
                                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-9h10v2H7v-2z"/>
                                        </svg>
                                        </Link>
                                    </div>:
                                    
                                        (isLoading)? 
                                            // (addStockData)?
                                            (addStockDataState.stockSymbol === searchResults[index]["1. symbol"] )?
                                                <div>
                                                    {/* is lo */}
                                                    {/* <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                                        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                                                        </svg> */}
                                                    <div className="loader" ></div>
                                                </div>
                                            :
                                            <div onClick={ () =>{ addStock( searchResults[index]["1. symbol"] , searchResults[index]["2. name"] ); setIsLoading(true)}  } >
                                                {/* \onClick={() => { setEntrydata( data[index]["1. symbol"] ); }  */}
                                                <Link to="#" >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/></svg>
                                                </Link>
                                            </div>
                                        :
                                            
                                        <div onClick={ () =>{ addStock( searchResults[index]["1. symbol"] , searchResults[index]["2. name"] ); setIsLoading(true)}  } >
                                            {/* \onClick={() => { setEntrydata( data[index]["1. symbol"] ); }  */}
                                            <Link to="#" >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/></svg>
                                            </Link>
                                        </div>

                                }
                            </div>
                            </Fade>
                            </>
                        )
                    }
                    else{
                        return(
                            <>
                            <div className="searchresItem">
                                <div>{ searchResults[0].Note}</div>
                                {/* <div>
                                    <Link to="#">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/></svg>
                                    </Link>
                                </div> */}
                            </div>
                            </>
                        )
                    }

                } )
            }

        </div>

        </Fade>
                   
        <QuickDashboard/>
        
        <NavbarMobile/>
        
        </div>
    )
}
