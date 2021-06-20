import { driver, process, structure } from 'gremlin';

// we're going to shorten this class down a bit. You can see where this
// comes into play in the Gremlin documentation
const traversal = process.AnonymousTraversalSource.traversal;

export class GremlinAdapter {
	public g: process.GraphTraversalSource;

	public constructor() {
		const config: any = {};
		const NEEDS_AUTH = false;
		config.traversalsource = 'g';

		// We don't discuss it in the article, but here is an example of what you'd
		// need to do in order to have the GraphTraversalSource you create be able
		// to communicate to a secured Gremlin endpoint
		if (NEEDS_AUTH) {
			const authenticator =
				new driver.auth.PlainTextSaslAuthenticator('user', 'key');
			config.rejectUnauthorized = true;
			config.authenticator = authenticator;
		}

		// withRemote specifies that this source is not local and should be considered
		// a network resource
		this.g = traversal().withRemote(
			new driver.DriverRemoteConnection(
				`ws://127.0.0.1:8182/gremlin`,
				config,
			),
		);
	}

	public async addGenericVertex(
		type: string,
		input: any,
	): Promise<structure.Vertex> {
		let write = this.g.addV(type);
		console.log({ type, input });

		for (const key in input) {
			if (input.hasOwnProperty(key)) {
				if (typeof input[key] === 'object') {
					write = write.property(key, JSON.stringify(input[key]));
					continue;
				}

				write = write.property(key, `${input[key]}`);
				console.log({ write });
			}
		}

		return new Promise((resolve, reject) => {
			write
				.toList()
				.then((results) => {
					console.log({ results });
					const resultSet: driver.ResultSet = new driver.ResultSet(
						results,
					);

					console.log({ resultSet });

					const created: structure.Vertex = <structure.Vertex>(
						(<unknown>resultSet.first())
					);
					resolve(created);
				})
				.catch((err) => {
					reject(err);
					console.error({ err });
				});
		});
	}
}

export interface GraphAdapter {
	addGenericVertex(
		type: string,
		input: any,
	): Promise<structure.Vertex>;
}

export interface Vertex {
	id: string;
	label: string;
	properties?: VertexProperty[];
}

export interface VertexProperty {
	id: string;
	label: string;
	value: any;
	properties?: Property[];
}

export interface Property {
	key: string;
	value: any;
}
