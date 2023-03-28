import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import config from './config/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Object>) {
	let gitTickets: object[] = [];

	let draft = '*';
	let visibility = '*';
	let releasetype = '*';
	let created_year = '*';
	let created_month = '*';
	let size = '100';
	//@ts-ignore
	if (req.query.draft) draft = req.query.draft;
	//@ts-ignore
	if (req.query.public) visibility = req.query.public;
	//@ts-ignore
	if (req.query.releasetype) releasetype = req.query.releasetype;
	//@ts-ignore
	if (req.query.created_year) created_year = req.query.created_year;
	//@ts-ignore
	if (req.query.created_month) created_month = req.query.created_month;

	let draftTickets = await axios.post(`${process.env.ELASITC_URL}/query/getreleases`, {
		index: 'releases',
		draft,
		public: visibility,
		releasetype,
		size,
		created_year,
		created_month,
	});

	draftTickets = draftTickets.data.body.hits.hits;
	let ignoreTickets = '';

	//@ts-ignore
	for (const draftTicket of draftTickets) {
		ignoreTickets += `&not[iids][]=${draftTicket._id}`;
		let ticketData = {
			...draftTicket._source,
			iid: draftTicket._id,
		};
		if (draftTicket._source.public && draft == 'false' && !draftTicket._source.draft) {
			gitTickets.push(ticketData);
		} else if (!req.query.draft) {
			gitTickets.push(ticketData);
		}
	}

	if (draft != 'false') {
		for (const project of config) {
			const tickets = await axios.get(`https://gitlab.com/api/v4/projects/${project.projectId}/issues?state=closed&labels=Moved to Live${ignoreTickets}`, {
				headers: {
					'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
				},
			});
			gitTickets = gitTickets.concat(tickets.data);
		}
	}
	res.status(200).json(gitTickets);
}
