
module.exports = {
  index: async (req, res) => {
    res.send({
      status: true,
      message: 'Hello! :).'
    }).status(200)
  }
}
