const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
// const keys = require('./keys');
const User = require('../models/userModel')

passport.serializeUser((user, done) => { done(null, user) })
passport.deserializeUser((user, done) => { done(null, user) })
passport.use(
  new GoogleStrategy({
    // options for google strategy
    clientID: '542973028117-o0cra2kbdde1uhni48vq5gbtslvconj9.apps.googleusercontent.com',
    clientSecret: '_kstSCSRkyhWVnYOGZaPisRu',
    callbackURL: '/auth/google/redirect',
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, (accessToken, refreshToken, profile, email, done) => {
    console.log('profile:::::', email.name.givenName)
    email.emails.forEach((data) => {
      // console.log('$$$$$$', data.email)
      const input = data.value
      const domain = input.split('@')[1]
      // var second_split = first_split.split(".");

      console.log('email:::::::', domain)

      // return done (null, email)
      User.findOne({ email: data.value }, (err, currentUser) => {
        // console.log('::::', currentUser)
        if (currentUser) {
          // console.log(':: currentUser :: ', currentUser)
          currentUser.givenName = email.name.givenName
          currentUser.familyName = email.name.familyName
          currentUser.save((err, saved) => {
            if (err) { console.log('wala na save ang name sa bago ni login') }
          })
          if (currentUser.fullName == '') {
            console.log('nag add')
            const name = email.name.givenName + ' ' + email.name.familyName
            currentUser.fullName = name
            currentUser.save((err, saved) => {
              if (err) { console.log('wala na save ang name sa bago ni login') } else { done(null, currentUser) }
            })
          } else {
            console.log('naa na --', currentUser)
            currentUser.id = email.id
            done(null, currentUser)
          }
        } else if (domain == 'meditab.com' || domain === 'drcatalyst.com' || domain === 'quickcap.com' || domain === 'suiterx.com' || domain === 'website4md.com' || domain === 'medpharmservices.com' || domain === 'medspecialized.com' || domain === 'mghostingservices.com' || domain === 'quickcap.net') {
          const user = new User({
            email: data.value,
            userType: 'Employee'
          })
          // user.save((err, saved) => {
          //     if (err) res.status(409).send();
          //     else res.status(201).send('Successfully created.');
          // });
          console.log('walaaaaaaaaaaaaa')
          user.save((err, saved) => {
            User.findOne({ email: data.value }, (err, currentUser) => {
              if (currentUser.fullName == '') {
                console.log('nag add')
                const name = email.name.givenName + ' ' + email.name.familyName
                currentUser.fullName = name
                currentUser.givenName = email.name.givenName
                currentUser.familyName = email.name.familyName
                currentUser.givenName = email.name.givenName
                currentUser.save((err, saved) => {
                  if (err) { console.log('wala na save ang name sa bago ni login') } else { done(null, currentUser) }
                })
              } else {
                console.log('naa na')
                currentUser.id = email.id
                done(null, currentUser)
              }
            })
          })
        } else { return done(null, email) }
      })
    })
  })
)
