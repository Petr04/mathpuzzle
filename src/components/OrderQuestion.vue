<template>
<v-container>

<div class="mb-5">
<mathjax
  :formula="question.text"
></mathjax>
</div>
<draggable
  animation="200"
  group="description"
  :disabled="readonly"
  ghost-class="ghost"
  class="list-group"
>
  <div
    v-for="(elem, i) in question.elems"
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
          :formula="elem"
        ></mathjax>
        <v-icon v-if="!readonly">mdi-drag-horizontal-variant</v-icon>
      </div>
    </v-card>
  </div>
</draggable>

<div class="body-2">{{ attemptMessages[0] }}</div>

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
import {StatusEnum, finalStatuses} from '@/consts';
import '@/assets/css/draggable.css';
import {VueMathjax} from 'vue-mathjax';
import Draggable from 'vuedraggable';

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
      attemptsMax: this.question.attempts == 0
        ? Infinity
        : this.question.attempts,
    };
  },
  methods: {
    decline,
    async checkAnswer() {
      // const response = await this.$axios
      //   .get('/tasks/check/' + this.question.id, {params: {
      //     type: this.question.type,
      //     elements: this.question.elements,
      //   }});
      // return response.data.correct;


      // demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      return Math.random() < .5;
    },
    submit() {
      this.status = StatusEnum.checking;
      this.checkAnswer().then(correct => this.status = correct
        ? StatusEnum.correct
        : StatusEnum.wrong);
      this.attempts++;
    },
    onSubmit() {
      if (this.check_on_submit)
        this.status = StatusEnum.saved;
      else
        this.submit();
    },
  },
  computed: {
    readonly() {
      return this.status == StatusEnum.correct ||
        (this.status == StatusEnum.wrong &&
          (this.attempts >= this.attemptsMax || this.check_on_submit));
    },
    error() {
      return this.status == StatusEnum.wrong;
    },
    success() {
      return this.status == StatusEnum.correct;
    },
    color() {
      if (this.error) return 'error';
      if (this.success) return 'success';
      return 'grey lighten-4';
    },
    final() {
      return finalStatuses.includes(this.status)
        || (this.status == StatusEnum.wrong && this.attemptsLeft == 0);
    },
    attemptsLeft() {
      return this.attemptsMax - this.attempts;
    },
    attemptMessages() {
      if (this.attemptsMax == Infinity)
        return [];

      return [this.attemptsLeft
        ? `Остал${this.attemptsLeft == 1 ? 'а' : 'о'}сь `
          + this.attemptsLeft + ' '
          + this.decline('попытка', 1, this.attemptsLeft, 'и')
        : 'Не осталось попыток'
      ];
    },
  },
  watch: {
    status(newValue) {
      this.$emit('statusChange', newValue);
    },
  },
};

</script>
