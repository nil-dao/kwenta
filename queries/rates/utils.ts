import { RateUpdates, Candles, Prices } from './types';
import Wei, { wei } from '@synthetixio/wei';
import { RateUpdateResult } from '@synthetixio/queries/build/node/generated/exchangesSubgraphQueries';
import { ethers } from 'ethers';
import { Synths } from 'constants/currency';
import { RATES_ENDPOINT_MAINNET, RATES_ENDPOINT_TESTNET } from './constants';
import { CandleResult } from 'queries/futures/subgraph';
import { Candle } from './types';
import { SYNTHS_ENDPOINT_MAIN } from 'queries/synths/constants';

export const getRatesEndpoint = (networkId: number): string => {
	return networkId === 1 || networkId === 42
		? SYNTHS_ENDPOINT_MAIN
		: networkId === 10
		? RATES_ENDPOINT_MAINNET
		: networkId === 69
		? RATES_ENDPOINT_TESTNET
		: RATES_ENDPOINT_MAINNET;
};

export const getMinAndMaxRate = (rates: RateUpdateResult[]): [Wei, Wei] => {
	if (rates.length === 0) return [wei(0), wei(0)];

	return rates.reduce(
		([minRate, maxRate], val) => {
			const { rate } = val;
			const newMax = rate.gt(maxRate) ? rate : maxRate;
			const newMin = rate.lt(minRate) ? rate : minRate;

			return [newMin, newMax];
		},
		[wei(ethers.constants.MaxUint256), wei(0)]
	);
};

export const calculateRateChange = (rates: RateUpdateResult[]): Wei => {
	if (rates.length < 2) return wei(0);

	const newPrice = rates[0].rate;
	const oldPrice = rates[rates.length - 1].rate;
	const percentageChange = newPrice.sub(oldPrice).div(oldPrice);

	return percentageChange;
};

export const mockHistoricalRates = (periodInHours: number, rate = 1, points = 100): RateUpdates => {
	let now = Date.now();

	const rates = [];

	for (let i = 0; i < points; i++) {
		rates.unshift({
			timestamp: now,
			rate,
		});
		now -= 1000 * 60 * periodInHours;
	}

	return rates;
};

export const mapLaggedDailyPrices = (prices: Candles): Prices => {
	return prices.map((candle) => {
		return {
			synth: candle.synth,
			price: Number(candle.average),
		};
	});
};

const markets = [
	Synths.sETH,
	Synths.sBTC,
	Synths.sLINK,
	Synths.sSOL,
	Synths.sAVAX,
	Synths.sMATIC,
	Synths.sAAVE,
	Synths.sUNI,
	Synths.sEUR,
	'sXAU',
	'sXAG',
	'sWTI',
	'sDYDX',
	'sAPE',
] as const;

const map: Record<typeof markets[number], string> = {
	[Synths.sETH]: 'ethereum',
	[Synths.sBTC]: 'bitcoin',
	[Synths.sLINK]: 'chainlink',
	[Synths.sSOL]: 'solana',
	[Synths.sAVAX]: 'avalanche-2',
	[Synths.sMATIC]: 'matic-network',
	[Synths.sAAVE]: 'aave',
	[Synths.sUNI]: 'uniswap',
	[Synths.sEUR]: 'euro',
	sXAU: '',
	sXAG: '',
	sWTI: '',
	sDYDX: 'dydx',
	sAPE: 'apecoin',
};

export const synthToCoingeckoPriceId = (synth: any) => {
	if (markets.includes(synth)) {
		return map[synth as typeof markets[number]];
	} else {
		return 'ethereum';
	}
};

export const mapCandles = (candles: CandleResult[]): Candle[] => {
	return candles?.map(({ id, synth, open, high, low, close, timestamp }: CandleResult) => {
		return {
			id: id,
			synth: synth,
			open: open.toNumber(),
			high: high.toNumber(),
			low: low.toNumber(),
			close: close.toNumber(),
			timestamp: timestamp.toNumber(),
		};
	});
};

export const mapPriceChart = (candles: CandleResult[]): Candle[] => {
	return candles?.map(({ id, synth, open, high, low, close, average, timestamp }: CandleResult) => {
		return {
			id: id,
			synth: synth,
			open: open.toNumber(),
			high: high.toNumber(),
			low: low.toNumber(),
			close: close.toNumber(),
			average: average.toNumber(),
			timestamp: timestamp.toNumber(),
		};
	});
};
