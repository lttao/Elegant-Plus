<template>
  <div
    @mousemove.stop="touchmove"
    @touchmove.stop="touchmove"
    @mouseup="stopDrag"
    @touchend="stopDrag"
    @mouseleave="stopDrag"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @transitionend="transitionEnd"
    :style="{ ...transform, transitionDuration: transition }"
    class="e-refresh"
    ref="eRefresh"
  >
    <template v-if="dragging || requesting">
      <div v-if="requesting" class="e-refresh-tip">{{ loadingText }}</div>
      <div v-else class="e-refresh-tip">
        <text>{{ dragging && dY > distance ? loosingText : pullingText }}</text>
      </div>
    </template>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watch,
} from 'vue';

export default defineComponent({
  props: {
    distance: {
      type: Number,
      default: 150,
    },
    pullingText: {
      type: String,
      default: '下拉刷新',
    },
    loadingText: {
      type: String,
      default: '正在刷新',
    },
    loosingText: {
      type: String,
      default: '释放更新',
    },
    showText: {
      type: Boolean,
      default: !0,
    },
    showArrow: {
      type: Boolean,
      default: !0,
    },
  },
  setup(props, { emit }) {
    let scrollTarget: any = null;
    const requesting = ref(false);
    const dragging = ref(false);
    const reset = ref(true);
    const startY = ref(0);
    const dY = ref(0);
    const eRefresh = ref(null);

    function getElement(e: any): any {
      let t = e;
      while (t && t.tagName !== 'HTML' && t.tagName !== 'BODY' && t.nodeType === 1) {
        const n = document.defaultdiv?.getComputedStyle(t).overflowY;
        if (n === 'scroll' || n === 'auto') return t;
        t = t.parentNode;
      }
      return document.documentElement;
    }

    onMounted(() => {
      scrollTarget = getElement(eRefresh.value);
    });

    function onDrag(e: any) {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      if (dragging.value && t.pageY - startY.value > 0 && window.scrollY <= 0) {
        dY.value = t.pageY - startY.value;
        if (requesting.value) {
          dY.value += props.distance;
        }
        e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
      }
    }
    function loadEnd() {
      requesting.value = false;
    }

    const onRefresh = () => {
      emit('onRefresh', loadEnd);
    };

    function touchmove(e: any) {
      onDrag(e);
      e.stopPropagation();
    }
    function loadStart() {
      requesting.value = true;
      dY.value = props.distance;
      onRefresh();
    }
    function startDrag(e: any) {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      if (!t) return;
      if (scrollTarget?.scrollTop <= 0) {
        startY.value = t.pageY;
        dragging.value = true;
        reset.value = false;
      }
    }
    function stopDrag() {
      dragging.value = false;
      dY.value > props.distance && window.scrollY <= 0 ? loadStart() : (dY.value = 0);
    }
    function transitionEnd() {
      dY.value !== props.distance || requesting.value || (dY.value = 0);
      dY.value === 0 && (reset.value = true);
    }

    const transition = computed(() => (dragging.value || (dY.value === 0 && reset.value) ? '0s' : '200ms'));

    const transform = computed(() => {
      const e: string = `${80 * Math.atan(dY.value / 200)}`;
      return e ? { transform: 'translateY('.concat(e, 'px)') } : {};
    });

    watch(requesting, (n) => {
      n || (dY.value = 0);
    });

    return {
      eRefresh,
      requesting,
      dragging,
      reset,
      startY,
      dY,
      transition,
      transform,
      onRefresh,
      stopDrag,
      startDrag,
      transitionEnd,
      touchmove,
    };
  },
});
</script>

<style lang="scss" scoped>
.e-refresh {
  position: relative;
  min-height: 100vh;
  // margin-bottom: -50px;
  &-tip {
    position: absolute;
    top: -50px;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1!important;
    font-size: 12px;
    color: #00B1F1;
  }
  &-icon {
    margin-right: 16rpx;
    transform: rotate(-180deg);
    transition: transform 0.3s;
  }
  .rotate {
    transform: rotate(0deg);
  }
}
</style>
