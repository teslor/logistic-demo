<template>
  <div class="parcel">
    <h1 class="title__main">{{ parcel.code ? 'Посылка #' + parcel.code : 'Посылка не найдена!' }}</h1>
    <div v-if="parcel.code" class="parcel__info">
      <div class="parcel__row">
        <div class="parcel__field">Статус</div><div class="parcel__value">{{ parcelText.status[parcel.status] }}</div>
      </div>
      <div class="parcel__row">
        <div class="parcel__field">Важность</div><div class="parcel__value">{{ parcelText.important[parcel.important] }}</div>
      </div>
      <div class="parcel__row">
        <div class="parcel__field">Отправитель</div><div class="parcel__value">{{ parcel.sender }}</div>
      </div>
      <div class="parcel__row">
        <div class="parcel__field">Откуда</div><div class="parcel__value">{{ parcel.from }}</div>
      </div>
      <div class="parcel__row">
        <div class="parcel__field">Куда</div><div class="parcel__value">{{ parcel.to }}</div>
      </div>
      <div class="parcel__row">
        <div class="parcel__field">Местоположение</div><div class="parcel__value">{{ parcel.location }}</div>
      </div>
      <div class="parcel__row"
           v-for="(item, index) in locationHistoryReversed"
           :key="index">
        <div class="parcel__value parcel__value_grayed">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    async fetch ({ store, params }) {
      await store.dispatch('getParcel', params.id)
    },

    computed: {
      locationHistoryReversed: function () {
        return this.parcel.locationHistory.slice().reverse()
      },
      ...mapState({
        parcel: state => state.parcel,
        parcelText: state => state.text.parcel
      })
    },
  }
</script>

<style lang="scss">
  @import '../../assets/css/variables';

  .parcel {
    flex: 1;
  }

  .parcel__info {
    width: 65%;
    margin: 0 auto;
  }

  .parcel__row {
    display: flex;
    justify-content: flex-end;
  }

  .parcel__row + .parcel__row {
    margin-top: 10px;
  }

  .parcel__field {
    background-color: $theme-color-02;
    opacity: 0.8;
    color: $theme-color-04;
    font-size: 28px;
    text-align: right;
    height: 50px;
    line-height: 50px;
    width: 40%;
    padding-right: 20px;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
  }

  .parcel__value {
    background-color: $theme-color-04;
    color: $text-color-01;
    font-size: 28px;
    height: 50px;
    line-height: 50px;
    width: 60%;
    padding-left: 20px;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
  }

  .parcel__value_grayed {
    color: $text-color-03
  }
</style>
