import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import config from './config/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Object>) {
	let gitTickets: object[] = [];

	let draft = '*';
	let visibility = '*';
	let releasetype = '*';
	let size = '100';
	//@ts-ignore
	if (req.query.draft) draft = req.query.draft;
	//@ts-ignore
	if (req.query.public) visibility = req.query.public;
	//@ts-ignore
	if (req.query.releasetype) releasetype = req.query.releasetype;

	let draftTickets = await axios.post(`${process.env.ELASITC_URL}/query/getreleases`, {
		index: 'releases',
		draft,
		public: visibility,
		releasetype,
		size,
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
		} else if(!req.query.draft) {
			gitTickets.push(ticketData);
		}
	}

	for (const project of config) {
		if (draft != 'false') {
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
