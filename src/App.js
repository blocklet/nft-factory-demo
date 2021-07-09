import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import { create } from '@arcblock/ux/lib/Theme';

import { getWebWalletUrl } from './libs/util';
import { SessionProvider } from './libs/session';
import { translations } from './locales';
import Main from './page/main';

let apiPrefix = '/';
if (window.blocklet && window.blocklet.prefix) {
  apiPrefix = window.blocklet.prefix;
}

function App() {
  const webWalletUrl = getWebWalletUrl();

  const theme = create({
    typography: {
      fontSize: 14,
      button: {
        textTransform: 'none',
      },
    },
    overrides: {
      MuiTableRow: {
        root: {
          '&:nth-child(even)': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
        head: {
          backgroundColor: 'transparent',
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <LocaleProvider translations={translations}>
          <SessionProvider
            serviceHost={apiPrefix}
            webWalletUrl={webWalletUrl}
          >
            <CssBaseline />
            <Main />
          </SessionProvider>
        </LocaleProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
