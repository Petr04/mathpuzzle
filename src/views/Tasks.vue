<template>
<v-container>

<template v-if="tasks">
  <v-card
    v-for="(task, i) in tasks"
    :key="i"
    :href="'/task/' + task.id"
    :class="'mb-' + margin"
    outlined
  >
    <v-card-title>{{ task.title }}</v-card-title>
    <v-card-text class="pre">{{ task.text }}</v-card-text>
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
