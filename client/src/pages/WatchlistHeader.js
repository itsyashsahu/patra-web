import React from 'react';
// import '../assests/style.css';

export default function WatchlistHeader() {
    return (
            <div className="watchlist-header">
                <div className="watchlist-header-items">
                    <span className="watchlist-header-items-label shift-nifty">Nifty</span>
                    <span className="watchlist-header-items-number numberFont">
                        <span className="watchlist-header-items-number-change numberFont">+123% </span>
                        17000
                    </span>
                </div>
                <div className="watchlist-header-items">
                    <span className="watchlist-header-items-label">Sensex</span>
                    <span className="watchlist-header-items-number numberFont">
                        <span className="watchlist-header-items-number-change numberFont">+123% </span>
                        17000
                    </span>
                </div>
            </div>
    )
}
