<template>

<v-text-field
  v-model="input"

  :dense="dense"
  :label="label"
  :disabled="disabled"

  :rules="[
    required != undefined ? rulesFs.required() : true,
    maxLength ? rulesFs.maxLength(maxLength) : true,
  ].concat(rules)"
  :required="required"
  :counter="maxLength
    && input.length >= counterShowLength_
        ? maxLength
        : false"
>
  <template v-slot:prepend>
    <slot name="prepend"></slot>
  </template>
  <template v-slot:append>
    <slot name="append"></slot>
  </template>
</v-text-field>

</template>
<script>
import {VTextField} from 'vuetify/lib';
import rulesFs from '@/lib/rules';

export default {
  extends: VTextField,
  props: [
    'value',
    'label', 'dense', 'type', 'disabled',

    'required',
    'maxLength',
    'counterShowLength',
  ],
  data() {
    return {
      input: this.value ? this.value : '',
      rulesFs,
      counterShowLength_: this.counterShowLength
        ? this.counterShowLength
        : Math.round(this.maxLength * .7),
    }
  },
  watch: {
    input() {
      this.$emit('input', this.input);
    }
  },
};

</script>
