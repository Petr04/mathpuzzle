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
        <NavItem
          v-for="(item, i) in ndItems"
          :key="i"
          :item="item"
        />
      </v-navigation-drawer>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </div>
</body>
</html>
</template>
<script>
import NavItem from '@/components/NavItem';

export default {
  data: function () {
    return {
      title: this.$route.params.title,
      ndItems: [
        {title: 'Задания', icon: 'mdi-text-box-multiple', href: '/'},
        {title: 'Аккаунт', icon: 'mdi-account', href: "/account/"},
        // {title: 'Продолжить', icon: 'mdi-progress-clock', href: "#"},
        // {title: 'Статистика', icon: 'mdi-poll', href: "#"},
        // {title: 'Администрирование', icon: 'mdi-gavel', href: "#"},
      ],
    }
  },
  components: {
    NavItem,
  },
};

</script>
<style>
html { overflow-y: auto; }

.MathJax_Display[style] {
  display: inline !important;
  text-align: left !important;
}
</style>
