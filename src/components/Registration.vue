<template>

<v-form
  action="login"
  method="POST"
  ref="form"
  @submit.prevent="register"
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
    label="E-mail"
    v-model="email"
    required
    :rules="[requiredRule(), emailRule()]"
    :class="`mx-${padding}`"
    outlined
  ></v-text-field>
  <v-text-field
    :type="showPassword ? 'text' : 'password'"
    label="Пароль"
    v-model="password"
    required
    :rules="passwordRules"
    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append="showPassword = !showPassword"
    :class="`mx-${padding}`"
    outlined
  ></v-text-field>
  <v-text-field
    :type="showPassword ? 'text' : 'password'"
    label="Повторите пароль"
    v-model="passwordRepeat"
    required
    :rules="passwordRepeatRules"
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
    >Зарегистрироваться</v-btn>
  </v-card-actions>
</v-form>

</template>
<script>
import rules from '@/lib/rules';

export default {
  props: ['padding'],
  data() {
    return {
      showPassword: false,

      username: '',
      email: '',
      password: '',
      passwordRepeat: '',

      requiredRule: rules.required,
      emailRule: rules.email,
      passwordRules: [
        s => Boolean(s) || 'Введите пароль',
        s => s.length <= 8 || 'Пароль должен быть длиннее 8 символов',
      ],
      passwordRepeatRules: [
        s => Boolean(s) || 'Повторите пароль',
        s => s == this.password || 'Пароли не совпадают',
      ],
    }
  },
  methods: {
    register() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      this.$axios.post('/userapi/registration/', {
        email: this.email,
        username: this.username,
        password: this.password,
      }).then(({data}) => {
        this.$axios.defaults.headers.common['Authorization'] = data.token;
      });
    }
  },
};

</script>
