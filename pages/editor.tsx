import {CKEditor} from '@ckeditor/ckeditor5-react';
import {Button, Chip, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from '@mui/material';
import {useEffect, useState} from 'react';
import axios from 'axios';
//@ts-ignore
import CustomCKEditor from 'ckeditor5-custom-build/build/ckeditor';

export default function Editor(props: any) {
	const [releaseType, setReleaseType] = useState('feature');
	const [visibility, setVisibility] = useState('public');
	const [title, setTitle] = useState<string | null>(props.ticket.title);
	const [description, setDescription] = useState<string | null>(props.ticket.description);

	useEffect(() => {
		if (props.ticket.public == false) {
			setVisibility('private');
		} else {
			setVisibility('public');
		}
		if (props.ticket.releasetype) {
			setReleaseType(props.ticket.releasetype);
		}
	}, [props.ticket]);

	const handleDraftSave = async () => {
		let publicView = true;
		if (visibility == 'private') publicView = false;
		const created_date = new Date().getTime();
		let created_month = new Date().getMonth();
		created_month = props.months[created_month];
		let created_year = new Date().getFullYear();
		let data = {iid: props.ticket.iid, title, description, draft: true, public: publicView, releasetype: releaseType, created_date, created_month, created_year};
		await axios.post('/api/addreleaseticket', {
			id: props.ticket.iid,
			index: 'releases',
			postContent: true,
			data,
		});
		props.updateTicket(data);
	};
	const handleRelease = async () => {
		let publicView = true;
		if (visibility == 'private') publicView = false;
		const created_date = new Date().getTime();
		let created_month = new Date().getMonth();
		created_month = props.months[created_month];
		let created_year = new Date().getFullYear();
		let data = {iid: props.ticket.iid, title, description, draft: false, public: publicView, releasetype: releaseType, created_date, created_month, created_year};
		await axios.post('/api/addreleaseticket', {
			id: props.ticket.iid,
			index: 'releases',
			postContent: true,
			data,
		});
		props.updateReleasedTicket(data);
	};

	return (
		<>
			<div className='editor'>
				<Chip className='chip' label='Title' />
				<br />
				<input
					onChange={(e) => {
						setTitle(e.target.value);
					}}
					defaultValue={props.ticket.title}
					className='ticket-title'
				/>
				<br />
				<br />
				<Chip className='chip' label='Release Type' />
				<div className='release-type'>
					<FormControl>
						<RadioGroup sx={{display: 'flex', flexDirection: 'row'}} aria-labelledby='demo-radio-buttons-group-label' onChange={(e) => setReleaseType(e.target.value)} value={releaseType} name='radio-buttons-group'>
							<FormControlLabel value='feature' control={<Radio />} label='Feature' />
							<FormControlLabel value='improvement' control={<Radio />} label='Improvement' />
						</RadioGroup>
					</FormControl>
				</div>
				<br />
				<Chip className='chip' label='Visibility' />
				<div className='visibility'>
					<FormControl>
						<RadioGroup sx={{display: 'flex', flexDirection: 'row'}} aria-labelledby='demo-radio-buttons-group-label' onChange={(e) => setVisibility(e.target.value)} value={visibility} name='radio-buttons-group'>
							<FormControlLabel value='public' control={<Radio />} label='Public' />
							<FormControlLabel value='private' control={<Radio />} label='Private' />
						</RadioGroup>
					</FormControl>
				</div>
				<br />
				<Chip className='chip' label='Description' />
				<CKEditor
					editor={CustomCKEditor}
					config={{title: false}}
					onChange={(event: any, editor: any) => {
						const data = editor.getData();
						setDescription(data);
					}}
					data={props.ticket.description}
				/>
				<br />
				<div className='save'>
					<Button variant='contained' color='error' onClick={() => props.setSelectedTicket()}>
						Cancel
					</Button>
					<Button variant='contained' onClick={handleDraftSave}>
						Draft Save
					</Button>
					<Button
						variant='contained'
						sx={{
							backgroundColor: '#6b2e7d',
							'&:hover': {
								//you want this to be the same as the backgroundColor above
								backgroundColor: '#6b2e7d',
							},
						}}
						onClick={handleRelease}>
						Publish
					</Button>
				</div>
			</div>
		</>
	);
}
