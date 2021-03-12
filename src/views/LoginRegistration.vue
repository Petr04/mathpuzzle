<template>
<v-container fill-height class="center">

<v-card width="600" outlined>
<v-tabs centered v-model="currentTab">
  <v-tabs-slider></v-tabs-slider>

  <v-tab ref="0">Вход</v-tab>
  <v-tab ref="1">Регистрация</v-tab>

  <!-- Вход -->
  <v-tab-item>
    <login :padding="padding"/>
  </v-tab-item>

  <!-- Регистрация -->
  <v-tab-item>
    <registration :padding="padding"/>
  </v-tab-item>
</v-tabs>
</v-card>

</v-container>
</template>
<style>

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-item-group {
  overflow: visible;
}

</style>
<script>
import Login from '@/components/Login';
import Registration from '@/components/Registration';

export default {
  components: {Login, Registration},
  data() {
    const action = this.$route.params.action;
    const actions = ['login', 'registration'];
    this.actions = actions;
    let currentTab = actions.indexOf(action);
    if (currentTab == -1) {
      currentTab = 0;
      this.replaceUrl(currentTab);
    }

    return {
      padding: 5,

      currentTab: currentTab,
    };
  },
  metaInfo() {
    return {
      title: this.currentTab == 0 ? 'Вход' : 'Регистрация',
    };
  },
  methods: {
    replaceUrl(val) {
      this.$router.replace(`/account/${this.actions[val]}/`);
    },
  },
  watch: {
    currentTab(val) {
      this.replaceUrl(val);
    }
  },
}
</script>
