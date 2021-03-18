<template>
<v-container>

<v-form ref="form">
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
    <v-radio-group v-model="question.answer" mandatory>
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
  </template>
</v-form>

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
  props: ['question'],
  components: {
    ImprovedTextField,
  },
  data: () => ({
    rules,
    typesLabels,
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
    validate() {
      let ret = this.$refs.form.validate();
      if (this.question.type == 'choiceQuestion') {
        this.$refs.choicesForm.validate();
        ret &&= this.$refs.choicesForm.validate();
      }
      return ret;
    },
  },
};
</script>
