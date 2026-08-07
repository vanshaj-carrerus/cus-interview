const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://CUS-Interview:CUS-Interview-vfpu4_8y87fhdo9ey@cus-interview.vxvmklu.mongodb.net/data').then(async () => {
  const db = mongoose.connection.db;
  const questions = await db.collection('learningquestions').find({ tags: { $in: [/amazon/i, /facebook/i, /tcs/i, /hcl/i] } }).toArray();
  console.log('Questions tagged with companies:', questions.length);
  
  const allTags = await db.collection('learningquestions').distinct('tags');
  console.log('All tags:', allTags);
  
  const tracks = await db.collection('learningtracks').find({ title: { $regex: /amazon|facebook|tcs/i } }).toArray();
  console.log('Tracks named after companies:', tracks.length);
  
  process.exit(0);
});
