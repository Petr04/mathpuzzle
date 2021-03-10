<template>

<v-form
  method="POST"
  ref="form"
  @submit.prevent="register"
>
  <v-text-field
    label="Логин"
    v-model="username"
    required
    :rules="[requiredRule()]"
    @blur="isRegistered('username')"
    :error-messages="usernameErrors"
    :class="`mx-${padding}`"
    outlined
  ></v-text-field>
  <v-text-field
    label="E-mail"
    v-model="email"
    required
    :rules="[requiredRule(), emailRule()]"
    @blur="isRegistered('email')"
    :error-messages="emailErrors"
    :class="`mx-${padding}`"
    outlined
  ></v-text-field>
  <v-text-field
    label="Имя"
    v-model="firstName"
    required
    :rules="[requiredRule()]"
    :error-messages="firstNameErrors"
    :class="`mx-${padding}`"
    outlined
  ></v-text-field>
  <v-text-field
    label="Фамилия"
    v-model="lastName"
    required
    :rules="[requiredRule()]"
    :error-messages="lastNameErrors"
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
import axios from '@/plugins/axios';
import rules from '@/lib/rules';
import camelToSnakeCase from '@/lib/camelToSnakeCase';

export default {
  props: ['padding'],
  data() {
    return {
      showPassword: false,

      // Лучше это поместить в объект
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordRepeat: '',

      usernameErrors: [],
      emailErrors: [],
      firstNameErrors: [],
      lastNameErrors: [],

      requiredRule: rules.required,
      emailRule: rules.email,
      passwordRules: [
        s => Boolean(s) || 'Введите пароль',
        s => s.length >= 8 || 'Пароль должен быть длиннее 8 символов',
      ],
      passwordRepeatRules: [
        s => Boolean(s) || 'Повторите пароль',
        s => s == this.password || 'Пароли не совпадают',
      ],
    };
  },
  methods: {
    async register() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      const data = new FormData();
      const fields = [
        'email', 'username', 'password',
        'firstName', 'lastName',
      ];
      for (let field of fields) {
        data.set( camelToSnakeCase(field), this[field] );
      }

      this.$store.dispatch('register', data)
      this.$router.push('/')
    },
    async isRegistered(field) {
      if (!this[field]) {
        this[field + 'Errors'] = [];
        return;
      }

      const {data} = await axios.get('/userapi/is_registered/', {params: {
        [field]: this[field],
      }});
      if (data.is_registered) {
        this[field + 'Errors'].push(
          `Пользователь с таким ${field == 'username' ? 'логином' : field}`
          + ` уже зарегистрирован`
        );
      } else
        this[field + 'Errors'] = [];
    },
  },
};

</script>
