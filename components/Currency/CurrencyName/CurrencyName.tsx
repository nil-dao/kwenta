import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { MarketClosureReason } from 'hooks/useMarketClosed';

import MarketClosureIcon from 'components/MarketClosureIcon';

import CurrencyIcon from '../CurrencyIcon';

import { CurrencyIconProps } from '../CurrencyIcon/CurrencyIcon';

import { ContainerRowMixin } from '../common';

type CurrencyNameProps = {
	currencyKey: string;
	symbol?: string;
	name?: string | null;
	showIcon?: boolean;
	iconProps?: Partial<CurrencyIconProps>;
	marketClosureReason?: MarketClosureReason;
	isDeprecated?: boolean;
};

export const CurrencyName: FC<CurrencyNameProps> = ({
	currencyKey,
	symbol,
	name = null,
	showIcon = false,
	iconProps = {},
	marketClosureReason,
	isDeprecated = false,
	...rest
}) => {
	const { t } = useTranslation();
	return (
		<Container showIcon={showIcon} {...rest}>
			{showIcon && (
				<CurrencyIconContainer>
					<CurrencyIcon className="icon" {...{ currencyKey, isDeprecated }} {...iconProps} />
					{marketClosureReason != null ? (
						<MarketClosureIconContainer>
							<MarketClosureIcon marketClosureReason={marketClosureReason} size="sm" />
						</MarketClosureIconContainer>
					) : null}
				</CurrencyIconContainer>
			)}
			<NameAndSymbol>
				<Symbol className="symbol">
					<span>{symbol || currencyKey}</span>
					{!isDeprecated ? null : (
						<Deprecated>
							<DeprecatedDot></DeprecatedDot> {t('common.currency.deprecated')}
						</Deprecated>
					)}
				</Symbol>
				{name && <Name className="name">{name}</Name>}
			</NameAndSymbol>
		</Container>
	);
};

const Container = styled.span<{ showIcon?: boolean }>`
	${(props) =>
		props.showIcon &&
		css`
			position: relative;
			display: inline-grid;
			align-items: center;
			grid-auto-flow: column;
			grid-gap: 8px;
		`}
`;

const NameAndSymbol = styled.span`
	${ContainerRowMixin};
`;

const Symbol = styled.div`
	color: ${(props) => props.theme.colors.selectedTheme.button.text};
	font-family: ${(props) => props.theme.fonts.bold};
	font-size: 14px;
	display: flex;
	align-items: center;
`;

const Name = styled.span`
	color: ${(props) => props.theme.colors.selectedTheme.gray};
`;

const CurrencyIconContainer = styled.span`
	position: relative;
`;

const MarketClosureIconContainer = styled.span`
	position: absolute;
	bottom: 0;
	right: 0;
	transform: translate(10%, 10%);
`;

const Deprecated = styled.div`
	display: flex;
	align-items: center;
	color: ${(props) => props.theme.colors.red};
	margin-left: 10px;
	text-transform: uppercase;
	font-size: 12px;
`;

const DeprecatedDot = styled.div`
	width: 9px;
	height: 9px;
	background: ${(props) => props.theme.colors.red};
	box-shadow: 0px 0px 10px ${(props) => props.theme.colors.red};
	margin-right: 4px;
	border-radius: 50%;
`;

export default CurrencyName;
