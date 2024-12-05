const userController = () => {
  const User = require('../models/userModel')
  // let Order = require('../models/orderModel');

  function post (req, res) {
    if (req.body.email) {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
          res.status(422).send('user already exist')
        } else {
          const user = new User({
            email: req.body.email,
            userType: req.body.userType
          })
          user.save((err) => {
            if (err) { res.status(409).send() } else { res.status(201).send('Successfully created.') }
          })
        }
      })
    } else { res.status(400).send('Required fields empty') }
  }

  function get (req, res) {
    // console.log('-asdasds', req.session)
    User.find({}, (err, users) => {
      if (err) { res.status(500).send() } else if (users) { res.status(200).json(users) } else { res.status(404).send() }
    })
  }

  function switchUserType (req, res) {
    User.findOne({
      _id: req.body._id
    }, function (err, user) {
      if (err) { res.status(500).send() } else if (user) {
        if (user.userType == 'Admin') {
          user.userType = 'Employee'
        } else {
          user.userType = 'Admin'
        }

        user.save((err, saved) => {
          if (err) { res.status(500).send() } else { res.status(200).send('Successfully updated.') }
        })
      } else { res.status(404).send() }
    })

    console.log(req.body)
  }

  function putByID (req, res) {
    User.findOne({
      _id: req.body._id
    }, function (err, user) {
      if (err) { res.status(500).send() } else if (user) {
        if (req.body.dept) {
          user.department = req.body.dept
          user.fullName = req.body.fullName
        } else if (req.body.userType) {
          user.department = req.body.dept
          user.userType = req.body.userType
          user.email = req.body.email
        } else if (req.body.email) {
          user.email = req.body.email
        } else {
          user.fullName = req.body.fullName
        }

        user.save((err, saved) => {
          if (err) { res.status(500).send() } else { res.status(200).send('Successfully updated.') }
        })
      } else { res.status(404).send() }
    })
  }

  function deleteById (req, res) {
    User.find({}, (err, user) => {
      req.body.toDelete.forEach((x) => {
        user.forEach((a) => {
          if (a._id == x) {
            User.findByIdAndRemove({
              _id: x
            }, (err) => {
              if (err) { res.status(500).send() } else { res.status(200).send() }
            })
          }
        })
      })
    })
  }

  function ownProfile (req, res) {
    console.log('req.user ::::::::', req.session)
    console.log(':::: ownProfile')

    if (!req.session.passport.user) {
      res.status(500).redirect('/')
    } else {
      User.findById({ _id: req.session.passport.user._id }).populate({ path: '_orders', select: 'name order' }).exec((err, user) => {
        console.log(':: ni sud ::', user.email)
        if (err) {
          res.status(500).send('asdasd')
        } else if (user) {
          res.status(200).json(user)
        } else { res.status(404).send() }
      })
    }
  }

  return {
    post,
    get,
    putByID,
    deleteById,
    switchUserType,
    ownProfile
  }
}

module.exports = userController
