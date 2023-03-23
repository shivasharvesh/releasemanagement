import Image from 'next/image';
import Releases from './releases';
import {useState} from 'react';
import Draft from './draft';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTicket} from '@fortawesome/free-solid-svg-icons';

export default function Home() {
	const [months, setMonths] = useState(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);

	const [showDraft, setShowDraft] = useState(false);
	return (
		<>
			<header className='header'>
				<Image width={150} height={50} className='kriya-logo' src='/kriya.png' alt='Kriyadocs' />
				{showDraft ? (
					<div onClick={() => setShowDraft(false)} className='draft-tickets'>
						<FontAwesomeIcon style={{height: 35, width: 35}} icon={faTicket} className='ticket-icon' />
					</div>
				) : (
					<div onClick={() => setShowDraft(true)} className='draft-tickets'>
						<Image height={35} width={35} className='editTicket' alt='edit' src='/editTicket.png' />
					</div>
				)}
			</header>
			{showDraft ? <Draft months={months} /> : <Releases months={months} />}
		</>
	);
}
