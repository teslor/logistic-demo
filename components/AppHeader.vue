<template>
  <div class="header">
    <div class="header__line1">
      <div class="header__logo"></div>
      <transition name="el-zoom-in-top">
        <el-input
            v-show="$route.name === 'parcels'"
            class="header__search"
            v-model="searchString"
            placeholder="Поиск посылок"
            suffix-icon="el-icon-search">
        </el-input>
      </transition>
      <div class="header__avatar">
        <div class="header__add">
          <i class="el-icon-plus"></i>
        </div>
        <div class="header__photo" :style="avatarStyle"></div>
      </div>
    </div>
    <div class="header__line2">
      <transition name="el-zoom-in-top">
        <el-radio-group v-show="$route.name === 'parcels'" size="mini" v-model="searchField">
          <el-radio label="code" border>Трек #</el-radio>
          <el-radio label="sender" border>Отправитель</el-radio>
          <el-radio label="from" border>Откуда</el-radio>
          <el-radio label="to" border>Куда</el-radio>
        </el-radio-group>
      </transition>
    </div>
    <nav class="header__line3">
      <el-tabs class="header__nav"
          :value="$route.path"
          @tab-click="(tab) => { this.$router.push(tab.name) }">
        <el-tab-pane label="Главная" name="/"/>
        <el-tab-pane label="Посылки" name="/parcels"/>
      </el-tabs>
      <transition name="el-zoom-in-top">
        <el-checkbox
            v-show="$route.name === 'parcels'"
            v-model="selectAllChecked"
            class="header__checkbox"
            @change="(val) => {
              $store.commit('PARCEL_TOGGLE_SELECT_ALL', val)
            }">
          Выбрать все
        </el-checkbox>
      </transition>
    </nav>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import debounce from 'lodash/debounce'

  export default {
    name: 'app-header',

    data() {
      return {
        searchString: '',
        searchField: 'code',
        selectAllChecked: false
      };
    },

    computed: {
      ...mapState({
        avatarStyle: state => {
          return {
            background: `url(${state.user.avatar}) center`,
            backgroundSize: 'cover'
          }
        }
      })
    },

    watch: {
      '$route.name': function (newRoute) {
         if (newRoute === 'parcels') return
         this.searchString = ''
         this.searchField = 'code'
         this.selectAllChecked = false
      },
      searchString () {
        this.findParcels()
      }
    },

    methods: {
      findParcels: debounce(async function () {
        if (this.$route.name !== 'parcels') return;
        await this.$store.dispatch('findParcels', { field: this.searchField, text: this.searchString.toLowerCase() })
      }, 800)
    }
  }
</script>

<style lang="scss">
  @import '../assets/css/variables';

  .header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 188px;
    background-color: $theme-color-01;
    padding: 36px 86px 0 86px;
    position: relative;
    box-shadow: 0 0 10px 2px silver;
  }

  .header__line1, .header__line3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header__line2 {
    text-align: center;
  }

  .header__line2 .el-radio {
    border: 1px solid $theme-color-03 !important;
    color: $theme-color-03;
    background-color: $theme-color-02;
  }

  .header__line2 .el-radio.is-checked {
    background-color: $theme-color-03;
  }

  .header__line3 {
    padding: 0 20px;
  }

  .header__logo {
    width: 200px;
    height: 45px;
    background: url('/static/logo.png') left no-repeat;
    background-size: contain;
  }

  .header__search {
    width: 45%;
    height: 60px;
  }

  .header__search .el-input__inner {
    border: none;
    height: 60px;
    background-color: $theme-color-02;
    color: $theme-color-03;
    padding-left: 20px;
    font-size: 16px;
  }

  .header__search .el-input__inner::placeholder {
    color: $theme-color-03;
  }

  .header__search .el-input__icon {
    color: $theme-color-03;
    width: 45px;
    font-size: 16px;
    font-weight: bold;
  }

  .header__avatar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 200px
  }

  .header__add {
    border: 2px dashed $theme-color-03;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    text-align: center;
    line-height: 35px;
    color: $theme-color-03;
    font-weight: bold;
    font-size: 16px;
    margin-right: 30px;
  }

  .header__photo {
    border: 2px solid $theme-color-03;
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }

  .header__nav .el-tabs__header {
    margin-bottom: 1px;
  }

  .header__nav .el-tabs__active-bar {
    background-color: $theme-color-03;
    height: 4px;
  }

  .header__nav .el-tabs__nav-wrap::after {
    opacity: 0;
  }

  .header__nav .el-tabs__item {
    font-size: 24px;
    font-weight: normal;
    height: 50px;
    color: $theme-color-03;
    opacity: 0.6;
    transition: opacity 1s;
    outline: none;
  }

  .header__nav .el-tabs__item:hover {
    opacity: 1;
  }

  .header__nav .el-tabs__item.is-active {
    opacity: 1;
  }

  .header__checkbox {
    display: flex;
    color: $theme-color-03;
    align-items: flex-end;
  }

  .header__checkbox .el-checkbox__label {
    font-size: 18px;
  }

  .header__checkbox .el-checkbox__input.is-checked+.el-checkbox__label {
    color: $theme-color-03;
  }
</style>
