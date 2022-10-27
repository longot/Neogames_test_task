import * as PIXI from 'pixi.js'

let gameStarted = false

export default function bootstrap(config) {
  if (gameStarted) {
    return
  }
  gameStarted = true

  const options = {
    width: 667 * 2,
    height: 375 * 2,
    backgroundColor: 0xFFFFFF,
    resolution: 1,
    antialias: true,
    autoResize: true,
  }
  const application = new PIXI.Application(options)
  window.game.appendChild(application.view)
  window.GameApplication = application

  const loader = PIXI.Loader.shared

  config.resource.forEach((element) => {
    // eslint-disable-next-line no-prototype-builtins
    if (element.hasOwnProperty('key') && element.hasOwnProperty('url')) {
      loader.add(element.key, element.url)
    }
  })
}
