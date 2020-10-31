<template>
<v-container>

<template v-if="tasks">
  <v-card
    v-for="(task, i) in tasks"
    :key="i"
    :to="'/task/' + task.id"
    :class="'mb-' + margin"
    outlined
  >
    <v-card-title>{{ task.title }}</v-card-title>
    <v-card-subtitle>{{ task.length }} {{ decline('вопрос', 2, task.length) }}</v-card-subtitle>
    <v-card-text v-if="task.text" class="pre">{{ task.text }}</v-card-text>
  </v-card>
<SpeedDial
  title="Создать"
  :items="items"
/>
</template>
<template v-else>
  <v-card
    v-for="i in 3"
    :key="i"
    :class="'mb-' + margin"
    outlined
  >
    <v-skeleton-loader
      type="article"
    ></v-skeleton-loader>
  </v-card>
</template>
</v-container>
</template>
<script>
import axios from 'axios';
import settings from '@/settings';
import decline from '@/decline';
import SpeedDial from '@/components/SpeedDial';

export default {
  components: {
    SpeedDial,
  },
  data: () => ({
    margin: 3,
    tasks: null,
    items: [
      {title: 'Тестовое задание', icon: 'mdi-pencil', href: '/create/test'},
      {title: 'Лото', icon: 'mdi-cards', href: '/create/loto'},
    ],
  }),
  methods: {
    decline,
  },
  mounted() {
    axios
      .get(settings.apiUrl + '/tasks/')
      .then(response => this.tasks = response.data);
  },
};
</script>
<style>

.pre { white-space: pre; }

</style>
