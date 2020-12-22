<template>
<v-container>

<v-text-field
  label="Заголовок вопроса"
  v-model="question.title"
></v-text-field>
<v-textarea
  label="Текст вопроса"
  v-model="question.text"
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
<v-text-field
  v-if="question.type == 'textQuestion'"
  label="Ответ"
  v-model="question.answer"
></v-text-field>
<template v-else-if="question.type == 'choiceQuestion'">
  <v-radio-group v-model="question.answer">
    <RadioTextField
      v-for="(choice, i) in question.choices"
      :key="i"
      :text-value="choice"
      @input="val => question.choices[i] = val"
    >
      <template
        v-slot:append
        v-if="question.choices.length > 2"
      >
        <v-btn
          icon
          @click="question.choices.splice(i, 1)"
        ><v-icon>mdi-close</v-icon></v-btn>
      </template>
    </RadioTextField>
    <v-btn
      icon
      @click="createChoice"
      class="ml-10"
    ><v-icon>mdi-plus</v-icon></v-btn>        
  </v-radio-group>
</template>
<div class="flex-start">
  <v-checkbox
    v-model="restrictAttempts"
    class="mr-3"
  ></v-checkbox>
  <v-text-field
    :value="restrictAttempts ? question.attempts : ''"
    @input="val => question.attempts = val"
    :disabled="!restrictAttempts"
    type="number"
    label="Ограничить количество попыток"
  ></v-text-field>
</div>

</v-container>
</template>
<script>
import RadioTextField from '@/components/RadioTextField';

const typesLabels = {
  textQuestion: 'Текстовый ответ',
  choiceQuestion: 'Выбор ответа',
};

export default {
  props: ['question'],
  components: {
    RadioTextField,
  },
  data: () => ({
    typesLabels,
    restrictAttempts: false,
  }),
  methods: {
    createChoice() {
      if (!this.question.choices.includes(''))
        this.question.choices.push('');
    },
  },
};
</script>
