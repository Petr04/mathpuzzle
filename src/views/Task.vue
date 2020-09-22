<template>
<v-container>

<template v-if="task">
  <h1 class="mb-6">{{ task.title }}</h1>

  <v-stepper v-model="currentQuestion" non-linear class="elevation-0">
    <v-stepper-header>
      <template
        v-for="(question, i) in task.questions"
      >
        <v-stepper-step
          :key="i"
          :step="i+1"
          editable
          :complete="statuses[i] == StatusEnum.correct"
          edit-icon="mdi-check"
          :color="statuses[i] == StatusEnum.correct ? 'success' : 'blue darken-2'"
          :rules="[() => statuses[i] != StatusEnum.wrong]"
          error-icon="mdi-close"
          @click="solvedQuestion = false"
        >
          {{ question.title }}
          <!-- TODO: If no title, digit isn't centered. Fix it -->
        </v-stepper-step>
        <v-divider
          :key="i + '-divider'"
          v-if="i < task.questions.length-1"
        ></v-divider>
      </template>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content
        v-for="(question, i) in task.questions"
        :key="i"
        :step="i+1"
      >
        <Question
          :question="question"
          @statusChange="val => onStatusChange(i, val)"
        />
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
import {StatusEnum} from '@/consts';
import Question from '@/components/Question';

export default {
  components: {
    Question,
  },
  data() {
    return {
      settings: settings,
      task: null,

      currentQuestion: 1,
      solvedQuestion: false,
      nextQuestionTimeout: 1000,

      StatusEnum,
      statuses: null,
    }
  },
  methods: {
    onStatusChange(i, val) {
      this.statuses[i] = val;

      if (val == StatusEnum.correct) {
        this.solvedQuestion = true;

        setTimeout(() => {
          if (this.solvedQuestion)
            this.currentQuestion++;
        }, this.nextQuestionTimeout);
      }
    },
  },
  mounted() {
    axios
      .get(settings.apiUrl + '/tasks/' + this.$route.params.id)
      .then(response => {
        this.task = response.data;
        this.statuses = Array(this.task.questions.length).fill(StatusEnum.default);
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
