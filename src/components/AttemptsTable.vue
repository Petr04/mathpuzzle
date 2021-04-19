<template>

<v-data-table
  v-if="items"
  :headers="headers"
  :items="items"
>
  <template
    v-for="i in templateNames"
    v-slot:[i.templateName]="{ item }"
  >
    <div :key="i.index">
    <v-icon
      v-if="item[i.index] == true"
      class="green--text"
    >mdi-check</v-icon>
    <v-icon
      v-else-if="item[i.index] == false"
      class="red--text"
    >mdi-close</v-icon>
    </div>
  </template>

</v-data-table>

</template>
<script>
import axios from '@/plugins/axios';

export default {
  props: ['task'],
  data() {
    return {
      items: null,
      headers: [{
        text: 'Имя',
        value: 'name',
      }].concat(this.task.questions.map((question, i) => ({
        text: i+1,
        value: i,
      }))),
    };
  },
  methods: {
    async getTaskAttempts() {
      const response = await axios.get('/tasks/attempts/', {params: {
        task: this.task.id,
        last: true,
      }});

      const byUser = {};
      for (let attempt of response.data) {
        const name = attempt.user.first_name + ' ' + attempt.user.last_name;
        if (!byUser[name])
          byUser[name] = {};

        byUser[name][attempt.question_number] = attempt.value;
      }

      const ret = [];
      for (const name in byUser) {
        ret.push( Object.assign({name: name}, byUser[name]) );
      }

      return ret;
    },
  },
  computed: {
    templateNames: function () {
      const ret = [];
      for (let i = 0; i < this.task.questions.length; i++) {
        ret.push({
          templateName: 'item.' + i,
          index: i,
        });
      }
      return ret;
    },
  },
  mounted() {
    this.getTaskAttempts().then(ret => this.items = ret);
  },
};

</script>
