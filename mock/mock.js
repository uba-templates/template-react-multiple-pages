
// See http://expressjs.com/en/4x/api.html#res
module.exports = function(router) {
  router.get("/Mock/Login.do", function(req, res, next) {
    res.send("Hello Mock " + new Date());
  });
  router.get('/user/:uid/photos/:file', function(req, res) {
    var uid = req.params.uid,
      file = req.params.file;
      res.send(`${uid}    ${file}`);
  });
  return router;
}
