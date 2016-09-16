module.exports = {
  target: 'web',
  entry: `${__dirname}/src/client.js`,
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/dist/static/`,
		publicPath: '/static/',
  },
  module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/,
			},
		],
	},
};
