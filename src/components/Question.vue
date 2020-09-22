<template>
<v-container>

<h2 v-if="question.title" class="mb-3">{{ question.title }}</h2>
<p class="mb-0">{{ question.text }}</p>

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
    :clearable="status != StatusEnum.correct"
    clear-icon="mdi-close"
    @click:clear="clearStatus"
    :error="status == StatusEnum.wrong"
    :error-messages="status == StatusEnum.wrong ? 'Неверно' : []"
    :success="status == StatusEnum.correct"
    :success-messages="status == StatusEnum.correct ? 'Верно' : []"
    :readonly="status == StatusEnum.correct"
  ></v-text-field>
  <v-radio-group
    v-if="question.type == 'choiceQuestion'"
    v-model="answer"
    :error="status == StatusEnum.wrong"
    :error-messages="status == StatusEnum.wrong ? 'Неверно' : []"
    :success="status == StatusEnum.correct"
    :success-messages="status == StatusEnum.correct ? 'Верно' : []"
    :readonly="status == StatusEnum.correct"
  >
    <v-radio
      v-for="(choiceText, i) in question.choices"
      :key="i"
      :label="choiceText"
      :value="i"
    ></v-radio>
  </v-radio-group>
  <v-btn
    depressed
    type="submit"
    :disabled="empty"
    color="blue darken-2"
    :dark="!empty"
    :loading="status == StatusEnum.checking"
    class="transition mt-3"
  >Отправить</v-btn>
</v-form>

</v-container>
</template>
<script>
import axios from 'axios';
import settings from '@/settings';
import {StatusEnum} from '@/consts';

export default {
  props: ['question'],
  data () {
    return {
      answer: null,
      StatusEnum,
      status: status ? status : StatusEnum.default,
    }
  },
  computed: {
    empty() {
      return !this.answer && this.answer !== 0;
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
