import { GraphAdapter, GremlinAdapter } from './GremlinAdapter';

const g: GraphAdapter = new GremlinAdapter();

// Employ a timeout hack to make sure we connect before we try to add this vertex
setTimeout(() => {
	g.addGenericVertex('person', { firstName: 'John', lastName: 'Doe' })
		.then((resp) => {
			console.log(resp);
			console.log(JSON.stringify(resp));
		})
		.catch(console.error);
}, 5000);
