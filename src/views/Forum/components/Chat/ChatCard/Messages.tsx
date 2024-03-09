import InfiniteScroll from 'react-infinite-scroll-component';
import { Message as IMessage } from 'src/types/Xmpp.types';
import { Message } from './Message';
import { useRecoilValue } from 'recoil';
import { chatSearchState } from 'src/recoil/chatSearch';
import { useContext, useMemo } from 'react';
import { ChatContext } from 'src/contexts';
import { useDevice } from 'src/hooks/useDevice';

export const Messages = ({
	hasMore,
	messages,
	messagesEndRef,
	onNext
}: {
	hasMore: boolean;
	messages: IMessage[];
	messagesEndRef: React.RefObject<HTMLDivElement>;
	onNext: () => void;
}) => {
	const search = useRecoilValue(chatSearchState);
	const { chatOpen } = useContext(ChatContext);
	const { iSm } = useDevice();

	const sorted = messages.sort((a, b) => {
		if (a.date.getTime() > b.date.getTime()) {
			return -1;
		} else if (a.date.getTime() < b.date.getTime()) {
			return 1;
		} else {
			return 0;
		}
	});

	const filtered = useMemo(() => {
		if (search) {
			return sorted.filter(message => message.message.toLowerCase().includes(search.toLowerCase()));
		} else {
			return sorted;
		}
	}, [search, sorted]);

	return (
		<div
			className="chat-wrap"
			id="scrollableDiv"
			style={{
				height: chatOpen ? '311px' : 'calc(100vh - 288px)',
				padding: iSm ? 0 : '16px',
			}}
		>
			{/* 
				Keep the ref here because its a column-reserve flex
				https://github.com/ankeetmaini/react-infinite-scroll-component#using-scroll-on-top
			*/}
			<div ref={messagesEndRef} />
			<InfiniteScroll
				dataLength={filtered.length}
				next={onNext}
				style={{
					display: 'flex',
					flexDirection: 'column-reverse'
				}}
				inverse={true}
				hasMore={hasMore}
				loader={<></>}
				scrollableTarget="scrollableDiv"
			>
				{filtered.map((message, idx) => (
					<Message key={message.id + idx} message={message} previousMessage={messages[idx + 1]} />
				))}
			</InfiniteScroll>
		</div>
	);
};
