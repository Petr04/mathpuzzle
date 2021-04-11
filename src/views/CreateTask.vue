<template>
<v-container>

<!-- {{ questions }} -->

<v-form
  ref="form"
>
  <improved-text-field
    v-model="taskData.title"
    label="Заголовок задания"
    :max-length="64"
    required
  ></improved-text-field>

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
            <v-tooltip top
              v-for="(button, i) in createButtons"
              :key="i"
            >
              <!-- Допилить чтобы подстраивались размеры -->
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab small icon
                  @click="createQuestion(button.type)"
                  :class="i < createButtons.length-1
                    || questions.length > 0 || true ? 'mr-1' : ''"

                  v-bind="attrs"
                  v-on="on"
                ><v-icon>{{ button.icon }}</v-icon></v-btn>
              </template>
              <span>{{ button.label }}</span>
            </v-tooltip>
            <v-fab-transition>
              <v-btn
                v-if="questions.length > 0 || true"
                fab dark small
                depressed
                color="red"
                @click="removeQuestion"
              ><v-icon>mdi-close</v-icon></v-btn>
            </v-fab-transition>
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
          <create-question-wrapper
            ref="createQuestion"
            :question="question"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-stepper>

    <v-switch
      v-model="taskData.check_on_submit"
      label="Проверять при отправлении"
      hint="Показывать правильность решения каждого вопроса только после
        отправления всего задания"
      persistent-hint
    ></v-switch>
  </div>

  <v-alert
    :value="questions.length == 0 && submitted"
    type="error"
  >
    Вы не создали ни одного вопроса
  </v-alert>

  <v-btn
    depressed
    dark
    color="blue darken-2"
    @click="saveTask"
  >Сохранить</v-btn>
</v-form>

</v-container>
</template>
<script>
import rules from '@/lib/rules';
import ImprovedTextField from '@/components/ImprovedTextField';
import CreateQuestionWrapper from '@/components/CreateQuestionWrapper';

class Question {
  constructor() {
    this.title = '';
    this.attempts_max = 1;
  }
}

class TextQuestion extends Question {
  constructor() {
    super();
    this.type = 'textQuestion';
    this.answer = null;
    this.text = '';
    this.choices = ['', ''];

    Object.defineProperty(this, 'answers', {
      get: function () {
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
    });
  }
}

class OrderQuestion extends Question {
  constructor() {
    super();
    this.type = 'orderQuestion';
    this.text = '';
    this.elems = ['', ''];
  }
}

const typeToClass = {
  textQuestion: TextQuestion,
  orderQuestion: OrderQuestion,
};

export default {
  components: {
    CreateQuestionWrapper,
    ImprovedTextField,
  },
  metaInfo: {
    title: 'Новое задание',
  },
  data() {
    return {
      questions: [
      ],
      taskData: {
        title: '',
        check_on_submit: false,
      },

      createButtons: [
        {
          icon: 'mdi-text',
          type: 'textQuestion',
          label: 'Текстовый вопрос'
        },
        {
          icon: 'mdi-format-list-numbered',
          type: 'orderQuestion',
          label: 'Вопрос на сортировку',
        },
      ].reverse(),

      rules,
      submitted: false,

      currentQuestion: 0,
      lastQuestion: 0,
      lastActionIsDeleting: false,
    };
  },
  methods: {
    createQuestion(type) {
      if (this.questions.length != 0) {
        const forms = this.$refs.createQuestion;
        if (!forms[forms.length-1].validate())
          return;
      }
      this.questions.push(new typeToClass[type]);
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
        if (question.answers) {
          ret.questions.push(Object.assign({},
            question, {answers: question.answers}
          ));
        } else {
          ret.questions.push(question);
        }
      }

      return {task: ret};
    },
    saveTask() {
      this.submitted = true;

      if (!this.$refs.form.validate()) return;

      // this.$axios.post('/tasks/', this.getAPIObject())
      //   .then(console.log);
      console.log(this.getAPIObject());

      this.$router.push('/');
    },
    setSlideGroupMaxWidth() {
      const buttons = this.$refs.buttons.$el;
      const stepperHeader = this.$refs.stepperHeader;
      const slideGroup = this.$refs.slideGroup.$el;

      slideGroup.style['max-width'] =
        `${stepperHeader.clientWidth - buttons.offsetWidth}px`;
    },
  },
  watch: {
    currentQuestion(newValue, oldValue) {
      this.lastQuestion = oldValue;
      this.lastActionIsDeleting = false;
    },
  },
  created() {
    window.addEventListener("resize", this.setSlideGroupMaxWidth);
  },
  destroyed() {
    window.removeEventListener("resize", this.setSlideGroupMaxWidth);
  },
  mounted() {
    setTimeout(() => this.setSlideGroupMaxWidth());
  },
};
</script>
