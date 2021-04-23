<template>
<v-container>

<template v-if="tasks">
  <v-card
    v-for="(task, i) in tasks"
    :key="i"
    :to="'/task/' + task.id"
    :class="'mb-' + margin"
    outlined
  >
    <div class="flex-space-between">
      <v-card-title class="pb-0">
        <v-icon v-if="task.status == 'finished'" left>
          mdi-check
        </v-icon>
        <v-icon v-else-if="task.status == 'started'" left>
          mdi-progress-check
        </v-icon>
        <span class="title">{{ task.title }}</span>
      </v-card-title>
      <div class="mr-4 grey--text text--darken-1" v-text="authorStr(task)">
      </div>
    </div>

    <!-- <v-card-subtitle class="mt-n8 subtitle-1"> -->
    <v-card-subtitle class="mt-n4 subtitle-1">
      <!-- {{ task.questions.length }} -->
      <!-- {{ decline('вопрос', 2, task.questions.length) }}<br> -->
      {{ getQuestionsPreview(task.questions) }}

    </v-card-subtitle>
    <v-card-text v-if="task.text">
      {{ task.text }}
    </v-card-text>
  </v-card>
  <!-- <SpeedDial
    title="Создать"
    :items="items"
  />
   -->
  <v-tooltip v-if="isAuthenticated" left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        to="/create/task/"
        color="red darken-2"
        fab dark
        bottom right fixed

        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <span>Создать задание</span>
  </v-tooltip>
</template>
<template v-else>
  <v-card
    v-for="i in 3"
    :key="i"
    :class="'mb-' + margin"
    outlined
  >
    <v-skeleton-loader
      type="article"
    ></v-skeleton-loader>
  </v-card>
</template>
</v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import authorStr from '@/lib/authorStr';
import decline from '@/lib/decline';
// import SpeedDial from '@/components/SpeedDial';

export default {
  components: {
    // SpeedDial,
  },
  data: () => ({
    margin: 3,
    tasks: null,
    questionsPreviewMaxCount: 10,
    questionsPreviewSeparator: ' • ',
    items: [
      {title: 'Тестовое задание', icon: 'mdi-pencil', href: '/create/test'},
    ],
  }),
  methods: {
    decline,
    getQuestionsPreview(questions) {
      const lenDiff = questions.length - this.questionsPreviewMaxCount;
      if (lenDiff >= 2) {
        return questions.slice(0, this.questionsPreviewMaxCount)
          .join(this.questionsPreviewSeparator)
          + ` и ещё ${lenDiff} ${decline('вопрос', 2, lenDiff)}`;
      }

      return questions.join(this.questionsPreviewSeparator);
    },
    authorStr,
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.$axios
      .get('/tasks')
      .then(response => this.tasks = response.data.tasks);
  },
};
</script>
<style>

.pre { white-space: pre; }

</style>
