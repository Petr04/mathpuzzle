<template>
<v-speed-dial
  v-model="fab"
  direction="top"
  transition="slide-y-reverse-transition"
  bottom right fixed
>
  <template v-slot:activator>
    <v-btn
      v-model="fab"
      color="red darken-2"
      :class="{ rotated: fab }"
      dark
      fab
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </template>
  <v-tooltip
    v-for="(item, i) in items"
    :key="i"
    left
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :to="item.href"
        :label="item.title"
        fab small

        v-bind="attrs"
        v-on="on"
      >
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ item.title }}</span>
  </v-tooltip>
</v-speed-dial>
</template>
<style>
.rotated .v-icon {
  transform: rotateZ(135deg);
}
</style>
<script>
export default {
  props: ['title', 'items'],
  data: () => ({
    fab: false,
  }),
};
</script>
