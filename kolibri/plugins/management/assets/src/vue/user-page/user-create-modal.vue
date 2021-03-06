<template>

  <core-modal
    :title="$tr('addNewAccountTitle')"
    :has-error="errorMessage ? true : false"
    @enter="createNewUser"
    @cancel="close"
  >
    <div>
      <!-- Fields for the user to fill out -->
      <section class="user-fields">
        <div class="user-field">
          <label for="name">{{$tr('name')}}</label>
          <input @focus="clearStatus" type="text" class="add-form" id="name" autocomplete="name"  autofocus="true" required v-model="full_name">
        </div>

        <div class="user-field">
          <label for="username">{{$tr('username')}}</label>
          <input @focus="clearStatus" type="text" class="add-form" autocomplete="username" id="username" required v-model="username">
        </div>

        <div class="user-field">
          <label for="password">{{$tr('password')}}</label>
          <input @focus="clearStatus" type="password" class="add-form" id="password" required v-model="password">
        </div>

        <div class="user-field">
          <label for="confirm-password">{{$tr('confirmPassword')}}</label>
          <input @focus="clearStatus" type="password" class="add-form" id="confirm-password" required v-model="passwordConfirm">
        </div>

        <div class="user-field">
          <label for="user-kind"><span class="visuallyhidden">{{$tr('userKind')}}</span></label>
          <select @focus="clearStatus" v-model="kind" id="user-kind">
            <option :value="LEARNER"> {{$tr('learner')}} </option>
            <option :value="COACH"> {{$tr('coach')}} </option>
            <option :value="ADMIN"> {{$tr('admin')}} </option>
          </select>
        </div>
      </section>

      <!-- Button Options at footer of modal -->
      <section class="footer">
        <p :class="{error: errorMessage}" v-if="statusMessage" aria-live="polite">{{statusMessage}}</p>
        <icon-button
          class="create-btn"
          :text="$tr('createAccount')"
          @click="createNewUser"
          :primary="true"
        />
      </section>
    </div>
  </core-modal>

</template>


<script>

  const actions = require('../../actions');
  const UserKinds = require('kolibri.coreVue.vuex.constants').UserKinds;

  module.exports = {
    $trNameSpace: 'userCreateModal',
    $trs: {
      // Modal title
      addNewAccountTitle: 'Add New Account',
      // Labels
      name: 'Name',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      userKind: 'User Kind',
      // Button Labels
      createAccount: 'Create Account',
      // Select inputs
      learner: 'Learner',
      coach: 'Coach',
      admin: 'Admin',
      // Status Messages
      emptyFieldError: 'All fields are required',
      pwMismatchError: 'Passwords do not match',
      unknownError: 'Whoops! Something went wrong!',
      loadingConfirmation: 'Loading...',
    },
    components: {
      'icon-button': require('kolibri.coreVue.components.iconButton'),
      'core-modal': require('kolibri.coreVue.components.coreModal'),
    },
    data() {
      return {
        username: '',
        password: '',
        passwordConfirm: '',
        full_name: '',
        kind: UserKinds.LEARNER,
        errorMessage: '',
        confirmationMessage: '',
      };
    },
    mounted() {
      // clear form on load
      Object.assign(this.$data, this.$options.data());
    },
    computed: {
      LEARNER: () => UserKinds.LEARNER,
      COACH: () => UserKinds.COACH,
      ADMIN: () => UserKinds.ADMIN,
      statusMessage() {
        if (this.errorMessage) {
          return this.errorMessage;
        } else if (this.confirmationMessage) {
          return this.confirmationMessage;
        }
        return false;
      },
    },
    methods: {
      createNewUser() {
        const newUser = {
          username: this.username,
          full_name: this.full_name,
          facility_id: this.facility,
          kind: this.kind,
        };

        // check for all fields populated
        if (!(this.username && this.password && this.full_name && this.kind)) {
          this.errorMessage = this.$tr('emptyFieldError');
        // check for password confirmation match
        } else if (!(this.password === this.passwordConfirm)) {
          this.errorMessage = this.$tr('pwMismatchError');
        // create user
        } else {
          newUser.password = this.password;

          // loading message
          this.confirmationMessage = this.$tr('loadingConfirmation');
          // using promise to ensure that the user is created before closing
          this.createUser(newUser).then(
            () => {
              this.close();
            },
            (error) => {
              if (error.status.code === 400) {
                // access the first error message
                this.errorMessage = error.entity[Object.keys(error.entity)[0]];
              } else if (error.status.code === 403) {
                this.errorMessage = error.entity;
              } else {
                this.errorMessage = this.$tr('unknownError');
              }
            });
        }
      },
      clearStatus() {
        this.errorMessage = '';
        this.confirmationMessage = '';
      },
      close() {
        this.$emit('close'); // signal parent to close
      },
    },
    vuex: {
      getters: {
        facility: state => state.facility,
      },
      actions: {
        createUser: actions.createUser,
      },
    },
  };

</script>


<style lang="stylus" scoped>

  @require '~kolibri.styles.definitions'

  $button-content-size = 1em

  .user-field
    padding-bottom: 5%
    input
      width: 100%
      height: 40px
      font-weight: bold
    label
      position: relative
      cursor: pointer
    select
      width: 100%
      height: 40px
      font-weight: bold
      background-color: transparent

  .add-form
    width: 300px
    margin: 0 auto
    display: block
    padding: 5px 10px
    letter-spacing: 0.08em
    border: none
    border-bottom: 1px solid $core-text-default
    height: 30px
    &:focus
      outline: none
      border-bottom: 3px solid $core-action-normal

  .header
    text-align: center

  .footer
    text-align: center

  .create-btn
    width: 200px

  .error
    color: $core-text-error

  .secondary
    &:hover
      color: #ffffff
      background-color: $core-action-dark
      svg
        fill: #ffffff

</style>
