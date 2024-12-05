const foodController = () => {
  const Food = require('../models/foodModel')

  function post (req, res) {
    console.log('=====', req.body)
    Food.findOne({ name: req.body.name }, (err, food) => {
      if (food) {
        res.status(422).send('food already exist')
      } else {
        const food = new Food({
          name: req.body.name,
          description: req.body.description,
          type: req.body.type
        })
        console.log('---=-=-', food)
        food.save((err, saved) => {
          if (err) { res.status(500).send() } else { res.status(200).json(saved) }
        })
      }
    })
  }

  function get (req, res) {
    console.log('_____', req.session)
    Food.find({}, (err, foods) => {
      console.log('butangan og string', foods)
      if (err) { res.status(500).send() } else if (foods) { res.status(200).json(foods) } else { res.status(404).send() }
    })
  }

  function putByID (req, res) {
    console.log('---', req.body)
    const foodId = req.body._id
    Food.findOne({ _id: foodId }, function (err, food) {
      if (!food) { console.log('no food found') } else {
        food.name = req.body.name
        food.description = req.body.description
        food.type = req.body.type
        // food.update({
        //     $set: {
        //         name: req.body.name,
        //         description: req.body.description,
        //         type: req.body.type
        //     }
        // }, err => {
        //     if (err) res.status(401).send('error updating food');
        //     else res.status(201).json(req.food);
        // })
        food.save((err, reved) => {
          if (err) { res.status(401).send('error updating food') } else { res.status(201).json(req.food) }
        })
      }
    })
  }

  function deleteById (req, res) {
    Food.find({}, (err, food) => {
      req.body.toDelete.forEach((x) => {
        food.forEach((a) => {
          if (a._id == x) {
            Food.findByIdAndRemove({ _id: x }, (err) => {
              if (err) { res.status(500).send() } else { res.status(200).send() }
            })
          }
        })
      })
    })
  }

  return {
    get,
    post,
    putByID,
    deleteById
  }
}

module.exports = foodController
