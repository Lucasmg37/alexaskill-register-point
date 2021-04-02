
module.exports = {
  index: async (req, res) => {
    console.log(req.body)

    res.send({
      status: true,
      message: 'Search succesfully.'
    }).status(200)
  }
}
