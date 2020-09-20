<template>
<v-container fill-height class="center">

<v-card width="600" outlined>
<v-tabs centered v-model="tabs">
  <v-tabs-slider></v-tabs-slider>

  <v-tab ref="0">Вход</v-tab>
  <v-tab ref="1">Регистрация</v-tab>

  <!-- Вход -->
  <v-tab-item>
    <v-form
      action="login"
      method="POST"
      ref="login"
    >
      <v-text-field
        label="Логин"
        required
        :rules="loginRules"
        :class="`mx-${padding}`"
        outlined
      ></v-text-field>
      <v-text-field
        :type="showPassword ? 'text' : 'password'"
        label="Пароль"
        required
        :rules="passwordRules"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        :class="`mx-${padding}`"
        outlined
      ></v-text-field>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          @click="validate('login')"
          text
        >Войти</v-btn>
      </v-card-actions>
    </v-form>
  </v-tab-item>

  <!-- Регистрация -->
  <v-tab-item>
    <v-form
      action="login"
      method="POST"
      ref="register"
    >
      <v-text-field
        label="Логин"
        required
        :rules="loginRules"
        :class="`mx-${padding}`"
        outlined
      ></v-text-field>
      <v-text-field
        :type="showPassword ? 'text' : 'password'"
        label="Пароль"
        v-model="passwordRegister"
        required
        :rules="passwordRegisterRules"
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
          @click="validate('register')"
          text
        >Зарегистрироваться</v-btn>
      </v-card-actions>
    </v-form>
  </v-tab-item>
</v-tabs>
</v-card>

</v-container>
</template>
<style>

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

</style>
<script>

export default {
  data: function () {
    const action = this.$route.params.action;
    const actions = ['login', 'register'];
    const tabs = actions.indexOf(action);
    if (tabs == -1) tabs == 0;

    return {
      padding: 5,
      showPassword: false,

      valid: true,
      passwordRegister: '',
      passwordRepeat: '',

      actions: actions,
      tabs: tabs,

      loginRules: [
        s => !!s || 'Введите логин',
      ],
      passwordRules: [
        s => !!s || 'Введите пароль',
      ],
      passwordRegisterRules: [
        s => !!s || 'Введите пароль',
        s => s.length <= 8 || 'Пароль должен быть длиннее 8 символов',
      ],
      passwordRepeatRules: [
        s => !!s || 'Повторите пароль',
        s => s == this.passwordRegister || 'Пароли не совпадают',
      ],
    };
  },
  watch: {
    tabs: function (val) {
      this.$router.replace(`/account/${this.actions[val]}/`);
    }
  },
  methods: {
    validate (ref) {
      this.$refs[ref].validate();
    },
    reset () {
      this.$refs.form.reset();
    },
    resetValidation () {
      this.$refs.form.resetValidation();
    },
  },
}
</script>
