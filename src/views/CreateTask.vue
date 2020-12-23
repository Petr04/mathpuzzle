<template>
<v-container>

<!-- {{ questions }} -->

<v-text-field
  label="Заголовок задания"
  v-model="taskData.title"
></v-text-field>

<div class="mb-5">
  <v-stepper
    v-model="currentQuestion"
    non-linear
    class="elevation-0 ma-0 rounded-0"
  >
    <v-stepper-header
      class="flex-space-between"
      ref="stepperHeader"
    >
      <v-slide-group
        show-arrows
        center-active
        :value="currentQuestion-1"
        ref="slideGroup"
      >
        <v-slide-item
          v-for="(question, i) in questions"
          :key="i"
          v-slot="{ active, toggle }"
        >
          <v-stepper-step
            :step="i+1"
            editable
            @click="toggle"
          >
            {{ question.title.trim() || 'Новый вопрос' }}
          </v-stepper-step>
        </v-slide-item>
      </v-slide-group>

      <v-card
        class="rounded-pill pa-1"
        ref="buttons"
        outlined
      >
        <div class="flex-space-between">
          <v-btn
            fab dark small
            depressed
            color="red"
            class="mr-1"
            @click="createQuestion"
          ><v-icon>mdi-plus</v-icon></v-btn>
          <v-btn
            fab small icon
            @click="removeQuestion"
          ><v-icon>mdi-close</v-icon></v-btn>
        </div>
      </v-card>

    </v-stepper-header>
    <v-tabs-items
      :value="currentQuestion-1"
      class="px-10"
    >
      <v-tab-item
        v-for="(question, i) in questions"
        :key="i"
      >
        <CreateQuestion
          :question="question"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-stepper>

  <v-switch
    v-model="taskData.check_on_submit"
    label="Проверять при отправлении"
    hint="Показывать правильность решения каждого вопроса только после отправления
      всего задания"
    persistent-hint
  ></v-switch>
</div>

<v-btn
  depressed
  dark
  color="blue darken-2"
  @click="saveTask"
>Сохранить</v-btn>
</v-container>
</template>
<script>
import axios from 'axios';
import settings from '@/settings';
import CreateQuestion from '@/components/CreateQuestion';

class Question {
  constructor() {
    this.title = '';
    this.text = '';
    this.check_on_submit = false;
    this.type = 'textQuestion';
    this.attempts = 1;
    this.answer = null;
    this.choices = ['', ''];
  }

  get answers() {
    if (this.answer == null || this.answer === '') {
      return null;
    }
    else if (this.type == 'textQuestion') {
      return [{
        text: this.answer,
        answer_num: 0,
        is_true: true,
      }];
    } else if (this.type == 'choiceQuestion') {
      const ret = [];
      for (let [i, choice] of this.choices.entries()) {
        ret.push({
          text: choice,
          answer_num: i,
          is_true: i == this.answer,
        });
      }
      return ret;
    }
    return null;
  }
}

export default {
  components: {
    CreateQuestion,
  },
  data() {
    return {
      questions: [
      ],
      taskData: {
        title: '',
        check_on_submit: false,
      },
      currentQuestion: 0,
      lastQuestion: 0,
      lastActionIsDeleting: false,
    };
  },
  methods: {
    createQuestion() {
      this.questions.push(new Question());
      setTimeout(() => this.currentQuestion = this.questions.length);
    },
    removeQuestion() {
      if (this.questions.length)

      this.questions.splice(this.currentQuestion-1, 1);
      if (this.lastActionIsDeleting) {
        if (this.currentQuestion == this.questions.length+1)
          this.currentQuestion--;
        else
          this.currentQuestion++;
      } else {
        if (this.lastQuestion > this.currentQuestion)
          this.lastQuestion--;
        if (this.lastQuestion > this.questions.length) {
          this.lastQuestion--;
        }

        this.currentQuestion = this.lastQuestion;
      }

      setTimeout(() => this.lastActionIsDeleting = true);
    },
    getAPIObject() {
      const ret = {...this.taskData};
      ret.questions = [];

      for (let question of this.questions) {
        ret.questions.push(Object.assign({},
          question, {answers: question.answers}
        ));
      }

      return {task: ret};
    },
    saveTask() {
      console.log(JSON.stringify(this.getAPIObject(), null, '    '));
      axios.post(settings.apiUrl + '/tasks/', this.getAPIObject())
        .then(console.log);
      this.$router.push('/');
    },
    setSlideGroupMaxWidth() {
      const buttons = this.$refs.buttons.$el;
      const stepperHeader = this.$refs.stepperHeader;
      const slideGroup = this.$refs.slideGroup.$el;

      slideGroup.style['max-width'] =
        `${stepperHeader.clientWidth - buttons.offsetWidth}px`;
    },
    onResize() {
      this.setSlideGroupMaxWidth();
    },
  },
  watch: {
    currentQuestion(newValue, oldValue) {
      this.lastQuestion = oldValue;
      this.lastActionIsDeleting = false;
    },
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
  mounted() {
    this.setSlideGroupMaxWidth();
  },
};
</script>
