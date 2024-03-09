import { Box } from '@mui/material';
import { H3Title, Paragraph2 } from 'src/components/Typography';
import { Form } from 'src/components/Form';
import { SwitchField } from 'src/components/Switch';
import { Controller } from 'react-hook-form';

export const Notification = () => {
	return (
		<Box className="setting-box">
			<H3Title>Chat</H3Title>
			<Form
				action={data => console.log(data)}
				defaultValues={{
					chat: true,
					onechat: true,
					groupchat: true
				}}
			>
				<Box className="column-box">
					<NotificationBox name="chat" text="Chat messages" />
					<NotificationBox name="onechat" text="Mentions in one-to-one chat" />
					<NotificationBox name="groupchat" text="Mentions in group chat" />
				</Box>
			</Form>
			<H3Title>Forum activity</H3Title>
			<Form
				action={data => console.log(data)}
				defaultValues={{
					reply: true,
					comment: false,
					following: true,
					mention: true,
					many: true
				}}
			>
				<Box className="column-box">
					<NotificationBox name="reply" text="Post replies" />
					<NotificationBox name="comment" text="Comments on your posts" />
					<NotificationBox name="following" text="Comments on following posts" />
					<NotificationBox name="mention" text="Post mentions" />
					<NotificationBox name="many" text="Enable mention notifications in one-to-many chat" />
				</Box>
			</Form>
			<H3Title>Updates</H3Title>
			<Form action={data => console.log(data)} defaultValues={{ announcement: true }}>
				<Box className="column-box">
					<NotificationBox name="announcement" text="Platform announcements" />
				</Box>
			</Form>
		</Box>
	);
};

const NotificationBox = ({ name, text }: { name: string; text: string }) => {
	return (
		<Controller
			name={name}
			render={({ field }) => (
				<Box
					sx={{
						padding: theme => theme.spacing(1, 1.5),
						backgroundColor: theme => theme.palette.dark[500],
						border: theme => `1px solid ${theme.palette.border.subtle}`,
						justifyContent: 'space-between',
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						borderRadius: 1.5
					}}
				>
					<Paragraph2>{text}</Paragraph2>
					<SwitchField checked={field.value} onChange={field.onChange} />
				</Box>
			)}
		/>
	);
};
