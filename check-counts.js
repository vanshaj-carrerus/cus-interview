const { connectDB } = require('./src/lib/mongodb');
const mongoose = require('mongoose');
const { LearningTrack, LearningLevel } = require('./src/models/learning');
async function run() {
  await connectDB();
  const c = await LearningTrack.countDocuments({ status: 'published', kind: 'course' });
  const l = await LearningLevel.countDocuments({ status: 'published' });
  console.log({courses: c, levels: l});
  process.exit(0);
}
run();
