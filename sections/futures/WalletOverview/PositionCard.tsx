import React from 'react';
import styled from 'styled-components';
import { Svg } from 'react-optimized-image';
import { useTranslation } from 'react-i18next';

import Card from 'components/Card';
import { FlexDivRow, FlexDivRowCentered } from 'styles/common';
import { Data, Subtitle } from '../common';
import { formatCurrency } from 'utils/formatters/number';
import { CurrencyKey, Synths } from 'constants/currency';
import ChangePercent from 'components/ChangePercent';
import CurrencyIcon from 'components/Currency/CurrencyIcon';
import WarningIcon from 'assets/svg/app/liquidation-warning.svg';
import { Position, PositionSide } from '../types';
import { FuturesPosition } from 'queries/futures/types';

type PositionCardProps = {
	position: Partial<FuturesPosition>;
	isCTA?: boolean;
};

const PositionCard: React.FC<PositionCardProps> = ({ position, isCTA = false }) => {
	const { t } = useTranslation();

	return (
		<StyledCard isCTA={isCTA}>
			{/* <StyledCardBody>
				<StyledFlexDivRowCentered>
					<Subtitle>{t('futures.wallet-overview.positions.position.title')}</Subtitle>
					<StyledFlexDivRow>
						<StyledCurrencyIcon currencyKey={position.position.currency} />
						<StyledData>
							{formatCurrency(position.position.currency, position.position.amount, { sign: '$' })}
						</StyledData>
						<PositionSideTag side={position.position.side}>
							{position.position.side}
						</PositionSideTag>
					</StyledFlexDivRow>
				</StyledFlexDivRowCentered>
				<StyledFlexDivRowCentered>
					<Subtitle>{t('futures.wallet-overview.positions.price')}</Subtitle>
					<Data>{formatCurrency(Synths.sUSD, position.price, { sign: '$' })}</Data>
				</StyledFlexDivRowCentered>
				<StyledFlexDivRowCentered>
					<StyledFlexDivRow>
						<Subtitle>{t('futures.wallet-overview.positions.liquidation')}</Subtitle>
						{position.riskOfLiquidation && <StyledSvg src={WarningIcon} />}
					</StyledFlexDivRow>
					<Data>{formatCurrency(Synths.sUSD, position.liquidationPrice, { sign: '$' })}</Data>
				</StyledFlexDivRowCentered>
				<StyledFlexDivRowCentered>
					<Subtitle>{t('futures.wallet-overview.positions.pnl')}</Subtitle>
					<StyledFlexDivRow>
						<StyledData>{formatCurrency(Synths.sUSD, position.margin, { sign: '$' })}</StyledData>
						<ChangePercent value={position.marginChange} />
					</StyledFlexDivRow>
				</StyledFlexDivRowCentered>
			</StyledCardBody> */}
		</StyledCard>
	);
};
export default PositionCard;

const StyledCard = styled(Card)<{ isCTA: boolean }>`
	margin-bottom: ${(props) => (props.isCTA ? 0 : '16px')};
	width: 100%;
`;

const StyledCardBody = styled(Card.Body)`
	background: ${(props) => props.theme.colors.navy};
`;

const StyledFlexDivRowCentered = styled(FlexDivRowCentered)`
	justify-content: space-between;
	margin-bottom: 4px;
`;

const StyledFlexDivRow = styled(FlexDivRow)`
	justify-content: flex-start;
	align-items: center;
`;

const StyledCurrencyIcon = styled(CurrencyIcon)`
	margin-right: 4px;
`;

const StyledData = styled(Data)`
	margin-right: 4px;
`;

const StyledSvg = styled(Svg)`
	margin-left: 4px;
`;

const PositionSideTag = styled.div<{ side: PositionSide }>`
	color: ${(props) => props.theme.colors.navy};
	font-family: ${(props) => props.theme.fonts.bold};
	background: ${(props) =>
		props.side === PositionSide.LONG ? props.theme.colors.green : props.theme.colors.red};
	text-transform: uppercase;
	padding: 2px 4px;
`;