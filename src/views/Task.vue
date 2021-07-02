<template>
<v-container>
<template v-if="task">
  <h1>{{ task.title }}</h1>
  <div class="flex-start pb-3">
    <span
      class="subtitle-1 grey--text text--darken-1"
      v-text="authorStr()"
    >
    </span>
    <v-dialog
      v-model="showAttempts"
      eager
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="imAuthor"
          small class="ml-3"
          v-bind="attrs"
          v-on="on"
        >Показать решения</v-btn>
      </template>

      <v-card>
        <v-toolbar flat>
          <v-btn
            icon
            @click="showAttempts=false"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                @click="updateAttempts"

                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-update</v-icon>
              </v-btn>
            </template>
            <span>Обновить попытки</span>
          </v-tooltip>

          <v-text-field
            v-model="attemptsSearch"
            class="mx-4 rounded-lg"
            style="max-width: 400px;"
            hide-details single-line solo
            :flat="!searchFocused"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
            :background-color="searchFocused
              ? '' : 'grey lighten-3'"
            label="Поиск"
            prepend-inner-icon="mdi-magnify"
            :clearable="true"
            clear-icon="mdi-close"
          ></v-text-field>

        </v-toolbar>
        <attempts-table
          ref="attemptsTable"
          :task="task"
          :search="attemptsSearch"
        />
      </v-card>
    </v-dialog>
  </div>

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
        <div class="mx-3">
          <h2 v-if="question.title" class="mb-3">{{ question.title }}</h2>
          <div v-html="question.text"></div>
          <text-question
            v-if="['textQuestion', 'choiceQuestion'].includes(question.type)"
            ref="question"
            :key="i"
            class="pa-0"

            :question="question"
            :check_on_submit="task.check_on_submit"
            @statusChange="val => onStatusChange(i, val)"
          />
          <order-question
            v-if="question.type == 'orderQuestion'"
            ref="question"
            :key="i"
            class="pa-0"

            :question="question"
            :check_on_submit="task.check_on_submit"
            @statusChange="val => onStatusChange(i, val)"
          />
        </div>
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
import authorStrFunc from '@/lib/authorStr';
import TextQuestion from '@/components/TextQuestion';
import OrderQuestion from '@/components/OrderQuestion';
import AttemptsTable from '@/components/AttemptsTable';

export default {
  components: {
    TextQuestion,
    OrderQuestion,
    AttemptsTable,
  },
  data() {
    return {
      task: null,

      currentQuestion: 1,
      questionSwitched: true,
      nextQuestionTimeout: 1000,
      autoPageSwitch: true,
      showAttempts: false,
      attemptsSearch: '',
      searchFocused: false,

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
    updateAttempts() {
      this.$refs.attemptsTable.updateAttempts();
    },
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

      this.updateAttempts();
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
    authorStr() {
      return authorStrFunc.call(this, this.task);
    },
  },
  computed: {
    imAuthor() {
      return this.task.author.email == this.$store.state.email;
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
