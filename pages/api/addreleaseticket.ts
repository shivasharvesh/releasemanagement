import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Object>) {
	const id = req.body.id;
	if(!id) {
		console.log('missin')
		return res.status(500).send("ID is missing")
	}
	const reqObj = req.body;
	await axios.post(`${process.env.ELASITC_URL}/query/insert/${id}`, reqObj);
	res.status(200).send('released');
}
