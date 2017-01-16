const html = require('choo/html')
const sf = require('sheetify')
const gameView = require('../../elements/game/index')
const blocklyWidget = require('../../elements/blockly')
const { speedSliderView, playButtonView } = require('../../elements/runtime-controls')
const initialState = require('./initial-state')

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
      flex-shrink: 0;
    }
    
    :host > .divider:hover {
      background: #848484;
    }

    :host > .column {
      height: 100%;
      width: 50%;
    }
`

const controlsPrefix = sf`
    :host {
      display: flex;
      flex-direction: row;
    }
    
    :host > * {
      margin-left: 20px;
    }
    
    :host > :first-child {
      margin-left: 0;
    }
`

const blocklyView = blocklyWidget()

const editorView = ({ clock, editor, game }, prev, send) => {
  const playButtonHtml = playButtonView({
    isRunning: clock.isRunning,
    onStart: () => send('clock:start'),
    onStop: () => send('clock:stop')
  })

  const speedSliderHtml = speedSliderView({
    min: 100,
    max: 1000,
    intervalDuration: clock.intervalDuration,
    onChange: (value) => send('clock:setIntervalDuration', { intervalDuration: value })
  })

  const blocklyHtml = blocklyView({
    toolbox: initialState.editor.toolbox,
    workspace: editor.workspace,
    onChange: ({ code, workspace }) => {
      send('runtime:commitCode', { code })
      send('editor:update', { code, workspace })
    }
  })

  const gameHtml = gameView({
    state: game,
    progress: clock.progress
  })

  return html`
    <main class="${mainPrefix}" onload=${initEditor}>
      <div class="header-bar">
        <div class="${controlsPrefix}">
          ${playButtonHtml}
          ${speedSliderHtml}
        </div>
      </div>
      <div class=${`${contentPrefix} content`}>
        <div class="column">
          ${blocklyHtml}
        </div>
        <div class="divider"></div>
        <div class="column">
          ${gameHtml}
        </div>
      </div>
    </main>
  `

  function initEditor () {
    send('game:loadGameState', { loadState: initialState.game })
  }
}

module.exports = editorView