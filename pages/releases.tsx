import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function Releases(props: any) {
	const [featureTickets, setFeatureTickets] = useState<any[]>([]);
	const [improvementTickets, setImprovementTickets] = useState<any[]>([]);
	const [filterMonth, setFilterMonth] = useState<null | string>(null);
	const [filterYear, setFilterYear] = useState<null | string>(null);
	const [showFilter, setShowFilter] = useState(false);
	const [selectedDate, setSelectedDate] = useState('');

	const getTickets = async () => {
		const currentYear = new Date().getFullYear();
		let currentMonth = new Date().getMonth();
		currentMonth = props.months[currentMonth];
		setFilterMonth(currentMonth.toString());
		setFilterYear(currentYear.toString());
		setSelectedDate(`${currentMonth.toString()} ${currentYear.toString()}`);
		const feature = await axios.get(`/api/gettickets?draft=false&releasetype=feature&created_year=${currentYear}&created_month=${currentMonth}`);
		const improvement = await axios.get(`/api/gettickets?draft=false&releasetype=improvement&created_year=${currentYear}&created_month=${currentMonth}`);
		setFeatureTickets(feature.data);
		setImprovementTickets(improvement.data);
	};
	useEffect(() => {
		getTickets();
	}, []);

	const handleFilterMonth = async (month: number) => {
		const selectedMonth = props.months[month];
		setFilterMonth(selectedMonth);
		setShowFilter(false);
		setSelectedDate(`${selectedMonth} ${filterYear}`);
		const feature = await axios.get(`/api/gettickets?draft=false&releasetype=feature&created_year=${filterYear}&created_month=${selectedMonth}`);
		const improvement = await axios.get(`/api/gettickets?draft=false&releasetype=improvement&created_year=${filterYear}&created_month=${selectedMonth}`);
		setFeatureTickets(feature.data);
		setImprovementTickets(improvement.data);
	};

	return (
		<>
			<div className='releases'>
				<CalendarMonthIcon className='filter-icon' onClick={() => setShowFilter(!showFilter)} fontSize={'large'} />
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker
						sx={{
							'.MuiInputBase-adornedEnd': {opacity: 0, width: 0},
						}}
						minDate={dayjs('01/01/2004')}
						maxDate={dayjs()}
						onYearChange={(year) => {
							setFilterYear(dayjs(year).year().toString());
						}}
						onMonthChange={(month) => {
							handleFilterMonth(dayjs(month).month());
						}}
						open={showFilter}
						disableFuture={true}
						views={['year', 'month']}
					/>
				</LocalizationProvider>

				<div className='release-list'>
					<Typography fontWeight={'bold'} fontStyle={'italic'} variant='h5' component='h2'>
						Releases <span className='release-year'>{selectedDate}</span>
					</Typography>
					<Divider />
					<br />
					<Typography fontWeight={'bold'} color={'#6b2e7d'} variant='h6' component='h2'>
						Features
					</Typography>
					<br />
					<div className='features'>
						{featureTickets.map((ticket, index) => (
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
								<Accordion defaultExpanded={true} className='release-ticket ck-content'>
									<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content'>
										<Typography fontWeight={'bold'} variant='h6'>
											{index + 1}. {ticket.title}
										</Typography>
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
						{improvementTickets.map((ticket, index) => (
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
								<Accordion defaultExpanded={false} className='release-ticket ck-content'>
									<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content'>
										<Typography fontWeight={'bold'} variant='h6'>
											{index + 1}. {ticket.title}
										</Typography>
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
