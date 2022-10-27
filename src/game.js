/* eslint-disable no-plusplus, no-param-reassign, no-prototype-builtins */
import * as PIXI from 'pixi.js'

export default class Game {
  constructor(config) {
    this.config = config
    this.app = window.GameApplication
    this.sceneElements = {}
    this.currentTweenList = {}

    const container = new PIXI.Container()
    const bonusContainer = new PIXI.Container()
    this.app.stage.addChild(container)
    this.app.stage.addChild(bonusContainer)
    this.sceneElements.container = container
    this.sceneElements.bonusContainer = bonusContainer
  }

  makeScene() {
    const textures = PIXI.utils.TextureCache

    const {sceneElements, config} = this
    const {container, bonusContainer} = sceneElements

    const chestEmptyImages = ['chest_0', 'chest_empty_1', 'chest_empty_2', 'chest_empty_3', 'chest_empty_4', 'chest_empty_5']
    const chestWinImages = ['chest_0', 'chest_win_1', 'chest_win_2', 'chest_win_3', 'chest_win_4', 'chest_win_5']
    const chestBonusImages = ['chest_0', 'chest_bonus_1', 'chest_bonus_2', 'chest_bonus_3', 'chest_bonus_4', 'chest_bonus_5']
    const chestEmptyTextureArray = []
    const chestWinTextureArray = []
    const chestBonusTextureArray = []

    for (let i = 0; i < 6; i++) {
      const textureEmpty = PIXI.Texture.from(chestEmptyImages[i])
      chestEmptyTextureArray.push(textureEmpty)

      const textureWin = PIXI.Texture.from(chestWinImages[i])
      chestWinTextureArray.push(textureWin)

      const textureBonus = PIXI.Texture.from(chestBonusImages[i])
      chestBonusTextureArray.push(textureBonus)
    }

    config.elements.forEach((element) => {
      if (element.disabled) return

      if (element.type === 'chest') {
        const chestSprite = new PIXI.Sprite(textures.chest_0)

        const animateEmptySprite = new PIXI.AnimatedSprite(chestEmptyTextureArray)
        animateEmptySprite.animationSpeed = 1 / 12
        animateEmptySprite.loop = false
        animateEmptySprite.visible = false

        const animateWinSprite = new PIXI.AnimatedSprite(chestWinTextureArray)
        animateWinSprite.animationSpeed = 1 / 12
        animateWinSprite.loop = false
        animateWinSprite.visible = false

        const animateBonusSprite = new PIXI.AnimatedSprite(chestBonusTextureArray)
        animateBonusSprite.animationSpeed = 1 / 12
        animateBonusSprite.loop = false
        animateBonusSprite.visible = false

        sceneElements[element.name] = chestSprite
        sceneElements[`${element.name}_empty`] = animateEmptySprite
        sceneElements[`${element.name}_win`] = animateWinSprite
        sceneElements[`${element.name}_bonus`] = animateBonusSprite

        // eslint-disable-next-line semi-style
        ;[chestSprite, animateEmptySprite, animateWinSprite, animateBonusSprite].forEach((sprite) => {
          sprite.x = element.x
          sprite.y = element.y

          if (element.hasOwnProperty('visible')) {
            sprite.visible = element.visible
          }
          if (element.hasOwnProperty('alpha')) {
            sprite.alpha = element.alpha
          }
          if (element.hasOwnProperty('anchor')) {
            sprite.anchor.set(element.anchor)
          }
          if (element.hasOwnProperty('scale')) {
            sprite.scale.set(element.scale)
          }

          container.addChild(sprite)
        })

        chestSprite.buttonMode = true
        chestSprite.on('pointerdown', () => { this.clickOnChest(element.name) }, this)
      }
      if (element.type === 'button' || element.type === 'sprite') {
        const sprite = new PIXI.Sprite(textures[element.sprite])
        sceneElements[element.name] = sprite

        sprite.x = element.x
        sprite.y = element.y

        if (element.hasOwnProperty('visible')) {
          sprite.visible = element.visible
        }
        if (element.hasOwnProperty('alpha')) {
          sprite.alpha = element.alpha
        }
        if (element.hasOwnProperty('anchor')) {
          sprite.anchor.set(element.anchor)
        }
        if (element.hasOwnProperty('scale')) {
          sprite.scale.set(element.scale)
        }

        container.addChild(sprite)

        if (element.type === 'button') {
          sprite.interactive = true
          sprite.buttonMode = true
          sprite.on('pointerdown', this.clickOnButton, this)
        }
      }
    })
    const text = new PIXI.Text('Main game scene', {
      fontFamily: 'Arial',
      fontSize: 32,
      fill: 0x000000,
    })
    text.x = 240
    text.y = 50
    container.addChild(text)

    const bonusText = new PIXI.Text('Bonus scene', {
      fontFamily: 'Arial',
      fontSize: 32,
      fill: 0x000000,
    })
    bonusText.x = 240
    bonusText.y = 50
    bonusContainer.addChild(bonusText)

    const bonusText2 = new PIXI.Text('Win amounts 1000$', {
      fontFamily: 'Arial',
      fontSize: 32,
      fill: 0x000000,
    })
    bonusText2.x = 200
    bonusText2.y = 500
    bonusContainer.addChild(bonusText2)

    const bonusAnimationTextureArray = []

    for (let i = 1; i < 31; i++) {
      const bonusAnimationTexture = PIXI.Texture.from(`f-${i}`)
      bonusAnimationTextureArray.push(bonusAnimationTexture)
    }

    const bonusAnimationSprite = new PIXI.AnimatedSprite(bonusAnimationTextureArray)
    bonusAnimationSprite.animationSpeed = 1 / 12
    bonusAnimationSprite.x = 225
    bonusAnimationSprite.y = 180
    bonusAnimationSprite.loop = false
    bonusContainer.addChild(bonusAnimationSprite)
    sceneElements.bonusAnimation = bonusAnimationSprite
    bonusAnimationSprite.onComplete = () => {
      bonusAnimationSprite.stop()
      this.chestDisabled = false
      this.checkIfNeedResetChests()
      bonusContainer.visible = false
      container.visible = true
    }
  }

  startGame() {
    this.chestDisabled = true
    this.buttonDisabled = false
    this.openChest = 0
    this.sceneElements.bonusContainer.visible = false
  }

  clickOnChest(chestName) {
    const {sceneElements} = this
    const {
      bonusAnimation, bonusContainer, container,
    } = sceneElements

    if (this.chestDisabled) return
    this.chestDisabled = true
    this.openChest += 1

    const chest = sceneElements[chestName]
    chest.visible = false
    let isChestWin = false
    let isChestBonus = false
    if (Math.random() > 0.5) {
      isChestWin = true
      if (Math.random() > 0.5) {
        isChestBonus = true
      }
    }

    const animation = (() => {
      if (isChestBonus) return sceneElements[`${chestName}_bonus`]
      if (isChestWin) return sceneElements[`${chestName}_win`]
      return sceneElements[`${chestName}_empty`]
    })()
    animation.visible = true
    animation.gotoAndPlay(0)
    animation.onComplete = () => {
      if (isChestBonus) {
        setTimeout(() => {
          bonusContainer.visible = true
          container.visible = false
          bonusAnimation.gotoAndPlay(0)
        }, 250)
      } else {
        this.chestDisabled = false
        this.checkIfNeedResetChests()
      }
    }
  }

  checkIfNeedResetChests() {
    if (this.openChest >= 6) {
      setTimeout(() => {
        this.resetChests()
        this.buttonDisabled = false
      }, 1000)
    }
  }

  resetChests() {
    const {sceneElements} = this
    const {
      play,
    } = sceneElements
    const textures = PIXI.utils.TextureCache

    for (let i = 1; i < 7; i++) {
      sceneElements[`chest_${i}`].visible = true
      sceneElements[`chest_${i}_empty`].visible = false
      sceneElements[`chest_${i}_win`].visible = false
      sceneElements[`chest_${i}_bonus`].visible = false
    }
    this.openChest = 0
    this.buttonDisabled = false
    this.chestDisabled = true
    play.texture = textures.play
    play.interactive = true
  }

  clickOnButton() {
    if (this.buttonDisabled) return
    const {sceneElements} = this
    const {
      play,
    } = sceneElements
    const textures = PIXI.utils.TextureCache

    this.buttonDisabled = true
    this.chestDisabled = false
    play.texture = textures.play_disable

    for (let i = 1; i < 7; i++) {
      sceneElements[`chest_${i}`].interactive = true
    }

    play.interactive = false
  }
}
