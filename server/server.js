const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://GET UR OWN BITCH";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const scoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
}, {
  timestamps: true,
});

const Score = mongoose.model('Score', scoreSchema);

app.get('/scores', async (req, res) => {
  try {
    // Return best score per user (deduplicated), sorted desc, top 10
    const topPerUser = await Score.aggregate([
      { $group: { _id: '$name', best: { $max: '$score' } } },
      { $project: { _id: 0, name: '$_id', score: '$best' } },
      { $sort: { score: -1 } },
      { $limit: 10 },
    ]);
    res.json(topPerUser);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

app.post('/scores', async (req, res) => {
  const { name, score } = req.body;

  const newScore = new Score({
    name,
    score,
  });

  try {
    await newScore.save();
    res.json('Score added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
