const tutorials = []

addTutorialRow('Blockly', [
  require('./A-blockly01'),
  require('./A-blockly02')
])

addTutorialRow('Rotate', [
  require('./B-rotate-01'),
  require('./B-rotate-02')
])

addTutorialRow('Loops', [
  require('./C-Loop01'),
  require('./C-Loop02'),
  require('./C-Loop03'),
  require('./C-Loop04')
])

addTutorialRow('If-Conditions', [
])

addTutorialRow('Scout', [
  require('./D-scout-01')
])

addTutorialRow('Resources', [
  require('./E-resource-01')
])

module.exports = tutorials

function addTutorialRow (categoryName, levels) {
  let row = {
    categoryName: categoryName,
    levels: levels
  }
  tutorials.push(row)
}
