<template>
<v-container>

<!-- {{ questions }} -->

<v-text-field label="Заголовок теста"></v-text-field>

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
    v-model="taskData.checkOnSubmit"
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
  @click="saveQuestion"
>Сохранить</v-btn>
</v-container>
</template>
<script>
import CreateQuestion from '@/components/CreateQuestion';

const emptyQuestion = {
  title: '',
  text: '',
  checkOnSubmit: false,
  type: 'textQuestion',
  attempts: 1,
  answer: null,
  choices: ['', ''],
};

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
        checkOnSubmit: false,
      },
      currentQuestion: 0,
      lastQuestion: 0,
      lastActionIsDeleting: false,
    };
  },
  methods: {
    createQuestion() {
      this.questions.push({...emptyQuestion});
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
    saveQuestion() {
      
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
      console.log(newValue);
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
