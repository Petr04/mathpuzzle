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

</style>
<script>
import Login from '@/components/Login';
import Registration from '@/components/Registration';

export default {
  components: {Login, Registration},
  data: function () {
    const action = this.$route.params.action;
    const actions = ['login', 'registration'];
    const currentTab = actions.indexOf(action);
    if (currentTab == -1) currentTab == 0;

    return {
      padding: 5,

      actions: actions,
      currentTab: currentTab,
    };
  },
  watch: {
    currentTab: function (val) {
      this.$router.replace(`/account/${this.actions[val]}/`);
    }
  },
}
</script>
