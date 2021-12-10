import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    totalPnl : 0 ,
    investedAmount : 0 ,
    currentValue : 0,
    holdingArr : []
  }
// both the given code perform same task bas yeh thoda kam code 
// likhna pada aur purane parameters bhi pass nhi krne pade


export const holdingReducer = createSlice({
    name:"holding",
    initialState,
    reducers:{
        setHolding:(state,action)=>{
            const payload = action.payload;
            state.holdingArr.push(payload)

        },
        updateHolding:(state,action)=>{
            const payload = action.payload;
            // console.log('hellalsdkfjaslk',payload)
            
            // find the stock 
            var stockIndex;
            // console.log("mila kya index ", stockIndex)
            state.holdingArr.find( (stock,index)=>{
                // console.log(stock.stockSymbol , payload.stockSymbol)
                if(stock.stockSymbol===payload.stockSymbol){
                    stockIndex = index
                    // console.log("mila gaya index ", stockIndex)
                    return stock
                }else{
                }
            })
            
            
            // console.log(stockIndex,payload.boughtQty,stockIndex===null,(stockIndex !=0) ,!(stockIndex))

            // if( (stockIndex>0) || !(stockIndex==0) ){

            // below one this contion is failing when there is only one or when the element with index 0 is clicked 
            // if( !(stockIndex) && (stockIndex !=0) ) {
            if( (stockIndex >=0)) {

                state.holdingArr.find( (stock,index)=>{

                    if(stock.stockSymbol===payload.stockSymbol){
                        stock.price = ( ( (stock.price*stock.qty)+(payload.boughtQty*payload.buyPrice) ) / ((payload.boughtQty) + (+stock.qty)) )
                        stock.price = Math.round( ( stock.price) * 100) / 100
                        stock.qty = ((payload.boughtQty) + (+stock.qty) );
                        return stock
                    }
    
                })
                
                console.log("this is when it has an index ")
            }else if(!(stockIndex)){
                const data = {
                    stockSymbol:payload.stockSymbol,
                    "close":payload.close ,
                    stockName:payload.stockName ,
                    qty:payload.boughtQty,
                    price:payload.buyPrice,
                }
                state.holdingArr.push(data)
                console.log("this is when it is undefined ")
                
            }
            // else {

            //     state.holdingArr.find( (stock,index)=>{

            //         if(stock.stockSymbol===payload.stockSymbol){
            //             stock.price = ( ( (stock.price*stock.qty)+(payload.boughtQty*payload.buyPrice) ) / ((payload.boughtQty) + (+stock.qty)) )
    
            //             stock.qty = ((payload.boughtQty) + (+stock.qty) );
            //             return stock
            //         }
    
            //     })
            // }

            // updating the quickdashboard details 
            state.investedAmount= 0 ;
            state.currentValue = 0;
            state.totalPnl = 0 ;

            state.holdingArr.map( function (resFinal,index){

                var stockInvestedAmount = ( ( resFinal.close * (+resFinal.qty) ))
                state.investedAmount = state.investedAmount +  stockInvestedAmount;
                state.investedAmount = Math.round( ( state.investedAmount +  stockInvestedAmount) * 100) / 100;

                // calcutating totalPnl 
                var stockPnl = ( (resFinal.close - resFinal.price)*(+resFinal.qty) )
                state.totalPnl = Math.round( ( state.totalPnl + stockPnl) * 100) / 100;
                
                // calculating current value 
                var stockCurrValue = ( resFinal.close*(+resFinal.qty) )
                state.currentValue = Math.round( ( state.currentValue + stockCurrValue) * 100) / 100;

                // return sname;
            })
        },
        calculateTotal:(state,action)=>{
            var resFinal = action.payload;
            // console.log("this is invested ant outside",state.investedAmount,action.payload)
            // calculating the ttlinvested amount 
            
            var stockInvestedAmount = ( ( resFinal.close * (+resFinal.qty) ))
            state.investedAmount = state.investedAmount +  stockInvestedAmount;
            state.investedAmount = Math.round( ( state.investedAmount +  stockInvestedAmount) * 100) / 100;

            // calcutating totalPnl 
            var stockPnl = ( (resFinal.close - resFinal.price)*(+resFinal.qty) )
            state.totalPnl = Math.round( ( state.totalPnl + stockPnl) * 100) / 100;
            
            // calculating current value 
            var stockCurrValue = ( resFinal.close*(+resFinal.qty) )
            state.currentValue = Math.round( ( state.currentValue + stockCurrValue) * 100) / 100;
            // state.holdingArr.map( function (sname,index){
            //     console.log("this is invested ant before",state.investedAmount)
            //     state.investedAmount = state.investedAmount +  (sname.qty*sname.price);
            //     console.log("this is invested ant",state.investedAmount)
            //     return sname;
            // })
        },
        updateSoldStock:(state,action)=>{
            // console.log(action.payload)
            const payload = action.payload;

            // finding the stock that has been clicked
            var stockIndex;
            state.holdingArr.find( (stock,index)=>{
                if(stock.stockSymbol===payload.stockSymbol){
                    stockIndex = index
                    return stock
                }
            })

            //firstly substracting the stockPnl 
            state.totalPnl = state.totalPnl - ((+payload.soldQuantity)*(state.holdingArr[stockIndex]["close"] - state.holdingArr[stockIndex]["price"]) ) ;
            
            state.investedAmount = state.investedAmount - ((+payload.soldQuantity)*state.holdingArr[stockIndex]["price"] ) 

            state.currentValue = state.currentValue - ((+payload.soldQuantity)*state.holdingArr[stockIndex]["close"] )
            // if all the stocks are sold remove the entry in the array 
            if( payload.soldQuantity == state.holdingArr[stockIndex]["qty"]  )
            {
                // console.log("quanitta")
                state.holdingArr.splice(state.holdingArr.findIndex(a => a.stockSymbol === payload.stockSymbol) , 1)
            }else{
                // else substract the qty that has been sold 
                state.holdingArr[stockIndex]["qty"] = Number( (+state.holdingArr[stockIndex]["qty"]) - (+payload.soldQuantity) );           
            }

            
        }
    }
})

export const {setHolding,updateHolding,calculateTotal,updateSoldStock} = holdingReducer.actions; 

export default holdingReducer.reducer;




