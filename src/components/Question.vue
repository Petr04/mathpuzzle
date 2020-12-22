<template>
<v-container>

<h2 v-if="question.title" class="mb-3">{{ question.title }}</h2>
<mathjax
  :formula="question.text"
></mathjax>
<v-form
  ref="form"
  class="mt-3"
  @submit.prevent="onSubmit"
>
  <v-text-field
    v-if="question.type == 'textQuestion'"
    v-model="answer"
    name="answer"
    label="Ответ"
    :clearable="!readonly"
    clear-icon="mdi-close"
    @click:clear="clearStatus"
    :error="status == StatusEnum.wrong"
    :error-messages="status == StatusEnum.wrong ? 'Неверно' : []"
    :success="status == StatusEnum.correct"
    :success-messages="status == StatusEnum.correct ? 'Верно' : []"
    :messages="(status == StatusEnum.saved ? 'Сохранено' : []).concat(attemptMessages)"
    :readonly="readonly"
  ></v-text-field>
  <v-radio-group
    v-if="question.type == 'choiceQuestion'"
    v-model="answer"
    :error="status == StatusEnum.wrong"
    :error-messages="status == StatusEnum.wrong ? 'Неверно' : []"
    :success="status == StatusEnum.correct"
    :success-messages="status == StatusEnum.correct ? 'Верно' : []"
    :messages="(status == StatusEnum.saved ? 'Сохранено' : []).concat(attemptMessages)"
    :readonly="readonly"
  >
    <template
      v-for="(choiceText, i) in question.answers"
    >
      <v-radio
        :key="i"
        :label="isTex(choiceText) ? '' : choiceText"
        :value="i"
      >
        <template
          v-if="isTex(choiceText)"
          slot="label"
        >
          <mathjax
            :formula="String.raw({raw: choiceText})"
          ></mathjax>
        </template>
      </v-radio>
    </template>
  </v-radio-group>
  <v-btn
    depressed
    type="submit"
    :disabled="empty || readonly"
    color="blue darken-2"
    :dark="!empty"
    :loading="status == StatusEnum.checking"
    class="transition mt-3"
  >Отправить</v-btn>
</v-form>

</v-container>
</template>
<style>
.transition {
  transition: .2s;
}
</style>
<script>
import {VueMathjax} from 'vue-mathjax';

import axios from 'axios';
import settings from '@/settings';
import {StatusEnum, finalStatuses} from '@/consts';
import decline from '@/lib/decline';

export default {
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
  components: {
    'mathjax': VueMathjax,
  },
  data () {
    return {
      answer: null,
      StatusEnum,
      status: status ? status : StatusEnum.default,

      attempts: 0,
      attemptsMax: this.question.attempts == 0
        ? Infinity
        : this.question.attempts,
    };
  },
  computed: {
    empty() {
      return !this.answer && this.answer !== 0;
    },
    readonly() {
      return this.status == StatusEnum.correct ||
        (this.status == StatusEnum.wrong &&
          (this.attempts >= this.attemptsMax || this.check_on_submit));
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
          + this.attemptsLeft
          + this.decline(' попытка', 1, this.attemptsLeft, 'и')
        : 'Не осталось попыток'
      ];
    },
  },
  watch: {
    status(newValue) {
      this.$emit('statusChange', newValue);
    },
  },
  methods: {
    async checkAnswer() {
      const response = await axios
        .get(settings.apiUrl + '/tasks/check/' + this.question.id, {params: {
          answer: this.answer,
          type: this.question.type,
        }});
      return response.data.correct;
    },
    onSubmit() {
      if (this.check_on_submit)
        this.status = StatusEnum.saved;
      else
        this.submit();
    },
    submit() {
      this.status = StatusEnum.checking;
      this.checkAnswer().then(correct => this.status = correct
        ? StatusEnum.correct
        : StatusEnum.wrong);
      this.attempts++;
    },
    clearStatus() {
      this.status = StatusEnum.default;
    },
    isTex(s) {
      return s.slice(0, 2) == '$$' && s.slice(-2) == '$$';
    },
    decline,
  },
};
</script>
