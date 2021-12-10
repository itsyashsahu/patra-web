import { configureStore } from '@reduxjs/toolkit'

import  userReducer  from './userReducer'
import watchlistReducer from './watchlistReducer'
import holdingReducer from './holdingReducer'
import transHistoryReducer from './transHistoryReducer'
import reportReducer from './reportReducer'

export const store = configureStore({
  reducer: {
    user : userReducer,
    watchlist : watchlistReducer,
    holding : holdingReducer,
    transHistory : transHistoryReducer,
    report : reportReducer
  },
})

