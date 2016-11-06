const html = require('choo/html')
const sf = require('sheetify')
const gameView = require('./game')
const blocklyView = require('./blockly')
const runtimeControlsView = require('./runtime-controls')

const mainPrefix = sf`
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    :host .header-bar {
      height: 50px;
      display: flex;
      padding: 20px;
      align-items: center;
      background: #404040;
    }

    :host .content {
      height: 100%;        
    }
`

const contentPrefix = sf`
    :host {
      display: flex;
      flex-direction: row;
    }

    :host > .divider {
      background: #404040;
      width: 10px;
      height: 100%;
      cursor: ew-resize;
    }
    
    :host > .divider:hover {
      background: #848484;
    }

    :host > .column {
      height: 100%;
      width: 50%;
    }
`

const mainView = (state, prev, send) => html`
  <main class=${mainPrefix}>
    <div class="header-bar">
      ${runtimeControlsView(state, prev, send)}
    </div>
    <div class=${`${contentPrefix} content`}>
      <div class="column">
        ${blocklyView(state, prev, send)}
      </div>
      <div class="divider"></div>
      <div class="column">
        ${gameView(state.game, prev, send)}
      </div>
    </div>
  </main>
`

module.exports = mainView
