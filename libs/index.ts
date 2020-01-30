import app from './app';

const page: string =
  location.pathname.indexOf('/my/top') !== -1 ||
  location.pathname.indexOf('/my/watchlist') !== -1
    ? 'watchlist'
    : 'ranking';
app(page);
