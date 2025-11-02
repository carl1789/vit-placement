#!/usr/bin/env node

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const uri = "mongodb+srv://task-manager:AnaqAZxx0BthhQfL@cluster0.m6vbg.mongodb.net/test?retryWrites=true&w=majority";

const backupFilePath = path.join(__dirname, '..', `scores_backup_${new Date().toISOString()}.json`);

async function processScores() {
  let connection;
  try {
    connection = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB database connection established successfully");

    const scoreSchema = new mongoose.Schema({
      name: { type: String, required: true },
      score: { type: Number, required: true },
    });

    // Use existing model or create a new one
    const Score = mongoose.models.Score || mongoose.model('Score', scoreSchema);

    // 1. Backup the entire collection
    const allScores = await Score.find({}).lean();
    fs.writeFileSync(backupFilePath, JSON.stringify(allScores, null, 2));
    console.log(`Backup created successfully: ${backupFilePath}`);

    // 2. Find the highest score for each unique name
    const highScores = await Score.aggregate([
      {
        $group: {
          _id: "$name",
          doc: { "$first": "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" }
      }
    ]);
    
    if (highScores.length === 0) {
        console.log('No scores found to process.');
        return;
    }

    // 3. Remove all existing entries
    await Score.deleteMany({});
    console.log('All scores have been removed.');

    // 4. Insert the new high scores
    await Score.insertMany(highScores);
    console.log('High scores have been inserted.');
    console.log('Script finished successfully.');

  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    if (connection) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
    }
  }
}

processScores();
