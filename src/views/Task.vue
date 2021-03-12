<template>
<v-container>
<template v-if="task">
  <h1 class="mb-6">{{ task.title }}</h1>

  <v-stepper
    v-model="currentQuestion"
    non-linear
    class="elevation-0 ma-0 rounded-0"
  >
    <v-stepper-header>
      <v-slide-group
        show-arrows
        center-active
        :value="currentQuestion-1"
      >
        <v-slide-item
          v-for="(question, i) in task.questions"
          :key="i"
          v-slot="{ active, toggle }"
        >
          <v-stepper-step
            :step="i+1"
            editable
            :complete="statuses[i] == StatusEnum.correct"
            edit-icon="mdi-check"
            :color="statuses[i] == StatusEnum.correct ? 'success' : 'blue darken-2'"
            :rules="[() => statuses[i] != StatusEnum.wrong]"
            error-icon="mdi-close"
            @click="toggle(); questionSwitched = true"
          >
            {{ question.title }}
            <!-- TODO: If no title, digit isn't centered. Fix it -->
          </v-stepper-step>
        </v-slide-item>
      </v-slide-group>
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
          :check_on_submit="task.check_on_submit"
          @statusChange="val => onStatusChange(i, val)"
        />
      </v-stepper-content>
      <v-stepper-content :step="task.questions.length+1">
        <template v-if="task.check_on_submit">
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
import {StatusEnum} from '@/consts';
import Question from '@/components/Question';

export default {
  components: {
    Question,
  },
  data() {
    return {
      task: null,

      currentQuestion: 1,
      questionSwitched: true,
      nextQuestionTimeout: 1000,
      autoPageSwitch: true,

      StatusEnum,
      statuses: null,
      questionRefs: null,
    }
  },
  metaInfo() {
    return {
      title: this.task ? this.task.title : 'Задание',
    };
  },
  methods: {
    onStatusChange(i, val) {
      this.statuses[i] = val;

      if (this.$refs.question[i].final && this.autoPageSwitch) {
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
        if (!this.$refs.question[i].final)
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
    this.$axios
      .get('/tasks/' + this.$route.params.id)
      .then(response => {
        this.task = response.data;
        this.statuses = Array(this.task.questions.length).fill(StatusEnum.default);
      });
    this.questionRefs = this.$refs.question;
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
