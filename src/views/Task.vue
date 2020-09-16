<template>
<v-container>

<h1>{{ task.title }}</h1>
<!-- TODO: non-linear stepper with question as step -->

</v-container>
</template>
<script>
import axios from 'axios';
import settings from '@/settings';

export default {
  data: () => ({
    task: null,
  }),
  mounted() {
    axios
      .get(settings.apiUrl + '/tasks/' + this.$route.params.id)
      .then(response => this.task = response.data);
  },
}

</script>
