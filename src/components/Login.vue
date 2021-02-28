<template>

<v-form
  action="login"
  method="POST"
  ref="form"
  @submit.prevent="login"
>
  <v-text-field
    label="Логин"
    v-model="username"
    required
    :rules="[requiredRule()]"
    :class="`mx-${padding}`"
    outlined
  ></v-text-field>
  <v-text-field
    :type="showPassword ? 'text' : 'password'"
    label="Пароль"
    v-model="password"
    required
    :rules="[requiredRule()]"
    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append="showPassword = !showPassword"
    :class="`mx-${padding}`"
    outlined
  ></v-text-field>
  <v-divider></v-divider>
  <v-card-actions>
    <v-btn
      type="submit"
      text
    >Войти</v-btn>
  </v-card-actions>
</v-form>

</template>
<script>
import rules from '@/lib/rules';

export default {
  props: ['padding'],
  data: () => ({
    showPassword: false,

    username: '',
    password: '',

    requiredRule: rules.required,
  }),
  methods: {
    async login() {
      // Тут можно добавить try/catch на всю функцию и если будет ошибка,
      // то писать: произошла ошибка на сервере

      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password,
        });
      } catch (e) {
        console.log('Упс, неловко вышло', e);
        // Тут типа беды с аккаунтом.
      }

      console.log({
        auth: this.$store.getters.isAuthenticated,
        username: this.$store.state.username,
      });

      await this.$store.dispatch('getUserData');
      console.log(this.$store.state.userData);
    },
  },
};

</script>
