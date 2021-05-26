// insert your own api key
// get api key from https://coinmarketcap.com/api/
const api_key = 'placeholder';

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

	span {
		font-size: 16px;
		font-weight: normal;
	}

	div {
		width: auto;
		padding: 20px;
	}

	p {
		font-size: 2em;
		font-weight: 200;
		margin-top: 5px;
		margin-bottom:0;
	}
}`;

export const command = async (dispatch) => {
	execute(() => getCap(dispatch), update_interval);
};

const getCap = (dispatch) => {
	fetch(
		`http://127.0.0.1:41417/https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?CMC_PRO_API_KEY=${api_key}`
	)
		.then((res) => res.json())
		.then((data) => {
			fetch('https://api.coingecko.com/api/v3/global')
				.then((res) => res.json())
				.then((data2) => {
					return dispatch({
						cap: data.data.quote.USD.total_market_cap,
						change: data2.data.market_cap_change_percentage_24h_usd,
					});
				});
		});
};

export const updateState = (data, prev) => ({ ...prev, ...data });

const execute = (action, interval) => {
	action();
	setInterval(action, interval);
};

export const render = ({ cap, change }) => {
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	const num = `$ ${numberWithCommas(Math.round(cap))}`;
	console.log(change);

	return (
		<div className='cryptoMarketCap'>
			<span>Crypto Market Cap</span>
			<p>{num}</p>
			<span
				style={{
					color: change > 0 ? '#1dcc5a' : '#cf1111',
					fontWeight: 'normal',
				}}>
				{Number.parseFloat(change).toPrecision(3) + '%'}
			</span>
		</div>
	);
};

export const refreshFrequency = false;
