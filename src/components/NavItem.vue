<template>

<v-tooltip right>
  <template v-slot:activator="{ on, attrs }">
    <v-list-item
      link
      :to="item.href"
      v-bind="attrs"
      v-on="on"
    >
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>

    </v-list-item>
  </template>
  <span>{{ item.title }}</span>
</v-tooltip>

</template>
<script>

export default {
  props: ['item'],
};

</script>
