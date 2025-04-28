export const GET = async () => {
	return new Response('', {
		status: 307,
		headers: {
			Location: '/onward?r=asf'
		}
	});
};
