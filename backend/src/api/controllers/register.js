
const puppeteer = require('puppeteer')
const { username, password } = require('../../config/credentials')

module.exports = {
  index: async (req, res) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.goto('https://app.pontomaisweb.com.br/#/acessar')

    const loginPontoMais = async () => {
      await page.evaluate(async () => {
        const login = document.getElementsByName('login')[0]
        login.id = 'login'

        const password = document.getElementsByName('password')[0]
        password.id = 'password'
      })

      await page.focus('#login')
      await page.keyboard.type('' + username)

      await page.focus('#password')
      await page.keyboard.type('' + password)

      await page.evaluate(async () => {
        document.querySelectorAll('form button')[0].click()
      })
    }

    const saveRegister = async () => {
      await page.evaluate(async () => {
        const button = document.querySelectorAll('button')[1]
        const buttonText = button && button.innerText

        if (buttonText === 'Registrar ponto') {
          button.click()
          return true
        }

        return false
      })
    }

    try {
      await loginPontoMais()

      setTimeout(async () => {
        await saveRegister()
        await page.screenshot({ path: 'example1.png' })
        await browser.close()
      }, 5000)
    } catch (e) {
      res.send({
        status: false,
        message: 'Error.'
      }).status(500)
    }

    res.send({
      status: true,
      message: 'Search succesfully.'
    }).status(200)
  }
}
