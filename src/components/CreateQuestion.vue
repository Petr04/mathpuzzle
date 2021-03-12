<template>
<v-container>

<improved-text-field
  label="Заголовок вопроса"
  v-model="question.title"
  :max-length="32"
  required
  class="mb-3"
></improved-text-field>
<v-textarea
  label="Текст вопроса"
  v-model="question.text"
  :rules="[rules.required()]"
  required
  auto-grow
  outlined
></v-textarea>
<div class="flex-start">
  <span>Тип ответа:</span>
  <v-chip-group
    v-model="question.type"
    class="ml-3"
    active-class="blue--text text--accent-4"
    mandatory
  >
    <v-chip
      v-for="(label, type) in typesLabels"
      :key="type"
      :value="type"
    >{{ label }}</v-chip>
  </v-chip-group>
</div>
<improved-text-field
  v-if="question.type == 'textQuestion'"
  v-model="question.answer"
  label="Ответ"
  :max-length="64"
  required
></improved-text-field>
<template v-else-if="question.type == 'choiceQuestion'">
  <v-radio-group v-model="question.answer">
    <v-form ref="choicesForm">
      <improved-text-field
        v-for="(choice, i) in question.choices"
        :key="i"
        required
        :max-length="64"
        :value="choice"
        @input="val => question.choices[i] = val"
        dense
      >
        <template v-slot:prepend>
          <v-radio></v-radio>
        </template>
        <template
          v-slot:append
          v-if="question.choices.length > 2"
        >
          <v-btn
            icon
            @click="question.choices.splice(i, 1)"
          ><v-icon>mdi-close</v-icon></v-btn>
        </template>
      </improved-text-field>
    </v-form>

    <v-btn
      icon
      @click="createChoice"
      class="ml-10"
    ><v-icon>mdi-plus</v-icon></v-btn>

  </v-radio-group>
  <v-alert
    :value="question.answer == null && submitted"
    type="error"
  >
    Выберите правильный вариант ответа
  </v-alert>
</template>
<div class="flex-start">
  <v-checkbox
    v-model="restrictAttempts"
    class="mr-3"
  ></v-checkbox>
    <!-- @input="val => question.attempts = val" -->
  <v-text-field
    :value="restrictAttempts ? question.attempts : ''"
    :disabled="!restrictAttempts"
    v-model="attempts"
    type="number"
    label="Ограничить количество попыток"
  ></v-text-field>
</div>

</v-container>
</template>
<script>
import ImprovedTextField from '@/components/ImprovedTextField';
import rules from '@/lib/rules';

const typesLabels = {
  textQuestion: 'Текстовый ответ',
  choiceQuestion: 'Выбор ответа',
};

export default {
  props: ['question', 'submitted'],
  components: {ImprovedTextField},
  data: () => ({
    rules,
    typesLabels,
    attempts: 1,
    restrictAttempts: false,
  }),
  mounted() {
    this.question.attempts = 0;
  },
  methods: {
    createChoice() {
      if (!this.question.choices.includes(''))
        this.question.choices.push('');

      this.$refs.choicesForm.validate();
    },
  },
  computed: {
    finalAttempts() {
      if (!this.restrictAttempts) return 0;
      return this.attempts;
    }
  },
  watch: {
    finalAttempts(val) {
      console.log(val);
      this.question.attempts = val;
    },
  },
};
</script>
