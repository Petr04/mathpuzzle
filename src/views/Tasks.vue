<template>
<v-container ref="container">
<v-text-field
  v-model="search"
  ref="search"
  class="rounded-lg search"
  placeholder="Поиск..."
  solo hide-details
  prepend-inner-icon="mdi-magnify"
  :clearable="true"
  clear-icon="mdi-close"
  :style="`width: ${searchWidth}px`"
></v-text-field>
<div :style="`margin-top: ${totalSearchMargin}px`">
  <v-card
    v-for="(task, i) in tasks"
    :key="i"
    :to="'/task/' + task.id"
    :style="`margin-bottom: ${margin}px`"
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
  <div
    v-if="loading"
    class="loader-container"
  >
    <v-progress-circular
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div>
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
</div>
</v-container>
</template>
<style scoped>
.pre { white-space: pre; }

.search {
  position: fixed;
  z-index: 1;
  transition: .3s top;
}

.loader-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
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
    margin: 12,
    searchMargin: 3,
    searchWidth: 0,
    hideSearchBarSensetivity: 0,
    hideSearchBarDelay: 90,
    scrolledToBottomOffset: 40,

    tasks: [],
    search: '',
    totalSearchMargin: 0,
    limit: 20,
    loading: true,
    hasMore: true,
    scrolledToBottom: false,
    scrolledToTop: false,

    questionsPreviewMaxCount: 10,
    questionsPreviewSeparator: ' • ',

    // items: [
    //   {title: 'Тестовое задание', icon: 'mdi-pencil', href: '/create/test'},
    // ],
  }),
  watch: {
    scrolledToBottom(val) {
      if (val)
        this.loadTasks();
    },
    scrolledToTop(val) {
      if (val)
        this.setSearchBarVisibility(true);
    },
    search(s) {
      this.$axios
        .get('/tasks/', {params: {
          offset: 0,
          limit: 13,
          filter: s,
        }})
        .then(response => {
          this.hasMore = response.data.tasks.length != 0;
          this.tasks = response.data.tasks;
          this.loading = false;
        });
    },
  },
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
    setSearchBarVisibility(visibility) {
      this.$refs.search.$el.style.top = (visibility
        ? this.margin
        : -this.totalSearchMargin) + 'px';
    },
    setScrollWatching() { // split to multiple functions
      let lastScrollTop = 0;

      window.onscroll = () => {
        // Search bar visibility control
        if (this.$refs.search) {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const diff = scrollTop - lastScrollTop;

          if (Math.abs(diff) > this.hideSearchBarSensetivity) {
            setTimeout(() => this.setSearchBarVisibility(diff < 0),
              this.hideSearchBarDelay);
          }

          lastScrollTop = scrollTop;
        }

        // scrolledToTop
        this.scrolledToTop = window.scrollY == 0;

        // scrolledToBottom
        if (this.scrolledToBottom) {
          this.scrolledToBottom = false;
        }

        const bottomOfWindow = Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop)
        + window.innerHeight
          < document.documentElement.offsetHeight - this.scrolledToBottomOffset;

        if (!bottomOfWindow) {
          this.scrolledToBottom = true;
        }
      };
    },
    loadTasks() {
      if (!this.hasMore)
        return;

      this.loading = true;
      this.$axios
        .get('/tasks/', {params: {
          offset: this.tasks.length,
          limit: 13,
        }})
        .then(response => {
          this.hasMore = response.data.tasks.length != 0;
          this.tasks = [...this.tasks, ...response.data.tasks];
          this.loading = false;
        });
    },
    adjustSearchBarWidth() {
      if (!this.$refs.container)
        return;
      const style = window.getComputedStyle(this.$refs.container, null);
      const width = Number.parseInt(style.getPropertyValue('width'));
      const paddingLeft = Number.parseInt(style.getPropertyValue('padding-left'));
      const paddingRight = Number.parseInt(style.getPropertyValue('padding-right'));
      this.searchWidth = width - paddingLeft - paddingRight;
    },
    authorStr,
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.adjustSearchBarWidth();
    window.addEventListener('resize', this.adjustSearchBarWidth);

    this.totalSearchMargin = this.$refs.search.$el.offsetHeight
      + this.searchMargin + this.margin;

    this.setScrollWatching();
    this.loadTasks();

    this.$refs.search.$el.style.top = this.margin + 'px';
  },
  destroyed () {
    window.removeEventListener('resize', this.handleScroll);
  },
};
</script>
