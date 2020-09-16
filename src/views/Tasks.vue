<template>
<v-container>

<v-card
  v-for="(task, i) in tasks"
  :key="i"
  :href="'/task/' + task.id"
  outlined
>
  <v-card-title>{{ task.title }}</v-card-title>
  <v-card-text>{{ task.text }}</v-card-text>
</v-card>

</v-container>
</template>
<script>
import axios from 'axios';
import settings from '@/settings';

export default {
  data: () => ({
    tasks: null,
  }),
  mounted() {
    axios
      .get(settings.apiUrl + '/tasks/')
      .then(response => this.tasks = response.data);
  },
}

</script>
