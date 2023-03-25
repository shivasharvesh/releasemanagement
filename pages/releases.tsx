import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function Releases(props: any) {
	const [featureTickets, setFeatureTickets] = useState<any[]>([]);
	const [improvementTickets, setImprovementTickets] = useState<any[]>([]);
	const [sortedFeatureTickets, setSortedFeatureTickets] = useState({});
	const [sortedImprovementTickets, setSortedImprovementTickets] = useState({});
	const [filterMonth, setFilterMonth] = useState<null | string>(null);
	const [showFilter, setShowFilter] = useState(false);

	const sortFeatureTicketsByMonth = () => {
		const sortedFeatureTicketsCopy = sortedFeatureTickets;
		for (const featureTicket of featureTickets) {
			if (!sortedFeatureTicketsCopy[featureTicket.created_month]) {
				sortedFeatureTicketsCopy[featureTicket.created_month] = [];
				sortedFeatureTicketsCopy[featureTicket.created_month].push(featureTicket);
			} else {
				sortedFeatureTicketsCopy[featureTicket.created_month].push(featureTicket);
			}
		}
		setSortedFeatureTickets(sortedFeatureTicketsCopy);
	};

	const sortImprovementsTicketsByMonth = () => {
		const sortedImprovementTicketsCopy = sortedImprovementTickets;
		for (const improvementTicket of improvementTickets) {
			if (!sortedImprovementTicketsCopy[improvementTicket.created_month]) {
				sortedImprovementTicketsCopy[improvementTicket.created_month] = [];
				sortedImprovementTicketsCopy[improvementTicket.created_month].push(improvementTicket);
			} else {
				sortedImprovementTicketsCopy[improvementTicket.created_month].push(improvementTicket);
			}
		}
		setSortedImprovementTickets(sortedImprovementTicketsCopy);
	};

	const getTickets = async () => {
		const feature = await axios.get('/api/getgittickets?draft=false&releasetype=feature');
		const improvement = await axios.get('/api/getgittickets?draft=false&releasetype=improvement');
		setFeatureTickets(feature.data);
		setImprovementTickets(improvement.data);
	};
	useEffect(() => {
		getTickets();
	}, []);

	useEffect(() => {
		sortFeatureTicketsByMonth();
	}, [featureTickets]);

	useEffect(() => {
		sortImprovementsTicketsByMonth();
	}, [improvementTickets]);

	return (
		<>
			<div className='releases'>
				{
				!showFilter &&
				<CalendarMonthIcon className={`filter-icon ${filterMonth && 'active'}`} onClick={()=>setShowFilter(true)} fontSize={'large'}/>
				}
				<div className={`filter ${showFilter ? 'fadeIn' : 'fadeOut'}`}>
					<Typography fontWeight={'bold'} color={'#6b2e7d'} variant='h6' component='h5'>
						Filter 
						<span className='close-filter' onClick={()=>setShowFilter(false)}>X</span>
					</Typography>
					<Divider />
					<br />
					{props.months.map((month: string) => (
						<Typography
							key={month}
							onClick={() => {
								if (filterMonth == month) {
									setFilterMonth(null);
								} else {
									setFilterMonth(month);
								}
							}}
							className={`filter-month ${filterMonth == month ? 'active' : ''}`}
							color={'gray'}
							variant='h6'
							component='h5'>
							{month}
						</Typography>
					))}
				</div>
				<div className='release-list'>
					<Typography fontWeight={'bold'} fontStyle={'italic'} variant='h5' component='h2'>
						Releases <span className='release-year'>March 2023</span> 
					</Typography>
					<Divider />
					<br />
					<Typography fontWeight={'bold'} color={'#6b2e7d'} variant='h6' component='h2'>
						Features
					</Typography>
					<br />
					<div className='features'>
						{filterMonth
							? sortedFeatureTickets[filterMonth]
								? sortedFeatureTickets[filterMonth].map((ticket, index) => (
										<div key={index} className='release-ticket-wrapper'>
											{index != 0 ? (
												new Date(featureTickets[index - 1].created_date).toLocaleDateString() != new Date(ticket.created_date).toLocaleDateString() ? (
													<>
														<br />
														<Typography variant='body2' className='ticket-created-date' fontWeight={'bold'} color='gray'>
															{new Date(ticket.created_date).toLocaleDateString()}
														</Typography>
													</>
												) : null
											) : (
												<Typography variant='body2' className='ticket-created-date' fontWeight={'bold'} color='gray'>
													{new Date(ticket.created_date).toLocaleDateString()}
												</Typography>
											)}
											<Accordion defaultExpanded={true}  className='release-ticket ck-content'>
												<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
													<Typography fontWeight={'bold'} variant='h6'>{ticket.title}</Typography>
												</AccordionSummary>
												<AccordionDetails dangerouslySetInnerHTML={{__html: ticket.description}} />
											</Accordion>
										</div>
								  ))
								: null
							: featureTickets.map((ticket, index) => (
									<div key={index} className='release-ticket-wrapper'>
										{index != 0 ? (
											new Date(featureTickets[index - 1].created_date).toLocaleDateString() != new Date(ticket.created_date).toLocaleDateString() ? (
												<>
													<br />
													<Typography variant='body2' className='ticket-created-date' fontWeight={'bold'} color='gray'>
														{new Date(ticket.created_date).toLocaleDateString()}
													</Typography>
												</>
											) : null
										) : (
											<Typography variant='body2' className='ticket-created-date' fontWeight={'bold'} color='gray'>
												{new Date(ticket.created_date).toLocaleDateString()}
											</Typography>
										)}
										<Accordion defaultExpanded={true}  className='release-ticket ck-content'>
											<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
												<Typography fontWeight={'bold'} variant='h6'>{ticket.title}</Typography>
											</AccordionSummary>
											<AccordionDetails dangerouslySetInnerHTML={{__html: ticket.description}} />
										</Accordion>
									</div>
							  ))}
					</div>
					<br />
					<Divider />
					<br />
					<Typography fontWeight={'bold'} color={'#6b2e7d'} variant='h6' component='h2'>
						Improvements
					</Typography>
					<br />
					<div className='improvements'>
						{filterMonth
							? sortedImprovementTickets[filterMonth]
								? sortedImprovementTickets[filterMonth].map((ticket, index) => (
										<div key={index} className='release-ticket-wrapper'>
											{index != 0 ? (
												new Date(featureTickets[index - 1].created_date).toLocaleDateString() != new Date(ticket.created_date).toLocaleDateString() ? (
													<>
														<br />
														<Typography variant='body2' className='ticket-created-date' fontWeight={'bold'} color='gray'>
															{new Date(ticket.created_date).toLocaleDateString()}
														</Typography>
													</>
												) : null
											) : (
												<Typography variant='body2' className='ticket-created-date' fontWeight={'bold'} color='gray'>
													{new Date(ticket.created_date).toLocaleDateString()}
												</Typography>
											)}
											<Accordion defaultExpanded={false}  className='release-ticket ck-content'>
												<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
													<Typography fontWeight={'bold'} variant='h6'>{ticket.title}</Typography>
												</AccordionSummary>
												<AccordionDetails dangerouslySetInnerHTML={{__html: ticket.description}} />
											</Accordion>
										</div>
								  ))
								: null
							: improvementTickets.map((ticket, index) => (
									<div key={index} className='release-ticket-wrapper'>
										{index != 0 ? (
											new Date(improvementTickets[index - 1].created_date).toLocaleDateString() != new Date(ticket.created_date).toLocaleDateString() ? (
												<Typography variant='body2' className='ticket-created-date' fontWeight={'bold'} color='gray'>
													{new Date(ticket.created_date).toLocaleDateString()}
												</Typography>
											) : null
										) : (
											<Typography variant='body2' className='ticket-created-date' fontWeight={'bold'} color='gray'>
												{new Date(ticket.created_date).toLocaleDateString()}
											</Typography>
										)}
										<Accordion defaultExpanded={false}  className='release-ticket ck-content'>
											<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
												<Typography fontWeight={'bold'} variant='h6'>{ticket.title}</Typography>
											</AccordionSummary>
											<AccordionDetails dangerouslySetInnerHTML={{__html: ticket.description}} />
										</Accordion>
									</div>
							  ))}
					</div>
				</div>
			</div>
		</>
	);
}
