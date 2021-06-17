import { ref, onMounted } from "vue";

export default function useInputAction(props, { emit, root }) {
  const inputRef = ref();
  const isShowClear = ref(false);

  onMounted(() => {
    props.autofocus && inputRef.value.focus(); // 自动获取焦点
  });

  // 输入框内容变化时触发
  const handleInput = (e) => {
    const { value } = e.target;
    props.clearable && (isShowClear.value = value ? true : false);

    emit("update:modelValue", value);
  };

  // 输入框获得焦点时触发
  const handleFocus = (e) => {
    const { value } = e.target;
    props.clearable && (isShowClear.value = value ? true : false);

    emit("focus", e);
  };

  // 输入框失去焦点时触发
  const handleBlur = (e) => {
    props.clearable && (isShowClear.value = false);

    emit("blur", e);
  };

  // 	点击清除按钮后触发
  const handleClear = () => {
    props.clearable && (isShowClear.value = false);

    emit("update:modelValue", "");
    emit("clear");
  };

  return {
    inputRef,
    isShowClear,
    handleInput,
    handleFocus,
    handleBlur,
    handleClear,
  };
}
