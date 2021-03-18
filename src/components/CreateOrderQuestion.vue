<template>
<v-container>
  <v-form ref="form">
    <draggable
      handle=".handle"
      class="list-group"
      v-bind="dragOptions"
      ghost-class="ghost"
    >
      <improved-text-field
        v-for="(element,i) in question.elems"
        :key="i"
        @input="val => question.elems[i] = val"
        class="list-group-item"
        required
        dense
      >
        <template
          v-slot:append
          v-if="question.elems.length > 2"
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
import ImprovedTextField from '@/components/ImprovedTextField';
import Draggable from 'vuedraggable';

export default {
  props: ['question'],
  components: {
    Draggable,
    ImprovedTextField,
  },
  data() {
    return {
      dragging: false,
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      },
    };
  },
  methods: {
    add() {
      if (!this.question.elems.includes(''))
        this.question.elems.push('');

      this.$refs.form.validate();
    },
    del(n) {
      this.question.elems.splice(n, 1);
    },
    validate() {
      return this.$refs.form.validate();
    },
  },
}
</script>
<style>
.ghost {
  opacity: 0.5;
}
.handle {
  cursor: grab;
}
</style>
