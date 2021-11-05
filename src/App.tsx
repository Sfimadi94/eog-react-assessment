import React from 'react';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
// prettier-ignore
import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/react-hooks';
import createStore from './store/index';
// import Header from './components/Header';
import Wrapper from './components/Wrapper';
import Dashboard from './metrics/Dashboard';

const store = createStore();

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
  cache: new InMemoryCache(),
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Wrapper>
          <Dashboard />
          <ToastContainer />
        </Wrapper>
      </ApolloProvider>
    </Provider>
  </MuiThemeProvider>
);

export default App;
