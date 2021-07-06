<template>
<v-container>

<draggable
  v-model="question.answers"
  animation="200"
  group="description"
  :disabled="readonly"
  ghost-class="ghost"
  class="list-group"
>
  <div
    v-for="(answer, i) in question.answers"
    :key="i"
    class="list-group-item"
  >
    <v-card
      :dark="color.slice(0, 4) != 'grey'"
      :class="'pa-3 mb-3 ' + color"
      :style="readonly ? '' : 'cursor: grab;'"
      outlined
    >
      <div class="flex-space-between">
        <mathjax
          :formula="answer"
        ></mathjax>
        <v-icon v-if="!readonly">mdi-drag-horizontal-variant</v-icon>
      </div>
    </v-card>
  </div>
</draggable>

<div class="body-2">{{ attemptMessage }}</div>

<v-btn
  depressed
  @click="onSubmit"
  :disabled="readonly"
  color="blue darken-2"
  :dark="!readonly"
  :loading="status == StatusEnum.checking"
  class="transition mt-3"
>Отправить</v-btn>

</v-container>
</template>
<script>
import decline from '@/lib/decline';
import {StatusEnum} from '@/consts';
import {
  readonly, final, error, success, color,
  attemptsLeft, attemptMessage} from '@/lib/questions/computed';
import {onSubmit, submit} from '@/lib/questions/methods';
import '@/assets/css/draggable.css';
import {VueMathjax} from 'vue-mathjax';
import Draggable from 'vuedraggable';
import qs from 'qs';

export default {
  components: {
    Draggable,
    mathjax: VueMathjax,
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
    check_on_submit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      StatusEnum,

      dragDisabled: false,

      status: StatusEnum.default,
      attempts: 0,
      attemptsMax: this.question.attempts_max == 0
        ? Infinity
        : this.question.attempts_max,
    };
  },
  methods: {
    decline,
    async checkAnswer() {
      const response = await this.$axios
        .get('/tasks/check/' + this.question.id, {
          params: {
            type: this.question.type,
            answers: this.question.answers,
          },
          paramsSerializer(params) {
             return qs.stringify(params, {arrayFormat: 'repeat'})
          },
        });
      return response.data.correct;
    },
    submit,
    onSubmit,
  },
  computed: {
    readonly,
    error,
    success,
    color,
    final,
    attemptsLeft,
    attemptMessage,
  },
  watch: {
    status(newValue) {
      this.$emit('statusChange', newValue);
    },
  },
  async mounted() {
    const response = await this.$axios.get('/tasks/attempts/', {params: {
      question: this.question.id,
      user: this.$store.state.email,
    }});

    if (response.data.length == 0)
      return;

    const last = response.data.splice(-1)[0];
    this.attempts = response.data.length;
    this.status = last.value ? StatusEnum.correct : StatusEnum.wrong;

    this.question.answers = last.answer;
  },
};

</script>
