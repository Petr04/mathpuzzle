<template>
<v-container>

<h2 class="mb-3">{{ question.title }}</h2>
<p class="mb-0">{{ question.text }}</p>

<v-form
  ref="form"
  class="mt-3"
  @submit.prevent="onSubmit"
>
  <v-text-field
    v-if="question.type == 'text_question'"
    v-model="answer"
    name="answer"
    label="Ответ"
    clearable
    clear-icon="mdi-close"
    @click:clear="clearStatus"
    :loading="status == StatusEnum.checking"
    :error="status == StatusEnum.wrong"
    :error-messages="status == StatusEnum.wrong ? 'Неверно' : []"
    :success="status == StatusEnum.correct"
    :success-messages="status == StatusEnum.correct ? 'Верно' : []"
    :readonly="status == StatusEnum.correct"
  ></v-text-field>
  <v-btn
    depressed
    type="submit"
    :disabled="empty"
    color="blue darken-2"
    :dark="!empty"
    class="transition mt-3"
  >Отправить</v-btn>
</v-form>

</v-container>
</template>
<script>
import axios from 'axios';
import settings from '@/settings';

const StatusEnum = Object.freeze({
  default: 'default',
  checking: 'checking',
  wrong: 'wrong',
  correct: 'correct',
});

export default {
  props: ['question'],
  data () {
    return {
      answer: null,
      StatusEnum,
      status: StatusEnum.default,
    }
  },
  computed: {
    empty() {
      return !this.answer;
    },
  },
  methods: {
    async checkAnswer() {
      const response = await axios
        .get(settings.apiUrl + '/tasks/check/' + this.question.id,
          {params: {answer: this.answer}});
      return response.data.correct;
    },
    onSubmit() {
      this.status = StatusEnum.checking;
      this.checkAnswer().then(correct => this.status = correct
        ? StatusEnum.correct
        : StatusEnum.wrong);
    },
    clearStatus() {
      this.status = StatusEnum.default;
    }
  },
};

</script>
