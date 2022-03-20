const userOps = require("../config/crudoperations/profile");
const express = require("express");
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/index");

router.post("/getuser", function(request, response) {
  var id;
  if (request.body.userId) {
    id = request.body.userId;
  } else {
    id = request.userData.objectId;
  }

  userOps.populate(id, (err, res) => {
    if (err) {
      response.send(err);
    } else if (res) {
      response.send(res);
    }
  });
});
router.post("/getallusers", function(request, response) {
  userOps.findallusers(request.userData.objectId, (err, res) => {
    if (err) {
      callback(err, null);
    } else if (res) {
      response.send(res);
    }
  });
});
router.post("/alluser", function(request, response) {
  userOps.getuser(request, response);
});
router.post("/userrole", function(request, response) {
  userOps.getuserrole(request, response);
});
router.post("/countuserrole", function(request, response) {
  userOps.count(request, response);
});
router.post("/getuserbyid", function(request, response) {
  userOps.getUserById(request.body.userId, (err, res) => {
    if (err) {
      utils.response(response, "fail");
    } else if (res) {
      response.send(res);
    }
  });
});

router.post("/incash", function(request, response) {
  userOps.incash(response, request.body.userId, (err, res) => {
    if (err) {
      callback(err, null);
    } else if (res) {
      response.json({ message: "sucessful" });
    }
  });
});
router.post("/incashuser", function(request, response) {
  userOps.incashuser(
    response,
    request.userData.userId,
    request.body.credit,
    (err, res) => {
      if (err) {
        callback(err, null);
      } else if (res) {
        dbOperations.checkSession(request, response, request.userData);
      }
    }
  );
});
router.post("/findincash", function(request, response) {
  var obj = request.body;
  userOps.getincash(obj, response);
});

module.exports = router;
