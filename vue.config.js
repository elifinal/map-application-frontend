module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/your/path/to/dist/'
    : '/',
};
