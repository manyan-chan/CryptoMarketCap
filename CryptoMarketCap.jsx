/*
Copyright (c) 2021, Manyan Chan
All rights reserved.

This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree. 
*/

// update every 5 mins
const update_interval = 1000 * 60 * 5;
export const className = `
	top: 150px;
	right: 20px;
	color: #fff;
	font-family: Helvetica Neue;
	border-radius: 10px;
	background-color: rgba(0,0,0,0.3);
	text-align: right;
	-webkit-font-smoothing: antialiased;
	p {
		margin: 0;
		font-size: 16px;
	}
	div {
		width: auto;
		padding: 20px;
	}
	.Number {
		font-size: 30px;
		font-weight: 200;
		margin-top: 5px;
		margin-bottom:0;
	}
	.Positive{
		color: #1dcc5a;
		font-size: 16px;
	}
	.Negative{
		color: #cf1111;
		font-size: 16px;
	}
}`;

export const command = async (dispatch) => {
	execute(() => getCap(dispatch), update_interval);
};

const getCap = (dispatch) => {
	fetch('https://api.coingecko.com/api/v3/global')
		.then((res) => res.json())
		.then((data) => {
			return dispatch({
				cap: data.data.total_market_cap.usd,
				change: data.data.market_cap_change_percentage_24h_usd,
			});
		});
};

export const updateState = (data, prev) => ({ ...prev, ...data });

const execute = (action, interval) => {
	action();
	setInterval(action, interval);
};

export const render = ({ cap, change }) => {
	const numberWithCommas = (x) => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	const num = `$ ${numberWithCommas(Math.round(cap))}`;
	// console.log(change);

	return (
		<div className='CryptoMarketCap'>
			<p>Crypto Market Cap</p>
			<p className='Number'>{num}</p>
			<p className={change > 0 ? 'Positive' : 'Negative'}>
				{Number.parseFloat(change).toFixed(2) + '%'}
			</p>
		</div>
	);
};

export const refreshFrequency = false;
