<template>

<v-form ref="form">
  <div class="mx-3">
    <improved-text-field
      label="Заголовок вопроса"
      v-model="question.title"
      :max-length="32"
      required
      class="mb-3"
    ></improved-text-field>
    <create-text-question
      v-if="['textQuestion', 'choiceQuestion'].includes(question.type)"
      ref="createQuestion"
      :question="question"
      class="pa-0"
    />
    <create-order-question
      v-if="question.type == 'orderQuestion'"
      ref="createQuestion"
      :question="question"
      class="pa-0"
    />

    <restrict-attempts
      @input="val => question.attempts = val"
    />
  </div>
</v-form>

</template>
<script>
import RestrictAttempts from '@/components/RestrictAttempts';
import CreateTextQuestion from '@/components/CreateTextQuestion';
import CreateOrderQuestion from '@/components/CreateOrderQuestion';
import ImprovedTextField from '@/components/ImprovedTextField';

export default {
  props: ['question'],
  components: {
    RestrictAttempts,
    CreateTextQuestion,
    CreateOrderQuestion,
    ImprovedTextField,
  },
  methods: {
    validate() {
      const isFormValid = this.$refs.form.validate();
      const isQuestionValid = this.$refs.createQuestion.validate();
      return isFormValid && isQuestionValid;
    },
  },
};

</script>
