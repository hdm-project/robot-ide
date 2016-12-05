const game = require('../utils/game')
const initialState = require('./initial-state')
const { movable } = require('./components/movable')
const { spawner } = require('./components/spawner')
const { collectable } = require('./components/collectable')

module.exports = game.engine({
  state: initialState,
  components: {
    movable,
    spawner,
    collectable
  }
})
