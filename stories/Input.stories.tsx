import { ComponentStory, ComponentMeta } from "@storybook/react";

import Input from "../components/Input";

export default {
  title: "Components/Input",
  component: Input,
  argTypes: {
    setValue: {
      action: "value changed:",
      table: {
        disable: true,
      },
    },
    className: {
      control: false,
    },
    suggestions: {
      control: { type: "array" },
    },
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Default = Template.bind({});

export const CustomClass = Template.bind({});
CustomClass.args = {
  className: "bg-red-700",
};

export const WithSuggestions = Template.bind({});
WithSuggestions.args = {
  suggestions: ["first", "second"],
};
