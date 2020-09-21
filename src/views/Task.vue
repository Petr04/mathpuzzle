<template>
<v-container>

<template v-if="task">
  <h1 class="mb-6">{{ task.title }}</h1>

  <v-stepper v-model="currentQuestion" non-linear class="elevation-0">
    <v-stepper-header>
      <template
        v-for="(question, i) in task.questions"
      >
        <v-stepper-step :key="i" :step="i+1" editable>
          {{ question.title }}
          <!-- TODO: If no title, digit isn't centered. Fix it -->
          <!-- TODO: Add wrong/correct mark to stepper header -->
        </v-stepper-step>
        <v-divider :key="i + '-divider'" v-if="i < task.questions.length-1">
        </v-divider>
      </template>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content
        v-for="(question, i) in task.questions"
        :key="i"
        :step="i+1"
      >
        <Question :question="question" />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>

</template>
<v-skeleton-loader
  v-else
  type="article"
></v-skeleton-loader>

</v-container>
</template>
<script>
import axios from 'axios';
import settings from '@/settings';
import Question from '@/components/Question';

export default {
  components: {
    Question,
  },
  data: () => ({
    settings: settings,
    task: null,
    currentQuestion: 1,
  }),
  mounted() {
    axios
      .get(settings.apiUrl + '/tasks/' + this.$route.params.id)
      .then(response => {
        this.task = response.data;
        this.states = Array(this.task.questions.length).fill('default')
      });
  },
};
</script>
<style>
.v-stepper__header {
  box-shadow: none;
}
.transition {
  transition: .2s;
}
</style>
