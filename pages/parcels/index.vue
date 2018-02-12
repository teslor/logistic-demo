<template>
  <div class="parcels" v-loading="loading">
    <div class="parcels__list">
      <div class="parcels__header">
        <div class="parcels__col1">Трек код</div>
        <div class="parcels__col2">Направление</div>
        <div class="parcels__col3">Местоположение</div>
        <div class="parcels__col4">Статус</div>
        <div class="parcels__col5">Важность</div>
        <div class="parcels__col6">Отправитель</div>
      </div>
      <div class="parcels__data"
           :class="{ parcels__data_selected: parcel.selected }"
           v-for="parcel in parcels"
           :key="parcel.key"
           @click="handleParcelClick(parcel.key)">
        <div class="parcels__col1">{{ parcel.code }}</div>
        <div class="parcels__col2">{{ parcel.from }}&nbsp;&nbsp;<i class="parcels__icon el-icon-arrow-right"/>{{ parcel.to }}</div>
        <div class="parcels__col3"><i class="parcels__icon el-icon-location"/>{{ parcel.location }}</div>
        <div class="parcels__col4" :class="{ parcels__handed: parcel.status === 'handed'}">
          <i v-if="parcel.status === 'handed'" class="parcels__icon el-icon-success"/>{{ parcelText.status[parcel.status] }}
        </div>
        <div class="parcels__col5" :class="{ parcels__high: parcel.important === 'high'}">
          <i v-if="parcel.important === 'high'" class="parcels__icon el-icon-warning"/>{{ parcelText.important[parcel.important]  }}
        </div>
        <div class="parcels__col6">{{ parcel.sender }}</div>
        <div class="parcels__col7" @click.stop="handleSelectClick(parcel.key)">
          <div class="parcels__radio" :class="{ parcels__radio_selected: parcel.selected}"></div>
        </div>
      </div>
    </div>
    <div v-show="parcels.length === 0" style="text-align: center">Ничего не найдено!</div>
    <transition name="el-zoom-in-bottom">
      <div class="parcels__panel" v-show="selectedParcels.length > 0">
        <div class="parcels__panel-info">Выбрано: {{ selectedParcels.length }}</div>
        <div class="parcels__col3">
          <el-input v-model="locationValue" placeholder="Местоположение"></el-input>
        </div>
        <div class="parcels__col4">
          <el-select v-model="statusValue" placeholder="Выберите статус">
            <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="parcels__col5">
          <el-select v-model="importantValue" placeholder="Выберите важность">
            <el-option
                v-for="item in importantOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" :disabled="!locationValue && !statusValue && !importantValue" @click="updateSelectedParcels">
          Сохранить изменения
        </el-button>
      </div>
    </transition>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    async fetch ({ store }) {
      await store.dispatch('getParcels')
    },

    data () {
      return {
        locationValue: '',
        statusValue: '',
        importantValue: '',
      }
    },

    computed: {
      statusOptions: function () {
        return Object.keys(this.parcelText.status).map(key => {
          return { value: key, label: this.parcelText.status[key] }
        })
      },
      importantOptions: function () {
        return Object.keys(this.parcelText.important).map(key => {
          return { value: key, label: this.parcelText.important[key] }
        })
      },
      ...mapState({
        loading: state => state.parcels.loading,
        parcels: state => state.parcels.data,
        parcelText: state => state.text.parcel
      }),
      ...mapGetters([
        'selectedParcels'
      ])
    },

    watch: {
      selectedParcels (selectedParcelsNew) {
        if (!selectedParcelsNew.length) {
          this.locationValue = ''
          this.statusValue = ''
          this.importantValue = ''
        }
      }
    },

    methods: {
      handleParcelClick(parcelKey) {
        this.$router.push(`/parcels/${parcelKey}`)
      },
      handleSelectClick(parcelKey) {
        this.$store.commit('PARCEL_TOGGLE_SELECT', parcelKey)
      },
      async updateSelectedParcels() {
        const options = {}
        if (this.locationValue) options.location = this.locationValue
        if (this.statusValue) options.status = this.statusValue
        if (this.importantValue) options.important = this.importantValue
        await this.$store.dispatch('updateSelectedParcels', options)
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/css/variables';

  .parcels {
    flex: 1;
    padding: 0 40px;
    font-size: 22px;
    position: relative;
  }

  .parcels__panel {
    position: absolute;
    background-color: $theme-color-04;
    height: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 0 20px -2px $text-color-03;
    padding: 20px 40px;
    display: flex;
    align-items: center;
  }

  .parcels__header {
    display: flex;
    width: 100%;
    height: 80px;
    color: $text-color-02;
    border-bottom: 1px solid $text-color-03;
    margin-bottom: 20px;
  }

  .parcels__col1, .parcels__col2, .parcels__col3, .parcels__col4, .parcels__col5, .parcels__col6, .parcels__col7 {
    display: flex;
    align-items: center;
    padding-left: 25px;
    overflow: hidden;
  }
  .parcels__col1, .parcels__col3, .parcels__col4, .parcels__col5, .parcels__col6 {
    width: 15%;
  }
  .parcels__col2 {
    width: 20%;
  }
  .parcels__col7 {
    width: 5%;
  }

  .parcels__data {
    cursor: pointer;
    height: 80px;
    background-color: $theme-color-04;
    display: flex;
    border-radius: 6px;
  }

  .parcels__data_selected {
    background-color: #fdfff2;
  }

  .parcels__data + .parcels__data {
    margin-top: 10px;
  }

  .parcels__icon {
    margin-right: 6px;
    font-size: 15px;
    font-weight: bold;
  }

  .parcels__handed {
    color: $theme-color-01;
  }

  .parcels__high {
    color: #f56c6c;
  }

  .parcels__radio {
    border: 3px solid $text-color-02;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    transition: background-color 0.5s;
  }

  .parcels__radio_selected {
    background-color: $theme-color-02;
  }

  .parcels__panel-info {
    width: 35%;
  }
</style>
