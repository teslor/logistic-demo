import Vuex from 'vuex'
import axios from 'axios'

const createStore = () => {
  const apiUrl = 'http://localhost:3001'

  return new Vuex.Store({
    state: {
      // Static data (TODO: remove from here)
      text: {
        parcel: {
          status: {
            packaged: 'Упаковано',
            sent: 'Отправлено',
            handed: 'Вручено',
          },
          important: {
            low: 'Обычная доставка',
            high: 'Срочная доставка',
          }
        }
      },

      user: {},
      parcel: {},
      parcels: {
        loading: false,
        data: [],
        meta: {}
      },
    },

    getters: {
      selectedParcels: state => {
        return state.parcels.data.filter(parcel => parcel.selected)
      }
    },

    mutations: {
      USER_SET (state, user) {
        state.user = user.data
      },
      PARCEL_SET (state, parcel) {
        state.parcel = parcel
      },
      PARCELS_SET (state, parcels) {
        state.parcels.meta = parcels.meta
        state.parcels.data = parcels.data.map(parcel => { return { ...parcel, selected: false }})
      },
      PARCELS_SET_LOADING (state, loading) {
        state.parcels.loading = loading
      },
      PARCEL_TOGGLE_SELECT (state, parcelKey) {
        const i = state.parcels.data.findIndex(parcel => parcel.key === parcelKey)
        if (i !== -1) state.parcels.data[i].selected = !state.parcels.data[i].selected;
      },
      PARCEL_TOGGLE_SELECT_ALL (state, select = true) {
        state.parcels.data.forEach(parcel => {
          parcel.selected = select
        })
      }
    },

    actions: {
      async nuxtServerInit ({ commit }) {
        try {
          const response = await axios.get(`${apiUrl}/user`)
          commit('USER_SET', response.data)
        }
        catch(e) {}
      },
      async getParcel ({ commit }, parcelId) {
        try {
          // TODO: back-end should return parcel by id
          const response = await axios.get(`${apiUrl}/parcels`)
          let parcel = null
          if (parcelId) {
            parcel = response.data.data.find(parcel => String(parcel.key) === parcelId)
          }
          commit('PARCEL_SET', parcel ? parcel : {})
        }
        catch(e) {
          // Error notification
        }
        return true
      },
      async getParcels ({ commit }) {
        try {
          commit('PARCELS_SET_LOADING', true)
          const response = await axios.get(`${apiUrl}/parcels`)
          commit('PARCELS_SET', response.data)
          commit('PARCELS_SET_LOADING', false)
        }
        catch(e) {
          // Error notification
        }
        return true
      },
      async findParcels ({ commit }, { field, text }) {
        try {
          commit('PARCELS_SET_LOADING', true)
          // TODO: back-end should return filtered data
          // Imitate filtering
          const response = await axios.get(`${apiUrl}/parcels`)
          if (field && text) {
            response.data.data = response.data.data.filter(parcel => { return parcel[field].toLowerCase().indexOf(text) !== -1 })
          }
          commit('PARCELS_SET', response.data)
          commit('PARCELS_SET_LOADING', false)
        }
        catch(e) {
          // Error notification
        }
        return true
      },
      async updateSelectedParcels ({ commit, getters }, options) {
        try {
          commit('PARCELS_SET_LOADING', true)
          // TODO: POST request should be here
          const response = await axios.get(`${apiUrl}/parcels`)
          // Imitate updated data
          const selectedKeys = getters.selectedParcels.map(parcel => parcel.key)
          response.data.data.forEach(parcel => {
            if (!selectedKeys.includes(parcel.key)) return
            Object.keys(options).forEach(optionKey => {
              parcel[optionKey] = options[optionKey]
            })
          })
          commit('PARCELS_SET', response.data)
          commit('PARCELS_SET_LOADING', false)
        }
        catch(e) {
          // Error notification
        }
        return true
      },
    }
  })
}

export default createStore
