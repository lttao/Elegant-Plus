import { defineComponent } from 'vue';

const buttonProps = {
  tag: {
    type: String,
    default: 'button'
  }
}

const Button = defineComponent({
  name: 'button',
  render() {
    const { tag } = this
    return (
      <tag>
        <slot></slot>
      </tag>
    )
  }
});

export default Button;
