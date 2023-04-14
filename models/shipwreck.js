var mongoose = require('mongoose');
// var { Schema } = require('mongoose');

const shipwrecks = new mongoose.Schema({
  // _id: { type: mongoose.Schema.Types.ObjectId },
  recrd: { type: String, default: '' },
  vesslterms: { type: String, default: '' },
  feature_type: { type: String, required: true },
  chart: { type: String, required: true },
  latdec: { type: Number, required: true },
  londec: { type: Number, required: true },
  gp_quality: { type: String, default: '' },
  depth: { type: Number, default: 0 },
  sounding_type: { type: String, default: '' },
  history: { type: String, default: '' },
  quasou: { type: String, default: '' },
  watlev: { type: String, required: true },
  coordinates:{
    type: [Number],
    index: '2dsphere'
  } ,
});


module.exports = mongoose.model('shipwrecks',shipwrecks);