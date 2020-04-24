import {ObjectID} from  'mongodb';

export function isAuthenticated(req, res, next) {
  // do any checks you want to in here

  if(!req.user) { // for testing
    req.user = { ...req.user, 
        _id: new ObjectID("5ea287bafc9d3a1862718b85"),
        googleId: '101321807445229510865',
        __v: 0,
        tags: []
    }
  }

  if (req.user)
      return next();

  res.status(401).json({
    status:0,
    error: "You need to login"
  })
}
