<template>

<v-form
  method="POST"
  ref="form"
  @submit.prevent="login"
>
  <v-text-field
    label="Логин"
    v-model="username"
    required
    :rules="[requiredRule()]"
    @blur="isRegistered"
    :error-messages="usernameErrors"
    :class="`mx-${padding}`"
    outlined
  ></v-text-field>
  <v-text-field
    :type="showPassword ? 'text' : 'password'"
    label="Пароль"
    v-model="password"
    required
    :rules="[requiredRule()]"
    :error-messages="passwordErrors"
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
import axios from '@/plugins/axios';
import rules from '@/lib/rules';

export default {
  props: ['padding'],
  data: () => ({
    showPassword: false,

    username: '',
    password: '',

    usernameErrors: [],
    passwordErrors: [],
    requiredRule: rules.required,
  }),
  methods: {
    async login() {
      // Тут (как и везде) можно добавить try/catch на всю функцию
      // и если будет ошибка, то писать: произошла ошибка на сервере

      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      const data = new FormData();
      data.set('username', this.username);
      data.set('password', this.password);

      try {
        await this.$store.dispatch('login', data);
        this.passwordErrors = [];

        await this.$store.dispatch('getUserData');
        console.log(this.$store.state.userData);

        this.$router.push('/');
      } catch (e) {
        console.log(e);
        this.passwordErrors.push('Неверный пароль');
      }
    },
    async isRegistered() {
      if (!this.username) {
        this.usernameErrors = [];
        return;
      }

      const {data} = await axios.get('/userapi/is_registered/', {params: {
        username: this.username,
      }});
      if (!data.is_registered)
        this.usernameErrors.push('Неверный логин');
      else
        this.usernameErrors = [];
    },
  },
};

</script>
