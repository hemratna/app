<template>
  <div :data-collection="collection" :data-field="field.field">
    <div v-if="showLabel" class="name">
      <v-contextual-menu
        v-if="field.readonly === false"
        class="field-action"
        placement="right-start"
        :options="options"
        :icon="null"
        @click="emitChange"
      >
        <span class="field-label">{{ field.name || $helpers.formatTitle(field.field) }}</span>
        <v-icon v-if="field.required !== false" class="required" name="star" color="accent" sup />
        <v-icon name="arrow_drop_down" icon-style="outline" size="18" class="dropdown" />
      </v-contextual-menu>
      <span v-else class="field-static">
        <span class="field-label">{{ field.name || $helpers.formatTitle(field.field) }}</span>
        <v-icon v-if="field.required !== false" class="required" name="star" color="accent" sup />
      </span>
      <v-toggle
        v-if="batchMode"
        class="batch-toggle"
        :value="!blocked"
        @input="$emit(blocked ? 'activate' : 'deactivate', field.field)"
      />
    </div>

    <div class="field">
      <v-ext-input
        :id="field.interface || 'text-input'"
        :name="name"
        :required="field.required"
        :readonly="field.readonly || blocked"
        :options="field.options"
        :type="field.type"
        :datatype="field.datatype"
        :value="value"
        :relation="relation"
        :fields="fields"
        :collection="collection"
        :values="values"
        :length="field.length"
        :new-item="newItem"
        @input="
          $emit('stage-value', {
            field: field.field,
            value: $event
          })
        "
        @setfield="
          $emit('stage-value', {
            field: $event.field,
            value: $event.value
          })
        "
      />
    </div>
    <div v-if="field.note" class="note" v-html="$helpers.snarkdown(field.note)"></div>
  </div>
</template>

<script>
export default {
  name: "VField",
  props: {
    name: {
      type: String,
      required: true
    },
    field: {
      type: Object,
      required: true
    },
    fields: {
      type: Object,
      required: true
    },
    values: {
      type: Object,
      required: true
    },
    collection: {
      type: String,
      default: null
    },
    blocked: {
      type: Boolean,
      default: false
    },
    batchMode: {
      type: Boolean,
      default: false
    },
    newItem: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      initialValue: this.values[this.field.field]
    };
  },

  computed: {
    showLabel() {
      const interfaceName = this.field.interface;
      const interfaceMeta = this.getInterfaceMeta(interfaceName);

      // In case the current field doesn 't have an interface setup
      if (!interfaceMeta) return true;

      const hideLabel = interfaceMeta.hideLabel;

      if (hideLabel === true) return false;

      return true;
    },

    relation() {
      const { collection, field, type } = this.field;

      if (type.toLowerCase() === "m2o") return this.$store.getters.m2o(collection, field);
      if (type.toLowerCase() === "o2m") return this.$store.getters.o2m(collection, field);
      if (type.toLowerCase() === "translation") return this.$store.getters.o2m(collection, field);
      return null;
    },

    isChanged() {
      return this.value !== this.initialValue;
    },

    isDefault() {
      const defaultValue = this.field.default_value;
      return this.value === defaultValue;
    },

    value() {
      return this.values[this.field.field];
    },

    options() {
      return {
        setNull: {
          text: this.$t("clear_value"),
          icon: "delete_outline",
          disabled: this.value === null
        },
        reset: {
          text: this.$t("reset_to_default"),
          icon: "settings_backup_restore",
          disabled: this.isDefault === true
        },
        clear: {
          text: this.$t("undo_changes"),
          icon: "undo",
          disabled: this.isChanged === false
        }
      };
    }
  },

  methods: {
    getInterfaceMeta(interfaceName) {
      const interfaceMeta = this.$store.state.extensions.interfaces[interfaceName];

      return interfaceMeta || undefined;
    },

    emitChange(action) {
      let value;

      switch (action) {
        case "setNull":
          value = null;
          break;
        case "clear":
          value = this.initialValue;
          break;
        case "reset":
          value = this.field.default_value;
          break;
      }

      this.$emit("stage-value", {
        field: this.field.field,
        value: value
      });
    }
  }
};
</script>

<style scoped lang="scss">
.note {
  color: var(--light-gray);
  margin-top: 4px;
}

.name {
  font-size: var(--size-2);
  margin-bottom: 10px;
  color: var(--darkest-gray);
}

.required {
  display: inline-block;
  margin-top: -8px;
  margin-left: 2px;
}

.field-static {
  display: inline-block;
}

.field-action {
  display: inline-block;
  transition: all var(--fast) var(--transition);
  &:hover {
    color: var(--accent);
    .dropdown {
      color: var(--accent);
    }
  }
  .dropdown {
    color: var(--lighter-gray);
    vertical-align: -2px;
  }
}

.batch-toggle {
  display: inline-block;
  vertical-align: -4px;
  margin-left: 4px;
}
</style>
