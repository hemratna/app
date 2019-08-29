<template>
  <div class="interface-one-to-many">
    <v-notice v-if="relationshipSetup === false" color="warning" icon="warning">
      {{ $t("relationship_not_setup") }}
    </v-notice>

    <template v-else>
      <div v-if="items.length" class="table">
        <div class="header">
          <div class="row">
            <button v-if="sortable" class="sort-column" @click="toggleManualSort">
              <v-icon name="sort" size="18" :color="manualSortActive ? 'action' : 'light-gray'" />
            </button>
            <button
              v-for="field in visibleFields"
              :key="field.field"
              type="button"
              @click="changeSort(field.field)"
            >
              {{ $helpers.formatTitle(field.field) }}
              <v-icon
                v-if="sort.field === field.field"
                :name="sort.asc ? 'arrow_downward' : 'arrow_upward'"
                size="16"
              />
            </button>
          </div>
        </div>
        <draggable
          v-model="itemsSorted"
          class="body"
          handle=".drag-handle"
          :disabled="!sortable || !manualSortActive"
          :class="{ dragging, readonly }"
          @start="dragging = true"
          @end="dragging = false"
        >
          <div
            v-for="item in itemsSorted"
            :key="item[relatedPrimaryKeyField]"
            class="row"
            @click="startEdit(item[relatedPrimaryKeyField])"
          >
            <div v-if="sortable" class="sort-column" :class="{ disabled: !manualSortActive }">
              <v-icon v-if="!readonly" name="drag_handle" class="drag-handle" />
            </div>
            <div v-for="field in visibleFields" :key="field.field" class="field-preview">
              <v-ext-display
                :interface-type="field.interface"
                :name="field.field"
                :type="field.type"
                :collection="field.collection"
                :datatype="field.datatype"
                :options="field.options"
                :value="String(item[field.field]).startsWith('$temp_') ? null : item[field.field]"
              />
            </div>
            <button
              v-if="!readonly"
              class="remove"
              @click.stop="deleteItem(item[relatedPrimaryKeyField])"
            >
              <v-icon name="close" />
            </button>
          </div>
        </draggable>
      </div>
      <v-notice v-else>{{ $t("no_items_selected") }}</v-notice>

      <div v-if="!readonly" class="buttons">
        <v-button
          v-if="options.allow_create"
          type="button"
          :disabled="readonly"
          icon="add"
          @click="startAddNewItem"
        >
          {{ $t("add_new") }}
        </v-button>

        <v-button
          v-if="options.allow_select"
          type="button"
          :disabled="readonly"
          icon="playlist_add"
          @click="selectExisting = true"
        >
          {{ $t("select_existing") }}
        </v-button>
      </div>
    </template>

    <v-item-select
      v-if="selectExisting"
      :fields="visibleFieldNames"
      :collection="relation.collection_many.collection"
      :filters="[]"
      :value="stagedSelection || selectionPrimaryKeys"
      @input="stageSelection"
      @done="closeSelection"
      @cancel="cancelSelection"
    />

    <portal v-if="editItem" to="modal">
      <v-modal
        :title="addNew ? $t('creating_item') : $t('editing_item')"
        :buttons="{
          save: {
            text: $t('save'),
            color: 'accent'
          }
        }"
        @close="closeEditItem"
        @save="saveEditItem"
      >
        <div class="edit-modal-body">
          <v-form
            new-item
            :fields="relatedCollectionFields"
            :collection="relation.collection_many.collection"
            :values="editItem"
            @stage-value="stageValue"
          />
        </div>
      </v-modal>
    </portal>
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import shortid from "shortid";
import { diff } from "deep-object-diff";

export default {
  name: "InterfaceOneToMany",
  mixins: [mixin],
  data() {
    return {
      sort: {
        field: null,
        asc: true
      },

      selectExisting: false,
      editItem: false,
      addNew: null,

      dragging: false,

      items: null,
      loading: false,
      error: null,
      stagedSelection: null,
      initialValue: _.cloneDeep(this.value) || []
    };
  },

  computed: {
    relationshipSetup() {
      if (!this.relation) return false;
      return true;
    },

    visibleFields() {
      if (this.relationshipSetup === false) return [];
      if (!this.options.fields) return [];

      let visibleFieldNames;

      if (Array.isArray(this.options.fields)) {
        visibleFieldNames = this.options.fields.map(val => val.trim());
      }

      visibleFieldNames = this.options.fields.split(",").map(val => val.trim());

      const relatedFields = this.relation.collection_many.fields;
      const recursiveKey = this.relation.field_many.field;

      return visibleFieldNames.map(name => {
        const fieldInfo = relatedFields[name];

        if (recursiveKey && name === recursiveKey) {
          fieldInfo.readonly = true;
        }

        return fieldInfo;
      });
    },

    visibleFieldNames() {
      return this.visibleFields.map(field => field.field);
    },

    relatedPrimaryKeyField() {
      return _.find(this.relation.collection_many.fields, { primary_key: true }).field;
    },

    selectionPrimaryKeys() {
      return this.items.map(item => item[this.relatedPrimaryKeyField]);
    },

    sortField() {
      const sortField = this.options.sort_field;

      if (!sortField) {
        return null;
      }

      return _.find(this.relation.collection_many.fields, { field: sortField });
    },

    sortable() {
      return !!this.sortField;
    },

    manualSortActive() {
      return this.sort.field === "$manual";
    },

    relatedCollectionFields() {
      const relatedCollectionFields = this.relation.collection_many.fields;

      // Disable editing the many to one that points to this one to many
      const manyToManyField = this.relation.field_many && this.relation.field_many.field;
      return _.mapValues(relatedCollectionFields, field => {
        const clone = _.clone(field);

        if (clone.field === manyToManyField) {
          clone.readonly = true;
        }

        return clone;
      });
    },

    itemsSorted: {
      get() {
        if (this.sort.field === "$manual") {
          return _.orderBy(
            _.cloneDeep(this.items),
            item => item[this.sortField.field],
            this.sort.asc ? "asc" : "desc"
          );
        }

        return _.orderBy(
          _.cloneDeep(this.items),
          item => item[this.sort.field],
          this.sort.asc ? "asc" : "desc"
        );
      },
      set(newValue) {
        this.items = newValue.map((item, index) => {
          return {
            ...item,
            [this.sortField.field]: index + 1
          };
        });
      }
    }
  },
  watch: {
    items(value, oldValue) {
      // When oldvalue is null, it's the very first load
      if (oldValue === null) return;
      this.emitValue(value);
    }
  },

  created() {
    if (this.sortable) {
      this.sort.field = "$manual";
    } else {
      if (this.visibleFieldNames && this.visibleFieldNames.length > 0) {
        this.sort.field = this.visibleFieldNames[0];
      }
    }

    this.items = _.cloneDeep(this.value) || [];
  },

  methods: {
    changeSort(fieldName) {
      if (this.sort.field === fieldName) {
        this.sort.asc = !this.sort.asc;
        return;
      }

      this.sort.asc = true;
      this.sort.field = fieldName;
      return;
    },

    toggleManualSort() {
      this.sort.field = "$manual";
      this.sort.asc = true;
    },

    startAddNewItem() {
      this.addNew = true;

      const relatedCollectionFields = this.relation.collection_many.fields;
      const defaults = _.mapValues(relatedCollectionFields, field => field.default_value);
      const manyToManyField = this.relation.field_many && this.relation.field_many.field;
      const tempKey = "$temp_" + shortid.generate();

      if (defaults.hasOwnProperty(this.relatedPrimaryKeyField)) {
        delete defaults[this.relatedPrimaryKeyField];
      }

      if (defaults.hasOwnProperty(manyToManyField)) {
        delete defaults[manyToManyField];
      }

      this.items = [
        ...this.items,
        {
          [this.relatedPrimaryKeyField]: tempKey,
          ...defaults
        }
      ];

      this.startEdit(tempKey);
    },

    stageValue({ field, value }) {
      this.$set(this.editItem, field, value);
    },

    async startEdit(primaryKey) {
      let values = _.cloneDeep(this.items.find(i => i[this.relatedPrimaryKeyField] === primaryKey));

      const isNewItem = typeof primaryKey === "string" && primaryKey.startsWith("$temp_");

      if (isNewItem === false) {
        const collection = this.relation.collection_many.collection;
        const res = await this.$api.getItem(collection, primaryKey, { fields: "*.*.*" });
        const item = res.data;

        values = _.merge({}, item, values);
      }

      this.editItem = values;
    },

    saveEditItem() {
      const primaryKey = this.editItem[this.relatedPrimaryKeyField];

      const manyToManyField = this.relation.field_many && this.relation.field_many.field;

      this.items = this.items.map(item => {
        if (item[this.relatedPrimaryKeyField] === primaryKey) {
          const edits = _.clone(this.editItem);

          // Make sure we remove the many to one field that points to this o2m to prevent this nested item
          // to be accidentally assigned to another parent
          if (edits.hasOwnProperty(manyToManyField)) {
            delete edits[manyToManyField];
          }

          return edits;
        }

        return item;
      });

      this.editItem = null;
    },

    closeEditItem() {
      this.editItem = null;
    },

    stageSelection(primaryKeys) {
      this.stagedSelection = primaryKeys;
    },

    async closeSelection() {
      const primaryKeys = this.stagedSelection || [];

      // Remove all the items from this.items that aren't selected anymore
      this.items = this.items.filter(item => {
        const primaryKey = item[this.relatedPrimaryKeyField];
        return primaryKeys.includes(primaryKey);
      });

      // Fetch all newly selected items so we can render them in the table
      const itemPrimaryKeys = this.items.map(item => item[this.relatedPrimaryKeyField]);
      const newlyAddedItems = _.difference(primaryKeys, itemPrimaryKeys);

      const res = await this.$api.getItem(
        this.relation.collection_many.collection,
        newlyAddedItems.join(","),
        {
          fields: "*.*.*"
        }
      );

      const items = Array.isArray(res.data) ? res.data : [res.data];

      this.items = [...this.items, ...items];
      this.stagedSelection = null;
      this.selectExisting = false;
    },

    cancelSelection() {
      this.stagedSelection = null;
      this.selectExisting = false;
    },

    deleteItem(primaryKey) {
      this.items = this.items.filter(item => item[this.relatedPrimaryKeyField] !== primaryKey);
    },

    emitValue(value) {
      value = _.cloneDeep(value);

      const recursiveKey = this.relation.field_many.field;

      const newValue = value
        .map(after => {
          const primaryKey = after[this.relatedPrimaryKeyField];

          const before = this.initialValue.find(i => i[this.relatedPrimaryKeyField] === primaryKey);

          if (before) {
            const delta = diff(before, after);

            // For every nested field, we only want to stage the changed values, hence the delta above
            // HOWEVER, there is one field type where we _don't_ want to only save the changes: JSON
            // For a nested JSON record, we want to save the whole new state of the object, instead of
            // just the values that changed, seeing it will override the saved value with a new Object
            // only containing the changes.
            // In order to achieve that, we'll loop over every key in the delta, and use the "full"
            // after value in case the delta field is a JSON type
            _.forEach(delta, (value, key) => {
              const fieldInfo = this.relatedCollectionFields[key];
              if (!fieldInfo) return;

              const type = fieldInfo.type.toLowerCase();

              if (type === "json") {
                delta[key] = after[key];
              }
            });

            if (Object.keys(delta).length > 0) {
              const newVal = {
                [this.relatedPrimaryKeyField]: before[this.relatedPrimaryKeyField]
              };

              if (
                recursiveKey &&
                newVal[this.relatedPrimaryKeyField].hasOwnProperty(recursiveKey)
              ) {
                delete newVal[recursiveKey];
              }

              return _.merge({}, newVal, delta);
            } else {
              return null;
            }
          }

          if (recursiveKey && after.hasOwnProperty(recursiveKey)) {
            delete after[recursiveKey];
          }

          if (
            typeof after[this.relatedPrimaryKeyField] === "string" &&
            after[this.relatedPrimaryKeyField].startsWith("$temp_")
          ) {
            delete after[this.relatedPrimaryKeyField];
          }

          return after;
        })
        .filter(i => i);

      const savedPrimaryKeys = this.initialValue.map(item => item[this.relatedPrimaryKeyField]);
      const newPrimaryKeys = value.map(item => item[this.relatedPrimaryKeyField]);
      const deletedKeys = _.difference(savedPrimaryKeys, newPrimaryKeys);
      const deletedRows = deletedKeys.map(key => {
        if (this.options.delete_mode === "relation") {
          return {
            [this.relatedPrimaryKeyField]: key,
            [recursiveKey]: null
          };
        }

        return {
          [this.relatedPrimaryKeyField]: key,
          $delete: true
        };
      });

      this.$emit("input", [...newValue, ...deletedRows]);
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  background-color: var(--white);
  border: var(--input-border-width) solid var(--lighter-gray);
  border-radius: var(--border-radius);
  border-spacing: 0;
  width: 100%;
  margin: 16px 0 24px;

  .header {
    height: var(--input-height);
    border-bottom: 2px solid var(--lightest-gray);

    button {
      text-align: left;
      font-weight: 500;
      transition: color var(--fast) var(--transition);

      &:hover {
        transition: none;
        color: var(--darker-gray);
      }
    }

    i {
      vertical-align: top;
      color: var(--light-gray);
    }
  }

  .row {
    display: flex;
    align-items: center;
    padding: 0 5px;

    > div {
      padding: 3px 5px;
      flex-basis: 200px;
      max-width: 200px;
    }
  }

  .header .row {
    align-items: center;
    height: 40px;

    & > button {
      padding: 3px 5px 2px;
      flex-basis: 200px;
      max-width: 200px;
    }
  }

  .body {
    max-height: 275px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    .row {
      cursor: pointer;
      position: relative;
      height: 50px;
      border-bottom: 2px solid var(--off-white);

      &:hover {
        background-color: var(--highlight);
      }

      & div:last-of-type {
        flex-grow: 1;
      }

      button {
        color: var(--lighter-gray);
        transition: color var(--fast) var(--transition);

        &:hover {
          transition: none;
          color: var(--danger);
        }
      }
    }

    &.readonly {
      pointer-events: none;
    }
  }

  .sort-column {
    flex-basis: 36px !important;

    &.disabled i {
      color: var(--lightest-gray);
      cursor: not-allowed;
    }
  }
}

.drag-handle {
  cursor: grab;
}

.dragging {
  cursor: grabbing !important;
}

.buttons {
  margin-top: 24px;
}

.buttons > * {
  display: inline-block;
}

.buttons > *:first-child {
  margin-right: 24px;
}

.edit-modal-body {
  padding: 30px 30px 60px 30px;
  background-color: var(--body-background);
  .form {
    grid-template-columns:
      [start] minmax(0, var(--column-width)) [half] minmax(0, var(--column-width))
      [full];
  }
}

.remove {
  position: absolute;
  right: 10px;
}
</style>
