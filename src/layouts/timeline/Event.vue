<template>
  <div class="event">
    <div class="line" :class="{ connect: connect }">
      <div
        class="point"
        :style="{ backgroundColor: 'var(--' + (data.color || 'gray') + ')' }"
      ></div>
    </div>
    <div class="container" @click="$router.push(data.to)">
      <div class="title">
        {{ data.title }}
      </div>
      <div class="content">
        <v-ext-display
          v-if="data.contentType"
          :id="data.contentType.name"
          class="display"
          :name="data.contentType.name"
          :type="data.contentType.type"
          :value="data.content"
          :interface-type="data.contentType.interface"
          :options="data.contentType.options"
          @click.native.stop=""
        />
        <v-timeago class="time" :datetime="data.time" :auto-update="86400" :locate="$i18n.locale" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: null
    },
    connect: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.event {
  position: relative;

  &:first-child {
    .container {
      border-top: none;
    }
    .line .point {
      top: 6px;
    }
  }

  .line {
    position: absolute;
    top: 15px;
    left: 24px;
    height: 102%;
    width: 2px;
    transform: translate(-50%, 0);

    &.connect {
      background-color: var(--lightest-gray);
    }

    .point {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-left: 50%;
      transform: translate(-50%, -50%);
      border: 3px solid white;
      z-index: 10;
      top: 8px;
      position: relative;
    }
  }

  .container {
    cursor: pointer;
    margin: 0 32px 0 40px;
    padding: 12px;
    border-radius: var(--border-radius);
    border-top: 2px solid var(--off-white);

    &:hover {
      background-color: var(--highlight);
    }

    .title {
      color: var(--darker-gray);
      margin-bottom: 4px;
      font-weight: 500;
      // font-size: 15px;
      text-transform: capitalize; // For activity
    }

    .content {
      display: flex;
      align-items: center;

      .display {
        margin-right: 4px;
        font-weight: 500;
        color: var(--gray);
      }

      .time {
        color: var(--light-gray);
      }
    }
  }
}
</style>
