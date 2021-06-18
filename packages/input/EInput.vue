<template>
  <div class="eg-input">
    <input
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
      :readonly="readonly"
      autocomplete="off"
      class="eg-input_input"
      ref="inputRef"
    />
    <i
      v-if="clearable"
      v-show="isShowClear"
      @touchstart.stop="handleClear"
      @mousedown.stop="handleClear"
      >关闭</i
    >
  </div>
</template>

<script>
import useInputAction from '../_hooks/useInputAction.ts';

export default {
  name: 'EInput',
  props: {
    modelValue: [String, Number],
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    }, // 占位提示文字
    shape: String, // 搜索框形状，可选值为 round
    background: String, // 搜索框外部背景色
    autofocus: Boolean, // 是否自动聚焦
    readonly: Boolean, // 是否将输入框设为只读
    disabled: Boolean, // 是否禁用输入框
    clearable: {
      type: Boolean,
      default: true,
    }, // 是否有清除功能
    maxlength: [String, Number], // 输入的最大字符数
  },
  setup(props, context) {
    const {
      inputRef,
      isShowClear,
      handleInput,
      handleFocus,
      handleBlur,
      handleClear,
    } = useInputAction(props, context);

    return {
      inputRef,
      isShowClear,
      handleInput,
      handleFocus,
      handleBlur,
      handleClear,
    };
  },
  emits: ['update:modelValue', 'clear', 'focus', 'blur'],
};
</script>

<style scoped lang="scss">
.eg-input {
  width: 100%;
  height: 40px;
  border-radius: 2px;
  background: red;
  box-sizing: border-box;
  padding: 0 10px;
  display: flex;
  align-items: center;
  &_input {
    margin: 0;
    flex: 1;
    background: none;
    outline: none;
    border: none;
    padding: 0;
    line-height: inherit;
    font-size: 14px;
    color: #323233;
    &::-webkit-input-placeholder {
      line-height: inherit;
      font-size: 14px;
      color: #c8c9cc;
    }
    &::-webkit-search-cancel-button,
    &::-webkit-search-decoration,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      display: none;
    }
  }
}
</style>
