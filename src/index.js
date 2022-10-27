import * as PIXI from 'pixi.js'
import bootstrap from './bootstrap'
import Game from './game'
import config from './config'

window.addEventListener('load', () => {
  bootstrap(config)
  const loader = PIXI.Loader.shared

  loader.load((loader, resources) => {
    const currentGame = new Game(config)
    currentGame.makeScene()
    currentGame.startGame()
  })
})
