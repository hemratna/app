<template>
  <draggable
    v-model="choices"
    element="div"
    class="interface-checkboxes"
    :class="{ cols: !options.single }"
  >
    <div v-for="(choice, index) in choices" :key="choice.id" class="choice">
      <v-icon v-if="options.draggable" class="drag-handle" name="drag_indicator" />

      <template v-if="choice.custom">
        <button @click="choices[index].checked = !choices[index].checked">
          <v-icon
            color="darker-gray"
            :name="choice.checked ? 'check_box' : 'check_box_outline_blank'"
          />
        </button>
        <input v-model="choices[index].key" :placeholder="$t('other') + '...'" />
      </template>

      <v-checkbox
        v-else
        :id="choice.id"
        v-tooltip="choice.value"
        name="list-sorting"
        :value="choice.key"
        :disabled="readonly"
        :label="choice.value"
        :checked="choice.checked"
        @change="choices[index].checked = !choices[index].checked"
      />
    </div>
    <button v-if="options.allow_other" @click="addCustom">{{ $t("add_new") }}...</button>
  </draggable>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import shortid from "shortid";

export default {
  name: "InterfaceCheckboxes",
  mixins: [mixin],
  data() {
    return {
      choices: []
    };
  },
  watch: {
    choices: {
      deep: true,
      handler(val) {
        if (this.initialized !== true) return;
        let newValue = val.filter(choice => choice.checked).map(choice => choice.key);

        if (this.options.wrap) {
          newValue = ["", ...newValue, ""];
        }

        this.$emit("input", newValue);
      }
    }
  },
  created() {
    this.initChoices();
  },
  methods: {
    initChoices() {
      const optionChoices = _.clone(this.options.choices);

      let choices = this.value
        .filter(key => key) // filter out empty strings
        .map(key => {
          return {
            id: shortid.generate(),
            key: key,
            value: optionChoices[key],
            custom: optionChoices.hasOwnProperty(key) === false,
            checked: true
          };
        });

      // Remove custom values if "allow_other" is not enabled
      if (!this.options.allow_other) {
        choices = choices.filter(function(obj) {
          return obj.custom !== true;
        });
      }

      const nonChecked = Object.keys(optionChoices)
        .filter(key => {
          return this.value.includes(key) === false;
        })
        .map(key => {
          return {
            id: shortid.generate(),
            key: key,
            value: optionChoices[key],
            custom: false,
            checked: false
          };
        });

      choices = [...choices, ...nonChecked];

      this.choices = choices;
      this.initialized = true;
    },
    addCustom() {
      this.choices = [
        ...this.choices,
        {
          id: shortid.generate(),
          key: "",
          custom: true,
          checked: true
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.interface-checkboxes {
  display: grid;
  grid-gap: 12px;
}

.cols {
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
}

.drag-handle {
  cursor: grab;
}

.choice {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .form-checkbox {
    width: 100%;
  }

  input {
    border: 0;
    border-bottom: 1px solid var(--gray);
    width: 100%;
    margin-left: 4px;
    width: 100%;
    max-width: max-content;
  }

  input:hover {
    border-color: var(--darker-gray);
  }

  input:focus {
    border-color: var(--darkest-gray);
  }

  input::placeholder {
    color: var(--light-gray);
  }
}

button {
  text-align: left;
  color: var(--accent);
}
</style>
