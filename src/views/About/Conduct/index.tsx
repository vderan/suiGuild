import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { H1Title, H4Title, PreTitle, Paragraph2 } from 'src/components/Typography';
import gilderImg from 'src/assets/icons/gilder.svg';

export const Conduct = () => {
	return (
		<StyledBox>
			<Box className="terms">
				<Box className="title">
					<H1Title> Code of conduct Gilder </H1Title>
				</Box>
				<Box className="content-wrap">
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Community Rules </H4Title>
						</Box>
						<Box className="text">
							<PreTitle> 1. Treat everyone with respect: </PreTitle>
							<Paragraph2 className="inside-text">
								Absolutely no harassment, sexism, racism, or hate speech will be tolerated.
							</Paragraph2>
							<PreTitle> 2. No Deceptive Practices: </PreTitle>
							<Paragraph2 className="inside-text">
								Do not send altered, deceptive, or false source-identifying information, including "spoofing" or
								"phishing."
							</Paragraph2>
							<PreTitle> 3. No NSFW or obscene content: </PreTitle>
							<Paragraph2 className="inside-text">
								Refrain from sharing text, images, or links featuring nudity, sex, hard violence, or other graphically
								disturbing content.
							</Paragraph2>
							<PreTitle> 4. Report Rule Violations: </PreTitle>
							<Paragraph2 className="inside-text">
								If you see something against the rules or something that makes you feel unsafe, let the Gilder team
								know. We want this server to be a safe and welcoming space!
							</Paragraph2>
							<PreTitle> 5. No Tolerance for Scams: </PreTitle>
							<Paragraph2 className="inside-text">
								We DO NOT tolerate scams of any form. Please report to the moderators immediately if you spot any scammy
								behavior from community members.
							</Paragraph2>
							<PreTitle> 6. No Hate Speech: </PreTitle>
							<Paragraph2 className="inside-text">
								Refrain from engaging in any activity that incites or encourages violence or hatred against individuals
								or groups.
							</Paragraph2>
							<PreTitle> 7. No Unauthorized Access: </PreTitle>
							<Paragraph2 className="inside-text">
								Avoid attempting to gain unauthorized access to the Services or related systems.
							</Paragraph2>
							<PreTitle> 8. No Data Infringement: </PreTitle>
							<Paragraph2 className="inside-text">
								Do not use the Services to store or transmit data that infringes upon or misappropriates someone else’s
								intellectual property or is otherwise tortious or unlawful.
							</Paragraph2>
							<PreTitle> 9. No Harmful Content: </PreTitle>
							<Paragraph2 className="inside-text">
								Do not upload or transmit any data, file, software, or link that contains harmful components, including
								viruses, Trojan horses, worms, or other similar technologies.
							</Paragraph2>
							<PreTitle> 10. No Interference: </PreTitle>
							<Paragraph2 className="inside-text">
								Do not attempt to reverse engineer, decompile, hack, disable, interfere with, disassemble, modify, copy,
								translate, or disrupt the functionality of the Services.
							</Paragraph2>
							<PreTitle> 11. No Competitive Activities: </PreTitle>
							<Paragraph2 className="inside-text">
								Do not use the Services to build a similar or competitive product or service, or copy any ideas,
								features, functions, or graphics of the Services.
							</Paragraph2>
							<PreTitle> 12. No Support for Terrorism: </PreTitle>
							<Paragraph2 className="inside-text">
								Do not use the Services to provide material support or resources to any organization(s) designated by
								the United States government as a foreign terrorist organization.
							</Paragraph2>
							<PreTitle> 13. No Unauthorized Account Access: </PreTitle>
							<Paragraph2 className="inside-text">
								Do not permit any third party to use your username or password for the Services.
							</Paragraph2>
							<Paragraph2 className="inside-text">
								Do not share, transfer, or otherwise provide access to your account to another person.
							</Paragraph2>
							<PreTitle> 14. No Inappropriate Use: </PreTitle>
							<Paragraph2 className="inside-text">
								Avoid using the Services in any manner that may harm minors.
							</Paragraph2>
							<PreTitle> 15. No Unauthorized Communication: </PreTitle>
							<Paragraph2 className="inside-text">
								Do not send unsolicited communications, promotions, advertisements, or spam.
							</Paragraph2>
							<PreTitle> 16. No Deceptive Practices: </PreTitle>
							<Paragraph2 className="inside-text">
								Do not send altered, deceptive, or false source-identifying information, including "spoofing" or
								"phishing."
							</Paragraph2>
						</Box>
					</Box>
				</Box>
				<Box className="ref-wrap">
					<Box className="ref-box">
						<img src={gilderImg} alt="gilder" />
						<Paragraph2>{`All Rights Reserved ${new Date().getFullYear()} Gilder`}</Paragraph2>
					</Box>
				</Box>
			</Box>
		</StyledBox>
	);
};

const StyledBox = styled(Box, { name: 'Privacy' })(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	margin: theme.spacing(7.75, 1.5, 10.75, 1.5),
	'& .terms': {
		maxWidth: theme.spacing(121.5),
		'& .title': {
			display: 'flex',
			justifyContent: 'flex-start',
			marginBottom: theme.spacing(6.5),
			[theme.breakpoints.down('md')]: {
				marginBottom: theme.spacing(3)
			}
		},
		'& .content-wrap': {
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(5),
			[theme.breakpoints.down('md')]: {
				gap: theme.spacing(3)
			},
			'& .content-box': {
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing(1),
				'& .caption': {
					display: 'flex',
					justifyContent: 'flex-start'
				},
				'& .text': {
					display: 'flex',
					flexDirection: 'column',
					gap: theme.spacing(1),
					'& .inside-text': {
						marginLeft: theme.spacing(2)
					},
					'& .inside': {
						marginLeft: theme.spacing(4)
					}
				}
			}
		},
		'& .ref-wrap': {
			marginTop: theme.spacing(13),
			display: 'flex',
			justifyContent: 'center',
			'& .ref-box': {
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing(3.5)
			}
		}
	}
}))