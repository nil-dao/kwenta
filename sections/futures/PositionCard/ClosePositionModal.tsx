import { FC, useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import useSynthetixQueries from '@synthetixio/queries';
import Wei, { wei } from '@synthetixio/wei';

import TransactionNotifier from 'containers/TransactionNotifier';
import BaseModal from 'components/BaseModal';
import { FlexDivCentered, FlexDivCol } from 'styles/common';
import { PositionSide } from '../types';
import { Synths } from 'constants/currency';
import { formatCurrency, formatNumber, zeroBN } from 'utils/formatters/number';
import { getFuturesMarketContract } from 'queries/futures/utils';
import Connector from 'containers/Connector';
import Button from 'components/Button';
import { newGetExchangeRatesForCurrencies, synthToAsset } from 'utils/currencies';
import useSelectedPriceCurrency from 'hooks/useSelectedPriceCurrency';
import { newGetTransactionPrice } from 'utils/network';
import { gasSpeedState } from 'store/wallet';
import { CurrencyKey } from '@synthetixio/contracts-interface';
import { KWENTA_TRACKING_CODE } from 'queries/futures/constants';
import { currentMarketState, positionState } from 'store/futures';
import { useRefetchContext } from 'contexts/RefetchContext';

type ClosePositionModalProps = {
	onDismiss: () => void;
};

const ClosePositionModal: FC<ClosePositionModalProps> = ({ onDismiss }) => {
	const { t } = useTranslation();
	const { synthetixjs } = Connector.useContainer();
	const { useEthGasPriceQuery, useExchangeRatesQuery, useSynthetixTxn } = useSynthetixQueries();
	const ethGasPriceQuery = useEthGasPriceQuery();
	const exchangeRatesQuery = useExchangeRatesQuery();
	const gasSpeed = useRecoilValue(gasSpeedState);
	const { selectedPriceCurrency } = useSelectedPriceCurrency();
	const [error, setError] = useState<string | null>(null);
	const [orderFee, setOrderFee] = useState<Wei>(wei(0));
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const currencyKey = useRecoilValue(currentMarketState);
	const position = useRecoilValue(positionState);
	const positionDetails = position?.position;

	const { handleRefetch } = useRefetchContext();

	const exchangeRates = useMemo(
		() => (exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null),
		[exchangeRatesQuery.isSuccess, exchangeRatesQuery.data]
	);

	const ethPriceRate = useMemo(
		() => newGetExchangeRatesForCurrencies(exchangeRates, Synths.sETH, selectedPriceCurrency.name),
		[exchangeRates, selectedPriceCurrency.name]
	);

	const gasPrice = ethGasPriceQuery.data?.[gasSpeed] ?? null;

	const closeTxn = useSynthetixTxn(
		`FuturesMarket${currencyKey?.[0] === 's' ? currencyKey.substring(1) : currencyKey}`,
		'closePositionWithTracking',
		[KWENTA_TRACKING_CODE],
		gasPrice ?? undefined,
		{ enabled: !!currencyKey }
	);

	const transactionFee = useMemo(
		() =>
			newGetTransactionPrice(
				gasPrice,
				closeTxn.gasLimit,
				ethPriceRate,
				closeTxn.optimismLayerOneFee
			),
		[gasPrice, ethPriceRate, closeTxn.gasLimit, closeTxn.optimismLayerOneFee]
	);

	const positionSize = positionDetails?.size ?? wei(0);

	useEffect(() => {
		const getOrderFee = async () => {
			try {
				if (!synthetixjs || !currencyKey || !positionSize) return;
				setError(null);
				const FuturesMarketContract = getFuturesMarketContract(currencyKey, synthetixjs!.contracts);
				const size = positionSize.neg();
				const orderFee = await FuturesMarketContract.orderFee(size.toBN());
				setOrderFee(wei(orderFee.fee));
			} catch (e) {
				// @ts-ignore
				console.log(e.message);
				// @ts-ignore
				setError(e?.data?.message ?? e.message);
			}
		};
		getOrderFee();
	}, [synthetixjs, currencyKey, positionSize]);

	const dataRows = useMemo(() => {
		if (!positionDetails || !currencyKey) return [];
		return [
			{
				label: t('futures.market.user.position.modal.order-type'),
				value: t('futures.market.user.position.modal.market-order'),
			},
			{
				label: t('futures.market.user.position.modal.side'),
				value: (positionDetails?.side ?? PositionSide.LONG).toUpperCase(),
			},
			{
				label: t('futures.market.user.position.modal.size'),
				value: formatCurrency(currencyKey || '', positionDetails?.size ?? zeroBN, {
					sign: synthToAsset(currencyKey as CurrencyKey),
				}),
			},
			{
				label: t('futures.market.user.position.modal.leverage'),
				value: `${formatNumber(positionDetails?.leverage ?? zeroBN)}x`,
			},
			{
				label: t('futures.market.user.position.modal.ROI'),
				value: formatCurrency(Synths.sUSD, positionDetails?.roi ?? zeroBN, { sign: '$' }),
			},
			{
				label: t('futures.market.user.position.modal.fee'),
				value: formatCurrency(Synths.sUSD, orderFee, { sign: '$' }),
			},
			{
				label: t('futures.market.user.position.modal.gas-fee'),
				value: formatCurrency(selectedPriceCurrency.name as CurrencyKey, transactionFee ?? zeroBN, {
					sign: '$',
				}),
			},
		];
	}, [positionDetails, currencyKey, t, orderFee, transactionFee, selectedPriceCurrency]);

	useEffect(() => {
		if (closeTxn.hash) {
			monitorTransaction({
				txHash: closeTxn.hash,
				onTxConfirmed: () => {
					onDismiss();
					handleRefetch('close-position');
				},
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [closeTxn.hash]);

	return (
		<StyledBaseModal
			onDismiss={onDismiss}
			isOpen={true}
			title={t('futures.market.user.position.modal.title')}
		>
			<>
				{dataRows.map(({ label, value }, i) => (
					<Row key={`datarow-${i}`}>
						<Label>{label}</Label>
						<ValueColumn>
							<Value>{value}</Value>
						</ValueColumn>
					</Row>
				))}
				<StyledButton
					variant="primary"
					isRounded
					size="lg"
					onClick={() => closeTxn.mutate()}
					disabled={!!error || !!closeTxn.errorMessage}
				>
					{error || closeTxn.errorMessage || t('futures.market.user.position.modal.title')}
				</StyledButton>
			</>
		</StyledBaseModal>
	);
};

export default ClosePositionModal;

const StyledBaseModal = styled(BaseModal)`
	[data-reach-dialog-content] {
		max-width: 400px;
	}
	.card-body {
		padding: 28px;
	}
`;

const Row = styled(FlexDivCentered)`
	justify-content: space-between;
`;

const Label = styled.div`
	font-family: ${(props) => props.theme.fonts.regular};
	color: ${(props) => props.theme.colors.selectedTheme.gray};
	font-size: 12px;
	text-transform: capitalize;
	margin-top: 6px;
`;

const Value = styled.div`
	font-family: ${(props) => props.theme.fonts.mono};
	color: ${(props) => props.theme.colors.selectedTheme.button.text};
	font-size: 12px;
	margin-top: 6px;
`;

const ValueColumn = styled(FlexDivCol)`
	align-items: flex-end;
`;

const StyledButton = styled(Button)`
	margin-top: 24px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	height: 55px;
`;
