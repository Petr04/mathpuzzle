<template>

<div class="flex-start">
  <v-checkbox
    v-model="restrictAttempts"
    class="mr-3"
  ></v-checkbox>
  <v-text-field
    :value="restrictAttempts ? attempts : ''"
    :disabled="!restrictAttempts"
    v-model="attempts"
    type="number"
    label="Ограничить количество попыток"
  ></v-text-field>
</div>

</template>
<script>

export default {
  data: () => ({
    restrictAttempts: false,
    attempts: 1,
  }),
  computed: {
    finalAttempts() {
      if (!this.restrictAttempts) return 0;
      return this.attempts;
    }
  },
  watch: {
    finalAttempts(val) {
      console.log(val);
      this.$emit('input', val);
    },
  },
};

</script>
