import styled from 'styled-components';

import Text from 'components/Text';
import Button from 'components/Button';
import { KwentaText, Title, Description } from '../common';

const Rewards: React.FC = () => {
	return (
		<RewardsContainer>
			<RewardsHeading variant="h5">Kwenta Rewards Total</RewardsHeading>
			<RewardsBody>
				<Title>Your Total Rewards</Title>
				<KwentaText white>734.72</KwentaText>
				<StyledDescription>Total KWENTA claimable when live.</StyledDescription>
				<Button disabled fullWidth>
					Claim KWENTA
				</Button>
			</RewardsBody>
		</RewardsContainer>
	);
};

const RewardsContainer = styled.div`
	width: 216px;
	margin-left: 16px;
`;

const RewardsBody = styled.div`
	width: 100%;
	padding: 18px 25px;
	border: 1px solid #353333;
	border-radius: 16px;

	& > button {
		height: 38px;
		font-size: 13px;
		&:disabled {
			background-color: transparent;
		}
	}
`;

const StyledDescription = styled(Description)`
	margin: 5px 0 18px;
`;

const RewardsHeading = styled(Text.Heading)`
	color: ${(props) => props.theme.colors.common.primaryGold};
	margin-bottom: 15px;
	text-transform: uppercase;
	font-family: ${(props) => props.theme.fonts.bold};
	font-size: 13px;
`;

export default Rewards;
