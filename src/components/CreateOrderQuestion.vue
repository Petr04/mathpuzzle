<template>
<v-container>
  <tinymce v-model="question.text" />

  <v-form ref="form">
    <draggable
      v-model="question.answers"
      handle=".handle"
      class="list-group"
      animation="200"
      ghost-class="ghost"
    >
      <improved-text-field
        v-for="(answer, i) in question.answers"
        :key="answer.answer_num"
        @input="val => question.answers[i].text = val"
        class="list-group-item"
        required
        dense
      >
        <template
          v-slot:append
          v-if="question.answers.length > 2"
        >
          <v-btn
            icon
            @click="del(i)"
          ><v-icon>mdi-close</v-icon></v-btn>
        </template>
        <template v-slot:prepend>
          <v-icon class="handle">mdi-drag-horizontal-variant</v-icon>
        </template>
      </improved-text-field>
    </draggable>
  </v-form>
  <v-icon @click="add">mdi-plus</v-icon>
</v-container>
</template>

<script>
import '@/assets/css/draggable.css';
import rules from '@/lib/rules';
import Tinymce from '@/components/TinyMCE';
import ImprovedTextField from '@/components/ImprovedTextField';
import Draggable from 'vuedraggable';

export default {
  props: ['question'],
  components: {
    Tinymce,
    Draggable,
    ImprovedTextField,
  },
  data() {
    return {
      rules,
      lastAnswerNum: 2,
      dragging: false,
      list: [],
    };
  },
  methods: {
    add() {
      if (!this.question.answers.includes('')) {
        this.question.answers.push({
          answer_num: this.lastAnswerNum++,
          is_true: false,
          text: ''
        });
      }
      this.$refs.form.validate();
    },
    del(n) {
      this.question.answers.splice(n, 1);
    },
    validate() {
      return this.$refs.form.validate();
    },
  },
}
</script>
