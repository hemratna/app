<template>
  <div class="content">
    <div v-if="tfa_secret" class="tfa-activation">
      <div>
        <img class="logo" alt="" src="../assets/logo-dark.svg" />
        <h1>2FA Activation</h1>
        <p>
          To continue, scan the QR code below in your authenticator app
        </p>
      </div>
      <qr-code
        class="qr"
        :value="'otpauth://totp/Directus?secret=' + tfa_secret"
        :options="{ width: 150 }"
      />

      <v-notice icon="info" class="notice">
        Please enter your One-Time Password below
      </v-notice>
      <div class="material-input">
        <input
          id="otp"
          v-model="otp"
          :class="{ 'has-value': otp && otp.length > 0 }"
          type="text"
          name="otp"
        />
        <label for="otp">{{ $t("otp") }}</label>
      </div>
      <v-button :disabled="disabled" @click="save2FASecret">Save</v-button>
      <transition-group name="list" tag="div" class="stack">
        <span v-if="error" key="error" class="notice" :class="errorType" @click="error = null">
          <v-icon :name="errorType" />
          {{ errorMessage }}
        </span>
      </transition-group>
    </div>
  </div>
</template>

<script>
import QrCode from "@chenfengyuan/vue-qrcode";
import { tokenPayload } from "../store/modules/auth/getters";

export default {
  name: "TFAActivation",
  components: {
    QrCode
  },
  data() {
    return {
      loading: false,
      error: null,
      tfa_secret: null,
      user_id: null,
      token: null,
      otp: null
    };
  },
  computed: {
    disabled() {
      return this.otp === null || this.otp.length === 0;
    },
    errorType() {
      if (!this.error) return;

      const errorCode = this.error && this.error.code;

      if (+errorCode >= 100 && +errorCode < 200) {
        if (+errorCode === 101 || +errorCode === 102) {
          return null;
        }

        return "warning";
      }
      return "error";
    },
    errorMessage() {
      if (!this.error) return;

      const errorCode = this.error && this.error.code;

      if (this.localeMessages.errors && this.localeMessages.errors[errorCode] != null) {
        return this.$t(`errors[${errorCode}]`);
      }

      return this.$t("error_unknown");
    },
    localeMessages() {
      return this.$i18n.getLocaleMessage(this.$i18n.locale);
    }
  },
  mounted() {
    this.loading = true;
    if (this.$api.url) {
      sessionStorage.setItem("api_url", this.$api.url);
    } else {
      this.$api.url = sessionStorage.getItem("api_url");
    }

    this.$api
      .get("/utils/2fa_secret")
      .then(res => {
        this.tfa_secret = res["2fa_secret"];
        sessionStorage.setItem("tfa_secret", this.tfa_secret);
      })
      .catch(error => {
        this.error = error;
      })
      .finally(() => (this.loading = false));

    this.token = this.$route.query.temp_token;
    let payload = tokenPayload(this);
    this.user_id = payload.id;
  },
  methods: {
    save2FASecret() {
      this.loading = true;
      this.$api.token = this.token;
      let tfa_url = "/users/" + this.user_id + "/activate2FA";
      this.$api
        .post(tfa_url, {
          tfa_secret: this.tfa_secret,
          otp: this.otp
        })
        .then(() => {
          console.log("enter then");
          this.$store.dispatch("refresh", this.token).then(() => this.enterApp());
        })
        .catch(error => {
          this.error = error;
          this.loading = false;
        });
    },
    enterApp() {
      sessionStorage.removeItem("api_url");

      this.$api
        .getMe({ fields: "last_page" })
        .then(res => res.data.last_page)
        .then(lastPage => {
          this.$router.push(lastPage || "/");
        })
        .catch(error => {
          this.loading = false;
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
          this.$router.push("/");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  color: var(--darker-gray);
  font-size: 36px;
  line-height: 1.4;
  font-weight: 300;
}

.qr {
  border: var(--input-border-width) solid var(--lightest-gray);
  border-radius: var(--border-radius);
  align-self: center;
}

.v-input {
  width: 100%;
}

.notice {
  width: 100%;
}

.content {
  background-color: var(--darkest-gray);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tfa-activation {
  background-color: var(--white);
  border-radius: var(--border-radius);
  max-width: 510px;
  width: 100%;
  max-height: 610px;
  height: 100%;
  position: relative;
  top: -2vh;
  padding: 40px 40px 30px;
  box-shadow: var(--box-shadow);
  place-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

.logo {
  height: 40px;
  pointer-events: none;
  user-select: none;
}

.notice {
  text-align: center;

  &.error {
    color: var(--danger);
  }
}

.stack {
  position: relative;
  width: 100%;
  padding: 30px 0 20px;
  text-align: center;

  > * {
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}

.material-input {
  position: relative;
  width: 100%;

  input {
    border: 0;
    font-size: 16px;
    border-bottom: 2px solid var(--lighter-gray);
    width: 100%;
    padding: 10px 0;
    color: var(--gray);
    transition: border-color var(--fast) var(--transition);
    border-radius: 0;

    &:-webkit-autofill {
      color: var(--gray) !important;
      -webkit-text-fill-color: var(--gray);
      -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
    }

    &:hover {
      transition: none;
      border-color: var(--gray);
      &:focus {
        border-color: var(--darker-gray);
      }
    }

    &:focus {
      outline: 0;
      border-color: var(--darker-gray);
      color: var(--dark-gray);

      &:-webkit-autofill {
        color: var(--darker-gray) !important;
        -webkit-text-fill-color: var(--darker-gray);
        -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
      }
    }
  }

  label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    font-weight: 400;
    transform-origin: left;
    transition: all var(--fast) var(--transition);
  }

  input:focus,
  input.has-value {
    & + label {
      transform: scale(0.8);
      top: -10px;
    }
  }

  input:-webkit-autofill {
    /* Fixes FireFox: If any part of a selector is invalid, it invalidates the whole selector */
    & + label {
      transform: scale(0.8);
      top: -10px;
    }
  }
}
</style>
