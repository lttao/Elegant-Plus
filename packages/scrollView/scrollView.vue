<template>
  <uni-scroll-view v-bind="$attrs">
    <div
      ref="wrap"
      class="uni-scroll-view"
    >
      <div
        ref="main"
        :style="{'overflow-x': scrollX?'auto':'hidden','overflow-y': scrollY?'auto':'hidden'}"
        class="uni-scroll-view"
      >
        <div
          ref="content"
          class="uni-scroll-view-content"
        >
          <div
            v-if="refresherEnabled"
            ref="refresherinner"
            :style="{'background-color': refresherBackground, 'height': refresherHeight + 'px'}"
            class="uni-scroll-view-refresher"
          >
            <div
              v-if="refresherDefaultStyle !== 'none'"
              class="uni-scroll-view-refresh"
            >
              <div class="uni-scroll-view-refresh-inner">
                <svg
                  v-if="refreshState=='pulling'"
                  :style="{'transform': 'rotate('+ refreshRotate +'deg)'}"
                  fill="#2BD009"
                  class="uni-scroll-view-refresh__icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                  <path
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                </svg>
                <svg
                  v-if="refreshState=='refreshing'"
                  class="uni-scroll-view-refresh__spinner"
                  width="24"
                  height="24"
                  viewBox="25 25 50 50"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    style="color: #2BD009;"
                    stroke-width="3"
                  />
                </svg>
              </div>
            </div>
            <slot
              v-if="refresherDefaultStyle=='none'"
              name="refresher"
            />
          </div>
          <slot />
        </div>
      </div>
    </div>
  </uni-scroll-view>
</template>
<script>
import {
  initScrollBounce,
  disableScrollBounce,
  supportsPassive,
} from './src/scroll';
import scroller from '../_mixins/scroller/index';

const passiveOptions = supportsPassive ? {
  passive: true,
} : false;

// const PULLING = 'pulling'
// const REFRESHING = 'refreshing'

export default {
  name: 'ScrollView',
  mixins: [scroller],
  props: {
    scrollX: {
      type: [Boolean, String],
      default: false,
    },
    scrollY: {
      type: [Boolean, String],
      default: false,
    },
    upperThreshold: {
      type: [Number, String],
      default: 50,
    },
    lowerThreshold: {
      type: [Number, String],
      default: 50,
    },
    scrollTop: {
      type: [Number, String],
      default: 0,
    },
    scrollLeft: {
      type: [Number, String],
      default: 0,
    },
    scrollIntoView: {
      type: String,
      default: '',
    },
    scrollWithAnimation: {
      type: [Boolean, String],
      default: false,
    },
    enableBackToTop: {
      type: [Boolean, String],
      default: false,
    },
    refresherEnabled: {
      type: [Boolean, String],
      default: false,
    },
    refresherThreshold: {
      type: Number,
      default: 45,
    },
    refresherDefaultStyle: {
      type: String,
      default: 'back',
    },
    refresherBackground: {
      type: String,
      default: '#fff',
    },
    refresherTriggered: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      lastScrollTop: this.scrollTopNumber,
      lastScrollLeft: this.scrollLeftNumber,
      lastScrollToUpperTime: 0,
      lastScrollToLowerTime: 0,
      refresherHeight: 0,
      refreshRotate: 0,
      refreshState: '',
    };
  },
  computed: {
    upperThresholdNumber() {
      const val = Number(this.upperThreshold);
      return isNaN(val) ? 50 : val;
    },
    lowerThresholdNumber() {
      const val = Number(this.lowerThreshold);
      return isNaN(val) ? 50 : val;
    },
    scrollTopNumber() {
      return Number(this.scrollTop) || 0;
    },
    scrollLeftNumber() {
      return Number(this.scrollLeft) || 0;
    },
  },
  watch: {
    scrollTopNumber(val) {
      this._scrollTopChanged(val);
    },
    scrollLeftNumber(val) {
      this._scrollLeftChanged(val);
    },
    scrollIntoView(val) {
      this._scrollIntoViewChanged(val);
    },
    refresherTriggered(val) {
      // TODO
      if (val === true) {
        this._setRefreshState('refreshing');
      } else if (val === false) {
        this._setRefreshState('restore');
      }
    },
  },
  mounted() {
    const self = this;
    this._attached = true;
    this._scrollTopChanged(this.scrollTopNumber);
    this._scrollLeftChanged(this.scrollLeftNumber);
    this._scrollIntoViewChanged(this.scrollIntoView);
    this.__handleScroll = function (event) {
      event.preventDefault();
      event.stopPropagation();
      self._handleScroll.bind(self, event)();
    };
    let touchStart = null;
    let needStop = null;
    this.__handleTouchMove = function (event) {
      const x = event.touches[0].pageX;
      const y = event.touches[0].pageY;
      const { main } = self.$refs;
      if (needStop === null) {
        if (Math.abs(x - touchStart.x) > Math.abs(y - touchStart.y)) {
          // 横向滑动
          if (self.scrollX) {
            if (main.scrollLeft === 0 && x > touchStart.x) {
              needStop = false;
              return;
            } if (main.scrollWidth === main.offsetWidth + main.scrollLeft && x < touchStart.x) {
              needStop = false;
              return;
            }
            needStop = true;
          } else {
            needStop = false;
          }
        } else {
          // 纵向滑动
          if (self.scrollY) {
            if (main.scrollTop === 0 && y > touchStart.y) {
              needStop = false;
              return;
            } if (main.scrollHeight === main.offsetHeight + main.scrollTop && y < touchStart.y) {
              needStop = false;
              return;
            }
            needStop = true;
          } else {
            needStop = false;
          }
        }
      }
      if (needStop) {
        event.stopPropagation();
      }

      if (self.refresherEnabled && self.refreshState === 'pulling') {
        const dy = y - touchStart.y;
        self.refresherHeight = dy;

        let rotate = dy / self.refresherThreshold;
        if (rotate > 1) {
          rotate = 1;
        } else {
          rotate *= 360;
        }
        self.refreshRotate = rotate;

        self.$trigger('refresherpulling', event, {
          deltaY: dy,
        });
      }
    };

    this.__handleTouchStart = function (event) {
      if (event.touches.length === 1) {
        disableScrollBounce({
          disable: true,
        });
        needStop = null;
        touchStart = {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
        };
        if (self.refresherEnabled && self.refreshState !== 'refreshing' && self.$refs.main.scrollTop === 0) {
          self.refreshState = 'pulling';
        }
      }
    };
    this.__handleTouchEnd = function (event) {
      touchStart = null;
      disableScrollBounce({
        disable: false,
      });
      if (self.refresherHeight >= self.refresherThreshold) {
        self._setRefreshState('refreshing');
      } else {
        self.refresherHeight = 0;
        self.$trigger('refresherabort', event, {});
      }
    };
    this.$refs.main.addEventListener('touchstart', this.__handleTouchStart, passiveOptions);
    this.$refs.main.addEventListener('touchmove', this.__handleTouchMove, passiveOptions);
    this.$refs.main.addEventListener('scroll', this.__handleScroll, supportsPassive ? {
      passive: false,
    } : false);
    this.$refs.main.addEventListener('touchend', this.__handleTouchEnd, passiveOptions);
    initScrollBounce();
  },
  activated() {
    // 还原 scroll-view 滚动位置
    this.scrollY && (this.$refs.main.scrollTop = this.lastScrollTop);
    this.scrollX && (this.$refs.main.scrollLeft = this.lastScrollLeft);
  },
  beforeUnmount() {
    this.$refs.main.removeEventListener('touchstart', this.__handleTouchStart, passiveOptions);
    this.$refs.main.removeEventListener('touchmove', this.__handleTouchMove, passiveOptions);
    this.$refs.main.removeEventListener('scroll', this.__handleScroll, supportsPassive ? {
      passive: false,
    } : false);
    this.$refs.main.removeEventListener('touchend', this.__handleTouchEnd, passiveOptions);
  },
  methods: {
    scrollTo(t, n) {
      const i = this.$refs.main;
      t < 0 ? t = 0 : n === 'x' && t > i.scrollWidth - i.offsetWidth ? t = i.scrollWidth - i.offsetWidth
        : n === 'y' && t > i.scrollHeight - i.offsetHeight && (t = i.scrollHeight - i.offsetHeight);
      let r = 0;
      let o = '';
      n === 'x' ? r = i.scrollLeft - t : n === 'y' && (r = i.scrollTop - t);
      if (r !== 0) {
        this.$refs.content.style.transition = 'transform .3s ease-out';
        this.$refs.content.style.webkitTransition = '-webkit-transform .3s ease-out';
        if (n === 'x') {
          o = `translateX(${r}px) translateZ(0)`;
        } else {
          n === 'y' && (o = `translateY(${r}px) translateZ(0)`);
        }
        this.$refs.content.removeEventListener('transitionend', this.__transitionEnd);
        this.$refs.content.removeEventListener('webkitTransitionEnd', this.__transitionEnd);
        this.__transitionEnd = this._transitionEnd.bind(this, t, n);
        this.$refs.content.addEventListener('transitionend', this.__transitionEnd);
        this.$refs.content.addEventListener('webkitTransitionEnd', this.__transitionEnd);
        if (n === 'x') {
          // if (e !== 'ios') {
          i.style.overflowX = 'hidden';
          // }
        } else if (n === 'y') {
          i.style.overflowY = 'hidden';
        }

        this.$refs.content.style.transform = o;
        this.$refs.content.style.webkitTransform = o;
      }
    },
    _handleTrack($event) {
      if ($event.detail.state === 'start') {
        this._x = $event.detail.x;
        this._y = $event.detail.y;
        this._noBubble = null;
        return;
      }
      if ($event.detail.state === 'end') {
        this._noBubble = false;
      }
      if (this._noBubble === null && this.scrollY) {
        if (Math.abs(this._y - $event.detail.y) / Math.abs(this._x - $event.detail.x) > 1) {
          this._noBubble = true;
        } else {
          this._noBubble = false;
        }
      }
      if (this._noBubble === null && this.scrollX) {
        if (Math.abs(this._x - $event.detail.x) / Math.abs(this._y - $event.detail.y) > 1) {
          this._noBubble = true;
        } else {
          this._noBubble = false;
        }
      }
      this._x = $event.detail.x;
      this._y = $event.detail.y;
      if (this._noBubble) {
        $event.stopPropagation();
      }
    },
    _handleScroll($event) {
      if (!($event.timeStamp - this._lastScrollTime < 20)) {
        this._lastScrollTime = $event.timeStamp;
        const { target } = $event;
        this.$trigger('scroll', $event, {
          scrollLeft: target.scrollLeft,
          scrollTop: target.scrollTop,
          scrollHeight: target.scrollHeight,
          scrollWidth: target.scrollWidth,
          deltaX: this.lastScrollLeft - target.scrollLeft,
          deltaY: this.lastScrollTop - target.scrollTop,
        });
        if (this.scrollY) {
          if (target.scrollTop <= this.upperThresholdNumber && this.lastScrollTop - target.scrollTop > 0 && $event.timeStamp - this.lastScrollToUpperTime > 200) {
            this.$trigger('scrolltoupper', $event, {
              direction: 'top',
            });
            this.lastScrollToUpperTime = $event.timeStamp;
          }
          if (target.scrollTop + target.offsetHeight + this.lowerThresholdNumber >= target.scrollHeight && this.lastScrollTop - target.scrollTop < 0 && $event.timeStamp - this.lastScrollToLowerTime > 200) {
            this.$trigger('scrolltolower', $event, {
              direction: 'bottom',
            });
            this.lastScrollToLowerTime = $event.timeStamp;
          }
        }
        if (this.scrollX) {
          if (target.scrollLeft <= this.upperThresholdNumber && this.lastScrollLeft - target.scrollLeft > 0 && $event.timeStamp - this.lastScrollToUpperTime > 200) {
            this.$trigger('scrolltoupper', $event, {
              direction: 'left',
            });
            this.lastScrollToUpperTime = $event.timeStamp;
          }
          if (target.scrollLeft + target.offsetWidth + this.lowerThresholdNumber >= target.scrollWidth && this.lastScrollLeft - target.scrollLeft < 0 && $event.timeStamp - this.lastScrollToLowerTime > 200) {
            this.$trigger('scrolltolower', $event, {
              direction: 'right',
            });
            this.lastScrollToLowerTime = $event.timeStamp;
          }
        }
        this.lastScrollTop = target.scrollTop;
        this.lastScrollLeft = target.scrollLeft;
      }
    },
    _scrollTopChanged(val) {
      if (this.scrollY) {
        if (this._innerSetScrollTop) {
          this._innerSetScrollTop = false;
        } else if (this.scrollWithAnimation) {
          this.scrollTo(val, 'y');
        } else {
          this.$refs.main.scrollTop = val;
        }
      }
    },
    _scrollLeftChanged(val) {
      if (this.scrollX) {
        if (this._innerSetScrollLeft) {
          this._innerSetScrollLeft = false;
        } else if (this.scrollWithAnimation) {
          this.scrollTo(val, 'x');
        } else {
          this.$refs.main.scrollLeft = val;
        }
      }
    },
    _scrollIntoViewChanged(val) {
      if (val) {
        if (!/^[_a-zA-Z][-_a-zA-Z0-9:]*$/.test(val)) {
          console.error(`id error: scroll-into-view=${val}`);
          return;
        }
        const element = this.$el.querySelector(`#${val}`);
        if (element) {
          const mainRect = this.$refs.main.getBoundingClientRect();
          const elRect = element.getBoundingClientRect();
          if (this.scrollX) {
            const left = elRect.left - mainRect.left;
            const { scrollLeft } = this.$refs.main;
            const x = scrollLeft + left;
            if (this.scrollWithAnimation) {
              this.scrollTo(x, 'x');
            } else {
              this.$refs.main.scrollLeft = x;
            }
          }
          if (this.scrollY) {
            const top = elRect.top - mainRect.top;
            const { scrollTop } = this.$refs.main;
            const y = scrollTop + top;
            if (this.scrollWithAnimation) {
              this.scrollTo(y, 'y');
            } else {
              this.$refs.main.scrollTop = y;
            }
          }
        }
      }
    },
    _transitionEnd(val, type) {
      this.$refs.content.style.transition = '';
      this.$refs.content.style.webkitTransition = '';
      this.$refs.content.style.transform = '';
      this.$refs.content.style.webkitTransform = '';
      const { main } = this.$refs;
      if (type === 'x') {
        main.style.overflowX = this.scrollX ? 'auto' : 'hidden';
        main.scrollLeft = val;
      } else if (type === 'y') {
        main.style.overflowY = this.scrollY ? 'auto' : 'hidden';
        main.scrollTop = val;
      }
      this.$refs.content.removeEventListener('transitionend', this.__transitionEnd);
      this.$refs.content.removeEventListener('webkitTransitionEnd', this.__transitionEnd);
    },
    _setRefreshState(state) {
      switch (state) {
        case 'refreshing':
          this.refresherHeight = this.refresherThreshold;
          this.$trigger('refresherrefresh', event, {});
          break;
        case 'restore':
          this.refresherHeight = 0;
          this.$trigger('refresherrestore', {}, {});
          break;
      }
      this.refreshState = state;
    },
    getScrollPosition() {
      const { main } = this.$refs;
      return {
        scrollLeft: main.scrollLeft,
        scrollTop: main.scrollTop,
        scrollHeight: main.scrollHeight,
        scrollWidth: main.scrollWidth,
      };
    },
  },
};
</script>
<style>
uni-scroll-view {
  display: block;
  width: 100%;
}

uni-scroll-view[hidden] {
  display: none;
}

.uni-scroll-view {
  position: relative;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  /* display: flex; 时在安卓下会导致scrollWidth和offsetWidth一样 */
  height: 100%;
  max-height: inherit;
}

.uni-scroll-view-content {
  width: 100%;
  height: 100%;
}

.uni-scroll-view-refresher {
  position: relative;
  overflow: hidden;
}

.uni-scroll-view-refresh {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.uni-scroll-view-refresh-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .117647), 0 1px 4px rgba(0, 0, 0, .117647);
}

.uni-scroll-view-refresh__spinner {
  transform-origin: center center;
  animation: uni-scroll-view-refresh-rotate 2s linear infinite;
}

.uni-scroll-view-refresh__spinner > circle {
  stroke: currentColor;
  stroke-linecap: round;
  animation: uni-scroll-view-refresh-dash 2s linear infinite;
}

@keyframes uni-scroll-view-refresh-rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes uni-scroll-view-refresh-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
</style>
