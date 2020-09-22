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
    <v-card-subtitle>{{ task.length }} {{ declension('вопрос', task.length) }}</v-card-subtitle>
    <v-card-text v-if="task.text" class="pre">{{ task.text }}</v-card-text>
  </v-card>
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

export default {
  data: () => ({
    margin: 3,

    tasks: null,
  }),
  methods: {
    declension(noun, n) { // Только для 2 склонения
      let add = 'ов';
      const lastDigit = n % 10;

      if (lastDigit == 1) add = '';
      else if (2 <= lastDigit && lastDigit <= 4)
        add = 'а';

      return noun + add;
    }
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
