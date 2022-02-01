require(`dotenv`).config();
const express = require(`express`);
const cors = require(`cors`);
const bodyParser = require(`body-parser`);
const connectDB = require(`./config/database`);
const { PORT } = require(`./config/env`);
const router = require(`./routes`);

connectDB();

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
const apiRoutes = router();
app.use(`/api/v1/`, apiRoutes);

app.listen(PORT, () => {
    console.log(`Server stated on port ${PORT}`);
});