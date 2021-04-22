<template>
<v-container>

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
    :messages="(status == StatusEnum.saved ? ['Сохранено'] : []).concat(attemptMessages)"
    :readonly="readonly"
  ></v-text-field>
  <v-radio-group
    v-if="question.type == 'choiceQuestion'"
    v-model="answer"
    :error="status == StatusEnum.wrong"
    :error-messages="status == StatusEnum.wrong ? 'Неверно' : []"
    :success="status == StatusEnum.correct"
    :success-messages="status == StatusEnum.correct ? 'Верно' : []"
    :messages="(status == StatusEnum.saved ? ['Сохранено'] : []).concat(attemptMessages)"
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
    :dark="!(empty || readonly)"
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
import {StatusEnum} from '@/consts';
import {
  empty, readonly, final,
  attemptsLeft, attemptMessages} from '@/lib/questions/computed';
import {onSubmit, submit} from '@/lib/questions/methods';
import decline from '@/lib/decline';
import isTex from '@/lib/isTex';

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
      attemptsMax: this.question.attempts_max == 0
        ? Infinity
        : this.question.attempts_max,
    };
  },
  computed: {
    empty,
    readonly,
    final,
    attemptsLeft,
    attemptMessages,
  },
  watch: {
    status(newValue) {
      this.$emit('statusChange', newValue);
    },
  },
  methods: {
    async checkAnswer() {
      const response = await this.$axios
        .get('/tasks/check/' + this.question.id, {params: {
          answer: this.answer,
          type: this.question.type,
        }});
      return response.data.correct;
    },
    clearStatus() {
      this.status = StatusEnum.default;
    },
    onSubmit,
    submit,
    isTex,
    decline,
  },
};
</script>
