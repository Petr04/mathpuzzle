<template>
<v-container>

<!-- outlined -->
<v-card elevation="0" class="mb-3">
  <v-card-title>
    <div class="horizontal-space-between">
      <div class="horizontal">
        <avatar v-if="isAuthenticated" size="64" class="mr-4"/>
        <div
          class="text-h4"
          color='grey darken-4'
          v-text="text"
        ></div>
      </div>
      <v-btn text @click="logout">
        Выйти
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </div>
  </v-card-title>
<!--   <v-divider class="mx-4"></v-divider>
  <v-card-text>
    <div>Задач решено: 256</div>
    <div>Тем пройдено: 16</div>
    <div><router-link to="/">Мои задачи</router-link></div>
  </v-card-text>
 --></v-card>

<!-- <v-card outlined>
  <v-card-text>
    Hello, world!
  </v-card-text>
</v-card>
 -->
</v-container>
</template>
<style scoped>

.horizontal, .horizontal-space-between {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.horizontal-space-between {
  width: 100%;
  justify-content: space-between;
}

</style>
<script>
import {mapState, mapGetters} from 'vuex';
import Avatar from '@/components/Avatar';

export default {
  components: { Avatar },
  mounted () {
    if (!this.$store.getters.isAuthenticated)
      this.$router.push('login/');
  },
  data() {
    return {
      text: !this.$store.getters.isAuthenticated
        || `${this.$store.state.firstName}`
          +` ${this.$store.state.lastName}`,
    };
  },
  metaInfo() {
    return {
      title: `${this.firstName} ${this.lastName} | Личный кабинет`,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('login/');
    },
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    ...mapState([
      'username', 'email',
      'firstName', 'lastName',
    ]),
  },
};

</script>
