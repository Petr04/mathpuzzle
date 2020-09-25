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
          :complete="finalStatuses.includes(statuses[i])"
          edit-icon="mdi-check"
          :color="statuses[i] == StatusEnum.correct ? 'success' : 'blue darken-2'"
          :rules="[() => statuses[i] != StatusEnum.wrong]"
          error-icon="mdi-close"
          @click="questionSwitched = true"
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
          ref="question"
          :key="i"

          :question="question"
          :checkOnSubmit="task.checkOnSubmit"
          @statusChange="val => onStatusChange(i, val)"
        />
      </v-stepper-content>
      <v-stepper-content :step="task.questions.length+1">
        <template v-if="task.checkOnSubmit">
          <h2>Завершить</h2>
          <p>Вы ответили на все вопросы</p>
          <v-btn
            @click="submitAll"
            depressed
            color="blue darken-2"
            dark
          >Проверить</v-btn>
        </template>
        <template v-else>
          <h2>Готово!</h2>
          <p>Вы выполнили задание</p>
        </template>
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
import {StatusEnum, finalStatuses} from '@/consts';
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
      questionSwitched: true,
      nextQuestionTimeout: 1000,
      autoPageSwitch: true,

      StatusEnum,
      finalStatuses,
      statuses: null,
    }
  },
  methods: {
    onStatusChange(i, val) {
      this.statuses[i] = val;

      if (finalStatuses.includes(val) && this.autoPageSwitch) {
        this.questionSwitched = false;

        setTimeout(() => {
          if (!this.questionSwitched) {

            const unsolvedNext = this.nextUnsolvedQuestion(this.currentQuestion);
            let nextQuestion;

            if (unsolvedNext == this.task.questions.length) {
              nextQuestion = this.nextUnsolvedQuestion(0);
            }
            else {
              nextQuestion = unsolvedNext;
            }

            this.currentQuestion = nextQuestion+1;

          }

        }, this.nextQuestionTimeout);
      }
    },
    nextUnsolvedQuestion(questionNumber) {
      let i;

      for (i = questionNumber; i < this.statuses.length; i++) {
        if (!finalStatuses.includes(this.statuses[i]))
          return i;
      }

      return i;
    },
    submitAll() {
      for (let question of this.$refs.question)
        question.submit();

      this.autoPageSwitch = false;
      this.currentQuestion = 1;
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
