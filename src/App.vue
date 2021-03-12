<template>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title v-if="title">{{ title }} | MathPuzzle</title>
  <title v-else>MathPuzzle</title>
</head>
<body>
  <div id="app">
    <v-app>
      <v-navigation-drawer
        app
        permanent
        mini-variant
      >
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">

            <v-list-item
              :class="isAuthenticated ? 'px-2' : ''"
              link
              to="/account/"

              v-bind="attrs"
              v-on="on"
            >
              <v-list-item-avatar v-if="isAuthenticated">
                <avatar />
              </v-list-item-avatar>
              <v-list-item-icon v-else>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Аккаунт</v-list-item-title>
              </v-list-item-content>

            </v-list-item>

          </template>
          <span>Аккаунт</span>
        </v-tooltip>

        <v-divider></v-divider>

        <v-list>
          <NavItem
            v-for="(item, i) in ndItems"
            :key="i"
            :item="item"
          />
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <router-view style="max-width: 960px"/>
      </v-main>
    </v-app>
  </div>
</body>
</html>
</template>
<script>
import axios from '@/plugins/axios';
import { mapGetters } from 'vuex';
import NavItem from '@/components/NavItem';
import Avatar from '@/components/Avatar';

export default {
  metaInfo: {
    title: 'Задания',
    titleTemplate: '%s | SciPuzzle',
  },
  mounted() {
    if (this.$store.state.sessionToken) {
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + this.$store.state.sessionToken;
    }

    console.log(
      this.$store.state.sessionToken,
      this.$store.state.username,
    );
  },
  data() {
    return {
      title: this.$route.params.title,
      ndItems: [
        {title: 'Задания', icon: 'mdi-text-box-multiple', href: '/'},
        // {title: 'Продолжить', icon: 'mdi-progress-clock', href: "#"},
        // {title: 'Статистика', icon: 'mdi-poll', href: "#"},
        // {title: 'Администрирование', icon: 'mdi-gavel', href: "#"},
      ],
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
    ]),
  },
  components: {
    NavItem,
    Avatar,
  },
};

</script>
<style>
html { overflow-y: auto; }
</style>
