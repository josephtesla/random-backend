import app from "./app";
const PORT = process.env.PORT || 8000;
require("dotenv").config();

const server = app.listen(PORT, () => {
    console.log(`
      ################################################
      🛡️  Server listening on port: ${PORT} 🛡️
      ################################################
      SERVER IN ${process.env.NODE_ENV} MODE
    `);
});
