import '@mui/internal-test-utils/init';
import '@mui/internal-test-utils/setupKarma';

const pigmentCssContext = require.context(
  '../packages/pigment-css-react/tests/',
  true,
  /\.test\.(js|ts|tsx)$/,
);
pigmentCssContext.keys().forEach(pigmentCssContext);