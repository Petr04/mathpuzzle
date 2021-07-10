<template>
<v-container>

<v-form ref="form">

  <tinymce v-model="question.text" />

  <improved-text-field
    v-if="question.type == 'textQuestion'"
    v-model="question.answer"
    label="Ответ"
    :max-length="256"
    required
  ></improved-text-field>
  <template v-else-if="question.type == 'choiceQuestion'">
    <v-radio-group v-model="question.answer" mandatory>
      <v-form ref="choicesForm">
        <improved-text-field
          v-for="(choice, i) in question.choices"
          :key="i"
          required
          :max-length="256"
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
import Tinymce from '@/components/TinyMCE';
import rules from '@/lib/rules';

export default {
  props: ['question'],
  components: {
    ImprovedTextField,
    Tinymce,
  },
  data: () => ({
    rules,
  }),
  mounted() {
    this.question.attempts_max = 0;
  },
  methods: {
    createChoice() {
      if (this.$refs.choicesForm.validate())
        this.question.choices.push('');
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
