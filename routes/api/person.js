// Define the routes
const express = require('express');
const router = express.Router();
const Shipwreck = require('./../../models/shipwreck');

router.get('/search', (req, res) => {
  res.render('search-form');
});

// post route for hbs file
router.post('/search', async (req, res) => {
  try {
    const page = parseInt(req.body.page);
    const perPage = parseInt(req.body.perPage);
    const depth = parseFloat(req.body.depth);
    const skip = (page - 1) * perPage;
    const filter = depth ? { depth: depth } : {};
    console.log(filter);
    const shipwrecks = await Shipwreck.find(filter).skip(skip).limit(perPage);
    console.log(shipwrecks)
    res.render('search-result', { shipwrecks });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});


// Adding new data
router.post('/adddata', async (req, res) => {
  try {
    const { recrd, vesslterms, feature_type, chart, latdec, londec, gp_quality, depth, sounding_type, history, quasou, watlev, coordinates } = req.body;
    console.log(recrd)
    const newShipwreck = new Shipwreck({
      
      recrd,
      vesslterms,
      feature_type,
      chart,
      latdec,
      londec,
      gp_quality,
      depth,
      sounding_type,
      history,
      quasou,
      watlev,
      coordinates,
    });

    await newShipwreck.save();
    res.status(201).send(newShipwreck);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
  //Getting data
  router.get('/getdata', async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const perPage = parseInt(req.query.perPage);
      const depth = parseInt(req.query.depth);
      const skip = (page - 1) * perPage;
      const filter = depth ? { depth: depth } : {};
      console.log(filter);
      const shipwrecks = await Shipwreck.find(filter).skip(skip).limit(perPage);
      res.send(shipwrecks);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
  
  // GETting data using specific ID 
  router.get('/getdata/:id', (req, res) => {
    Shipwreck.findById(req.params.id)
      .then((shipwreck) => {
        if (!shipwreck) {
          return res.status(404).json({ message: 'Shipwreck not found' });
        }
        res.json(shipwreck);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving shipwreck' });
      });
  });
  
  // Update using ID
  router.put('/updatedata/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      console.log(updates);
      const options = { new: true };
      const shipwreck = await Shipwreck.findByIdAndUpdate(id, updates, options);
      if (!shipwreck) {
        res.status(404).send();
      } else {
        res.send(shipwreck);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
  
  // Deleting the data
  router.delete('/deletedata/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const shipwreck = await Shipwreck.findByIdAndDelete(id);
      if (!shipwreck) {
        res.status(404).send('Not found');
      } else {
        res.send(id+' Deleted');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
  
  // Export the router
  module.exports = router;