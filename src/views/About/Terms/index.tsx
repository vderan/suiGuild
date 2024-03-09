import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { H1Title, H4Title, Paragraph2 } from 'src/components/Typography';
import gilderImg from 'src/assets/icons/gilder.svg';
import { useNavigate } from 'react-router-dom';

export const Terms = () => {
	const navigate = useNavigate();

	return (
		<StyledBox>
			<Box className="terms">
				<Box className="title">
					<H1Title> Gilder Terms of Service </H1Title>
				</Box>
				<Box className="content-wrap">
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Effective Date: November 17, 2023 </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								These User Terms of Service (the “User Terms”) govern your access and use of Gilder platform (the
								“Services”). Please read them carefully. These User Terms apply to you as a user of the Services.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Legally Binding </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								These User Terms are a legally binding contract between you and the Gilder DAO. If you access or use the
								Services or continue accessing or using the Services after being notified of a change to the User Terms,
								you confirm that you have read, understand and agree to be bound by the User Terms. “Gilder”, “we”,
								“our” and “us” currently refers to the Gilder DAO, its partners and its agents.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> You Must be Over the Legal Age </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								To the extent prohibited by applicable law, the Services are not intended for and should not be used by
								(a) anyone under the age of sixteen or (b) anyone under the applicable age of majority according to the
								data protection laws and regulations in your jurisdiction. You represent that you are over the legal
								age.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Acceptable and unacceptable conduct for our Services </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								We may suspend or terminate your account or cease providing you with all or part of the Services at any
								time if we reasonably believe: (i) you have violated these User Terms or other policies, (ii) you create
								risk or possible legal exposure for us; (iii) your account should be removed due to unlawful conduct;
								(iv) your account should be removed due to prolonged inactivity; or (v) our provision of the Services to
								you is no longer commercially viable. We will make reasonable efforts to notify you by the email address
								associated with your account or the next time you attempt to access your account, depending on the
								circumstances. To the extent permitted by law, we may also terminate your account or cease providing you
								with all or part of the Services for any other reason or no reason at our convenience. This policy may
								change as Gilder grows and evolves, so please check back regularly for updates and changes.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Do: </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2> · comply with all User Terms of Service; </Paragraph2>
							<Paragraph2>
								· comply with all applicable laws and governmental regulations, including, but not limited to, all
								intellectual property, data, privacy, and export control laws, and regulations promulgated by any
								government agencies;
							</Paragraph2>
							<Paragraph2>
								{' '}
								· use reasonable efforts to prevent unauthorized access to or use of the Services;{' '}
							</Paragraph2>
							<Paragraph2> · keep passwords and all other login information confidential; </Paragraph2>
							<Paragraph2>
								· monitor and control all activity conducted through your account in connection with the Services;
							</Paragraph2>
							<Paragraph2>
								· promptly notify us if you become aware of or reasonably suspect any illegal or unauthorized activity
								or a security breach involving your account, including any loss, theft, or unauthorized disclosure or
								use of a username, password, or account; and
							</Paragraph2>
							<Paragraph2>
								· comply in all respects with all applicable terms of the third party applications, including any that
								Customer elects to integrate with the Services that you access or subscribe to in connection with the
								Services.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Do Not: </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>· permit any third party use a username or password for the Services; </Paragraph2>
							<Paragraph2>
								· share, transfer or otherwise provide access to an account designated for you to another person;
							</Paragraph2>
							<Paragraph2>
								· use the Services to store or transmit any data that may infringe upon or misappropriate someone else’s
								trademark, copyright, or other intellectual property, or that may be tortious or unlawful;
							</Paragraph2>
							<Paragraph2>
								· upload to, or transmit from, the Services any data, file, software, or link that contains or redirects
								to a virus, Trojan horse, worm, or other harmful component or technology that unlawfully accesses or
								downloads content or information stored within the Services or on the hardware of Gilder or any third
								party;
							</Paragraph2>
							<Paragraph2>
								· attempt to reverse engineer, decompile, hack, disable, interfere with, disassemble, modify, copy,
								translate, or disrupt the features, functionality, integrity, or performance of the Services (including
								any mechanism used to restrict or control the functionality of the Services), any third party use of the
								Services, or any third party data contained therein (except to the extent such restrictions are
								prohibited by applicable law);
							</Paragraph2>
							<Paragraph2>
								· attempt to gain unauthorized access to the Services or related systems or networks or to defeat,
								avoid, bypass, remove, deactivate, or otherwise circumvent any software protection or monitoring
								mechanisms of the Services; · access the Services in order to build a similar or competitive product or
								service or copy any ideas, features, functions, or graphics of the Services;
							</Paragraph2>
							<Paragraph2>
								· use the Services in any manner that may harm minors or that interacts with or targets people under the
								age of thirteen;
							</Paragraph2>
							<Paragraph2>
								· engage in activity that incites or encourages violence or hatred against individuals or groups;
							</Paragraph2>
							<Paragraph2>
								· use the Services to provide material support or resources (or to conceal or disguise the nature,
								location, source, or ownership of material support or resources) to any organization(s) designated by
								the United States government as a foreign terrorist organization pursuant to section 219 of the
								Immigration and Nationality Act or other laws and regulations concerning national security, defense or
								terrorism;
							</Paragraph2>
							<Paragraph2>
								· access, search, or create accounts for the Services by any means other than our publicly supported
								interfaces (for example, "scraping" or creating accounts in bulk);
							</Paragraph2>
							<Paragraph2> · send unsolicited communications, promotions or advertisements, or spam; </Paragraph2>
							<Paragraph2>
								· send altered, deceptive or false source-identifying information, including "spoofing" or "phishing";
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Your Account </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								You may need to create an account to use the Services. You are responsible for safeguarding your
								account, so use a strong password and limit its use to this account. We cannot and will not be liable
								for any loss or damage arising from your failure to comply with the above.
							</Paragraph2>
							<Paragraph2>
								You can control most communications from the Services. We may need to provide you with certain
								communications, such as service announcements and administrative messages. These communications are
								considered part of the Services and your account, and you may not be able to opt-out from receiving
								them.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Your Rights and Grant of Rights in the Content </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								You retain your rights to any information, text, links, graphics, photos, audio, videos, or other
								materials or arrangements of materials uploaded or appearing on the Services (collectively referred to
								as “Content”) you submit, post or display on or through the Services. What’s yours is yours — you own
								your Content (and your incorporated audio, photos and videos are considered part of the Content).
							</Paragraph2>
							<Paragraph2>
								By submitting, posting or displaying Content on or through the Services, you grant us a worldwide,
								non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process,
								adapt, modify, publish, transmit, display, and distribute such Content in any and all media or
								distribution methods now known or later developed (for clarity, these rights include, for example,
								curating, transforming, and translating). This license authorizes us to make your Content available to
								the rest of the world and to let others do the same. You agree that this license includes the right for
								us to provide, promote, and improve the Services and to make Content submitted to or through the
								Services available to other companies, organizations or individuals for the syndication, broadcast,
								distribution, repost, promotion or publication of such Content on other media and services, subject to
								our terms and conditions for such Content use. Such additional uses by us, or other companies,
								organizations or individuals, is made with no compensation paid to you with respect to the Content that
								you submit, post, transmit or otherwise make available through the Services as the use of the Services
								by you is hereby agreed as being sufficient compensation for the Content and grant of rights herein.
							</Paragraph2>
							<Paragraph2>
								We have an evolving set of rules for how ecosystem partners can interact with your Content on the
								Services. These rules exist to enable an open ecosystem with your rights in mind. You understand that we
								may modify or adapt your Content as it is distributed, syndicated, published, or broadcast by us and our
								partners and/or make changes to your Content in order to adapt the Content to different media.
							</Paragraph2>
							<Paragraph2>
								You represent and warrant that you have, or have obtained, all rights, licenses, consents, permissions,
								power, and/or authority necessary to grant the rights granted herein for any Content that you submit,
								post or display on or through the Services. You agree that such Content will not contain material
								subject to copyright or other proprietary rights unless you have the necessary permission or are
								otherwise legally entitled to post the material and to grant us the license described above.
							</Paragraph2>
							<Paragraph2>
								Any use or reliance on any Content or materials posted via the Services or obtained by you through the
								Services is at your own risk. We do not endorse, support, represent or guarantee the completeness,
								truthfulness, accuracy, or reliability of any Content or communications posted via the Services or
								endorse any opinions expressed via the Services. You understand that by using the Services, you may be
								exposed to Content that might be offensive, harmful, inaccurate or otherwise inappropriate, or in some
								cases, postings that have been mislabeled or are otherwise deceptive. All Content is the sole
								responsibility of the person who originated such Content. We may not monitor or control the Content
								posted via the Services and, we cannot take responsibility for such Content.
							</Paragraph2>
							<Paragraph2>
								We reserve the right to remove Content that violates the User Agreement, including for example,
								copyright or trademark violations or other intellectual property misappropriation, impersonation,
								unlawful conduct, or harassment.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Takedown Requests </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								If you believe that your Content has been copied in a way that constitutes copyright infringement,
								please report this by visiting our Contact page.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Contacting Gilder </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								Please also feel free to contact us if you have any questions about these Terms of User by using the
								Contact webpage on our site.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Your License to Use the Services </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								We give you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use the
								software provided to you as part of the Services. This license has the sole purpose of enabling you to
								use and enjoy the benefit of the Services as provided on the platform, in the manner permitted by these
								Terms.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> The Services are Available "AS-IS" </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								Your access to and use of the Services or any Content are at your own risk. You understand and agree
								that the Services are provided to you on an “AS IS” and “AS AVAILABLE” basis. Without limiting the
								foregoing, to the maximum extent permitted under applicable law, Gilder DISCLAIM ALL WARRANTIES AND
								CONDITIONS, WHETHER EXPRESS OR IMPLIED, OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
								NON-INFRINGEMENT. Gilder makes no warranty or representation and disclaims all responsibility and
								liability for: (i) the completeness, accuracy, availability, timeliness, security or reliability of the
								Services or any Content; (ii) any harm to your computer system, loss of data, or other harm that results
								from your access to or use of the Services or any Content; (iii) the deletion of, or the failure to
								store or to transmit, any Content and other communications maintained by the Services; and (iv) whether
								the Services will meet your requirements or be available on an uninterrupted, secure, or error-free
								basis. No advice or information, whether oral or written, obtained from Gilder or through the Services,
								will create any warranty or representation not expressly made herein.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Limitation of Liability </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, Gilder SHALL NOT BE LIABLE FOR ANY INDIRECT,
								INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
								INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES,
								RESULTING FROM (i) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES; (ii) ANY CONDUCT
								OR CONTENT OF ANY THIRD PARTY ON THE SERVICES, INCLUDING WITHOUT LIMITATION, ANY DEFAMATORY, OFFENSIVE
								OR ILLEGAL CONDUCT OF OTHER USERS OR THIRD PARTIES; (iii) ANY CONTENT OBTAINED FROM THE SERVICES; OR
								(iv) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT. IN NO EVENT SHALL THE
								AGGREGATE LIABILITY OF Gilder EXCEED THE GREATER OF ONE HUNDRED U.S. DOLLARS (U.S. $100.00). THE
								LIMITATIONS OF THIS SUBSECTION SHALL APPLY TO ANY THEORY OF LIABILITY, WHETHER BASED ON WARRANTY,
								CONTRACT, STATUTE, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, AND WHETHER OR NOT Gilder HAVE BEEN
								INFORMED OF THE POSSIBILITY OF ANY SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE
								FAILED OF ITS ESSENTIAL PURPOSE.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Survival </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								These terms of the User Terms survive any termination or expiration of the User Terms.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Privacy Policy </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								Please review our (
								<Paragraph2
									sx={{ textDecoration: 'underLine', cursor: 'pointer' }}
									onClick={() => {
										navigate('/privacy');
									}}
								>
									Privacy Policy
								</Paragraph2>
								) for more information on how we collect and use data relating to the use and performance of our
								products. You understand that through your use of the Services you consent to the collection and use (as
								set forth in the Privacy Policy) of this information, including the transfer of this information to the
								United States, Ireland, and/or other countries for storage, processing and use by us and our agents.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Modifications </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								We may change these User Terms. You can review the most current version of the User Terms at any time by
								visiting this page, and by visiting the following for the most current versions of the other pages that
								are referenced in these User Terms and Privacy Policy. Any revisions to these User Terms will become
								effective on the date we publish the change. We will try to notify you of material revisions, for
								example via a service notification or an email to the email associated with your account. If you use the
								Services after the effective date of any changes, that use will constitute your acceptance of the
								revised terms and conditions.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Waiver </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								No failure or delay by either party in exercising any right under the User Terms, will constitute a
								waiver of that right. No waiver under the User Terms will be effective unless made in writing and signed
								by an authorized representative of the party being deemed to have granted the waiver.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Severability </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								The User Terms will be enforced to the fullest extent permitted under applicable law. If any provision
								of the User Terms is held by a court of competent jurisdiction to be contrary to law, the provision will
								be modified by the court and interpreted so as best to accomplish the objectives of the original
								provision to the fullest extent permitted by law, and the remaining provisions of the User Terms will
								remain in effect.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Assignment </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								You may not assign any of your rights or delegate your obligations under these User Terms, whether by
								operation of law or otherwise, without the prior written consent of us (not to be unreasonably
								withheld). We may assign these User Terms in their entirety (including all terms and conditions
								incorporated herein by reference), without your consent.
							</Paragraph2>
							<Paragraph2>
								The User Terms, and any disputes arising out of or related hereto, will be governed exclusively by the
								same applicable governing law of the Contract, without regard to conflicts of laws rules or the United
								Nations Convention on the International Sale of Goods. The courts located in the applicable venue of the
								Contract will have exclusive jurisdiction to adjudicate any dispute arising out of or relating to the
								User Terms, or its formation, interpretation or enforcement. Each party hereby consents and submits to
								the exclusive jurisdiction of such courts.
							</Paragraph2>
						</Box>
					</Box>
					<Box className="content-box">
						<Box className="caption">
							<H4Title> Entire Agreement </H4Title>
						</Box>
						<Box className="text">
							<Paragraph2>
								The User Terms, including any terms incorporated by reference into the User Terms, constitute the entire
								agreement between you and us and supersede all prior and contemporaneous agreements, proposals or
								representations, written or oral, concerning its subject matter. To the extent of any conflict or
								inconsistency between the provisions in these User Terms and any pages referenced in these User Terms,
								the terms of these User Terms will first prevail.
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