import {Alert, Badge, Card, CircularProgress, Typography} from '@mui/material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';

export default function Draft(props: any) {
	const [tickets, setTickets] = useState<any[]>([]);
	const [selectedTicket, setSelectedTicket] = useState(null);
	const [selectedTicketIndex, setSelectedTicketIndex] = useState<number>(0);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const getTickets = async () => {
		const tickets = await axios.get('/api/getgittickets');
		setTickets(tickets.data);
	};
	useEffect(() => {
		getTickets();
	}, []);
	const Editor = dynamic(() => import('./editor'), {ssr: false});
	const updateTicket = (updatedTicket: object) => {
		tickets[selectedTicketIndex] = updatedTicket;
		setSuccessMessage('Saved as draft!');
		setTimeout(() => {
			setSuccessMessage(null);
		}, 3000);
		setSelectedTicket(null);
	};
	const removeReleasedTicket = () => {
		tickets.splice(selectedTicketIndex, 1);
		setSuccessMessage('Ticket released!');
		setTimeout(() => {
			setSuccessMessage(null);
		}, 3000);
		setSelectedTicket(null);
	};
	return (
		<>
			<div className='draft-releases'>
				{successMessage && (
					<Alert variant='filled' className='alert' severity='success'>
						{successMessage}
					</Alert>
				)}

				{selectedTicket ? (
					<>
						<Typography className='title' fontWeight={'bold'} color={'gray'} variant='h6'>
							Edit release note
						</Typography>
						<Editor {...props} ticket={selectedTicket} removeReleasedTicket={removeReleasedTicket} updateTicket={updateTicket} setSelectedTicket={setSelectedTicket} />
					</>
				) : tickets.length > 0 ? (
					<>
						<Typography className='title' fontWeight={'bold'} color={'gray'} variant='h6'>
							Ready for release
						</Typography>
						{tickets.map((ticket, index) => (
							<Card
								sx={{width: '40%'}}
								onClick={() => {
									setSelectedTicket(ticket);
									setSelectedTicketIndex(index);
								}}
								variant='outlined'
								className={`ticket-card ${ticket.draft != undefined ? (ticket.draft == true ? 'edited-ticket' : 'released-ticket') : ''}`}
								key={ticket.id}>
								
								<Typography dangerouslySetInnerHTML={{__html: ticket.title}} />
							</Card>
						))}
					</>
				) : (
					<CircularProgress className='loading' />
				)}
			</div>
		</>
	);
}
