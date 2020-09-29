global.rootRequire = name => require(`${__dirname}/${name}`);
require('dotenv').config();

const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(compression({ level: 6, filter: shouldCompress }));

// so great, it just works
require('./app')(app);

function shouldCompress (req, res) {
	if (req.headers['x-no-compression'])
		return false;

	return compression.filter(req, res);
}
