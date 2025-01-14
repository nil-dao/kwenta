import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';

import LogoNoTextSVG from 'assets/svg/brand/logo-no-text.svg';
import MarketOrderPreview from 'assets/png/marketing/market-order-preview.png';

import { GridDiv, Paragraph } from 'styles/common';
import { StackSection } from '../common';

import media from 'styles/media';
import Link from 'next/link';
import Button from 'components/Button';
import ROUTES from 'constants/routes';
import PoweredBySynthetix from 'components/PoweredBySynthetix';
import Webp from 'components/Webp';

const Hero = () => {
	const { t } = useTranslation();

	return (
		<StackSection>
			<LogoNoTextSVG />
			<Header>{t('homepage.hero.title')}</Header>
			<ProductDescription>
				<Trans i18nKey={'homepage.hero.copy'} components={[<Emphasis />]} />
			</ProductDescription>
			<SynthetixContainer>
				<PoweredBySynthetix />
			</SynthetixContainer>
			<CTAContainer>
				<Link href={ROUTES.Markets.Home}>
					<Button variant="primary" isRounded={false} size="md">
						{t('homepage.nav.trade-now')}
					</Button>
				</Link>
			</CTAContainer>
			<HeroImageContainer>
				<Webp srcOrSrcset={MarketOrderPreview} StyledImg={HeroImage} />
			</HeroImageContainer>
		</StackSection>
	);
};

const Emphasis = styled.b`
	color: ${(props) => props.theme.colors.common.primaryWhite};
`;

const Header = styled(Paragraph)`
	font-family: ${(props) => props.theme.fonts.compressedBlack};
	max-width: 636px;
	font-size: 80px;
	line-height: 85%;
	text-align: center;
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.common.primaryGold};
	text-shadow: 0px 0px 62px rgba(208, 168, 117, 0.35);
	padding-top: 40px;
`;

const ProductDescription = styled(Paragraph)`
	font-family: ${(props) => props.theme.fonts.regular};
	max-width: 530px;
	font-size: 24px;
	line-height: 120%;
	text-align: center;
	color: #bdbdbd;
	padding-top: 16px;
`;

const HeroImageContainer = styled(GridDiv)`
	width: 100vw;
	overflow: hidden;
	display: grid;
	justify-content: center;
	margin-top: 97px;
	margin-bottom: 201px;
`;

const HeroImage = styled.img`
	width: 960px;
	${media.lessThan('md')`
		width: 785px;
	`}
	${media.lessThan('sm')`
		width: 380px;
	`}
	background: linear-gradient(180deg, #C9975A 0%, #94F2FF 100%);
	border: 1px solid;
	border-radius: 20px;
`;

const SynthetixContainer = styled.div`
	margin: 25px 0px 0px 0;
`;

const CTAContainer = styled.div`
	margin: 50px 0px 0px 0;
	z-index: 1;
`;

export default Hero;
