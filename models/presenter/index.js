const _ = require('lodash')
const update = require('immutability-helper')
const p2pPresenter = require('./p2p-presenter')

module.exports = ({ hubUrl }) => {
  const presenter = p2pPresenter({
    hubUrl
  })

  return {
    namespace: 'presenter',

    state: {
      groupId: null,
      clients: {} // clients [{ id, code, username }] mapped to their id
    },

    reducers: {
      addClient: (state, { id }) => {
        const client = {
          id,
          username: 'unknown',
          code: null
        }

        return update(state, {
          clients: {
            [id]: { $set: client }
          }
        })
      },

      removeClient: (state, { id }) =>
        update(state, {
          clients: { $set: _.omit(state.clients, [id]) }
        }),

      setUsername: (state, { id, username }) =>
        update(state, {
          clients: {
            [id]: {
              username: { $set: username }
            }
          }
        }),

      commitCode: (state, { id, code }) =>
        update(state, {
          clients: {
            [id]: {
              code: { $set: code }
            }
          }
        }),

      _setGroupId: (state, { groupId }) => {
        console.log('set GroupId', groupId, update(state, {
          groupId: { $set: groupId },
          clients: { $set: {} }
        }))
        return update(state, {
          groupId: { $set: groupId },
          clients: { $set: {} }
        })
      }
    },

    effects: {
      disconnect: (state, data, send) => {
        presenter.stop()
        send('presenter:_setGroupId', { groupId: null }, _.noop)
      },

      joinGroup: (state, { groupId }, send) => {
        presenter.joinStar({ gid: groupId })
        send('presenter:_setGroupId', { groupId }, _.noop)
      },

      handleMessage: ({ clients }, { id, message }, send) => {
        if (!clients[id]) {
          return
        }

        switch (message.type) {
          case 'SET_USERNAME':
            const username = message.data.username
            send('presenter:setUsername', { id, username })
            return

          case 'COMMIT_CODE':
            const code = message.data.code
            send('presenter:commitCode', { id, code })
            return

          default:
            return
        }
      }
    },

    subscriptions: {
      p2pConnection: (send) => {
        presenter.onAddClient(({ id }) => send('presenter:addClient', { id }, _.noop))
        presenter.onRemoveClient(({ id }) => send('presenter:removeClient', { id }, _.noop))
        presenter.onMessage((id, { type, data }) =>
          send('presenter:handleMessage', { id, message: { type, data } }, _.noop))
      }
    }
  }
}