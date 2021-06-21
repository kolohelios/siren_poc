import { GraphAdapter, GremlinAdapter } from './GremlinAdapter';
import writer from 'siren-writer';
import express, { Application } from 'express';
import morgan from 'morgan';
import Router from './routes';

const g: GraphAdapter = new GremlinAdapter();

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.use(Router);

app.listen(PORT, () => {
	console.log('Server is running on port', PORT);
});

console.log({ settings: app.settings });

const siren = writer('http://api.x.io');

// Employ a timeout hack to make sure we connect before we try to add this vertex
setTimeout(() => {
	g.addGenericVertex('person', { firstName: 'John', lastName: 'Doe' })
		.then((resp) => {
			console.log(resp);
			console.log(JSON.stringify(resp));
			g.addGenericVertex('organization', { name: 'Test Co.' }).then(
				(resp) => {
					console.log(resp);
					console.log(JSON.stringify(resp));
				},
			);
		})
		.catch(console.error);
}, 5000);
