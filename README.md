# Papo Client

It’s built with JavaScript – a very light [node](https://nodejs.org) plus [express](http://expressjs.com) server, [React.js](https://facebook.github.io/react/), [Redux](http://redux.js.org/), and many other wonderful libraries on the front-end.

## About

This project is client side for Papo. An open source CMR for building modern real-time applications for facebook business.

## Getting Started

Before you can run this app, you must start MongoDB, [Papo Server](https://github.com/enesyteam/papo-server).
Getting up and running is as easy as 1, 2, 3 and 4.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. MongoDB are running.
2. Install your dependencies

    ```
    cd path/to/papo-client; npm install
    ```

3. Set environment variables

**windows**

	```
	set NODE_ENV=development
	set PAPO_ENV=development
	```

**linux**

	```
	export NODE_ENV=development
	export PAPO_ENV=development
	```

If you want to run Papo in production mode: 

	```
	set NODE_ENV=production
	set PAPO_ENV=production
	```

4. Start your app

    ```
    npm start
    ```

Go to `https://localhost:5000`

## Folders structure

	```
	-papo-client
	--assets	contains all universal style sheets (e.g: layout, sidebar, colors, mixins, ....)
	--bin		build logics
	--build		build bundles
	--client	client source
	---auth
	---blocks
	---...
	--config	environments config
	--docs		development documents
	--public	public assets (generate by build logics)
	--server	entry of this app
	--test		test cases
	```

## Coding guides

This project require some coding rules to make it clear.

### Language

* Every descriptions use `English`
* Every code file must have this at the begining
```
	/** @format */

	/**
 	* External dependencies
 	*/
 	// External dependencies will imported here
 	...

 	/**
	 * Internal dependencies.
	 */
	...

	/**
	 * Module variables
	 */
	Module variables will defined here (e.g: const MY_VARIABLE = 'hello')
```

* other rules 

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Help

For more information on all the things you can do with papo-client ....

## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
