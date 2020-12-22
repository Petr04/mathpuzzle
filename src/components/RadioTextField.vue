<template>
<v-container>

<v-text-field
  :label="label"
  :value="textValue"
  @input="val => $emit('input', val)"
  dense hide-details
>
  <template v-slot:prepend>
    <v-radio
      :value="value"
    ></v-radio>
  </template>
  <template v-slot:append>
    <slot name="append"></slot>
  </template>
</v-text-field>

</v-container>
</template>
<script>
export default {
  model: {
    prop: 'textValue',
    event: 'input',
  },
  props: ['value', 'label', 'textValue'],
};
</script>
