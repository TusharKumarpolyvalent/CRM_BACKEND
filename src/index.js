const dotenv = require('dotenv');
// Load base environment variables
dotenv.config({ path: '.env' });
// Load local overrides (if exists)
// dotenv.config({ path: `.env.${process.env.NODE_ENV}`, override: true });

const app = require('./server');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is up and running on port ${PORT}`);
});
// teting
